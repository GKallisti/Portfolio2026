import type { Localized } from './types'

/* Imported by the Worker as well as the browser bundle: the Worker needs the
   paths to serve the app shell, and the agent needs the key points so it can
   talk about these pages without inventing what is on them. Keep this module
   free of React and browser globals. */

/**
 * In-depth pages that hang off a project card.
 *
 * The site is otherwise a single scrolling page. These are separate routes
 * because they are long enough to be read on their own and worth linking to
 * directly — an interviewer should be able to receive one URL.
 */
export const DEEP_DIVE_IDS = ['enmoto-product', 'enmoto-architecture'] as const
export type DeepDiveId = (typeof DEEP_DIVE_IDS)[number]

export const PAGE_IDS = ['home', ...DEEP_DIVE_IDS] as const
export type PageId = (typeof PAGE_IDS)[number]

export interface DeepDive {
  id: DeepDiveId
  path: string
  /** The project card these pages are linked from. */
  projectId: string
  /** Short link text. */
  label: Localized
  /** Used for the document title. */
  title: Localized
  /** One line on the project card, under the link. */
  teaser: Localized
  /**
   * What the page says, condensed for the agent's reference. Not rendered —
   * the page itself carries the full version. If the page changes a claim,
   * change it here too, or the agent will contradict the page it just opened.
   */
  keyPoints: Localized<string[]>
}

