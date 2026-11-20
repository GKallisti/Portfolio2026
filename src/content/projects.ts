import type { Project } from './types'

/* Imported by the Cloudflare Pages Function as well as the browser bundle —
   keep this module free of React and browser globals. */

/**
 * Confidentiality note on `otm-agent`:
 *
 * The product name and the end clients are deliberately absent. What is
 * described here — the architecture, the problem, the outcome — is Gisella's
 * own engineering work and is safe to discuss. Do not add the product name,
 * client names, or screenshots to this file.
 */

export const projects: Project[] = [
  {
    id: 'enmoto',
    name: 'EnMoto',
    tagline: {
      en: 'A mobile platform for the motorcycle community, built solo and live on Google Play.',
      es: 'Una plataforma móvil para la comunidad motociclista, hecha en solitario y publicada en Google Play.',
    },
    description: {
      en: 'Social network, marketplace and anti-theft alert network in one app, with an AI assistant that plans routes conversationally.',
      es: 'Red social, marketplace y red de alertas antirrobo en una sola app, con un asistente de IA que planifica rutas conversando.',
    },
    detail: {
      en: 'Every layer is mine: a React 19 + TypeScript frontend packaged as a native Android app through Capacitor and published on Google Play, a .NET 10 API in Clean Architecture with CQRS, PostGIS for geospatial queries, three real-time SignalR hubs, and over 90 automated tests running in CI. GitHub Actions runs the tests and builds the Android app — a debug APK whenever the client changes, and the signed AAB for Play — while the front deploys itself to Cloudflare Pages. The API ships through my own deploy script, which builds the ARM Docker image, brings it up on an Oracle Cloud VM and confirms both the health check and the commit that is actually running. Automated backups and error monitoring round it off — all on free-tier infrastructure. The route assistant runs on Semantic Kernel, combining an LLM with OpenRouteService and Nominatim so riders can ask for a route in plain language.',
      es: 'Cada capa es mía: un frontend React 19 + TypeScript empaquetado como app nativa de Android con Capacitor y publicado en Google Play, una API .NET 10 en Clean Architecture con CQRS, PostGIS para consultas geoespaciales, tres hubs SignalR en tiempo real y más de 90 tests automatizados corriendo en CI. GitHub Actions corre los tests y compila la app Android —un APK de debug con cada cambio al cliente y el AAB firmado para Play—, y el front se publica solo en Cloudflare Pages. La API se despliega con un script propio que construye la imagen Docker para ARM, la levanta en una VM de Oracle Cloud y confirma tanto el health check como el commit que quedó corriendo. Se completa con backups automáticos y monitoreo de errores, todo sobre infraestructura de capa gratuita. El asistente de rutas corre sobre Semantic Kernel, combinando un LLM con OpenRouteService y Nominatim para que quien maneja pueda pedir una ruta en lenguaje natural.',
    },
    domains: ['fullstack', 'mobile', 'ai'],
    stack: [
      'React 19',
      'TypeScript',
      'Capacitor',
      '.NET 10',
      'CQRS',
      'PostGIS',
      'SignalR',
      'Semantic Kernel',
      'Docker',
      'GitHub Actions',
      'Oracle Cloud',
    ],
    status: 'production',
    year: '2025',
    /* Straight to the Play Store listing. No `hl` parameter on purpose: Google
       serves the store page in the visitor's own locale, and pinning it to
       es_AR would show Spanish to an English-speaking recruiter. */
    download: 'https://play.google.com/store/apps/details?id=com.enmoto.app',
    landing: 'https://enmoto.com.ar/descargar',
    featured: true,
  },
  {
    id: 'otm-agent',
    name: {
      en: 'Agentic assistant for Oracle Transportation Management',
      es: 'Asistente agéntico para Oracle Transportation Management',
    },
    tagline: {
      en: 'An agentic system I took from a scripted assistant to LLM reasoning — alone, in under a year.',
      es: 'Un sistema agéntico que llevé de asistente scripteado a razonamiento con LLM — sola, en menos de un año.',
    },
    description: {
      en: 'A transactional conversational agent embedded in Oracle Transportation Management, built for enterprise SaaS clients who needed agentic workflows the platform did not yet cover.',
      es: 'Un agente conversacional transaccional embebido en Oracle Transportation Management, construido para clientes SaaS enterprise que necesitaban flujos agénticos que la plataforma todavía no cubría.',
    },
    detail: {
      en: 'I was the sole developer across architecture, code and documentation, with no senior supervision. It began as an ODA-only assistant with no LLM in the loop; I rebuilt it into a full agentic system with LLM reasoning, RAG and document recognition. The core is a schema-driven, declarative API catalog — 13 OTM objects and 37 operations — running on a modular deterministic pipeline: router, planner, entity resolver, executor, parser, presenter. The architecture is stateless, so it is idempotent across restarts and scales horizontally. RAG runs behind anti-hallucination guardrails, and the LLM client is hybrid across OCI Generative AI and OpenAI. I presented it live at several OTM industry conferences and scoped a working demo for a prospective client. It did not go on to production: partway through, Oracle shipped equivalent capability bundled into the subscription those clients already had. I read that as the clearest validation the work could have got — I had built for a gap the platform owner went on to fill.',
      es: 'Fui la única desarrolladora en arquitectura, código y documentación, sin supervisión senior. Empezó siendo un asistente basado solo en ODA, sin LLM en el circuito; lo reconstruí hasta convertirlo en un sistema agéntico completo con razonamiento LLM, RAG y reconocimiento de documentos. El núcleo es un catálogo de API declarativo y schema-driven — 13 objetos de OTM y 37 operaciones — sobre un pipeline determinista y modular: router, planner, entity resolver, executor, parser, presenter. La arquitectura es stateless, así que es idempotente ante reinicios y escala horizontalmente. El RAG corre detrás de guardrails anti-alucinación, y el cliente LLM es híbrido entre OCI Generative AI y OpenAI. Lo presenté en vivo en varias conferencias de la industria OTM y armé una demo funcional para un cliente potencial. No llegó a producción: en el camino, Oracle lanzó capacidades equivalentes incluidas en la suscripción que esos clientes ya tenían. Lo leo como la validación más clara que el trabajo podía recibir — había construido para un hueco que el dueño de la plataforma terminó cubriendo.',
    },
    domains: ['ai'],
    stack: [
      'Agentic Architecture',
      'RAG',
      'OCI Generative AI',
      'OpenAI',
      'Oracle Digital Assistant',
      'Oracle Transportation Management',
      'REST APIs',
    ],
    status: 'demonstrated',
    year: '2024',
    confidentialNote: {
      en: 'Client work — product and client names withheld under confidentiality.',
      es: 'Trabajo para cliente — nombres de producto y clientes reservados por confidencialidad.',
    },
    featured: true,
  },
  {
    id: 'portfolio-agent',
    name: { en: 'This site', es: 'Este sitio' },
    tagline: {
      en: 'The agent in the corner is a working demo of the architecture above.',
      es: 'El agente de la esquina es una demo funcional de la arquitectura de arriba.',
    },
    description: {
      en: 'A portfolio whose assistant actually operates the page: it filters projects, switches language, changes the theme and navigates — through a typed tool catalog, with the pipeline visible while it runs.',
      es: 'Un portfolio cuyo asistente realmente opera la página: filtra proyectos, cambia el idioma, cambia el tema y navega — a través de un catálogo de tools tipado, con el pipeline visible mientras corre.',
    },
    detail: {
      en: 'Rather than describing how I build agents, this page runs one. Every action the agent can take is declared once as a Zod schema, which produces both the runtime validation and the function definitions sent to the model — the same schema-driven approach as the OTM catalog, shrunk to fit a website. The API key stays server-side in a Cloudflare Pages Function with rate limiting; the browser never sees it. When the model is unreachable, the commands still work locally.',
      es: 'En vez de describir cómo construyo agentes, esta página corre uno. Cada acción que el agente puede ejecutar se declara una sola vez como schema de Zod, y de ahí salen tanto la validación en runtime como las definiciones de funciones que recibe el modelo — el mismo enfoque schema-driven del catálogo de OTM, reducido al tamaño de un sitio web. La API key vive server-side en una Cloudflare Pages Function con rate limiting; el navegador nunca la ve. Si el modelo no responde, los comandos siguen funcionando localmente.',
    },
    domains: ['ai', 'web'],
    stack: ['React 19', 'TypeScript', 'Zod', 'Tailwind 4', 'Cloudflare Pages Functions', 'OpenAI API'],
    status: 'production',
    year: '2026',
    repo: 'https://github.com/GKallisti/Portfolio',
    featured: true,
  },
  {
    id: 'ingobernable',
    name: 'Ingobernable',
    tagline: {
      en: 'A political satire management game about running Argentina — published, playable in the browser.',
      es: 'Un juego de gestión y sátira política sobre gobernar Argentina — publicado y jugable en el navegador.',
    },
    description: {
      en: 'You govern Argentina and try to survive your term: provinces, factions, the public, elections and events, all in retro pixel art. Black humour aimed at power, equally at every side.',
      es: 'Gobernás Argentina e intentás aguantar el mandato: provincias, facciones, el pueblo, elecciones y eventos, todo en pixel art retro. Humor negro que apunta al poder, por igual a todos los espacios.',
    },
    detail: {
      en: 'This is where the game development degree meets the day job. It started as a TypeScript/React prototype and I rebuilt it in Unity 6 and C#, with Windows and WebGL builds. The simulation is pure C#, deterministic and fully separate from the view: every random roll goes through a seeded RNG, it compiles and runs its 350+ tests outside the editor on .NET 10, and Unity imports it as a local package — which is what makes a balance change measurable instead of anecdotal. Content and balance are data-driven JSON catalogues, tuned over eight documented balance passes with simulated bot runs. The online leaderboard is a Cloudflare Worker with D1 and versioned migrations, and a scripted pipeline builds Windows and WebGL, runs a smoke test, deploys the site and verifies it. The pixel art for the title and posters is my own, drawn in Aseprite. Currently on version 1.3.',
      es: 'Acá es donde la tecnicatura en videojuegos se cruza con el trabajo. Empezó como un prototipo en TypeScript/React y lo reconstruí en Unity 6 y C#, con builds para Windows y WebGL. La simulación es C# puro, determinista y totalmente separada de la vista: todo el azar pasa por un RNG con semilla, compila y corre sus más de 350 tests fuera del editor con .NET 10, y Unity la importa como paquete local — eso es lo que hace que un cambio de balance sea medible y no anecdótico. El contenido y el balance son catálogos JSON, ajustados en ocho pasadas de balance documentadas con partidas simuladas por bots. El leaderboard online es un Worker de Cloudflare con D1 y migraciones versionadas, y un pipeline con scripts compila Windows y WebGL, corre una prueba de humo, publica el sitio y lo verifica. El pixel art del título y los afiches es mío, dibujado en Aseprite. Hoy va por la versión 1.3.',
    },
    domains: ['games'],
    stack: ['Unity 6', 'C#', '.NET 10', 'WebGL', 'Cloudflare Workers', 'D1', 'Aseprite'],
    status: 'production',
    year: '2026',
    href: 'https://ingobernable.aidev-gg.ar/',
    featured: true,
  },
  {
    id: 'bardoarcade',
    name: 'BardoArcade',
    tagline: {
      en: 'A living-room game hub: the TV is the shared screen, up to eight phones are the controllers.',
      es: 'Un hub de juegos para el living: el TV es la pantalla compartida y hasta ocho teléfonos son los controles.',
    },
    description: {
      en: 'Six original party games — trivia, a band builder, blackjack, kart racing and more — plus an arcade corner. Players join by scanning a QR code; each phone is both a controller and a private screen.',
      es: 'Seis juegos propios para jugar en grupo — trivia, armá tu banda, blackjack, carreras de karts y más — y un rincón de arcades. Se entra escaneando un QR; cada teléfono es control y pantalla privada a la vez.',
    },
    detail: {
      en: 'The server is the authority: built on Node 22 and Colyseus, it validates every action and runs the rules and simulations, while phones send intentions rather than results and the TV only renders the state it receives — with separate public and private views, and token-based identity recovery so a full page reload does not drop a player. The monorepo keeps a shared protocol package validated with Zod and one package per game. Karts are drawn in Three.js with a four-way split screen and simulated server-side. The heavier arcade titles are emulated on the server itself and streamed to the TV at 58–60 fps. The same React app ships as two Android apps through Capacitor, one for Android TV and one for phones, with App Links so a room QR opens straight in the app. It runs on an Oracle Cloud ARM VM behind Cloudflare, over HTTPS and secure WebSockets, and is tested with node:test and Playwright on Chromium and WebKit.',
      es: 'El servidor es la autoridad: hecho con Node 22 y Colyseus, valida cada acción y corre las reglas y simulaciones, mientras los teléfonos mandan intenciones y no resultados, y el TV solo dibuja el estado que recibe — con vistas públicas y privadas separadas, y recuperación de identidad por tokens para que recargar la página no saque a nadie de la partida. El monorepo tiene un paquete de protocolo compartido validado con Zod y un paquete por juego. Los karts se dibujan en Three.js con pantalla dividida en cuatro y se simulan en el servidor. Los arcades más pesados se emulan en el propio servidor y se transmiten al TV a 58–60 cuadros por segundo. La misma app React sale como dos apps Android con Capacitor, una para Android TV y otra para teléfonos, con App Links para que el QR de la sala abra directo en la app. Corre en una VM ARM de Oracle Cloud detrás de Cloudflare, con HTTPS y WebSockets seguros, y se prueba con node:test y Playwright en Chromium y WebKit.',
    },
    domains: ['fullstack', 'mobile', 'games'],
    stack: ['TypeScript', 'React 19', 'Node.js', 'Colyseus', 'Three.js', 'Zod', 'Capacitor', 'Playwright', 'Oracle Cloud'],
    status: 'in-progress',
    year: '2026',
    href: 'https://party.challengers.ar',
    featured: false,
  },
  {
    id: 'casa-13',
    name: 'Casa 13',
    tagline: {
      en: 'An isometric action roguelike where your birth chart builds your character and the real sky changes each run.',
      es: 'Un roguelike de acción isométrico donde tu carta astral arma el personaje y el cielo real cambia cada partida.',
    },
    description: {
      en: 'Cross the twelve astrological houses to face Ophiuchus, the sign erased from the zodiac. Sun, Moon and Ascendant decide your stats, abilities and starting gear; today’s moon phase and retrogrades change today’s run.',
      es: 'Atravesás las doce casas astrológicas para enfrentar a Ofiuco, el signo borrado del zodíaco. Sol, Luna y Ascendente definen stats, habilidades y equipo inicial; la fase lunar y los retrógrados de hoy cambian la partida de hoy.',
    },
    detail: {
      en: 'Built in Godot 4.7 with GDScript, currently working towards a vertical slice: the first quadrant of houses plus the boss. Every character gets the same stat budget and each sign biases it through its own pool per position, so no chart is unfairly weak. Alongside the game I write my own tooling: a sprite forge, a layered character builder that also generates random enemies, and palette extraction from concept art. A headless smoke test walks every chart combination — 12³ of them — checking the stat budget, then plays a full run automatically through every room, ability and the boss.',
      es: 'Hecho en Godot 4.7 con GDScript, hoy rumbo a una porción vertical: el primer cuadrante de casas más el jefe. Todos los personajes tienen el mismo presupuesto de stats y cada signo lo sesga con su propio pool por posición, así que ninguna carta sale injustamente débil. Junto al juego escribo mis propias herramientas: una forja de sprites, un armador de personajes por capas que también genera enemigos al azar y extracción de paleta desde el arte conceptual. Un smoke test headless recorre todas las combinaciones de carta — 12³ — verificando el presupuesto de stats, y después juega una partida completa sola, por todas las salas, habilidades y el jefe.',
    },
    domains: ['games'],
    stack: ['Godot 4', 'GDScript'],
    status: 'building',
    year: '2026',
    featured: false,
  },
  {
    id: 'ticket-timer',
    name: 'Ticket Timer',
    tagline: {
      en: 'Time tracking per ticket for a consulting team, with a management dashboard — built on my own initiative.',
      es: 'Registro de horas por ticket para un equipo de consultoría, con dashboard de gestión — hecho por iniciativa propia.',
    },
    description: {
      en: 'A timer the team uses to log hours against each ticket, and a dashboard where the project manager sees the whole team’s time. Works offline and syncs when it can.',
      es: 'Un cronómetro con el que el equipo carga horas por ticket, y un dashboard donde el project manager ve el tiempo de todo el equipo. Funciona sin conexión y sincroniza cuando puede.',
    },
    detail: {
      en: 'Three layers with clear roles: the browser’s local storage as an offline queue, a Cloudflare Worker with D1 as the source of truth the dashboard reads from, and a write-only backup to a synced folder inside the client’s tenant. The design is driven by data minimisation — the full record, free-text descriptions included, only goes to the tenant backup, while the Worker receives just the projection the dashboard needs, so client text never leaves the client’s environment. Access is split into two roles, team and manager, each with its own five-word passphrase that is easy to dictate over the phone. It runs on the free tier, with versioned SQL migrations and a manual for the team.',
      es: 'Tres capas con roles claros: el almacenamiento local del navegador como cola offline, un Worker de Cloudflare con D1 como fuente de verdad de la que lee el dashboard, y un respaldo de solo escritura en una carpeta sincronizada dentro del tenant del cliente. El diseño parte de la minimización de datos — el registro completo, con las descripciones en texto libre, solo va al respaldo del tenant, mientras el Worker recibe únicamente la proyección que necesita el dashboard, así que el texto del cliente nunca sale de su entorno. El acceso se divide en dos roles, equipo y gestión, cada uno con su frase de cinco palabras, fácil de dictar por teléfono. Corre en la capa gratuita, con migraciones SQL versionadas y un manual para el equipo.',
    },
    domains: ['web'],
    stack: ['JavaScript', 'Cloudflare Workers', 'D1', 'SQL'],
    status: 'building',
    year: '2026',
    confidentialNote: {
      en: 'Internal tool — no public link.',
      es: 'Herramienta interna — sin enlace público.',
    },
    featured: false,
  },
  {
    id: 'freelance-web',
    name: { en: 'Freelance web development', es: 'Desarrollo web freelance' },
    tagline: {
      en: 'E-commerce and landing pages for small businesses, end to end.',
      es: 'E-commerce y landing pages para pequeños negocios, de punta a punta.',
    },
    description: {
      en: 'A run of WordPress and WooCommerce builds for direct clients, where I handled development, hosting and DNS myself.',
      es: 'Una serie de desarrollos en WordPress y WooCommerce para clientes directos, donde me ocupé del desarrollo, el hosting y el DNS.',
    },
    detail: {
      en: 'Between late 2022 and early 2024 I designed, built and deployed sites for furniture retail, real estate and non-profit clients — including Premier Muebles, Gorostidi Inmobiliaria, Anhimalia and Fe.bo.ca.k. Beyond the builds themselves, I managed hosting, domains and DNS configuration directly with each client, which is where I learned the operational side of shipping something someone else depends on.',
      es: 'Entre fines de 2022 y principios de 2024 diseñé, construí y desplegué sitios para clientes de mobiliario, inmobiliaria y ONGs — entre ellos Premier Muebles, Gorostidi Inmobiliaria, Anhimalia y Fe.bo.ca.k. Más allá del desarrollo, gestioné hosting, dominios y configuración de DNS directamente con cada cliente, que es donde aprendí el lado operativo de sostener algo de lo que otra persona depende.',
    },
    domains: ['web'],
    stack: ['WordPress', 'WooCommerce', 'PHP', 'MySQL', 'DNS', 'Hosting'],
    status: 'archived',
    year: '2022–2024',
    href: 'https://rodrigotolzen.com/',
    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

/** Every distinct stack entry, for the agent's filter vocabulary. */
export const allStackTags = [...new Set(projects.flatMap((p) => p.stack))].sort()
