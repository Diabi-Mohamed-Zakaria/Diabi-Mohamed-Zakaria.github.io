(() => {
  'use strict';
  const copy = {
    it: { toggle: 'Chiedimi', title: 'Chiedi di Zakaria', subtitle: 'Risposte basate sul portfolio', intro: 'Ciao! Chiedimi dei progetti, studi o competenze di Zakaria.', placeholder: 'Scrivi una domanda…', send: 'Invia', close: 'Chiudi chat', loading: 'Sto cercando nel portfolio…', error: 'La chat AI non è disponibile ora.', contact: 'Chiedi direttamente a Zakaria', request: 'Scrivi a Zakaria', requestIntro: 'Lascia la tua domanda e un indirizzo email o numero di telefono per ricevere una risposta.', message: 'La tua domanda', method: 'Come vuoi essere ricontattato?', phone: 'Telefono', email: 'La tua email', phoneLabel: 'Il tuo numero', privacy: 'La domanda e il recapito vengono inviati a FormSubmit per consegnarli a Zakaria via email.', sending: 'Invio in corso…', sent: 'Richiesta inviata. Zakaria ti risponderà appena possibile.', failed: 'Invio non riuscito. Scrivi a mohamedzakariadiabi@gmail.com.', submit: 'Invia richiesta' },
    en: { toggle: 'Ask me', title: 'Ask about Zakaria', subtitle: 'Answers based on the portfolio', intro: "Hi! Ask me about Zakaria's projects, education or skills.", placeholder: 'Type a question…', send: 'Send', close: 'Close chat', loading: 'Checking the portfolio…', error: 'AI chat is unavailable right now.', contact: 'Ask Zakaria directly', request: 'Contact Zakaria', requestIntro: 'Leave your question and an email address or phone number for a reply.', message: 'Your question', method: 'How should Zakaria reach you?', phone: 'Phone', email: 'Your email', phoneLabel: 'Your phone number', privacy: 'Your question and contact details go to FormSubmit, which emails them to Zakaria.', sending: 'Sending…', sent: 'Request sent. Zakaria will reply as soon as possible.', failed: 'Could not send. Email mohamedzakariadiabi@gmail.com.', submit: 'Send request' },
    fr: { toggle: 'Une question ?', title: 'Question sur Zakaria', subtitle: 'Réponses basées sur le portfolio', intro: 'Bonjour ! Posez une question sur les projets, les études ou les compétences de Zakaria.', placeholder: 'Écrivez une question…', send: 'Envoyer', close: 'Fermer le chat', loading: 'Je consulte le portfolio…', error: "Le chat IA est indisponible pour le moment.", contact: 'Demander à Zakaria', request: 'Contacter Zakaria', requestIntro: 'Laissez votre question et une adresse email ou un numéro de téléphone pour recevoir une réponse.', message: 'Votre question', method: 'Comment vous recontacter ?', phone: 'Téléphone', email: 'Votre email', phoneLabel: 'Votre numéro', privacy: 'Votre question et vos coordonnées sont transmises à FormSubmit pour être envoyées à Zakaria par email.', sending: 'Envoi…', sent: 'Demande envoyée. Zakaria vous répondra dès que possible.', failed: "Envoi impossible. Écrivez à mohamedzakariadiabi@gmail.com.", submit: 'Envoyer la demande' }
  };
  const $ = id => document.getElementById(id);
  const panel = $('chat-panel');
  const toggle = $('chat-toggle');
  const messages = $('chat-messages');
  const form = $('chat-form');
  const input = $('chat-input');
  const requestModal = $('contact-request-modal');
  const requestForm = $('contact-request-form');
  const requestMessage = $('contact-request-message');
  const requestMethod = $('contact-request-method');
  const requestValue = $('contact-request-value');
  let returnFocus = null;
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
    $('contact-request-open').textContent = t.request;
    $('contact-request-title').textContent = t.request;
    $('contact-request-intro').textContent = t.requestIntro;
    $('contact-request-message-label').textContent = t.message;
    $('contact-request-method-label').textContent = t.method;
    $('contact-request-phone-option').textContent = t.phone;
    $('contact-request-value-label').textContent = requestMethod.value === 'phone' ? t.phoneLabel : t.email;
    $('contact-request-privacy').textContent = t.privacy;
    $('contact-request-submit').textContent = t.submit;
  }
  function openRequest(question = '') {
    returnFocus = document.activeElement;
    requestMessage.value = question;
    $('contact-request-status').textContent = '';
    requestModal.hidden = false;
    requestMessage.focus();
  }
  function closeRequest() {
    requestModal.hidden = true;
    returnFocus?.focus();
  }
  function offerContact(after, question) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chat-contact-offer';
    button.textContent = copy[lang()].contact;
    button.addEventListener('click', () => openRequest(question));
    after.after(button);
    messages.scrollTop = messages.scrollHeight;
  }
  $('contact-request-open').addEventListener('click', () => openRequest());
  $('contact-request-close').addEventListener('click', closeRequest);
  requestModal.addEventListener('click', event => { if (event.target === requestModal) closeRequest(); });
  requestMethod.addEventListener('change', () => {
    requestValue.value = '';
    requestValue.type = requestMethod.value === 'phone' ? 'tel' : 'email';
    requestValue.autocomplete = requestMethod.value === 'phone' ? 'tel' : 'email';
    requestValue.pattern = requestMethod.value === 'phone' ? '[+0-9().\\s-]{6,25}' : '';
    translate();
  });
  requestForm.addEventListener('submit', async event => {
    event.preventDefault();
    const submit = $('contact-request-submit');
    const status = $('contact-request-status');
    submit.disabled = true;
    status.textContent = copy[lang()].sending;
    try {
      const response = await fetch('https://formsubmit.co/ajax/mohamedzakariadiabi@gmail.com', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          _subject: 'Nuova richiesta dal portfolio',
          _honey: $('contact-request-website').value,
          message: requestMessage.value.trim(),
          ...(requestMethod.value === 'email' ? { email: requestValue.value.trim() } : { phone: requestValue.value.trim() })
        })
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const result = await response.json();
      if (result.success !== true && result.success !== 'true') throw new Error('Submission failed');
      status.textContent = copy[lang()].sent;
      requestForm.reset();
      requestValue.type = 'email';
      requestValue.pattern = '';
      translate();
    } catch { status.textContent = copy[lang()].failed; }
    finally { submit.disabled = false; }
  });
  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus(); else toggle.focus();
  }
  toggle.addEventListener('click', () => setOpen(panel.hidden));
  $('chat-close').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !requestModal.hidden) closeRequest();
    else if (event.key === 'Escape' && !panel.hidden) setOpen(false);
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
        if (data.known === false) offerContact(pending, question);
      } finally { clearTimeout(timeout); }
    } catch {
      pending.textContent = copy[responseLang].error;
      offerContact(pending, question);
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
