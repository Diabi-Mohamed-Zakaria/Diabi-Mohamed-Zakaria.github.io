# Portfolio — Diabi Mohamed Zakaria

Sito personale statico (HTML + CSS + JS, Tailwind via CDN, **nessuna build**), in 3 lingue (IT/EN/FR) con selettore in alto a destra. Pensato per essere pubblicato così com'è su GitHub Pages, nel repository `diabi-mohamed-zakaria.github.io`.

## Struttura del progetto

```
.
├── index.html          → scheletro HTML (il testo viene iniettato da JS)
├── css/
│   └── style.css        → tema, animazioni, componenti custom
├── js/
│   ├── i18n.js           → TUTTO il testo del sito, in it/en/fr (unica fonte)
│   └── main.js            → rendering + interazioni (nav, lingua, scroll, ecc.)
├── images/
│   └── favicon.svg
└── README.md
```

Non c'è alcun framework, build tool o `package.json`: apri `index.html` e funziona.

## Prova in locale

Basta aprire `index.html` nel browser. Se preferisci un server locale (comodo per evitare problemi di cache):

```bash
cd site
python3 -m http.server 8000
# poi apri http://localhost:8000
```


## Come pubblicare su GitHub Pages

Il repository `Diabi-Mohamed-Zakaria.github.io` è uno *user site*: GitHub pubblica automaticamente tutto ciò che sta nella **root del branch `main`**, senza bisogno di configurazioni.

```bash
# nella cartella dove hai clonato il repository vuoto
cp -r /percorso/di/questa/cartella/site/* .
git add .
git commit -m "Primo sito portfolio"
git push origin main
```

Dopo qualche minuto il sito sarà live su `https://Diabi-Mohamed-Zakaria.github.io/`.

Se il branch di default del repository non è `main` (es. `master`), usa quel nome al posto di `main`.

## Come modificare i testi

Tutto il contenuto (titoli, bio, progetti, competenze, contatti...) si trova in **un solo file**: `js/i18n.js`, diviso in tre blocchi `it`, `en`, `fr`. Ogni chiave è commentata e facile da individuare: cambia il valore tra virgolette e salva, senza toccare `main.js`.

Per aggiungere un nuovo progetto, copia un blocco esistente dentro `projects.items` (in tutte e tre le lingue) e modifica i campi `name`, `period`, `desc`, `tags`, `done`.

## Come funziona (in breve)

- **Nessun build step**: Tailwind CSS viene caricato via CDN (`cdn.tailwindcss.com`) e configurato inline in `index.html` con la palette e i font del sito.
- **Multilingua senza duplicare le pagine**: `index.html` contiene solo contenitori vuoti con `id`; `js/main.js` legge `SITE_CONTENT[lingua]` da `js/i18n.js` e popola tutto a runtime. Cambiare lingua non ricarica la pagina.
- La lingua scelta viene salvata in `localStorage`, così chi torna sul sito la ritrova.
- Font: **Sora** (titoli), **JetBrains Mono** (etichette/nav, richiama un editor di codice), **IBM Plex Sans** (testo).
- Rispetta `prefers-reduced-motion`: chi disattiva le animazioni nel sistema operativo non vede l'effetto di scrittura o le transizioni.
