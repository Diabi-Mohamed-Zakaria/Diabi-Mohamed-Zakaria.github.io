/* =====================================================================
   SITE_CONTENT
   Tutto il testo del sito, in italiano / inglese / francese.
   Per modificare un testo, cerca la chiave qui sotto e cambia il valore.
   Le voci con "// TODO" vanno completate a mano (link social ecc.).
===================================================================== */
const SITE_CONTENT = {

  it: {
    meta: {
      title: "Diabi Mohamed Zakaria — Portfolio",
      description: "Laureando in Informatica — sviluppatore full-stack, mobile & AI. Progetti, esperienza e contatti."
    },
    nav: {
      about: "about.md",
      path: "percorso.log",
      projects: "progetti/",
      skills: "competenze.json",
      contact: "contatti.sh"
    },
    hero: {
      eyebrow: "Laureando in Informatica",
      name: "Diabi Mohamed Zakaria",
      tagline: "Sviluppatore Full-Stack, Mobile & AI",
      bio: "Studente di Informatica all'Università del Piemonte Orientale con solida esperienza pratica nello sviluppo software full-stack, mobile e distribuito. Progetto e realizzo applicazioni reali che spaziano da backend e infrastrutture cloud a sistemi mobile e intelligenza artificiale, con particolare interesse per i modelli generativi, le pipeline basate su LLM e la ricerca semantica.",
      location: "Vercelli, Italia",
      status: "In stage presso Foto Portale (lug–set 2026)",
      ctaPrimary: "Scrivimi",
      ctaSecondary: "Vedi i progetti"
    },
    path: {
      title: "percorso.log",
      educationTitle: "Istruzione",
      experienceTitle: "Esperienza",
      education: [
        { period: "2023 — in corso", title: "Università del Piemonte Orientale", sub: "Laurea triennale in Informatica" },
        { period: "2022", title: "Liceo Scientifico", sub: "Diploma di Maturità Scientifica" }
      ],
      experience: [
        {
          period: "Lug 2026 — Set 2026 · 3 mesi",
          title: "Foto Portale",
          sub: "Stage — Modulo di Ricerca AI",
          desc: "Sviluppo del modulo di ricerca AI di Foto Portale, la piattaforma che mette in contatto brand e agenzie con creator. Ho realizzato la pipeline completa: sincronizzazione dei profili, generazione del testo di contesto, embedding e ricerca vettoriale combinata a filtri strutturati, oltre al motore che genera la spiegazione testuale dei risultati tramite un LLM. Test unitari e di integrazione con PHPUnit in ambiente Docker con PostgreSQL/pgvector.",
          tags: ["PHP", "Symfony", "Twig", "JavaScript", "LLM API", "PostgreSQL", "pgvector", "Doctrine", "Docker", "PHPUnit"]
        }
      ]
    },
    projects: {
      title: "progetti/",
      items: [
        {
          name: "MiCasaEsTuCasa",
          path: "~/progetti/micasaestucasa",
          period: "2026",
          desc: "App Android in stile Airbnb per la gestione di alloggi: ricerca, prenotazione e pubblicazione di annunci. Architettura client-server con autenticazione Firebase e dati in tempo reale.",
          tags: ["Kotlin", "Firebase", "Android"],
          done: false
        },
        {
          name: "DartHub",
          path: "~/progetti/darthub",
          period: "2025 — 2026",
          desc: "Piattaforma per la gestione di partite e tornei di freccette, che collega giochi fisici a Internet tramite sensori IoT. Architettura a 7 microservizi Java con API Gateway, comunicazione real-time via MQTT ed edge component con modalità offline. Progetto di laboratorio universitario (PISSIR).",
          tags: ["Java", "Javalin", "JWT", "SQLite/JDBC", "MQTT", "API Gateway", "Microservizi", "Alpine.js"],
          done: false
        },
        {
          name: "EventHub",
          path: "~/progetti/eventhub",
          period: "2025 — 2026",
          desc: "Sistema distribuito per la gestione di eventi, sviluppato in Java con architettura RMI. Ruoli distinti per organizzatori e utenti. Progetto di Ingegneria del Software con metodologia Agile e documentazione UML.",
          tags: ["Java", "RMI", "UML", "Agile"],
          done: false
        },
        {
          name: "Iron Gym Website",
          path: "~/progetti/iron-gym",
          period: "2025",
          desc: "Applicazione web completa per la gestione di una palestra, con pannelli dedicati per amministratori, trainer e clienti. Frontend in HTML5/CSS3 e backend Node.js con API REST.",
          tags: ["Node.js", "JavaScript", "HTML5/CSS3", "REST API"],
          done: false
        },
        {
          name: "Compilator AC/DC",
          path: "~/progetti/compilator-ac-dc",
          period: "2026",
          desc: "Compilatore che traduce il linguaggio AC nel linguaggio DC, con fasi di analisi lessicale, sintattica e traduzione del codice. Progetto accademico avanzato sull'architettura dei linguaggi di programmazione.",
          tags: ["Java", "Compilatori", "Analisi sintattica"],
          done: false
        },
        {
          name: "OggettIUtilInVendita",
          path: "~/progetti/oggettiutilinvendita",
          period: "2026",
          desc: "App iOS per la compravendita di oggetti usati, in stile Subito.it. Gestione annunci, ricerca per categoria, profili utente e messaggistica tra acquirente e venditore.",
          tags: ["Swift", "iOS", "Firebase"],
          done: false
        },
        {
          name: "StudyMind",
          path: "~/progetti/studymind",
          period: "2026",
          desc: "Sistema multi-agente per sessioni di studio personalizzate: genera appunti sintetici e domande calibrate a partire dal materiale caricato, e risponde con metodo socratico invece di dare la soluzione diretta. Adattamento dinamico sulle lacune rilevate e report finale delle performance.",
          tags: ["Python", "Agno", "LLM", "AI Agents", "Pipeline"],
          done: true
        },
        {
          name: "Progetto Database",
          path: "~/progetti/db-teoria-sql",
          period: "2024 — 2025",
          desc: "Progettazione e implementazione di database relazionali con PL/pgSQL: dalla modellazione ER alla scrittura di procedure e query complesse in PostgreSQL.",
          tags: ["PostgreSQL", "PL/pgSQL", "SQL"],
          done: false
        }
      ],
      doneLabel: "Completato"
    },
    skills: {
      title: "competenze.json",
      categories: [
        { label: "linguaggi", items: ["Java", "Python", "JavaScript", "Kotlin", "C", "Swift", "SQL"] },
        { label: "web & backend", items: ["Node.js", "Express.js", "REST API", "HTML5/CSS3", "EJS", "Agno", "PHP", "Symfony", "Javalin", "MQTT (Mosquitto)"] },
        { label: "cloud & database", items: ["Firebase", "Google Cloud", "PostgreSQL", "pgvector", "Firestore", "SQLite/JDBC", "Docker"] },
        { label: "mobile", items: ["Android (Kotlin)", "iOS (Swift)", "SwiftUI"] },
        { label: "frontend", items: ["Vanilla JS", "Alpine.js"] },
        { label: "strumenti & metodi", items: ["Git/GitHub", "Agile/Scrum", "UML", "Linux", "PHPUnit", "JWT", "API Gateway", "Microservizi"] },
        { label: "ai & automazione", items: ["Prompt Engineering", "LLM/Chatbot AI", "Machine Learning", "Ricerca Vettoriale", "Embedding"] }
      ],
      languagesTitle: "Lingue parlate",
      languages: [
        { name: "Francese", level: "Madrelingua", pct: 100 },
        { name: "Arabo", level: "Madrelingua", pct: 100 },
        { name: "Italiano", level: "Fluente", pct: 85 },
        { name: "Inglese", level: "B2", pct: 60 }
      ]
    },
    contact: {
      tabname: "contatti.sh",
      title: "Parliamone",
      subtitle: "Sono aperto a stage, collaborazioni e nuove opportunità. Scrivimi pure, rispondo sempre.",
      links: {
        email: "Email",
        phone: "Telefono",
        whatsapp: "WhatsApp",
        github: "GitHub",
        linkedin: "LinkedIn"
      },
      copy: "Copia email",
      copied: "Copiata!"
    },
    footer: {
      tagline: "Costruisco, imparo, ripeto.",
      updated: "Ultimo aggiornamento: agosto 2026"
    }
  },

  en: {
    meta: {
      title: "Diabi Mohamed Zakaria — Portfolio",
      description: "Computer Science student — full-stack, mobile & AI developer. Projects, experience, and contact."
    },
    nav: {
      about: "about.md",
      path: "path.log",
      projects: "projects/",
      skills: "skills.json",
      contact: "contact.sh"
    },
    hero: {
      eyebrow: "Computer Science Student (BSc, in progress)",
      name: "Diabi Mohamed Zakaria",
      tagline: "Full-Stack, Mobile & AI Developer",
      bio: "Computer Science student at Università del Piemonte Orientale with solid hands-on experience in full-stack, mobile, and distributed software development. I design and build real applications spanning backend systems and cloud infrastructure to mobile apps and artificial intelligence, with a particular interest in generative models, LLM-based pipelines, and semantic search.",
      location: "Vercelli, Italy",
      status: "Currently interning at Foto Portale (Jul–Sep 2026)",
      ctaPrimary: "Get in touch",
      ctaSecondary: "View projects"
    },
    path: {
      title: "path.log",
      educationTitle: "Education",
      experienceTitle: "Experience",
      education: [
        { period: "2023 — ongoing", title: "Università del Piemonte Orientale", sub: "BSc in Computer Science" },
        { period: "2022", title: "Liceo Scientifico", sub: "Scientific High School Diploma" }
      ],
      experience: [
        {
          period: "Jul 2026 — Sep 2026 · 3 months",
          title: "Foto Portale",
          sub: "Internship — AI Search Module",
          desc: "Built the AI-powered search module for Foto Portale, a platform connecting brands and agencies with creators. I developed the full pipeline: profile data sync, context-text generation, embeddings and vector search combined with structured filters, plus the engine that generates a natural-language explanation of each result via an LLM. Wrote unit and integration tests with PHPUnit in a Dockerized PostgreSQL/pgvector environment.",
          tags: ["PHP", "Symfony", "Twig", "JavaScript", "LLM API", "PostgreSQL", "pgvector", "Doctrine", "Docker", "PHPUnit"]
        }
      ]
    },
    projects: {
      title: "projects/",
      items: [
        {
          name: "MiCasaEsTuCasa",
          path: "~/projects/micasaestucasa",
          period: "2026",
          desc: "Airbnb-style Android app for managing accommodations: search, booking, and listing management. Client-server architecture with Firebase authentication and real-time data.",
          tags: ["Kotlin", "Firebase", "Android"],
          done: false
        },
        {
          name: "DartHub",
          path: "~/projects/darthub",
          period: "2025 — 2026",
          desc: "Platform for managing darts matches and tournaments, connecting physical games to the internet via IoT sensors. 7-microservice Java architecture with an API Gateway, real-time MQTT communication, and an edge component with offline mode. University lab project (PISSIR).",
          tags: ["Java", "Javalin", "JWT", "SQLite/JDBC", "MQTT", "API Gateway", "Microservices", "Alpine.js"],
          done: false
        },
        {
          name: "EventHub",
          path: "~/projects/eventhub",
          period: "2025 — 2026",
          desc: "Distributed event-management system built in Java with an RMI architecture, with distinct roles for organizers and attendees. Software Engineering project built with Agile methodology and UML documentation.",
          tags: ["Java", "RMI", "UML", "Agile"],
          done: false
        },
        {
          name: "Iron Gym Website",
          path: "~/projects/iron-gym",
          period: "2025",
          desc: "Full web application for managing a gym, with dedicated panels for administrators, trainers, and members. HTML5/CSS3 frontend with a Node.js backend exposing a REST API.",
          tags: ["Node.js", "JavaScript", "HTML5/CSS3", "REST API"],
          done: false
        },
        {
          name: "Compilator AC/DC",
          path: "~/projects/compilator-ac-dc",
          period: "2026",
          desc: "Compiler that translates the AC language into DC, implementing lexical analysis, parsing, and code translation phases. Advanced academic project on programming-language architecture.",
          tags: ["Java", "Compilers", "Parsing"],
          done: false
        },
        {
          name: "OggettIUtilInVendita",
          path: "~/projects/oggettiutilinvendita",
          period: "2026",
          desc: "iOS marketplace app for buying and selling second-hand items, similar to Subito.it. Listing management, category search, user profiles, and buyer–seller messaging.",
          tags: ["Swift", "iOS", "Firebase"],
          done: false
        },
        {
          name: "StudyMind",
          path: "~/projects/studymind",
          period: "2026",
          desc: "Multi-agent system for personalized study sessions: generates synthetic notes and calibrated questions from uploaded material, and answers using the Socratic method instead of giving direct solutions. Dynamically adapts to detected gaps and produces a final performance report.",
          tags: ["Python", "Agno", "LLM", "AI Agents", "Pipeline"],
          done: true
        },
        {
          name: "Progetto Database",
          path: "~/projects/db-theory-sql",
          period: "2024 — 2025",
          desc: "Design and implementation of relational databases with PL/pgSQL: from ER modeling to writing complex procedures and queries in PostgreSQL.",
          tags: ["PostgreSQL", "PL/pgSQL", "SQL"],
          done: false
        }
      ],
      doneLabel: "Completed"
    },
    skills: {
      title: "skills.json",
      categories: [
        { label: "languages", items: ["Java", "Python", "JavaScript", "Kotlin", "C", "Swift", "SQL"] },
        { label: "web & backend", items: ["Node.js", "Express.js", "REST API", "HTML5/CSS3", "EJS", "Agno", "PHP", "Symfony", "Javalin", "MQTT (Mosquitto)"] },
        { label: "cloud & database", items: ["Firebase", "Google Cloud", "PostgreSQL", "pgvector", "Firestore", "SQLite/JDBC", "Docker"] },
        { label: "mobile", items: ["Android (Kotlin)", "iOS (Swift)", "SwiftUI"] },
        { label: "frontend", items: ["Vanilla JS", "Alpine.js"] },
        { label: "tools & methods", items: ["Git/GitHub", "Agile/Scrum", "UML", "Linux", "PHPUnit", "JWT", "API Gateway", "Microservices"] },
        { label: "ai & automation", items: ["Prompt Engineering", "LLM/Chatbot AI", "Machine Learning", "Vector Search", "Embedding"] }
      ],
      languagesTitle: "Spoken languages",
      languages: [
        { name: "French", level: "Native", pct: 100 },
        { name: "Arabic", level: "Native", pct: 100 },
        { name: "Italian", level: "Fluent", pct: 85 },
        { name: "English", level: "B2", pct: 60 }
      ]
    },
    contact: {
      tabname: "contact.sh",
      title: "Let's talk",
      subtitle: "I'm open to internships, collaborations, and new opportunities. Feel free to reach out — I always reply.",
      links: {
        email: "Email",
        phone: "Phone",
        whatsapp: "WhatsApp",
        github: "GitHub",
        linkedin: "LinkedIn"
      },
      copy: "Copy email",
      copied: "Copied!"
    },
    footer: {
      tagline: "Build, learn, repeat.",
      updated: "Last updated: August 2026"
    }
  },

  fr: {
    meta: {
      title: "Diabi Mohamed Zakaria — Portfolio",
      description: "Étudiant en informatique — développeur full-stack, mobile & IA. Projets, expérience et contact."
    },
    nav: {
      about: "about.md",
      path: "parcours.log",
      projects: "projets/",
      skills: "competences.json",
      contact: "contact.sh"
    },
    hero: {
      eyebrow: "Étudiant en Informatique (Licence en cours)",
      name: "Diabi Mohamed Zakaria",
      tagline: "Développeur Full-Stack, Mobile & IA",
      bio: "Étudiant en informatique à l'Università del Piemonte Orientale, avec une solide expérience pratique du développement logiciel full-stack, mobile et distribué. Je conçois et réalise des applications réelles allant des backends et infrastructures cloud aux systèmes mobiles et à l'intelligence artificielle, avec un intérêt particulier pour les modèles génératifs, les pipelines basés sur des LLM et la recherche sémantique.",
      location: "Vercelli, Italie",
      status: "En stage chez Foto Portale (juil.–sept. 2026)",
      ctaPrimary: "Me contacter",
      ctaSecondary: "Voir les projets"
    },
    path: {
      title: "parcours.log",
      educationTitle: "Formation",
      experienceTitle: "Expérience",
      education: [
        { period: "2023 — en cours", title: "Università del Piemonte Orientale", sub: "Licence en Informatique" },
        { period: "2022", title: "Liceo Scientifico", sub: "Baccalauréat scientifique" }
      ],
      experience: [
        {
          period: "Juil. 2026 — Sept. 2026 · 3 mois",
          title: "Foto Portale",
          sub: "Stage — Module de recherche IA",
          desc: "Développement du module de recherche IA de Foto Portale, une plateforme qui met en relation marques et agences avec des créateurs. J'ai construit le pipeline complet : synchronisation des profils, génération du texte de contexte, embeddings et recherche vectorielle combinée à des filtres structurés, ainsi que le moteur générant une explication en langage naturel des résultats via un LLM. Tests unitaires et d'intégration avec PHPUnit dans un environnement Docker PostgreSQL/pgvector.",
          tags: ["PHP", "Symfony", "Twig", "JavaScript", "LLM API", "PostgreSQL", "pgvector", "Doctrine", "Docker", "PHPUnit"]
        }
      ]
    },
    projects: {
      title: "projets/",
      items: [
        {
          name: "MiCasaEsTuCasa",
          path: "~/projets/micasaestucasa",
          period: "2026",
          desc: "Application Android façon Airbnb pour la gestion de logements : recherche, réservation et publication d'annonces. Architecture client-serveur avec authentification Firebase et données en temps réel.",
          tags: ["Kotlin", "Firebase", "Android"],
          done: false
        },
        {
          name: "DartHub",
          path: "~/projets/darthub",
          period: "2025 — 2026",
          desc: "Plateforme de gestion de matchs et tournois de fléchettes, reliant des jeux physiques à Internet via des capteurs IoT. Architecture à 7 microservices Java avec API Gateway, communication temps réel via MQTT et un composant edge avec mode hors-ligne. Projet de laboratoire universitaire (PISSIR).",
          tags: ["Java", "Javalin", "JWT", "SQLite/JDBC", "MQTT", "API Gateway", "Microservices", "Alpine.js"],
          done: false
        },
        {
          name: "EventHub",
          path: "~/projets/eventhub",
          period: "2025 — 2026",
          desc: "Système distribué de gestion d'événements développé en Java avec une architecture RMI, avec des rôles distincts pour organisateurs et participants. Projet de génie logiciel développé selon une méthodologie Agile avec documentation UML.",
          tags: ["Java", "RMI", "UML", "Agile"],
          done: false
        },
        {
          name: "Iron Gym Website",
          path: "~/projets/iron-gym",
          period: "2025",
          desc: "Application web complète pour la gestion d'une salle de sport, avec des espaces dédiés aux administrateurs, coachs et clients. Frontend en HTML5/CSS3 et backend Node.js avec API REST.",
          tags: ["Node.js", "JavaScript", "HTML5/CSS3", "REST API"],
          done: false
        },
        {
          name: "Compilator AC/DC",
          path: "~/projets/compilator-ac-dc",
          period: "2026",
          desc: "Compilateur traduisant le langage AC vers le langage DC, avec des phases d'analyse lexicale, syntaxique et de traduction du code. Projet académique avancé sur l'architecture des langages de programmation.",
          tags: ["Java", "Compilateurs", "Analyse syntaxique"],
          done: false
        },
        {
          name: "OggettIUtilInVendita",
          path: "~/projets/oggettiutilinvendita",
          period: "2026",
          desc: "Application iOS de petites annonces pour l'achat et la vente d'objets d'occasion, dans l'esprit de Subito.it. Gestion des annonces, recherche par catégorie, profils utilisateurs et messagerie acheteur-vendeur.",
          tags: ["Swift", "iOS", "Firebase"],
          done: false
        },
        {
          name: "StudyMind",
          path: "~/projets/studymind",
          period: "2026",
          desc: "Système multi-agents pour des sessions d'étude personnalisées : génère des notes synthétiques et des questions calibrées à partir du matériel fourni, et répond selon la méthode socratique plutôt que de donner la solution directe. S'adapte dynamiquement aux lacunes détectées et produit un rapport final de performance.",
          tags: ["Python", "Agno", "LLM", "AI Agents", "Pipeline"],
          done: true
        },
        {
          name: "Progetto Database",
          path: "~/projets/db-theorie-sql",
          period: "2024 — 2025",
          desc: "Conception et implémentation de bases de données relationnelles avec PL/pgSQL : de la modélisation ER à l'écriture de procédures et requêtes complexes en PostgreSQL.",
          tags: ["PostgreSQL", "PL/pgSQL", "SQL"],
          done: false
        }
      ],
      doneLabel: "Terminé"
    },
    skills: {
      title: "competences.json",
      categories: [
        { label: "langages", items: ["Java", "Python", "JavaScript", "Kotlin", "C", "Swift", "SQL"] },
        { label: "web & backend", items: ["Node.js", "Express.js", "REST API", "HTML5/CSS3", "EJS", "Agno", "PHP", "Symfony", "Javalin", "MQTT (Mosquitto)"] },
        { label: "cloud & bases de données", items: ["Firebase", "Google Cloud", "PostgreSQL", "pgvector", "Firestore", "SQLite/JDBC", "Docker"] },
        { label: "mobile", items: ["Android (Kotlin)", "iOS (Swift)", "SwiftUI"] },
        { label: "frontend", items: ["Vanilla JS", "Alpine.js"] },
        { label: "outils & méthodes", items: ["Git/GitHub", "Agile/Scrum", "UML", "Linux", "PHPUnit", "JWT", "API Gateway", "Microservices"] },
        { label: "ia & automatisation", items: ["Prompt Engineering", "LLM/Chatbot AI", "Machine Learning", "Recherche vectorielle", "Embedding"] }
      ],
      languagesTitle: "Langues parlées",
      languages: [
        { name: "Français", level: "Langue maternelle", pct: 100 },
        { name: "Arabe", level: "Langue maternelle", pct: 100 },
        { name: "Italien", level: "Courant", pct: 85 },
        { name: "Anglais", level: "B2", pct: 60 }
      ]
    },
    contact: {
      tabname: "contact.sh",
      title: "Discutons-en",
      subtitle: "Je suis ouvert aux stages, collaborations et nouvelles opportunités. N'hésitez pas à m'écrire, je réponds toujours.",
      links: {
        email: "Email",
        phone: "Téléphone",
        whatsapp: "WhatsApp",
        github: "GitHub",
        linkedin: "LinkedIn"
      },
      copy: "Copier l'email",
      copied: "Copié !"
    },
    footer: {
      tagline: "Je construis, j'apprends, je recommence.",
      updated: "Dernière mise à jour : août 2026"
    }
  }
};

/* =====================================================================
   Contact links — same across languages (only the visible label changes,
   see SITE_CONTENT[lang].contact.links above).
   // TODO: sostituisci "#" con l'URL reale del tuo profilo LinkedIn.
   // TODO: verifica che lo username GitHub sia corretto.
===================================================================== */
const CONTACT_HREF = {
  email: "mailto:mohamedzakariadiabi@gmail.com",
  phone: "tel:+393533067756",
  whatsapp: "https://wa.me/393533067756",
  github: "https://github.com/Diabi-Mohamed-Zakaria", // TODO: verifica username
  linkedin: "#" // TODO: incolla qui l'URL del tuo profilo LinkedIn
};

const SUPPORTED_LANGS = ["it", "en", "fr"];
