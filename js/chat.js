(() => {
  'use strict';
  const copy = {
    it: { toggle: 'Chiedimi', title: 'Chiedi di Mohamed', subtitle: 'Risposte basate sul portfolio', intro: 'Ciao! Chiedimi dei progetti, studi o competenze di Mohamed.', placeholder: 'Scrivi una domanda…', send: 'Invia', close: 'Chiudi chat', loading: 'Sto cercando nel portfolio…', error: 'La chat AI non è disponibile ora. Puoi contattare Mohamed dalla sezione contatti.' },
    en: { toggle: 'Ask me', title: 'Ask about Mohamed', subtitle: 'Answers based on the portfolio', intro: "Hi! Ask me about Mohamed's projects, education or skills.", placeholder: 'Type a question…', send: 'Send', close: 'Close chat', loading: 'Checking the portfolio…', error: 'AI chat is unavailable right now. You can contact Mohamed from the contact section.' },
    fr: { toggle: 'Une question ?', title: 'Question sur Mohamed', subtitle: 'Réponses basées sur le portfolio', intro: 'Bonjour ! Posez une question sur les projets, les études ou les compétences de Mohamed.', placeholder: 'Écrivez une question…', send: 'Envoyer', close: 'Fermer le chat', loading: 'Je consulte le portfolio…', error: "Le chat IA est indisponible. Vous pouvez contacter Mohamed depuis la section contact." }
  };
  const $ = id => document.getElementById(id);
  const panel = $('chat-panel');
  const toggle = $('chat-toggle');
  const messages = $('chat-messages');
  const form = $('chat-form');
  const input = $('chat-input');
  let busy = false;
  const lang = () => Object.hasOwn(copy, document.documentElement.lang) ? document.documentElement.lang : 'it';

  function addMessage(content, kind) {
    const node = document.createElement('p');
    node.className = `chat-message chat-message--${kind}`;
    node.textContent = content;
    messages.append(node);
    messages.scrollTop = messages.scrollHeight;
    return node;
  }
  function translate() {
    const t = copy[lang()];
    toggle.textContent = t.toggle;
    $('chat-title').textContent = t.title;
    $('chat-subtitle').textContent = t.subtitle;
    $('chat-close').setAttribute('aria-label', t.close);
    $('chat-input-label').textContent = t.placeholder;
    input.placeholder = t.placeholder;
    $('chat-send').textContent = t.send;
    if (!messages.children.length) addMessage(t.intro, 'bot');
  }
  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus(); else toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  $('chat-close').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy) return;
    const question = input.value.trim();
    if (!question) return;
    const responseLang = lang();
    addMessage(question, 'user');
    input.value = '';
    busy = true;
    input.disabled = true;
    $('chat-send').disabled = true;
    const pending = addMessage(copy[responseLang].loading, 'bot');
    try {
      const endpoint = window.PORTFOLIO_CHAT_ENDPOINT;
      if (!endpoint) throw new Error('Endpoint not configured');
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(endpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, lang: responseLang }), signal: controller.signal
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (typeof data.answer !== 'string' || !data.answer.trim()) throw new Error('Invalid response');
        pending.textContent = data.answer;
      } finally { clearTimeout(timeout); }
    } catch {
      pending.textContent = copy[responseLang].error;
    } finally {
      busy = false;
      input.disabled = false;
      $('chat-send').disabled = false;
      if (!panel.hidden) input.focus();
    }
  });
  new MutationObserver(translate).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  translate();
})();
