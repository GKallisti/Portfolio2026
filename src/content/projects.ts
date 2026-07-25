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
      en: 'A production mobile platform for the motorcycle community, built solo.',
      es: 'Una plataforma móvil en producción para la comunidad motociclista, hecha en solitario.',
    },
    description: {
      en: 'Social network, marketplace and anti-theft alert network in one app, with an AI assistant that plans routes conversationally.',
      es: 'Red social, marketplace y red de alertas antirrobo en una sola app, con un asistente de IA que planifica rutas conversando.',
    },
    detail: {
      en: 'Every layer is mine: a React 19 + TypeScript frontend packaged as a native Android app through Capacitor, a .NET 10 API in Clean Architecture with CQRS, PostGIS for geospatial queries, three real-time SignalR hubs, and over 90 automated tests running in CI. It ships through a Dockerised GitHub Actions pipeline to an Oracle Cloud VM with automated backups, health checks and error monitoring — all on free-tier infrastructure. The route assistant runs on Semantic Kernel, combining an LLM with OpenRouteService and Nominatim so riders can ask for a route in plain language.',
      es: 'Cada capa es mía: un frontend React 19 + TypeScript empaquetado como app nativa de Android con Capacitor, una API .NET 10 en Clean Architecture con CQRS, PostGIS para consultas geoespaciales, tres hubs SignalR en tiempo real y más de 90 tests automatizados corriendo en CI. Se despliega mediante un pipeline dockerizado de GitHub Actions a una VM de Oracle Cloud, con backups automáticos, health checks y monitoreo de errores, todo sobre infraestructura de capa gratuita. El asistente de rutas corre sobre Semantic Kernel, combinando un LLM con OpenRouteService y Nominatim para que quien maneja pueda pedir una ruta en lenguaje natural.',
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
    href: 'https://enmoto.com.ar',
    download: 'https://enmoto.com.ar/descargar',
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
    /* Hidden behind the konami / ABACABB codes and the agent's `revealSecret`.
       It is real, in-progress work — the point of hiding it is that finding it
       is a reward for poking around, not that it is unfinished. */
    id: 'arg-idle',
    name: 'Argentina Idle Manager',
    secret: true,
    tagline: {
      en: 'A management roguelike about running Argentina. Deliberately unfair.',
      es: 'Un roguelike de gestión sobre administrar Argentina. Deliberadamente injusto.',
    },
    description: {
      en: 'An idle/management game where you run the country — or its provinces — against economic, social and political events, and try to last as long as you can before it collapses.',
      es: 'Un juego idle/management donde administrás el país — o sus provincias — contra eventos económicos, sociales y políticos, tratando de durar lo máximo posible antes del colapso.',
    },
    detail: {
      en: 'This is where the game development degree meets the day job. The simulation lives in a headless TypeScript core with Zod-validated state, kept entirely separate from the React UI — so the economy can be tested without rendering anything, and there is a test asserting the seeded RNG produces identical runs, which is what makes a balance change measurable instead of anecdotal. 33 tests currently pass. Systems are modelled as interacting loops rather than a list of numbers: education raises development, which slowly lowers corruption, which reduces dollar flight. The design philosophy is that the wrong move is always the tempting one — printing money and devaluing both work, right up until they do not.',
      es: 'Acá es donde la tecnicatura en videojuegos se cruza con el trabajo. La simulación vive en un core headless de TypeScript con estado validado por Zod, completamente separado de la UI en React — así la economía se puede testear sin renderizar nada, y hay un test que verifica que el RNG con semilla produce corridas idénticas, que es lo que hace que un cambio de balance sea medible y no anecdótico. Hoy pasan 33 tests. Los sistemas están modelados como loops que interactúan, no como una lista de números: la educación sube el desarrollo, que baja lentamente la corrupción, que reduce la fuga de dólares. La filosofía de diseño es que lo incorrecto siempre es lo tentador — emitir y devaluar funcionan, hasta que dejan de funcionar.',
    },
    domains: ['fullstack'],
    stack: ['TypeScript', 'Zod', 'React', 'Zustand', 'Vitest', 'npm workspaces'],
    status: 'in-progress',
    year: '2026',
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
    href: 'https://premiermuebles.com/',
    featured: false,
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

/** Projects visible without unlocking anything. */
export const publicProjects = projects.filter((p) => !p.secret)

/** Every distinct stack entry, for the agent's filter vocabulary. */
export const allStackTags = [...new Set(projects.flatMap((p) => p.stack))].sort()