export const deepDives: Record<DeepDiveId, DeepDive> = {
  'enmoto-product': {
    id: 'enmoto-product',
    path: '/enmoto/product',
    projectId: 'enmoto',
    label: { en: 'What it solves', es: 'Qué resuelve' },
    title: { en: 'EnMoto — what it solves', es: 'EnMoto — qué resuelve' },
    teaser: {
      en: 'The problem, the five features that tackle it, and the business decision behind each one.',
      es: 'El problema, las cinco funciones que lo atacan y la decisión de negocio detrás de cada una.',
    },
    keyPoints: {
      en: [
        'The problem: the information riders need already exists, but it is scattered across WhatsApp groups, Facebook pages and forwarded screenshots. It is a format problem, not a community problem — EnMoto puts a map on top of a community that already exists.',
        "Businesses: 5,151 listings were seeded before any owner signed up, so the map is useful on day one. Owners can claim their listing (with manual approval) and get a panel with three numbers: impressions, opens and contact taps. The order is deliberate — seed, measure, claim, and only then monetise — so the future sales pitch is 'this is what already happened while it was free'.",
        'SOS: one button, two modes. A theft alert goes to everyone within 50 km; a breakdown request goes to friends only by default, because asking for help reveals that you are alone. It arrives instantly in open apps and as a push notification in closed ones, and it expires on its own after 72 hours. Stated limit: push only reaches people who pinned a zone — live location is never stored — and today that is a minority.',
        "Clubs and events: clubs are real entities with members, followers and their own events on the map. 'How do I get there' is deterministic (GPS plus a routing service, no AI), and routes export to Google Maps or Waze rather than competing with them.",
        'AI copilot: plans multi-leg routes from plain language and answers discovery questions. The model chooses; it does not look things up. Every hard fact — phone, opening hours, price, event date, route geometry — travels from the database to the screen without passing through the model, because a confidently invented phone number is worse than none. It is free with a daily quota, because every query costs real money.',
        'Anti-abuse without identity checks: accounts gain reach over time — confirmed email, then 7 days with a complete profile, then a month with friends or a club. What gets limited is what helps someone mass-creating accounts, not what a genuine rider needs.',
        'Business decisions: free and ad-free for now; a marketplace with no commission; monetise businesses, not riders; Google Play plus a direct APK; Argentina first. It is deliberately not a GPS navigator, not an endless feed, does not handle payments, and never stores live location.',
        'Status as of 15 September 2026: live on Google Play, around 24 registered users and 5,151 business listings. The bottleneck is distribution, not the product.',
      ],
      es: [
        'El problema: la información que necesita un motociclista ya existe, pero está dispersa entre grupos de WhatsApp, páginas de Facebook y capturas reenviadas. Es un problema de formato, no de falta de comunidad — EnMoto le pone un mapa encima a una comunidad que ya existe.',
        "Comercios: se sembraron 5.151 fichas antes de que se registrara ningún dueño, así que el mapa sirve desde el día uno. El dueño puede reclamar su ficha (con aprobación manual) y gana un panel con tres números: apariciones, aperturas y toques al contacto. El orden es deliberado — sembrar, medir, reclamar y recién después monetizar — para que la conversación de venta sea 'esto es lo que ya te pasó estando gratis'.",
        'SOS: un solo botón con dos modos. La alerta de robo le llega a todos en 50 km; el pedido de auxilio sale por defecto sólo a amigos, porque pedir ayuda expone que estás solo. Llega al instante a quien tiene la app abierta y como notificación push a quien la tiene cerrada, y vence sola a las 72 horas. Límite dicho sin maquillar: el push sólo le llega a quien fijó su zona — la ubicación en vivo no se guarda — y hoy es una minoría.',
        "Agrupaciones y eventos: las agrupaciones son una entidad real, con miembros, seguidores y eventos propios en el mapa. 'Cómo llego' es determinístico (GPS más un servicio de ruteo, sin IA) y la ruta se exporta a Google Maps o Waze en vez de competir con ellos.",
        'Copiloto con IA: planifica rutas de varios tramos pedidas en lenguaje natural y responde búsquedas. El modelo elige, no consulta: todo dato duro — teléfono, horario, precio, fecha de un evento, geometría de la ruta — viaja de la base a la pantalla sin pasar por el modelo, porque un teléfono inventado con seguridad es peor que no tener teléfono. Es gratis con cupo diario, porque cada consulta cuesta plata real.',
        'Antiabuso sin verificar identidad: la cuenta gana alcance con el tiempo — email confirmado, después 7 días con perfil completo, después un mes con amistades o una agrupación. Se frena lo que le sirve a quien fabrica cuentas, no lo que necesita quien usa la app.',
        'Decisiones de negocio: gratis y sin publicidad por ahora; marketplace sin comisión; monetizar comercios, no usuarios; Google Play más APK directo; Argentina primero. Deliberadamente no es un navegador GPS, no es un feed infinito, no intermedia pagos y no guarda la ubicación en vivo.',
        'Estado al 15 de septiembre de 2026: publicada en Google Play, alrededor de 24 usuarios registrados y 5.151 fichas de comercio. El cuello de botella es la distribución, no el producto.',
      ],
    },
  },

  'enmoto-architecture': {
    id: 'enmoto-architecture',
    path: '/enmoto/architecture',
    projectId: 'enmoto',
    label: { en: 'How it works inside', es: 'Cómo funciona por dentro' },
    title: { en: 'EnMoto — under the hood', es: 'EnMoto — por dentro' },
    teaser: {
      en: 'Seven flows, drawn out: what talks to what, what was decided on purpose, and what was learned the hard way.',
      es: 'Siete flujos dibujados: qué habla con qué, qué se decidió a propósito y qué costó aprender.',
    },
    keyPoints: {
      en: [
        'One frontend codebase (React 19, TypeScript, Vite, Leaflet) serves both the web and the Android app through Capacitor. The front deploys automatically to Cloudflare Pages; the .NET 10 API is deployed by hand to a single OCI Ampere A1 VM running podman — asymmetric on purpose, because the API applies database migrations on startup.',
        'The API is a modular monolith in Clean Architecture (Domain, Application, Infrastructure, API) with MediatR and FluentValidation: 27 REST controllers, 3 SignalR hubs and 8 background workers. Suspended or unverified accounts are stopped by middleware before authorisation, not re-checked in every handler.',
        'Real time: an SOS alert is stored, broadcast over SignalR and pushed through Firebase FCM — two paths, not one with a fallback. AlertHub groups connections by geohash (precision 4, about 20 km) and by user. The lesson it left: the SignalR group is the access control — a friends-only alert was once being broadcast to the whole zone.',
        'AI copilot: Semantic Kernel with gpt-4o-mini and automatic tool calling over 10 tools, behind four brakes (platform switch, global spend ceiling, daily per-user quota, 10 requests a minute), with sessions stored in Postgres (30-minute TTL, 20 turns). Two output channels: a text summary goes back to the model, while DTO cards go straight to the app. The gotcha: returning route geometry to the model once pushed multi-leg trips past the 128k context window.',
        'Eight background workers expire and clean up content, promote community meeting points, notify people about nearby events, and score suspicious accounts once a night — deliberately kept off the hot path of every request.',
        'Anti-abuse in four independent layers: platform switches, account middleware, per-user rate limits and trust levels. The sign-in event log keeps truncated IPs and hashed user agents — enough to spot a burst of sign-ups from one place, not enough to identify anyone.',
        'Delivery: GitHub Actions runs backend unit and integration tests plus the front build on every push. The Android release workflow builds a signed AAB and checks permissions on the built artefact with aapt2, after two Play rejections. A deploy is verified by comparing the SHA served at /version and /version.json with git HEAD.',
        'Data and services: PostgreSQL 16 with PostGIS and pgvector, Cloudflare R2 for photos, OSRM and OpenRouteService for routing, Nominatim for geocoding, MapTiler map tiles, Brevo for email, Sentry and UptimeRobot for monitoring.',
      ],
      es: [
        'Un solo código de frontend (React 19, TypeScript, Vite, Leaflet) sirve a la web y a la app Android a través de Capacitor. El front se despliega solo en Cloudflare Pages; la API de .NET 10 se despliega a mano en una única VM OCI Ampere A1 con podman — asimétrico a propósito, porque la API aplica las migraciones al arrancar.',
        'La API es un monolito modular en Clean Architecture (Domain, Application, Infrastructure, API) con MediatR y FluentValidation: 27 controllers REST, 3 hubs de SignalR y 8 workers en segundo plano. Las cuentas suspendidas o sin verificar se frenan en un middleware antes de la autorización, no en cada handler.',
        'Tiempo real: una alerta de SOS se guarda, se difunde por SignalR y se manda como push por Firebase FCM — dos caminos, no uno con fallback. AlertHub agrupa conexiones por geohash (precisión 4, unos 20 km) y por usuario. La lección que dejó: el grupo de SignalR es el control de acceso — una alerta sólo para amigos se estaba difundiendo a toda la zona.',
        'Copiloto con IA: Semantic Kernel con gpt-4o-mini y tool-calling automático sobre 10 herramientas, detrás de cuatro frenos (interruptor de plataforma, techo global de gasto, cuota diaria por usuario, 10 pedidos por minuto), con sesiones guardadas en Postgres (TTL de 30 minutos, 20 turnos). Dos canales de salida: un resumen en texto vuelve al modelo, y las fichas (DTOs) van directo a la app. El gotcha: devolverle la geometría de la ruta al modelo hizo que los viajes de varios tramos superaran la ventana de 128k.',
        'Ocho workers en segundo plano vencen y limpian contenido, consolidan puntos de encuentro, avisan de eventos cercanos y puntúan cuentas sospechosas una vez por noche — a propósito fuera del camino caliente de cada request.',
        'Antiabuso en cuatro capas independientes: interruptores de plataforma, middlewares de cuenta, rate limit por usuario y niveles de confianza. El registro de logins guarda IPs truncadas y user-agents hasheados — alcanza para detectar una ronda de altas desde el mismo lugar, no para identificar a nadie.',
        'Entrega: GitHub Actions corre los tests unitarios y de integración del backend y el build del front en cada push. El workflow de release de Android arma un AAB firmado y revisa los permisos del artefacto ya construido con aapt2, después de dos rechazos de Play. Un deploy se verifica comparando el SHA que sirven /version y /version.json contra git HEAD.',
        'Datos y servicios: PostgreSQL 16 con PostGIS y pgvector, Cloudflare R2 para fotos, OSRM y OpenRouteService para ruteo, Nominatim para geocoding, tiles de MapTiler, Brevo para email, Sentry y UptimeRobot para monitoreo.',
      ],
    },
  },
}

export const deepDiveList: DeepDive[] = DEEP_DIVE_IDS.map((id) => deepDives[id])

export function deepDivesFor(projectId: string): DeepDive[] {
  return deepDiveList.filter((page) => page.projectId === projectId)
}

/** A trailing slash is the same page, not a different one. */
function normalizePath(pathname: string): string {
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

export function pathForPage(page: PageId): string {
  return page === 'home' ? '/' : deepDives[page].path
}

/** Anything unrecognised is the home page — never an error screen. */
export function pageForPath(pathname: string): PageId {
  const path = normalizePath(pathname)
  return deepDiveList.find((page) => page.path === path)?.id ?? 'home'
}

export function isDeepDivePath(pathname: string): boolean {
  return pageForPath(pathname) !== 'home'
}
