# Diabi Mohamed Zakaria — Portfolio

[![Live](https://img.shields.io/badge/live-diabi--mohamed--zakaria.github.io-1a73e8?logo=googlechrome&logoColor=white)](https://diabi-mohamed-zakaria.github.io/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](#)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](#)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](#)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)](#)
[![Three.js](https://img.shields.io/badge/Three.js-black?logo=three.js&logoColor=white)](#)

Portfolio personale — laureando in Informatica, sviluppatore full-stack, mobile & AI. Sito statico, nessun framework, nessuna build: si apre e funziona.

**🔗 Live:** [diabi-mohamed-zakaria.github.io](https://diabi-mohamed-zakaria.github.io/)

## Caratteristiche

- 🌍 **Multilingua** — italiano, inglese, francese, con selettore persistente (`localStorage`), senza ricaricare la pagina
- 🌓 **Tema chiaro / scuro** con rilevamento automatico delle preferenze di sistema
- 🪐 **Sfondo 3D animato** (Three.js) nella sezione hero
- ⌨️ **Effetto di scrittura** in stile terminale, disattivato automaticamente se l'utente ha impostato `prefers-reduced-motion`
- 📄 **CV scaricabile** in tre lingue (IT/EN/FR)
- 📬 **Sezione contatti** con copia rapida email, link a GitHub e LinkedIn
- 🔍 **SEO-ready** — meta tag, dati strutturati (JSON-LD), sitemap e robots.txt
- 📱 Completamente **responsive**
- 💬 **Chat AI** in IT/EN/FR, alimentata dai contenuti pubblici del portfolio, con risposta esplicita quando manca un'informazione

## Stack tecnico

| Livello | Tecnologie |
|---|---|
| Markup / stile | HTML5, CSS3, [Tailwind CSS](https://tailwindcss.com/) (via CDN) |
| Logica | JavaScript vanilla (ES modules) |
| Grafica 3D | [Three.js](https://threejs.org/) |
| Font | Sora, JetBrains Mono, IBM Plex Sans (Google Fonts) |
| Hosting | GitHub Pages |

Nessun bundler, nessun `package.json`, nessuna dipendenza da installare.

## Struttura del progetto

```
.
├── index.html            → scheletro HTML (il testo viene iniettato via JS)
├── css/
│   └── style.css         → tema, animazioni, componenti custom
├── js/
│   ├── i18n.js            → tutti i testi del sito, in IT/EN/FR (unica fonte)
│   ├── main.js             → rendering, interazioni, nav, lingua, scroll
│   └── solar-system.js      → sfondo 3D (Three.js)
├── images/
│   └── favicon.svg
├── cv/
│   └── CV_Diabi_Mohamed_Zakaria_{IT,EN,FR}.pdf
├── robots.txt / sitemap.xml → configurazione SEO
└── README.md
```


## Come funziona (in breve)

- **Multilingua senza duplicare le pagine**: `index.html` contiene solo contenitori vuoti con `id`; `js/main.js` legge `SITE_CONTENT[lingua]` da `js/i18n.js` e popola tutto a runtime.
- **Tailwind via CDN**: caricato e configurato inline in `index.html` con la palette colori e i font del sito, senza step di build.
- **Accessibilità**: rispetto di `prefers-reduced-motion`, markup semantico, contrasto verificato in entrambi i temi.

## Deploy

Pubblicato automaticamente via **GitHub Pages** dal branch `main` del repository `diabi-mohamed-zakaria.github.io`.

### Attivare la chat AI

GitHub Pages ospita solo il frontend. La chat usa Groq tramite il Cloudflare Worker in `chat/`, che conserva la chiave come secret. Finché `js/chat-config.js` non contiene l'URL del Worker, la chat mostra un messaggio di indisponibilità.

1. Crea una chiave nella [Groq Console](https://console.groq.com/keys) e un account Cloudflare. Conserva la chiave privatamente; non incollarla nel codice, nel browser o in Git.
2. Apri un terminale nella cartella `chat/` ed esegui `npx wrangler login`.
3. Esegui `npx wrangler secret put GROQ_API_KEY`. Quando Wrangler lo chiede, incolla la chiave nel prompt del terminale. Non scriverla nel comando. Se Wrangler chiede di creare il Worker, conferma.
4. Esegui `npx wrangler deploy` e copia l'URL `https://…workers.dev` restituito.
5. Inserisci solo quell'URL in `js/chat-config.js` come `window.PORTFOLIO_CHAT_ENDPOINT`. Pubblica il sito con GitHub Pages e prova una domanda dalla pagina pubblica.

Per aggiornare la conoscenza dopo una modifica a `js/i18n.js`, esegui `node scripts/build-chat-knowledge.mjs` e pubblica anche il Worker aggiornato. Il Worker accetta richieste dal dominio del portfolio; le domande vengono inviate a Groq per generare la risposta. La chiave resta nel secret Cloudflare, ma l'endpoint pubblico può comunque ricevere richieste da client che imitano l'origine: per controllare l'uso, imposta un limite di richieste nel tuo account Cloudflare. Verifica le quote del piano gratuito nella [pagina Groq](https://console.groq.com/docs/rate-limits).

### Attivare le richieste via email

La finestra di contatto usa [FormSubmit](https://formsubmit.co/) per recapitare nome, cognome, eventuale azienda, domanda e indirizzo email o numero di telefono a `mohamedzakariadiabi@gmail.com`. Non serve un dominio proprio. La prima richiesta avvia la verifica: apri il messaggio di attivazione ricevuto in Gmail e conferma l'indirizzo prima di pubblicare il modulo. Poi invia una richiesta di prova dalla pagina e verifica che arrivi in casella. FormSubmit elabora i dati inviati dai visitatori; la finestra lo indica prima dell'invio.

Se il servizio non conferma l'invio, la finestra mostra l'indirizzo email diretto. Il Worker continua a servire solo la chat AI.

## Contatti

- ✉️ [mohamedzakariadiabi@gmail.com](mailto:mohamedzakariadiabi@gmail.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/m-zakaria-diabi-11042a352)
- 💻 [GitHub](https://github.com/Diabi-Mohamed-Zakaria)
