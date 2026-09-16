import type { ReactNode } from 'react'
import type { Localized } from '@/content/types'
import { useT } from '@/i18n'
import { PageLink } from '@/components/layout/PageLink'
import {
  Block,
  Code,
  DataTable,
  DeepDiveHeader,
  DeepDiveShell,
  Panel,
  Prose,
  Split,
  Why,
} from '../DeepDive'

/**
 * EnMoto, from the product side: what each feature solves and why it was
 * decided that way.
 *
 * Source: docs/PROPUESTA_DE_VALOR.md in the EnMoto repo, verified against the
 * code on 2026-09-15. Numbers carry a date because they age — update them
 * with their date, and keep `keyPoints` in content/pages.ts in step so the
 * agent never contradicts this page.
 */

type Rich = Localized<ReactNode>

const whatItDoes: Localized = { en: 'What the app does', es: 'Qué hace la app' }
const whyThisWay: Localized = { en: 'Why this way', es: 'Por qué así' }

function Accent({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>
}

/* ------------------------------------------------------------------------ */

const header = {
  title: {
    en: (
      <>
        What riders need to know already exists. It was missing <Accent>a map</Accent>.
      </>
    ),
    es: (
      <>
        La información que necesita un motociclista ya existe. Le faltaba <Accent>un mapa</Accent>.
      </>
    ),
  } satisfies Rich,
  lead: {
    en: 'What problem each part of EnMoto solves, for whom, and why it was decided that way and not another.',
    es: 'Qué problema resuelve cada parte de EnMoto, para quién, y por qué se decidió así y no de otra manera.',
  } satisfies Localized,
  facts: [
    { en: 'Argentina · motorcycle community', es: 'Argentina · comunidad motociclista' },
    { en: 'Google Play + direct APK', es: 'Google Play + APK directo' },
    { en: 'Status as of 15 Sep 2026', es: 'Estado al 15/09/2026' },
  ] satisfies Localized[],
}

const fragments: { where: Localized; what: Localized }[] = [
  {
    where: { en: 'A WhatsApp group', es: 'Un grupo de WhatsApp' },
    what: {
      en: 'Which workshop opens on Sundays.',
      es: 'El taller que abre los domingos.',
    },
  },
  {
    where: { en: 'The right Facebook page', es: 'El Facebook correcto' },
    what: {
      en: 'Where the club is riding this weekend.',
      es: 'La salida del club del fin de semana.',
    },
  },
  {
    where: { en: 'Forwarded screenshots', es: 'Capturas reenviadas' },
    what: {
      en: 'A stolen bike — arriving late, and without the details.',
      es: 'La moto robada — que llega tarde y sin datos.',
    },
  },
]

const premise: Rich = {
  en: (
    <>
      This is not a shortage of community: the community exists, and it is active. It is a problem
      of <strong>format</strong> — conversations that scroll away where a map and a listing were
      needed. EnMoto does not invent the community. <Accent>It puts a map on top of it.</Accent>
    </>
  ),
  es: (
    <>
      No es un problema de falta de comunidad: la comunidad existe y es activa. Es un problema
      de <strong>formato</strong> — conversaciones que se pierden donde hacía falta un mapa y una
      ficha. EnMoto no inventa la comunidad. <Accent>Le pone un mapa encima.</Accent>
    </>
  ),
}

const stats: { n: Localized; label: Localized }[] = [
  {
    n: { en: '5,151', es: '5.151' },
    label: {
      en: 'business listings seeded, before any owner lifted a finger',
      es: 'fichas de comercio sembradas, sin que el dueño haga nada',
    },
  },
  {
    n: { en: '50 km', es: '50 km' },
    label: { en: 'reach of an SOS alert', es: 'de alcance de una alerta de SOS' },
  },
  {
    n: { en: '72 h', es: '72 h' },
    label: {
      en: 'and the alert expires on its own — nobody has to take it down',
      es: 'y la alerta vence sola: nadie tiene que bajarla',
    },
  },
  {
    n: { en: '0 %', es: '0 %' },
    label: { en: 'commission on the marketplace', es: 'de comisión en el marketplace' },
  },
]

/* ------------------------------------------------------------------------ */

const businesses = {
  eyebrow: {
    en: 'A Sunday, looking for a tyre shop in a town you do not know',
    es: 'Un domingo, buscando una gomería en una ciudad que no conocés',
  },
  title: {
    en: 'The business that exists but nobody can find',
    es: 'El comercio que existe pero nadie encuentra',
  },
  problem: {
    en: (
      <>
        A neighbourhood workshop, a tyre shop, a gear store: they live on being known. Their online
        presence, when there is one, is an out-of-date Facebook page. They have no marketing team
        and no appetite for learning a new tool — and above all,{' '}
        <strong>they are not going to fill in a listing on an app that has no users yet.</strong>
      </>
    ),
    es: (
      <>
        Un taller de barrio, una gomería, una casa de accesorios: viven de que los conozcan. Su
        presencia digital, cuando la hay, es una página de Facebook desactualizada. No tienen equipo
        de marketing ni ganas de aprender una herramienta nueva, y sobre todo{' '}
        <strong>no van a cargar una ficha en una app que todavía no tiene usuarios.</strong>
      </>
    ),
  } satisfies Rich,
  does: {
    en: (
      <p>
        The directory is <strong>seeded</strong>: 5,151 listings loaded by us — name, category,
        address, opening hours, phone — already on the map without the owner doing a thing. When
        they want to, the owner <strong>claims</strong> the listing, with manual approval, and only
        then gets the panel: edit, photo, promotion, hours per day, and their three numbers.
      </p>
    ),
    es: (
      <p>
        El padrón se <strong>siembra</strong>: 5.151 fichas cargadas por nosotros —nombre, rubro,
        dirección, horarios, teléfono— que ya aparecen en el mapa sin que el dueño haga nada. Cuando
        quiere, el dueño <strong>reclama</strong> su ficha, con aprobación manual, y recién ahí gana
        el panel: editar, foto, promoción, horarios por día y sus tres números.
      </p>
    ),
  } satisfies Rich,
  why: {
    en: (
      <p>
        An empty map is useless to everyone — to the rider who opens it and to the business you are
        asking to sign up. Seeding breaks the cold start: the map is worth opening on day one, and
        the business arrives when there is already something to show it. And an unclaimed listing
        does not pretend: it says it is unverified.
      </p>
    ),
    es: (
      <p>
        Un mapa vacío no le sirve a nadie: ni al motociclista que lo abre ni al comercio al que le
        pedís que se registre. Sembrar rompe el arranque en frío — el mapa vale el día uno, y el
        comercio llega cuando ya hay algo para mostrarle. Y la ficha sin reclamar no miente: dice
        que no está verificada.
      </p>
    ),
  } satisfies Rich,
  sequenceLabel: { en: 'A deliberate order', es: 'Un orden deliberado' },
  steps: [
    {
      name: { en: 'Seed', es: 'Sembrar' },
      detail: { en: '5,151 listings on the map', es: '5.151 fichas en el mapa' },
      code: null,
    },
    {
      name: { en: 'Measure', es: 'Medir' },
      detail: { en: 'impressions · opens · contact taps', es: 'apariciones · aperturas · contactos' },
      code: 'ImpressionCount · ClickCount · ContactCount',
    },
    {
      name: { en: 'Claim', es: 'Reclamar' },
      detail: { en: 'the owner asks for the listing', es: 'el dueño pide su ficha' },
      code: 'Unclaimed → PendingClaim → Claimed',
    },
    {
      name: { en: 'Monetise', es: 'Monetizar' },
      detail: { en: 'not yet — with numbers of its own', es: 'todavía no — con métricas propias' },
      code: null,
    },
  ] satisfies { name: Localized; detail: Localized; code: string | null }[],
  sequenceCaption: {
    en: 'The day a business is charged, the conversation will not be “pay to be listed” but “here is what already happened while it was free”. A number of your own is more convincing than a promise — which is why monetising comes last, not first.',
    es: 'El día que se le cobre a un comercio, la conversación no va a ser «pagá para aparecer» sino «esto es lo que ya te pasó estando gratis». Un número propio convence más que una promesa: por eso monetizar va último y no primero.',
  } satisfies Localized,
  rider: {
    en: (
      <>
        <strong>What it solves for the rider</strong>, on the other side: finding a tyre shop open
        on a Sunday in an unfamiliar town, with the hours and the phone number right there — instead
        of “google it and see”.
      </>
    ),
    es: (
      <>
        <strong>Lo que le resuelve al motociclista</strong>, que es el otro lado: encontrar una
        gomería abierta un domingo en una ciudad que no conoce, con el horario y el teléfono a mano
        — y no «buscá en Google y fijate».
      </>
    ),
  } satisfies Rich,
}

const sos = {
  eyebrow: {
    en: 'The two moments the app really has to deliver',
    es: 'Los dos momentos en que la app tiene que servir de verdad',
  },
  title: {
    en: 'Your bike was stolen, or you broke down',
    es: 'Te robaron la moto, o quedaste tirado',
  },
  problem: {
    en: (
      <>
        Two different situations with the same urgency, and in both what matters is that people
        nearby find out <strong>now</strong> — not two hours later, when someone happens to read the
        message. That is why it is <strong>one button with two modes</strong>, not two separate
        features half the users would fail to find on the day they needed one.
      </>
    ),
    es: (
      <>
        Son dos situaciones distintas con la misma urgencia, y en las dos lo que hace falta es que la
        gente que está cerca se entere <strong>ahora</strong>, no dentro de dos horas cuando alguien
        vea el mensaje. Por eso es <strong>un solo botón con dos modos</strong>, y no dos funciones
        separadas que la mitad de la gente no va a encontrar el día que las necesite.
      </>
    ),
  } satisfies Rich,
  modes: [
    {
      tag: { en: 'Theft', es: 'Robo' },
      code: 'theft',
      title: { en: 'Goes out to the whole area', es: 'Sale a toda la zona' },
      body: {
        en: 'Which bike, when and where, to anyone within 50 km. The theft has already happened: the more people know, the better.',
        es: 'Qué moto, cuándo y dónde, a quien esté a 50 km. El robo ya ocurrió: cuanta más gente lo sepa, mejor.',
      },
    },
    {
      tag: { en: 'Breakdown', es: 'Auxilio' },
      code: 'assist',
      title: { en: 'Goes to your friends only', es: 'Sale sólo a tus amigos' },
      body: {
        en: 'Asking for help reveals where you are, and that you are alone. Each mode defaults to whatever protects the person using it.',
        es: 'Pedir ayuda expone dónde estás y que estás solo. El default de cada modo es el que protege a quien lo usa.',
      },
    },
  ] satisfies { tag: Localized; code: string; title: Localized; body: Localized }[],
  does: {
    en: (
      <p>
        The alert travels two ways at once: instantly to anyone with the app open, and as a phone
        notification to anyone with it closed. An alert that only arrives if you happened to be
        looking at the screen is not an alert.
      </p>
    ),
    es: (
      <p>
        El aviso viaja por dos caminos a la vez: al instante para quien tiene la app abierta, y como
        notificación al teléfono para quien la tiene cerrada. Una alerta que sólo llega si estabas
        mirando la pantalla no es una alerta.
      </p>
    ),
  } satisfies Rich,
  why: {
    en: (
      <p>
        An alert <strong>expires on its own after 72 hours</strong>, with a seven-day cooldown per
        bike, because nobody remembers to take a notice down once the bike turns up — and a wall of
        stale alerts stops being information. What the copilot shows is trimmed on purpose: no plate,
        no owner name, no exact address. To know whether your area is hot, which bike, when and
        roughly where is enough.
      </p>
    ),
    es: (
      <p>
        La alerta <strong>vence sola a las 72 h</strong>, con un cooldown de siete días por moto,
        porque nadie se acuerda de bajar un aviso cuando apareció la moto — y un muro lleno de
        alertas viejas deja de ser información. Lo que muestra el copiloto va recortado a propósito:
        sin patente, sin nombre del dueño y sin dirección exacta. Para saber si tu zona está
        caliente alcanza con qué moto, cuándo y dónde aproximado.
      </p>
    ),
  } satisfies Rich,
  limit: {
    en: (
      <>
        <strong>A limit, stated plainly.</strong> The phone notification reaches people who pinned a
        zone, which is the only thing that places a person — live location is never stored. Today
        that is a minority of users, so the real reach is still smaller than the theoretical one. It
        is measured and visible in the admin panel, not hidden.
      </>
    ),
    es: (
      <>
        <strong>Un límite, dicho sin maquillar.</strong> El aviso al teléfono le llega a quien fijó
        su zona, que es el único dato que ubica a una persona —la ubicación en vivo no se guarda—.
        Hoy es una minoría de los usuarios, así que el alcance real todavía es menor al teórico. Está
        medido y a la vista en el panel de administración, no escondido.
      </>
    ),
  } satisfies Rich,
}

const clubs = {
  eyebrow: { en: '“Sunday, 9 AM, at the roundabout”', es: '«Domingo 9 AM en la rotonda»' },
  title: {
    en: 'The club ride, with every detail and a way to get there',
    es: 'La salida del club, con todos los datos y con cómo llegar',
  },
  problem: {
    en: (
      <>
        Anyone outside the circle does not know <strong>which roundabout</strong>, and anyone from
        out of town simply does not go. The event and the way to get there live in different places:
        the event in a group chat, the route in the heads of the people who have been before.
      </>
    ),
    es: (
      <>
        Quien no es del palo no sabe <strong>qué rotonda</strong>, y quien no es de la ciudad
        directamente no va. La información del evento y la de cómo llegar viven en lugares
        distintos: el evento en un grupo, la ruta en la cabeza de los que ya fueron.
      </>
    ),
  } satisfies Rich,
  anatomy: {
    label: { en: 'Anatomy of an event', es: 'Anatomía de un evento' },
    title: { en: 'An event is not a post', es: 'Un evento no es un posteo' },
    pin: { en: 'A point on the map', es: 'Un punto en el mapa' },
    fields: [
      { en: 'Date and time', es: 'Fecha y horario' },
      { en: 'Organiser: the club', es: 'Organizador: la agrupación' },
      { en: 'Visibility: public or friends only', es: 'Visibilidad: pública o sólo amigos' },
      { en: 'Capacity, invitees, attendees', es: 'Cupo, invitados y asistentes' },
    ] satisfies Localized[],
    actions: [
      {
        name: { en: 'How do I get there', es: 'Cómo llego' },
        note: { en: 'deterministic — GPS + routing, no AI', es: 'determinístico — GPS + ruteo, sin IA' },
      },
      {
        name: { en: 'Google Maps · Waze', es: 'Google Maps · Waze' },
        note: { en: 'public deep link, no account or API key', es: 'deep link público, sin cuenta ni API key' },
      },
      {
        name: { en: 'Share', es: 'Compartir' },
        note: { en: 'the phone’s own share menu', es: 'el menú real del sistema' },
      },
    ] satisfies { name: Localized; note: Localized }[],
  },
  does: {
    en: (
      <p>
        Clubs are a <strong>real entity</strong>, not free text on a profile: they have a page,
        members, followers and events of their own. That matters because permissions cannot be
        derived from free text — who runs the club, who posts and who just follows are different
        things.
      </p>
    ),
    es: (
      <p>
        Las agrupaciones —MC, MG, clubes— son una <strong>entidad real</strong>, no un texto libre en
        el perfil: tienen ficha, miembros, seguidores y eventos propios. Importa porque los permisos
        no pueden salir de un texto libre: quién administra, quién publica y quién sólo sigue son
        cosas distintas.
      </p>
    ),
  } satisfies Rich,
  why: {
    en: (
      <p>
        Nobody wants to navigate 200 km inside an app they have only just met. EnMoto’s edge is
        knowing <strong>where</strong> is worth going and with whom — not drawing the arrow at every
        corner. That fight with Google Maps is lost before it starts, and picking it would make the
        product worse. EnMoto plans; turn-by-turn is left to the app people already use.
      </p>
    ),
    es: (
      <p>
        Nadie quiere navegar 200 km dentro de una app que recién conoce. La ventaja de EnMoto es
        saber <strong>a dónde</strong> vale la pena ir y con quién, no dibujar la flecha en cada
        esquina: esa pelea con Google Maps se pierde, y además empeora el producto. EnMoto planifica;
        la vuelta a vuelta la hace la app que el usuario ya usa.
      </p>
    ),
  } satisfies Rich,
  share: {
    en: 'And sharing opens the phone’s own menu — WhatsApp, Telegram, Instagram, SMS — rather than forcing one app: the ride gets organised wherever the group already is, not wherever suits us.',
    es: 'Y compartir abre el menú del sistema —WhatsApp, Telegram, Instagram, SMS— en vez de forzar una sola app: la salida se organiza donde ya está el grupo, no donde a nosotros nos convenga.',
  } satisfies Localized,
}

const copilot = {
  eyebrow: {
    en: 'Half an hour between a map, a route planner and a calculator',
    es: 'Media hora entre un mapa, un buscador de rutas y la calculadora',
  },
  title: {
    en: 'Planning a trip without having to know how to plan trips',
    es: 'Planificar un viaje sin tener que saber planificar viajes',
  },
  problem: {
    en: (
      <>
        Putting a weekend ride together means working out how far it is, which way is best, where to
        fill up and what is worth seeing. With the copilot you type{' '}
        <em>“Tandil to Villa Gesell via Mar del Plata”</em> and get the multi-leg route back with
        time and distance, saved and reopenable later. The same copilot answers whether there is a
        tyre shop nearby, what is on this weekend, or whether anyone is selling an XR 150 for under
        two million pesos.
      </>
    ),
    es: (
      <>
        Armar una salida de fin de semana implica ver cuánto hay, por dónde conviene, dónde cargar
        nafta y qué hay para ver. Con el copiloto le escribís{' '}
        <em>«de Tandil a Villa Gesell pasando por Mar del Plata»</em> y devuelve la ruta de varios
        tramos con tiempo y distancia, guardable y reabrible después. El mismo copiloto contesta si
        hay una gomería cerca, qué eventos hay este finde o si hay alguna XR 150 hasta dos palos.
      </>
    ),
  } satisfies Rich,
  schematic: {
    label: { en: 'Anatomy of a reply', es: 'Anatomía de una respuesta' },
    disclaimer: { en: 'a schematic, not a screenshot', es: 'un esquema, no una captura' },
    ask: {
      en: 'Tandil to Villa Gesell via Mar del Plata',
      es: 'De Tandil a Villa Gesell pasando por Mar del Plata',
    },
    reply: {
      en: 'Here is the route in two legs. The details are below, and you can save it to pick up later.',
      es: 'Te armé la ruta en dos tramos. Abajo tenés el detalle, y la podés guardar para retomarla después.',
    },
    replyNote: { en: 'Written by the model', es: 'Lo redacta el modelo' },
    legs: [
      { en: 'Leg 1 · Tandil → Mar del Plata', es: 'Tramo 1 · Tandil → Mar del Plata' },
      { en: 'Leg 2 · Mar del Plata → Villa Gesell', es: 'Tramo 2 · Mar del Plata → Villa Gesell' },
    ] satisfies Localized[],
    legDetail: { en: 'distance · time', es: 'distancia · tiempo' },
    save: { en: 'Save', es: 'Guardar' },
    open: { en: 'Open in Maps', es: 'Abrir en Maps' },
    cardNote: {
      en: 'From the database and the routing service — never through the model',
      es: 'Sale de la base y del servicio de ruteo — sin pasar por el modelo',
    },
  },
  does: {
    en: (
      <p>
        The language model <strong>chooses; it does not look things up</strong>. It works out what
        you asked for, chains the steps and writes the reply. Every hard fact — phone, opening hours,
        price, event date, the route itself — comes from a database query and reaches the screen
        without passing through it.
      </p>
    ),
    es: (
      <p>
        El modelo de lenguaje <strong>elige, no consulta</strong>. Entiende qué pediste, encadena los
        pasos y redacta la respuesta. Cada dato duro —teléfono, horario, precio, fecha de un evento,
        la geometría de la ruta— sale de una consulta a la base y llega a la pantalla sin pasar por
        él.
      </p>
    ),
  } satisfies Rich,
  why: {
    en: (
      <p>
        <strong>A confidently invented phone number is worse than no phone number.</strong> An
        assistant that hallucinates a workshop’s opening hours destroys exactly the trust the product
        depends on. That — not saving tokens — is why the reply is split into two channels.
      </p>
    ),
    es: (
      <p>
        <strong>Un teléfono inventado con seguridad es peor que no tener teléfono.</strong> Un
        asistente que alucina el horario de un taller destruye exactamente la confianza que el
        producto necesita. Esa es la razón de partir la respuesta en dos canales, y no el ahorro de
        tokens.
      </p>
    ),
  } satisfies Rich,
  quota: {
    en: 'It is free with a daily quota, and the reason is said plainly: every query costs real money. The quota is what lets it exist for everyone instead of for no one.',
    es: 'Es gratis con cupo diario, y la razón se dice sin vueltas: cada consulta cuesta plata real. El cupo es lo que permite que exista para todos en vez de existir para nadie.',
  } satisfies Localized,
  deeper: {
    en: 'How the two channels are wired',
    es: 'Cómo están cableados los dos canales',
  } satisfies Localized,
}

const trust = {
  eyebrow: {
    en: 'Every open community ends up with fake accounts and DM spam',
    es: 'Toda comunidad abierta termina con cuentas falsas y spam al privado',
  },
  title: {
    en: 'Open to anyone, without letting the chancers take over',
    es: 'Abrirle la puerta a cualquiera sin que se llene de vivos',
  },
  problem: {
    en: (
      <>
        The reflex answer — ask for ID, verify identity — solves the spam and kills the product:
        nobody uploads a photo of their ID card to find a tyre shop. So{' '}
        <strong>identity is not verified</strong>. What is limited is not who you are, but what you
        can do on your first day.
      </>
    ),
    es: (
      <>
        La respuesta refleja —pedir DNI, verificar identidad— resuelve el spam y mata el producto:
        nadie sube una foto del documento para ver dónde hay una gomería. Así que{' '}
        <strong>no se verifica identidad</strong>. Lo que se limita no es quién sos, es qué podés
        hacer el primer día.
      </>
    ),
  } satisfies Rich,
  rungs: [
    {
      when: { en: 'Day 0', es: 'Día 0' },
      condition: { en: 'With a confirmed email', es: 'Con el email confirmado' },
      unlocks: {
        en: 'Everything you consume: the map, stories, events, SOS, chat and the marketplace catalogue.',
        es: 'Todo lo de consumo: mapa, historias, eventos, SOS, chat y el catálogo del marketplace.',
      },
    },
    {
      when: { en: 'Day 7', es: 'Día 7' },
      condition: {
        en: 'With a complete profile and a bike with a photo',
        es: 'Con el perfil completo y una moto con foto',
      },
      unlocks: {
        en: 'List a bike for sale, and see a seller’s phone number.',
        es: 'Publicar una moto en venta y ver el teléfono de un vendedor.',
      },
    },
    {
      when: { en: 'Day 30', es: 'Día 30' },
      condition: {
        en: 'With a couple of friends, or inside a club',
        es: 'Con un par de amistades, o dentro de una agrupación',
      },
      unlocks: {
        en: 'Found a club, and claim a business listing.',
        es: 'Fundar una agrupación y reclamar la ficha de un comercio.',
      },
    },
  ] satisfies { when: Localized; condition: Localized; unlocks: Localized }[],
  why: {
    en: (
      <p>
        The rule for what gets held back is explicit:{' '}
        <strong>limit what helps someone manufacturing accounts, not what a genuine user needs.</strong>{' '}
        That is why listing a bike requires account age but browsing the catalogue does not —
        cutting a new account off from the catalogue would empty the app for them and gain nothing in
        return. It is anti-abuse an honest user barely notices, and that “barely” is the whole
        design.
      </p>
    ),
    es: (
      <p>
        El criterio de qué se frena es explícito:{' '}
        <strong>se frena lo que le sirve a quien fabrica cuentas, no lo que le hace falta a quien usa la app.</strong>{' '}
        Por eso publicar una moto pide antigüedad pero mirar el catálogo no — recortarle el catálogo a
        una cuenta nueva sería vaciarle la app sin ganar nada a cambio. Es antiabuso que el usuario
        honesto casi no nota, y ese «casi» es el diseño completo.
      </p>
    ),
  } satisfies Rich,
}

const decisions = {
  title: { en: 'The business decisions, and why', es: 'Las decisiones de negocio, y su porqué' },
  head: [
    { en: 'Decision', es: 'Decisión' },
    { en: 'Why', es: 'Por qué' },
  ] satisfies Localized[],
  rows: [
    [
      { en: 'Free and ad-free, for now', es: 'Gratis y sin publicidad, por ahora' },
      {
        en: 'With a small community, charging or filling the screen with banners costs more users than it brings in. Density first, revenue later.',
        es: 'Con una comunidad chica, cobrar o llenar de banners cuesta más usuarios de los que deja. Primero densidad, después ingresos.',
      },
    ],
    [
      { en: 'A marketplace with no commission', es: 'Marketplace sin comisión' },
      {
        en: 'Taking a cut means stepping into the transaction: payments, disputes, guarantees. Here the bike is listed and the two parties sort it out — a smaller promise, and no friction.',
        es: 'La comisión obliga a meterse en la transacción: pagos, disputas, garantías. Acá la moto se publica y las partes arreglan: menos promesa, cero fricción.',
      },
    ],
    [
      {
        en: 'Seed businesses instead of waiting for sign-ups',
        es: 'Sembrar comercios en vez de esperar que se registren',
      },
      {
        en: 'It breaks the cold start. The map is worth opening on day one, and a business arrives when there is already something to show it.',
        es: 'Rompe el arranque en frío. El mapa vale el día uno y el comercio llega cuando ya hay algo que mostrarle.',
      },
    ],
    [
      { en: 'Monetise businesses, not riders', es: 'Monetizar comercios, no usuarios' },
      {
        en: 'A business has an economic reason to pay — you bring it customers. A rider has none to pay for looking at a map.',
        es: 'El comercio tiene una razón económica para pagar —le llevás clientes—. El usuario no tiene ninguna para pagar por ver un mapa.',
      },
    ],
    [
      { en: 'Google Play and a direct APK', es: 'Google Play y APK directo' },
      {
        en: 'Play brings trust, automatic updates and discovery; the APK covers anyone who would rather not go through Play. Only someone with doors to spare closes one.',
        es: 'Play da confianza, actualizaciones automáticas y descubrimiento; el APK cubre a quien no quiere pasar por Play. Cierra una puerta sólo el que la tiene de más.',
      },
    ],
    [
      { en: 'No identity verification', es: 'No verificar identidad' },
      {
        en: 'It would solve abuse and kill sign-ups. What a new account can do is limited; who is behind it is not questioned.',
        es: 'Resolvería el abuso y mataría el registro. Se limita lo que una cuenta nueva puede hacer, no quién es.',
      },
    ],
    [
      { en: 'Argentina first, explicitly', es: 'Argentina primero, y explícito' },
      {
        en: 'Geocoding, business categories, price formats and language are tuned for here. A generic product is not better — it is worse everywhere.',
        es: 'Geocoding, rubros, formato de precios y lenguaje están afinados para acá. Un producto genérico no es mejor: es peor en todos lados.',
      },
    ],
  ] satisfies [Localized, Localized][],
}

const nots = {
  eyebrow: {
    en: 'Saying so is part of the value proposition too',
    es: 'Decirlo también es propuesta de valor',
  },
  title: { en: 'What it deliberately does not do', es: 'Lo que deliberadamente no hace' },
  items: [
    {
      head: { en: 'Not a GPS navigator.', es: 'No es un navegador GPS.' },
      body: {
        en: 'It plans and exports; turn-by-turn belongs to Google Maps or Waze.',
        es: 'Planifica y exporta; la vuelta a vuelta la hace Google Maps o Waze.',
      },
    },
    {
      head: { en: 'Not an endless feed.', es: 'No es un feed infinito.' },
      body: {
        en: 'The map is the centre, and stories last 24 hours on purpose: it is “what is happening”, not a feed to keep up with.',
        es: 'El centro es el mapa, y las historias duran 24 h a propósito: es «qué está pasando», no algo para administrar.',
      },
    },
    {
      head: { en: 'Does not broker sales.', es: 'No intermedia compras.' },
      body: {
        en: 'No payments, no shipping, no guarantees.',
        es: 'Ni pagos, ni envíos, ni garantías.',
      },
    },
    {
      head: { en: 'Never stores live location.', es: 'No guarda la ubicación en vivo.' },
      body: {
        en: 'The only thing that places someone is the zone they chose to pin — a real limit on how far alerts reach, and one preferred over an app that always knows where you are.',
        es: 'Lo único que ubica a alguien es la zona que eligió fijar — un límite real para el alcance de las alertas, y se prefiere ese límite a una app que sabe siempre dónde estás.',
      },
    },
    {
      head: { en: 'Never asks for ID.', es: 'No pide documento.' },
      body: { en: 'Not to sign up, not for anything.', es: 'Ni para registrarse ni para nada.' },
    },
  ] satisfies { head: Localized; body: Localized }[],
}

const status = {
  eyebrow: { en: 'As of 15 Sep 2026', es: 'Al 15/09/2026' },
  title: { en: 'Where it stands today', es: 'Dónde está parado esto hoy' },
  figures: [
    {
      n: { en: 'Google Play', es: 'Google Play' },
      label: { en: 'published — plus a direct APK', es: 'publicada — y como APK directo' },
    },
    {
      n: { en: '~24', es: '~24' },
      label: { en: 'registered users', es: 'usuarios registrados' },
    },
    {
      n: { en: '5,151', es: '5.151' },
      label: { en: 'business listings in the directory', es: 'fichas de comercio en el padrón' },
    },
  ] satisfies { n: Localized; label: Localized }[],
  verdict: {
    en: (
      <>
        The app is there and the directory is there; what is missing is people.{' '}
        <strong>Today the bottleneck is not the product — it is distribution.</strong>
      </>
    ),
    es: (
      <>
        Hay app y hay padrón; falta gente.{' '}
        <strong>El cuello de botella hoy no es el producto: es la distribución.</strong>
      </>
    ),
  } satisfies Rich,
  footnote: {
    en: 'Every product claim on this page was checked against the code. The numbers carry a date because they age.',
    es: 'Cada afirmación de producto de esta página está verificada contra el código. Los números llevan fecha porque envejecen.',
  } satisfies Localized,
}

/* ------------------------------------------------------------------------ */

export default function EnMotoProduct() {
  const { t } = useT()

  return (
    <DeepDiveShell page="enmoto-product">
      <DeepDiveHeader
        eyebrow="EnMoto · 01 / 02"
        title={t(header.title)}
        lead={t(header.lead)}
        facts={header.facts.map((fact) => t(fact))}
      />

      {/* The premise: where the information lives today, and what changes. */}
      <div className="mt-14">
        <ul className="grid gap-3 md:grid-cols-3">
          {fragments.map((fragment, i) => (
            <li
              key={i}
              className="border-border-interactive rounded-xl border border-dashed px-5 py-4"
            >
              <p className="text-muted font-mono text-[11px] tracking-widest uppercase">
                {t(fragment.where)}
              </p>
              <p className="mt-2 leading-snug">{t(fragment.what)}</p>
            </li>
          ))}
        </ul>
        <p className="text-accent py-3 text-center font-mono text-lg" aria-hidden="true">
          ↓
        </p>
        <p className="border-accent bg-accent/5 rounded-xl border px-6 py-5 text-lg leading-relaxed md:text-xl">
          {t(premise)}
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat, i) => (
          <li key={i} className="bg-surface border-border rounded-xl border px-5 py-4">
            <p className="font-display text-accent text-3xl font-bold md:text-4xl">{t(stat.n)}</p>
            <p className="text-muted mt-1 text-sm leading-snug">{t(stat.label)}</p>
          </li>
        ))}
      </ul>

      {/* 01 — Businesses */}
      <Block id="businesses" index="01" eyebrow={t(businesses.eyebrow)} title={t(businesses.title)}>
        <Prose>
          <p>{t(businesses.problem)}</p>
        </Prose>
        <Split>
          <Panel label={t(whatItDoes)}>{t(businesses.does)}</Panel>
          <Why label={t(whyThisWay)}>{t(businesses.why)}</Why>
        </Split>

        <figure className="bg-surface border-border rounded-xl border p-5 sm:p-6">
          <p className="text-muted font-mono text-[11px] tracking-widest uppercase">
            {t(businesses.sequenceLabel)}
          </p>
          <ol className="mt-4 grid gap-3 md:grid-cols-4 md:gap-6">
            {businesses.steps.map((step, i) => {
              const last = i === businesses.steps.length - 1
              return (
                <li key={i} className="relative">
                  <div
                    className={[
                      'h-full rounded-lg border px-4 py-3',
                      last ? 'border-accent bg-accent/5 border-dashed' : 'border-border-interactive bg-raised',
                    ].join(' ')}
                  >
                    <p className="flex items-baseline gap-2">
                      <span className="text-pixel text-accent text-[8px]" aria-hidden="true">
                        {i + 1}
                      </span>
                      <span className="font-display font-semibold">{t(step.name)}</span>
                    </p>
                    <p className="text-muted mt-1 text-sm leading-snug">{t(step.detail)}</p>
                    {step.code && (
                      <p className="text-muted mt-2 font-mono text-[10.5px] leading-snug break-words">
                        {step.code}
                      </p>
                    )}
                  </div>
                  {!last && (
                    <span
                      className="text-muted absolute top-1/2 -right-[1.1rem] hidden -translate-y-1/2 font-mono md:block"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
          <figcaption className="text-muted mt-5 max-w-3xl text-sm leading-relaxed">
            {t(businesses.sequenceCaption)}
          </figcaption>
        </figure>

        <Prose>
          <p>{t(businesses.rider)}</p>
        </Prose>
      </Block>

      {/* 02 — SOS */}
      <Block id="sos" index="02" eyebrow={t(sos.eyebrow)} title={t(sos.title)}>
        <Prose>
          <p>{t(sos.problem)}</p>
        </Prose>

        <ul className="grid gap-4 md:grid-cols-2">
          {sos.modes.map((mode, i) => (
            <li
              key={mode.code}
              className={[
                'rounded-xl border px-5 py-5',
                i === 0 ? 'border-accent bg-accent/5' : 'bg-surface border-border-interactive',
              ].join(' ')}
            >
              <p className="flex items-center gap-2">
                <span
                  className={[
                    'rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium tracking-wide uppercase',
                    i === 0 ? 'bg-accent text-on-accent' : 'border-border-interactive border',
                  ].join(' ')}
                >
                  {t(mode.tag)}
                </span>
                <Code>{mode.code}</Code>
              </p>
              <h3 className="mt-3 text-xl">{t(mode.title)}</h3>
              <p className="text-muted mt-2 leading-relaxed">{t(mode.body)}</p>
            </li>
          ))}
        </ul>

        <Split>
          <Panel label={t(whatItDoes)}>{t(sos.does)}</Panel>
          <Why label={t(whyThisWay)}>{t(sos.why)}</Why>
        </Split>

        <p className="border-border-interactive text-muted max-w-3xl rounded-xl border border-dashed px-5 py-4 leading-relaxed">
          {t(sos.limit)}
        </p>
      </Block>

      {/* 03 — Clubs */}
      <Block id="clubs" index="03" eyebrow={t(clubs.eyebrow)} title={t(clubs.title)}>
        <Prose>
          <p>{t(clubs.problem)}</p>
        </Prose>

        <figure className="bg-surface border-border grid gap-6 rounded-xl border p-5 sm:p-6 md:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-muted font-mono text-[11px] tracking-widest uppercase">
              {t(clubs.anatomy.label)}
            </p>
            <h3 className="mt-2 text-2xl">{t(clubs.anatomy.title)}</h3>
            <p className="text-accent mt-4 flex items-center gap-2 text-sm">
              <span
                className="bg-accent inline-block h-2.5 w-2.5 rotate-45 rounded-[2px]"
                aria-hidden="true"
              />
              {t(clubs.anatomy.pin)}
            </p>
            <ul className="mt-3 space-y-2">
              {clubs.anatomy.fields.map((field, i) => (
                <li key={i} className="border-border border-b pb-2 text-sm last:border-b-0">
                  {t(field)}
                </li>
              ))}
            </ul>
          </div>
          <ul className="space-y-3 self-center">
            {clubs.anatomy.actions.map((action, i) => (
              <li
                key={i}
                className="bg-raised border-border-interactive flex flex-col gap-1 rounded-lg border px-4 py-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
              >
                <span className="font-medium">{t(action.name)}</span>
                <span className="text-muted font-mono text-[11px]">{t(action.note)}</span>
              </li>
            ))}
          </ul>
        </figure>

        <Split>
          <Panel label={t(whatItDoes)}>{t(clubs.does)}</Panel>
          <Why label={t(whyThisWay)}>{t(clubs.why)}</Why>
        </Split>

        <Prose>
          <p>{t(clubs.share)}</p>
        </Prose>
      </Block>

      {/* 04 — Copilot */}
      <Block id="copilot" index="04" eyebrow={t(copilot.eyebrow)} title={t(copilot.title)}>
        <Prose>
          <p>{t(copilot.problem)}</p>
        </Prose>

        <figure className="bg-surface border-border rounded-xl border p-5 sm:p-6">
          <p className="text-muted font-mono text-[11px] tracking-widest uppercase">
            {t(copilot.schematic.label)}{' '}
            <span className="normal-case tracking-normal">· {t(copilot.schematic.disclaimer)}</span>
          </p>

          <div className="mx-auto mt-5 max-w-xl space-y-3">
            <p className="bg-raised border-border ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-sm border px-4 py-2.5">
              {t(copilot.schematic.ask)}
            </p>

            <div>
              <p className="border-border-interactive w-fit max-w-[90%] rounded-2xl rounded-bl-sm border px-4 py-2.5 leading-relaxed">
                {t(copilot.schematic.reply)}
              </p>
              <p className="text-muted mt-1.5 pl-1 font-mono text-[11px]">
                ↑ (a) {t(copilot.schematic.replyNote)}
              </p>
            </div>

            <div>
              <div className="border-accent bg-accent/5 rounded-xl border px-4 py-3">
                <p className="font-display font-semibold">Tandil → Mar del Plata → Villa Gesell</p>
                <ul className="mt-2 space-y-1">
                  {copilot.schematic.legs.map((leg, i) => (
                    <li
                      key={i}
                      className="flex flex-wrap items-baseline justify-between gap-x-4 text-sm"
                    >
                      <span>{t(leg)}</span>
                      <span className="text-muted font-mono text-[11px]">
                        {t(copilot.schematic.legDetail)}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex gap-2 text-xs">
                  <span className="bg-accent text-on-accent rounded-md px-2.5 py-1 font-medium">
                    {t(copilot.schematic.save)}
                  </span>
                  <span className="border-border-interactive rounded-md border px-2.5 py-1">
                    {t(copilot.schematic.open)}
                  </span>
                </p>
              </div>
              <p className="text-accent mt-1.5 pl-1 font-mono text-[11px]">
                ↑ (b) {t(copilot.schematic.cardNote)}
              </p>
            </div>
          </div>
        </figure>

        <Split>
          <Panel label={t(whatItDoes)}>{t(copilot.does)}</Panel>
          <Why label={t(whyThisWay)}>{t(copilot.why)}</Why>
        </Split>

        <Prose>
          <p>{t(copilot.quota)}</p>
          <p>
            <PageLink
              page="enmoto-architecture"
              className="text-accent font-mono text-sm hover:underline"
            >
              {t(copilot.deeper)} →
            </PageLink>
          </p>
        </Prose>
      </Block>

      {/* 05 — Trust levels */}
      <Block id="anti-abuse" index="05" eyebrow={t(trust.eyebrow)} title={t(trust.title)}>
        <Prose>
          <p>{t(trust.problem)}</p>
        </Prose>

        <ol className="space-y-3">
          {trust.rungs.map((rung, i) => (
            <li
              key={i}
              // Each rung steps further in on wide screens: the reach grows as
              // the account does, and the layout says so before the words do.
              className={[
                'bg-surface border-border grid gap-2 rounded-xl border px-5 py-4 sm:grid-cols-[6rem_1fr] sm:gap-6',
                i === 1 ? 'md:ml-12' : i === 2 ? 'md:ml-24' : '',
              ].join(' ')}
            >
              <p className="text-accent font-mono text-sm font-medium">{t(rung.when)}</p>
              <div>
                <p className="font-medium">{t(rung.condition)}</p>
                <p className="text-muted mt-1 leading-relaxed">{t(rung.unlocks)}</p>
              </div>
            </li>
          ))}
        </ol>

        <Why label={t(whyThisWay)}>{t(trust.why)}</Why>
      </Block>

      {/* 06 — Decisions */}
      <Block id="decisions" index="06" title={t(decisions.title)}>
        <DataTable
          caption={t(decisions.title)}
          head={decisions.head.map((cell) => t(cell))}
          rows={decisions.rows.map((row) => row.map((cell) => t(cell)))}
        />
      </Block>

      {/* 07 — What it does not do */}
      <Block id="not" index="07" eyebrow={t(nots.eyebrow)} title={t(nots.title)}>
        <ul className="grid gap-3 md:grid-cols-2">
          {nots.items.map((item, i) => (
            <li
              key={i}
              className="bg-surface border-border flex gap-4 rounded-xl border px-5 py-4"
            >
              <span
                className="border-border-interactive text-muted mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border font-mono text-xs"
                aria-hidden="true"
              >
                ×
              </span>
              <p className="leading-relaxed">
                <strong>{t(item.head)}</strong>{' '}
                <span className="text-muted">{t(item.body)}</span>
              </p>
            </li>
          ))}
        </ul>
      </Block>

      {/* 08 — Status */}
      <Block id="status" index="08" eyebrow={t(status.eyebrow)} title={t(status.title)}>
        <ul className="grid gap-3 sm:grid-cols-3">
          {status.figures.map((figure, i) => (
            <li key={i} className="bg-surface border-border rounded-xl border px-5 py-4">
              <p className="font-display text-2xl font-bold md:text-3xl">{t(figure.n)}</p>
              <p className="text-muted mt-1 text-sm">{t(figure.label)}</p>
            </li>
          ))}
        </ul>
        <p className="max-w-3xl text-lg leading-relaxed md:text-xl">{t(status.verdict)}</p>
        <p className="text-muted font-mono text-xs">{t(status.footnote)}</p>
      </Block>
    </DeepDiveShell>
  )
}
