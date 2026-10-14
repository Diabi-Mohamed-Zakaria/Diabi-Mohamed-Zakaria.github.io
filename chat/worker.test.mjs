import test from 'node:test';
import assert from 'node:assert/strict';
import worker from './worker.js';

const origin = 'https://diabi-mohamed-zakaria.github.io';
const request = (question, lang = 'it', from = origin) => new Request('https://worker.example/', {
  method: 'POST', headers: { Origin: from, 'Content-Type': 'application/json' },
  body: JSON.stringify({ question, lang })
});

test('rejects unknown origins and oversized input before calling AI', async () => {
  assert.equal((await worker.fetch(request('hello', 'en', 'https://elsewhere.example'), {})).status, 403);
  assert.equal((await worker.fetch(request('x'.repeat(701)), {})).status, 400);
});

test('allows the local site and its browser preflight', async () => {
  const local = 'http://127.0.0.1:8000';
  const preflight = new Request('https://worker.example/', {
    method: 'OPTIONS', headers: { Origin: local, 'Access-Control-Request-Method': 'POST' }
  });
  const response = await worker.fetch(preflight, {});
  assert.equal(response.status, 204);
  assert.equal(response.headers.get('Access-Control-Allow-Origin'), local);
  assert.equal((await worker.fetch(request('x'.repeat(701), 'it', local), {})).status, 400);
});

test('sends published facts and handles supported and unknown answers', async () => {
  const originalFetch = globalThis.fetch;
  let payload;
  let upstreamUrl;
  try {
    globalThis.fetch = async (url, options) => {
      upstreamUrl = url;
      payload = JSON.parse(options.body);
      assert.equal(options.headers.Authorization, 'Bearer test');
      return Response.json({ choices: [{ message: { content: JSON.stringify({ known: true, answer: 'Ha studiato Informatica.' }) } }] });
    };
    let response = await worker.fetch(request('Cosa ha studiato?'), { GROQ_API_KEY: 'test' });
    assert.equal(response.status, 200);
    assert.equal((await response.json()).answer, 'Ha studiato Informatica.');
    assert.equal(upstreamUrl, 'https://api.groq.com/openai/v1/chat/completions');
    assert.equal(payload.model, 'openai/gpt-oss-20b');
    assert.match(payload.messages[1].content, /Università del Piemonte Orientale/);
    globalThis.fetch = async () => Response.json({ choices: [{ message: { content: JSON.stringify({ known: false, answer: 'Guess' }) } }] });
    response = await worker.fetch(request('Qual è il suo stipendio?'), { GROQ_API_KEY: 'test' });
    assert.match((await response.json()).answer, /Non ho informazioni verificate/);
  } finally { globalThis.fetch = originalFetch; }
});
