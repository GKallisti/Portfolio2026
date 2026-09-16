import { useState, type ReactNode } from 'react'
import type { Localized } from '@/content/types'
import { useT } from '@/i18n'
import { ui } from '@/content/ui'
import {
  Block,
  Code,
  DataTable,
  DeepDiveHeader,
  DeepDiveShell,
  Fact,
  Figure,
  Panel,
  Prose,
  Split,
  Why,
} from '../DeepDive'
import { Arrow, Box, Diagram, Label, TechBar } from '../diagram'
import { TechContext, type Tech } from '../tech'

/**
 * EnMoto, from the inside: how the parts talk to each other, and why.
 *
 * Source: docs/FLUJOS_TECNICOS.md in the EnMoto repo, read from the code on
 * 2026-09-15 (Program.cs, the hubs, the workers, appsettings.json and the
 * workflows). The diagrams are drawn by hand, not generated from that file's
 * Mermaid — a change to a flow has to be made in both places. Where the
 * drawing and the code disagree, the code wins.
 */

type Rich = Localized<ReactNode>

function Accent({ children }: { children: ReactNode }) {
  return <span className="text-accent">{children}</span>
}

/* ---------------------------------------------------------------- diagrams */

function SystemDiagram() {
  const { t } = useT()

  return (
    <Diagram
      width={760}
      height={312}
      label={t({
        en: 'System map: the web app and the Android app reach Cloudflare over HTTPS, which forwards REST and WebSocket traffic to the .NET API on an OCI VM. The API has REST controllers, SignalR hubs and background workers, and talks to PostgreSQL with PostGIS, R2 storage, OpenAI, routing and geocoding services, and push and email providers.',
        es: 'Mapa del sistema: la web y la app Android llegan a Cloudflare por HTTPS, que reenvía el tráfico REST y WebSocket a la API .NET en una VM de OCI. La API tiene controllers REST, hubs de SignalR y workers en segundo plano, y habla con PostgreSQL con PostGIS, el almacenamiento R2, OpenAI, los servicios de ruteo y geocoding, y los proveedores de push y email.',
      })}
    >
      <Label x={8} y={18} caps size={9}>{t({ en: 'Clients', es: 'Clientes' })}</Label>
      <Label x={200} y={18} caps size={9}>{t({ en: 'Edge', es: 'Borde' })}</Label>
      <Label x={380} y={18} caps size={9}>API · .NET 10</Label>
      <Label x={616} y={18} caps size={9}>{t({ en: 'Data & services', es: 'Datos y servicios' })}</Label>

      <Box x={8} y={48} w={156} h={60} title="Web / PWA" sub="React 19 · Vite · Leaflet" tech="react" />
      <Box
        x={8}
        y={132}
        w={156}
        h={60}
        title={t({ en: 'Android app', es: 'App Android' })}
        sub={t({ en: 'Capacitor · same bundle', es: 'Capacitor · mismo bundle' })}
        tech="capacitor"
      />

      <Box
        x={200}
        y={48}
        w={144}
        h={144}
        title="Cloudflare"
        sub={['Pages · CDN', 'DNS · TLS · WAF']}
        tech="cloudflare"
      />

      <Box x={380} y={32} w={200} h={236} tone="group" tech="dotnet" />
      <Box x={396} y={48} w={168} h={52} title="REST" sub="27 controllers" tech="dotnet" />
      <Box x={396} y={112} w={168} h={52} title="SignalR" sub="3 hubs" tone="accent" tech="signalr" />
      <Box
        x={396}
        y={176}
        w={168}
        h={52}
        title="Workers"
        sub={t({ en: '8 in the background', es: '8 en segundo plano' })}
        tech="dotnet"
      />
      <Label x={480} y={254} anchor="middle" size={9}>OCI Ampere A1 · podman</Label>

      <Box x={616} y={40} w={136} h={52} title="PostgreSQL 16" sub="PostGIS · pgvector" tone="store" tech="postgres" titleSize={11} />
      <Box x={616} y={100} w={136} h={40} title="R2" sub={t({ en: 'photos · S3 API', es: 'fotos · API S3' })} tech="cloudflare" titleSize={11} subSize={9} />
      <Box x={616} y={148} w={136} h={40} title="OpenAI" sub="gpt-4o-mini" tech="openai" titleSize={11} subSize={9} />
      <Box x={616} y={196} w={136} h={40} title="OSRM · Nominatim" sub={t({ en: 'routing · geocoding', es: 'ruteo · geocoding' })} titleSize={11} subSize={9} />
      <Box x={616} y={244} w={136} h={40} title="FCM · Brevo" sub="push · email" tech="fcm" titleSize={11} subSize={9} />

      <Arrow d="M 166 78 L 196 78" />
      <Arrow d="M 166 162 L 196 162" />
      <Label x={181} y={71} anchor="middle" size={8.5}>HTTPS</Label>
      <Label x={181} y={155} anchor="middle" size={8.5}>HTTPS</Label>

      <Arrow d="M 346 120 L 376 120" />
      <Label x={361} y={103} anchor="middle" size={8.5}>REST</Label>
      <Label x={361} y={113} anchor="middle" size={8.5}>+ WS</Label>

      {/* One bus out of the API rather than fifteen crossing lines. */}
      <Arrow d="M 582 150 L 597 150" head={false} />
      <Arrow d="M 597 66 L 597 264" head={false} />
      <Arrow d="M 597 66 L 612 66" />
      <Arrow d="M 597 120 L 612 120" />
      <Arrow d="M 597 168 L 612 168" />
      <Arrow d="M 597 216 L 612 216" />
      <Arrow d="M 597 264 L 612 264" />

      <Label x={8} y={304} size={9.5}>
        {t({
          en: 'Map tiles (MapTiler) are fetched by the client directly, never through the API.',
          es: 'Los tiles del mapa (MapTiler) los pide el cliente directo, sin pasar por la API.',
        })}
      </Label>
    </Diagram>
  )
}

function RequestDiagram() {
  const { t } = useT()

  return (
    <Diagram
      width={760}
      height={156}
      label={t({
        en: 'Request path: the client sends HTTP with a JWT through the middleware chain, then a controller, a MediatR handler and EF Core with PostGIS; the response comes back as a DTO serialised to JSON.',
        es: 'Recorrido de un request: el cliente manda HTTP con JWT, pasa por la cadena de middlewares, un controller, un handler de MediatR y EF Core con PostGIS; la respuesta vuelve como un DTO serializado a JSON.',
      })}
    >
      <Label x={8} y={20} size={9.5}>
        {t({
          en: 'middleware, in order: exceptions › CORS › authentication › rate limiter › active account › email verified › authorisation',
          es: 'middlewares, en orden: excepciones › CORS › autenticación › rate limiter › cuenta activa › email verificado › autorización',
        })}
      </Label>

      <Box x={8} y={40} w={104} h={56} title={t({ en: 'Client', es: 'Cliente' })} sub="JWT" tech="react" />
      <Box
        x={140}
        y={40}
        w={150}
        h={56}
        title="Middlewares"
        sub={t({ en: 'auth · limits · account', es: 'auth · límites · cuenta' })}
        tech="dotnet"
      />
      <Box x={318} y={40} w={122} h={56} title="Controller" sub={t({ en: '27 in total', es: '27 en total' })} tech="dotnet" />
      <Box x={468} y={40} w={140} h={56} title="Handler" sub={t({ en: 'MediatR · rules', es: 'MediatR · reglas' })} tech="dotnet" />
      <Box x={636} y={40} w={116} h={56} title="EF Core" sub="+ PostGIS" tone="store" tech="postgres" />

      <Arrow d="M 114 68 L 136 68" />
      <Arrow d="M 292 68 L 314 68" />
      <Arrow d="M 442 68 L 464 68" />
      <Arrow d="M 610 68 L 632 68" />
      <Label x={126} y={60} anchor="middle" size={8.5}>HTTP</Label>
      <Label x={304} y={60} anchor="middle" size={8.5}>ok</Label>
      <Label x={454} y={60} anchor="middle" size={8.5}>cmd</Label>
      <Label x={622} y={60} anchor="middle" size={8.5}>SQL</Label>

      <Arrow d="M 694 98 L 694 124 L 60 124 L 60 100" dashed />
      <Label x={377} y={144} anchor="middle" size={9.5}>
        {t({ en: 'response: DTO → JSON', es: 'respuesta: DTO → JSON' })}
      </Label>
    </Diagram>
  )
}

function SosDiagram() {
  const { t } = useT()

  return (
    <Diagram
      width={760}
      height={292}
      label={t({
        en: 'SOS flow: the rider sends an alert to the API, which stores it with a 72-hour expiry, broadcasts it through SignalR to either the zone group for theft or each friend’s own group for a breakdown, and also sends a Firebase push to phones with the app closed.',
        es: 'Flujo del SOS: quien pide ayuda manda la alerta a la API, que la guarda con vencimiento de 72 horas, la difunde por SignalR al grupo de la zona si es robo o al grupo de cada amigo si es auxilio, y además manda un push de Firebase a los teléfonos con la app cerrada.',
      })}
    >
      <Box
        x={8}
        y={112}
        w={126}
        h={54}
        title={t({ en: 'Rider in trouble', es: 'Quien pide ayuda' })}
        sub="theft | assist"
        tech="capacitor"
      />
      <Box
        x={180}
        y={112}
        w={120}
        h={54}
        title="API"
        sub={t({ en: 'stores, fans out', es: 'guarda y difunde' })}
        tech="dotnet"
      />
      <Box
        x={180}
        y={214}
        w={120}
        h={48}
        title="TheftReport"
        sub={t({ en: 'expires at 72 h', es: 'vence a las 72 h' })}
        tone="store"
        tech="postgres"
        titleSize={10.5}
      />
      <Box x={352} y={52} w={150} h={52} title="AlertHub" sub="/hubs/alerts" tone="accent" tech="signalr" />
      <Box x={352} y={196} w={150} h={52} title="Firebase FCM" sub="push" tech="fcm" />
      <Box
        x={556}
        y={14}
        w={196}
        h={52}
        title={t({ en: 'Zone group', es: 'Grupo por zona' })}
        sub={t({ en: 'geohash 4 ≈ 20 km · theft', es: 'geohash 4 ≈ 20 km · robo' })}
        tone="accent"
        tech="signalr"
      />
      <Box
        x={556}
        y={86}
        w={196}
        h={52}
        title={t({ en: 'Per-user group', es: 'Grupo por usuario' })}
        sub={t({ en: 'friends only · assist', es: 'sólo amigos · auxilio' })}
        tone="accent"
        tech="signalr"
      />
      <Box
        x={556}
        y={196}
        w={196}
        h={52}
        title={t({ en: 'Phone', es: 'Teléfono' })}
        sub={t({ en: 'with the app closed', es: 'con la app cerrada' })}
        tech="fcm"
      />

      <Arrow d="M 136 139 L 176 139" />
      <Label x={156} y={131} anchor="middle" size={8.5}>{t({ en: 'alert', es: 'alerta' })}</Label>
      <Arrow d="M 240 168 L 240 210" />
      <Label x={248} y={193} size={8.5}>{t({ en: 'stores', es: 'guarda' })}</Label>

      <Arrow d="M 302 128 L 326 128 L 326 78 L 348 78" tone="accent" />
      <Arrow d="M 302 152 L 326 152 L 326 222 L 348 222" />
      <Arrow d="M 504 70 L 528 70 L 528 40 L 552 40" tone="accent" />
      <Arrow d="M 504 86 L 528 86 L 528 112 L 552 112" tone="accent" />
      <Arrow d="M 504 222 L 552 222" />

      <Label x={8} y={284} size={9.5}>
        {t({
          en: 'The accent path is real time. The group a message is broadcast to IS the access control.',
          es: 'En acento, el camino de tiempo real. El grupo al que se difunde ES el control de acceso.',
        })}
      </Label>
    </Diagram>
  )
}

function CopilotDiagram() {
  const { t } = useT()

  const brakes: [Localized, Localized][] = [
    [
      { en: 'Feature switch', es: 'Interruptor' },
      { en: 'platform-wide', es: 'de plataforma' },
    ],
    [
      { en: 'Spend ceiling', es: 'Techo de gasto' },
      { en: 'global', es: 'global' },
    ],
    [
      { en: 'Daily quota', es: 'Cuota diaria' },
      { en: 'per user', es: 'por usuario' },
    ],
    [
      { en: 'Rate limit', es: 'Rate limit' },
      { en: '10 per minute', es: '10 por minuto' },
    ],
  ]

  return (
    <Diagram
      width={760}
      height={346}
      label={t({
        en: 'Copilot flow: a message passes four brakes in order, loads its session from Postgres, and reaches gpt-4o-mini, which calls up to ten tools backed by PostgreSQL, routing and geocoding. Each tool returns two things: a text summary that goes back to the model, which reads it and writes the reply, and data cards that go straight into the HTTP response without passing through the model.',
        es: 'Flujo del copiloto: el mensaje pasa cuatro frenos en orden, carga su sesión desde Postgres y llega a gpt-4o-mini, que llama hasta diez herramientas respaldadas por PostgreSQL, ruteo y geocoding. Cada herramienta devuelve dos cosas: un resumen en texto que vuelve al modelo, que lo lee y redacta la respuesta, y fichas de datos que van directo a la respuesta HTTP sin pasar por el modelo.',
      })}
    >
      <Box x={8} y={37} w={170} h={46} title="POST /assistant" sub="/message" tech="dotnet" titleSize={10.5} />

      <Box
        x={206}
        y={12}
        w={546}
        h={82}
        tone="group"
        caption={t({ en: 'Brakes, in order', es: 'Frenos, en orden' })}
        tech="dotnet"
      />
      {brakes.map(([title, sub], i) => (
        <Box
          key={i}
          x={218 + i * 134}
          y={36}
          w={120}
          h={48}
          title={t(title)}
          sub={t(sub)}
          tech="dotnet"
          titleSize={10.5}
        />
      ))}
      {[345, 479, 613].map((x) => (
        <Label key={x} x={x} y={65} anchor="middle" size={12}>›</Label>
      ))}

      <Arrow d="M 180 60 L 202 60" />
      <Arrow d="M 240 96 L 240 106 L 83 106 L 83 120" />
      <Label x={370} y={116} anchor="middle" size={9}>auto tool-calling</Label>

      <Box
        x={8}
        y={124}
        w={150}
        h={56}
        title={t({ en: 'Session', es: 'Sesión' })}
        sub={t({ en: '30 min · 20 turns', es: '30 min · 20 turnos' })}
        tone="store"
        tech="postgres"
      />
      <Box
        x={199}
        y={124}
        w={150}
        h={56}
        title="gpt-4o-mini"
        sub={t({ en: 'picks and writes', es: 'elige y redacta' })}
        tech="openai"
      />
      <Box
        x={390}
        y={124}
        w={150}
        h={56}
        title={t({ en: '10 tools', es: '10 herramientas' })}
        sub="RoutePlanner · Discovery"
        tech="dotnet"
        subSize={9}
      />
      <Box
        x={581}
        y={124}
        w={171}
        h={56}
        title="PostgreSQL + PostGIS"
        sub="OSRM · ORS · Nominatim"
        tone="store"
        tech="postgres"
        titleSize={11}
      />

      <Arrow d="M 160 152 L 195 152" />
      <Arrow d="M 351 152 L 386 152" />
      <Arrow d="M 542 152 L 577 152" />

      <Box
        x={390}
        y={212}
        w={150}
        h={52}
        title={t({ en: '(a) summary', es: '(a) resumen' })}
        sub={t({ en: 'text → history', es: 'texto → historial' })}
      />
      <Box
        x={581}
        y={212}
        w={171}
        h={52}
        title={t({ en: '(b) cards', es: '(b) fichas' })}
        sub={t({ en: 'DTOs · hard data', es: 'DTOs · dato duro' })}
        tone="accent"
      />

      <Arrow d="M 440 182 L 440 208" />
      <Arrow d="M 520 182 L 520 196 L 640 196 L 640 208" tone="accent" />
      <Arrow d="M 388 238 L 274 238 L 274 184" />
      <Label x={331} y={231} anchor="middle" size={9}>
        {t({ en: 'the model reads it', es: 'el modelo lo lee' })}
      </Label>
      <Arrow d="M 230 182 L 230 288" />
      <Label x={222} y={262} anchor="end" size={9}>{t({ en: 'writes', es: 'redacta' })}</Label>
      <Arrow d="M 666 266 L 666 288" tone="accent" />
      <Label x={656} y={281} anchor="end" size={9} tone="accent">
        {t({ en: 'never through the model', es: 'sin pasar por el modelo' })}
      </Label>

      <Box
        x={8}
        y={292}
        w={744}
        h={44}
        title={t({ en: 'HTTP response', es: 'Respuesta HTTP' })}
        sub={t({ en: 'text the model wrote + cards exactly as the database returned them', es: 'texto que redactó el modelo + fichas tal como salieron de la base' })}
      />
    </Diagram>
  )
}

function WorkersDiagram() {
  const { t } = useT()

  const cleanup: [string, Localized][] = [
    ['PurgeExpiredStories', { en: 'stories · 24 h', es: 'historias · 24 h' }],
    ['PurgeExpiredPois', { en: 'meeting points', es: 'puntos de encuentro' }],
    ['ExpireTheftAlerts', { en: 'alerts · 72 h', es: 'alertas · 72 h' }],
    ['ExpireMessages', { en: 'expired chat', es: 'chat vencido' }],
    ['PurgeAuthEvents', { en: 'sign-in log', es: 'log de logins' }],
  ]
  const product: [string, Localized][] = [
    ['ConsolidatePoi', { en: 'promotes points', es: 'consolida puntos' }],
    ['NotifyNearbyEvents', { en: 'zone alert', es: 'aviso por zona' }],
  ]

  return (
    <Diagram
      width={760}
      height={330}
      label={t({
        en: 'Background workers in three groups. Expiry and cleanup: stories, meeting points, theft alerts, chat messages and the sign-in log, writing to PostgreSQL and removing media from R2. Anti-abuse: nightly scoring of suspicious accounts in PostgreSQL. Product: consolidating meeting points and notifying nearby events, writing to PostgreSQL and sending push through FCM.',
        es: 'Workers en segundo plano, en tres grupos. Vencimiento y limpieza: historias, puntos de encuentro, alertas de robo, mensajes de chat y log de logins, sobre PostgreSQL y borrando media de R2. Antiabuso: puntuación nocturna de cuentas sospechosas en PostgreSQL. Producto: consolidar puntos de encuentro y avisar eventos cercanos, sobre PostgreSQL y mandando push por FCM.',
      })}
    >
      <Box x={8} y={22} w={250} h={218} tone="group" caption={t({ en: 'Expiry & cleanup', es: 'Vencimiento y limpieza' })} tech="dotnet" />
      {cleanup.map(([name, detail], i) => (
        <Box
          key={name}
          x={18}
          y={46 + i * 37}
          w={230}
          h={30}
          title={name}
          sub={t(detail)}
          layout="row"
          titleSize={9.5}
          subSize={9}
          rx={4}
          tech="dotnet"
        />
      ))}

      <Box x={270} y={22} w={220} h={90} tone="group" caption={t({ en: 'Anti-abuse', es: 'Antiabuso' })} tech="dotnet" />
      <Box
        x={280}
        y={46}
        w={200}
        h={52}
        title="ScoreSuspiciousAccounts"
        sub={t({ en: 'once a night', es: 'una vez por noche' })}
        titleSize={10}
        rx={4}
        tech="dotnet"
      />

      <Box x={502} y={22} w={250} h={104} tone="group" caption={t({ en: 'Product', es: 'Producto' })} tech="dotnet" />
      {product.map(([name, detail], i) => (
        <Box
          key={name}
          x={512}
          y={46 + i * 37}
          w={230}
          h={30}
          title={name}
          sub={t(detail)}
          layout="row"
          titleSize={9.5}
          subSize={9}
          rx={4}
          tech="dotnet"
        />
      ))}

      <Box x={8} y={276} w={120} h={44} title="R2" sub="media" tech="cloudflare" />
      <Box x={144} y={276} w={470} h={44} title="PostgreSQL" tone="store" tech="postgres" />
      <Box x={632} y={276} w={120} h={44} title="FCM" sub="push" tech="fcm" />

      <Arrow d="M 60 242 L 60 272" dashed />
      <Arrow d="M 200 242 L 200 272" />
      <Arrow d="M 380 114 L 380 272" />
      <Arrow d="M 560 128 L 560 272" />
      <Arrow d="M 700 128 L 700 272" dashed />
    </Diagram>
  )
}

function AntiAbuseDiagram() {
  const { t } = useT()

  const checks: { title: Localized; sub: Localized; outcome: string; outcomeSub: Localized }[] = [
    {
      title: { en: 'Enabled?', es: '¿Encendida?' },
      sub: { en: 'platform switch', es: 'interruptor' },
      outcome: '503',
      outcomeSub: { en: 'feature off', es: 'función apagada' },
    },
    {
      title: { en: 'Account ok?', es: '¿Cuenta ok?' },
      sub: { en: 'active + email', es: 'activa + email' },
      outcome: '401 / 403',
      outcomeSub: { en: 'stopped at the door', es: 'frenada en la puerta' },
    },
    {
      title: { en: 'Under the limit?', es: '¿Bajo el límite?' },
      sub: { en: 'rate limit', es: 'rate limit' },
      outcome: '429',
      outcomeSub: { en: 'never shown to user', es: 'no se le muestra' },
    },
    {
      title: { en: 'Trusted enough?', es: '¿Le alcanza?' },
      sub: { en: 'trust level', es: 'nivel de confianza' },
      outcome: t({ en: 'Clear message', es: 'Mensaje claro' }),
      outcomeSub: { en: 'says what is missing', es: 'dice qué falta' },
    },
  ]

  return (
    <Diagram
      width={760}
      height={300}
      label={t({
        en: 'Anti-abuse flow: a request passes four checks in order — platform switch, account active with email verified, rate limit, and trust level — and each failed check returns its own outcome: 503, 401 or 403, a silent 429, or a message saying what is missing. A request that passes reaches the handler, which writes sign-in events; a nightly worker scores them and feeds a suspicion panel.',
        es: 'Flujo antiabuso: un request pasa cuatro controles en orden — interruptor de plataforma, cuenta activa con email verificado, rate limit y nivel de confianza — y cada control que falla devuelve su propio resultado: 503, 401 o 403, un 429 silencioso o un mensaje que dice qué falta. El request que pasa llega al handler, que escribe eventos de login; un worker nocturno los puntúa y alimenta un panel de sospechas.',
      })}
    >
      <Box x={8} y={40} w={80} h={56} title="Request" />
      {checks.map((check, i) => {
        const x = 108 + i * 138
        return (
          <Box
            key={i}
            x={x}
            y={40}
            w={118}
            h={56}
            title={t(check.title)}
            sub={t(check.sub)}
            tech="dotnet"
            titleSize={11}
            rx={16}
          />
        )
      })}
      <Box x={660} y={40} w={92} h={56} title="Handler" sub={t({ en: 'use case', es: 'caso de uso' })} tech="dotnet" />

      <Arrow d="M 90 68 L 104 68" />
      {[228, 366, 504, 642].map((x) => (
        <Arrow key={x} d={`M ${x} 68 L ${x + 14} 68`} />
      ))}
      {[235, 373, 511, 649].map((x) => (
        <Label key={x} x={x} y={60} anchor="middle" size={8}>{t({ en: 'yes', es: 'sí' })}</Label>
      ))}

      {checks.map((check, i) => {
        const x = 108 + i * 138
        const last = i === checks.length - 1
        return (
          <Box
            key={`outcome-${i}`}
            x={x}
            y={146}
            w={118}
            h={48}
            title={check.outcome}
            sub={t(check.outcomeSub)}
            tone={last ? 'accent' : 'plain'}
            titleSize={11}
            subSize={9}
          />
        )
      })}
      {checks.map((_, i) => {
        const cx = 108 + i * 138 + 59
        return <Arrow key={`down-${i}`} d={`M ${cx} 98 L ${cx} 142`} />
      })}
      {checks.map((_, i) => (
        <Label key={`no-${i}`} x={108 + i * 138 + 65} y={124} size={8.5}>no</Label>
      ))}

      <Box
        x={540}
        y={240}
        w={212}
        h={48}
        title="auth_events"
        sub={t({ en: 'truncated IP · hashed UA', es: 'IP truncada · UA hasheado' })}
        tone="store"
        tech="postgres"
      />
      <Box
        x={290}
        y={240}
        w={220}
        h={48}
        title="ScoreSuspiciousAccounts"
        sub={t({ en: 'overnight', es: 'de madrugada' })}
        tech="dotnet"
        titleSize={11}
      />
      <Box
        x={8}
        y={240}
        w={252}
        h={48}
        title={t({ en: 'Suspicion panel', es: 'Panel de sospechas' })}
        sub={t({ en: 'admin', es: 'administración' })}
      />

      <Arrow d="M 706 98 L 706 236" dashed />
      <Label x={712} y={172} size={8.5}>{t({ en: 'writes', es: 'escribe' })}</Label>
      <Arrow d="M 538 264 L 514 264" dashed />
      <Arrow d="M 288 264 L 264 264" dashed />
    </Diagram>
  )
}

function DeployDiagram() {
  const { t } = useT()

  return (
    <Diagram
      width={760}
      height={252}
      label={t({
        en: 'Delivery pipelines: a push to main runs GitHub Actions and deploys the front to Cloudflare Pages automatically; the API is deployed by hand with a script to the OCI VM, where migrations run on startup; the signed Android AAB goes to Google Play. A deploy is verified by asking the version endpoints for their SHA and comparing it with git HEAD.',
        es: 'Pipelines de entrega: un push a main corre GitHub Actions y despliega el front en Cloudflare Pages de forma automática; la API se despliega a mano con un script a la VM de OCI, donde las migraciones corren al arrancar; el AAB firmado de Android va a Google Play. Un deploy se verifica pidiéndole el SHA a los endpoints de versión y comparándolo con git HEAD.',
      })}
    >
      <Box x={8} y={16} w={130} h={46} title={t({ en: 'Push to main', es: 'Push a main' })} titleSize={11} />
      <Box
        x={176}
        y={16}
        w={176}
        h={46}
        title="GitHub Actions"
        sub={t({ en: 'build · unit · integration', es: 'build · unit · integración' })}
        titleSize={11}
      />
      <Box
        x={392}
        y={16}
        w={160}
        h={46}
        title="Cloudflare Pages"
        sub={t({ en: 'automatic', es: 'automático' })}
        tech="cloudflare"
        titleSize={11}
      />

      <Label x={8} y={110} size={9.5}>{t({ en: 'by hand', es: 'a mano' })}</Label>
      <Arrow d="M 8 118 L 172 118" dashed />
      <Box
        x={176}
        y={92}
        w={176}
        h={46}
        title="deploy-api.ps1"
        sub={t({ en: 'manual · from main only', es: 'manual · sólo desde main' })}
        tech="dotnet"
        titleSize={11}
      />
      <Box
        x={392}
        y={92}
        w={160}
        h={46}
        title="OCI Ampere · podman"
        sub={t({ en: 'migrations on startup', es: 'migraciones al arrancar' })}
        tech="dotnet"
        titleSize={10.5}
      />

      <Label x={8} y={186} size={9.5}>{t({ en: 'by hand', es: 'a mano' })}</Label>
      <Arrow d="M 8 194 L 172 194" dashed />
      <Box
        x={176}
        y={168}
        w={176}
        h={46}
        title="android-release.yml"
        sub={t({ en: 'signed AAB + aapt2', es: 'AAB firmado + aapt2' })}
        tech="capacitor"
        titleSize={10.5}
      />
      <Box
        x={392}
        y={168}
        w={160}
        h={46}
        title="Google Play"
        sub={t({ en: 'production', es: 'producción' })}
        tech="capacitor"
        titleSize={11}
      />

      <Box
        x={592}
        y={16}
        w={160}
        h={122}
        title={t({ en: 'Verification', es: 'Verificación' })}
        sub={['GET /version', 'GET /version.json', 'vs git rev-parse HEAD']}
        tone="accent"
        titleSize={11}
      />

      <Arrow d="M 140 39 L 172 39" />
      <Arrow d="M 354 39 L 388 39" />
      <Arrow d="M 354 115 L 388 115" />
      <Arrow d="M 354 191 L 388 191" />
      <Arrow d="M 554 39 L 572 39 L 572 62 L 588 62" />
      <Arrow d="M 554 115 L 572 115 L 572 94 L 588 94" />

      <Label x={8} y={244} size={9.5}>
        {t({
          en: 'To know what is running, ask for the SHA — do not check the container’s date or grep the binary.',
          es: 'Para saber qué está corriendo se pide el SHA: no se mira la fecha del contenedor ni se grepea el binario.',
        })}
      </Label>
    </Diagram>
  )
}

/* -------------------------------------------------------------------- copy */

const header = {
  title: {
    en: (
      <>
        How EnMoto works <Accent>under the hood</Accent>
      </>
    ),
    es: (
      <>
        Cómo se mueve EnMoto <Accent>por dentro</Accent>
      </>
    ),
  } satisfies Rich,
  lead: {
    en: 'Seven flows that explain the whole system: what talks to what, what was decided on purpose, and what was learned the hard way. A single developer’s project, in production, with the app on Google Play.',
    es: 'Siete flujos que explican el sistema completo: qué habla con qué, qué se decidió a propósito y qué costó aprender. Un proyecto de una sola desarrolladora, en producción, con la app publicada en Google Play.',
  } satisfies Localized,
}

const facts: [string, Localized][] = [
  ['27', { en: 'REST controllers', es: 'controllers REST' }],
  ['3', { en: 'SignalR hubs', es: 'hubs de SignalR' }],
  ['8', { en: 'background workers', es: 'workers en segundo plano' }],
  ['10', { en: 'AI tools', es: 'herramientas de IA' }],
]

const sections: { id: string; title: Localized }[] = [
  { id: 'system', title: { en: 'The system at a glance', es: 'El sistema de una mirada' } },
  { id: 'request', title: { en: 'One request, end to end', es: 'Un request de punta a punta' } },
  { id: 'sos', title: { en: 'Real time: the SOS', es: 'Tiempo real: el SOS' } },
  { id: 'copilot', title: { en: 'The AI copilot', es: 'El copiloto con IA' } },
  { id: 'workers', title: { en: 'What runs on its own', es: 'Lo que corre solo' } },
  { id: 'anti-abuse', title: { en: 'Where each thing gets stopped', es: 'Dónde se frena cada cosa' } },
  { id: 'deploy', title: { en: 'From commit to production', es: 'Del commit a producción' } },
  { id: 'stack', title: { en: 'The stack, in one table', es: 'El stack, en una tabla' } },
]

const titleOf = (id: string) => sections.find((s) => s.id === id)!.title

const hubs: [string, string, Localized][] = [
  ['AlertHub', '/hubs/alerts', { en: 'geohash (zone, precision 4) and by user', es: 'geohash (zona, precisión 4) y por usuario' }],
  ['NotificationHub', '/hubs/notifications', { en: 'user only (user-<id>)', es: 'sólo por usuario (user-<id>)' }],
  ['ChatHub', '/hubs/chat', { en: 'user only (chat-<id>)', es: 'sólo por usuario (chat-<id>)' }],
]

/* -------------------------------------------------------------------- page */

export default function EnMotoArchitecture() {
  const { t } = useT()
  const [tech, setTech] = useState<Tech | null>(null)

  return (
    <DeepDiveShell page="enmoto-architecture">
      <DeepDiveHeader
        eyebrow="EnMoto · 02 / 02"
        title={t(header.title)}
        lead={t(header.lead)}
        facts={[
          ...facts.map(([n, label]) => (
            <Fact key={n} n={n}>
              {t(label)}
            </Fact>
          )),
          <Fact key="businesses" n={t({ en: '5,151', es: '5.151' })}>
            {t({ en: 'businesses on the map', es: 'comercios en el mapa' })}
          </Fact>,
        ]}
      >
        <nav aria-label={t(ui.deepDive.contents)} className="mt-12">
          <ol className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-muted hover:text-accent flex items-baseline gap-3 py-1 text-sm transition-colors"
                >
                  <span className="text-pixel text-accent text-[8px]" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  {t(section.title)}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </DeepDiveHeader>

      {/* Sticky only where there is room: wrapped onto three lines on a phone
          it would eat a fifth of the screen for the whole page. */}
      <div className="bg-bg/85 border-border -mx-6 mt-12 border-y px-6 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 md:sticky md:top-[3.5625rem] md:z-30">
        <TechBar active={tech} onChange={setTech} />
      </div>

      <TechContext value={tech}>
        {/* 01 */}
        <Block
          id="system"
          index="01"
          eyebrow={t({ en: 'What talks to what', es: 'Qué habla con qué' })}
          title={t(titleOf('system'))}
        >
          <Prose>
            <p>
              {t({
                en: 'One frontend codebase serves both the web and the app: Capacitor packages the same bundle, and everything native — camera, GPS, push, sharing, Google sign-in — comes in through plugins. The API is a modular .NET 10 monolith running on a single ARM VM with podman.',
                es: 'Un solo código de frontend sirve a la web y a la app: Capacitor empaqueta el mismo bundle, y lo nativo —cámara, GPS, push, compartir, login con Google— entra por plugins. La API es un monolito modular de .NET 10 que corre en una sola VM ARM con podman.',
              })}
            </p>
          </Prose>
          <Figure
            label={t(titleOf('system'))}
            caption={t({
              en: (
                <>
                  The front deploys itself on merge to <Code>main</Code>; the API is deployed by hand.
                  The asymmetry is deliberate: the front is static and reversible, the API runs
                  migrations. And the Android AAB freezes the front at build time, so any later
                  front-end change means building it again.
                </>
              ),
              es: (
                <>
                  El front se despliega solo al mergear a <Code>main</Code>; la API se despliega a
                  mano. Es asimétrico a propósito: el front es estático y reversible, la API aplica
                  migraciones. Y el AAB de Android congela el front al compilar, así que cualquier
                  cambio de front posterior obliga a rehacerlo.
                </>
              ),
            })}
          >
            <SystemDiagram />
          </Figure>
          <Why label={t({ en: 'The decision', es: 'La decisión' })}>
            <p>
              {t({
                en: 'One VM and a modular monolith, not microservices: for a single developer at this volume, the operational cost of splitting it up would outweigh anything it saved. The modularity lives in the code — Clean Architecture, use cases grouped by module — which is where it actually pays for itself.',
                es: 'Una sola VM y un monolito modular, no microservicios: con una sola desarrolladora y este volumen, la complejidad operativa de repartirlo costaría más de lo que ahorra. La modularidad vive en el código —Clean Architecture, casos de uso por módulo—, que es donde sí se paga sola.',
              })}
            </p>
          </Why>
        </Block>

        {/* 02 */}
        <Block
          id="request"
          index="02"
          eyebrow={t({ en: 'Clean Architecture, in motion', es: 'Clean Architecture en movimiento' })}
          title={t(titleOf('request'))}
        >
          <Prose>
            <p>
              {t({
                en: (
                  <>
                    Four projects — <Code>Domain</Code> → <Code>Application</Code> →{' '}
                    <Code>Infrastructure</Code> → <Code>API</Code> — with dependencies pointing
                    inwards: the domain knows about nobody. <Code>Application</Code> groups the use
                    cases by module (Events, Merchants, Trips, Trust, Moderation…) and defines the
                    repository interfaces that <Code>Infrastructure</Code> implements.
                  </>
                ),
                es: (
                  <>
                    Cuatro proyectos —<Code>Domain</Code> → <Code>Application</Code> →{' '}
                    <Code>Infrastructure</Code> → <Code>API</Code>— con las dependencias apuntando
                    hacia adentro: el dominio no conoce a nadie. <Code>Application</Code> agrupa los
                    casos de uso por módulo (Events, Merchants, Trips, Trust, Moderation…) y define
                    las interfaces de repositorio que <Code>Infrastructure</Code> implementa.
                  </>
                ),
              })}
            </p>
          </Prose>
          <Figure
            label={t(titleOf('request'))}
            caption={t({
              en: (
                <>
                  The pipeline order is not the default: <Code>ActiveUser</Code> and{' '}
                  <Code>EmailVerified</Code> run before authorisation, so a suspended or unconfirmed
                  account is stopped at the door and the rule is not repeated in every handler.
                </>
              ),
              es: (
                <>
                  El orden del pipeline no es el default: <Code>ActiveUser</Code> y{' '}
                  <Code>EmailVerified</Code> corren antes de la autorización, así una cuenta
                  suspendida o sin confirmar se frena en la puerta y la regla no se repite en cada
                  handler.
                </>
              ),
            })}
          >
            <RequestDiagram />
          </Figure>
          <Why label={t({ en: 'The detail that shapes every deploy', es: 'El detalle que condiciona los deploys' })}>
            <p>
              {t({
                en: (
                  <>
                    Migrations are applied when the API starts, in every environment. Deploying the
                    code is, in practice, deploying the schema too — hence the rule to take a{' '}
                    <Code>pg_dump</Code> first and never deploy from a dirty working tree. It was
                    learned by once deploying from a worktree with half a phase uncommitted.
                  </>
                ),
                es: (
                  <>
                    Las migraciones se aplican al arrancar la API, en todos los entornos. El deploy
                    del código es, en la práctica, también el deploy del esquema: de ahí la regla de
                    hacer <Code>pg_dump</Code> antes y de no deployar nunca desde un árbol de trabajo
                    sucio. Se aprendió deployando una vez desde un worktree con media fase sin
                    commitear.
                  </>
                ),
              })}
            </p>
          </Why>
        </Block>

        {/* 03 */}
        <Block
          id="sos"
          index="03"
          eyebrow={t({ en: 'The flow with the most moving parts', es: 'El flujo con más partes' })}
          title={t(titleOf('sos'))}
        >
          <Prose>
            <p>
              {t({
                en: 'A breakdown request or a theft alert has to arrive now. It goes out along two paths that are not one path with a fallback: SignalR delivers to whoever is connected, and Firebase push to whoever has the app closed.',
                es: 'Un pedido de auxilio o una alerta de robo tienen que llegar ahora. El aviso sale por dos caminos que no son uno con fallback: SignalR le entrega a quien está conectado, y el push de Firebase a quien tiene la app cerrada.',
              })}
            </p>
          </Prose>
          <Figure
            label={t(titleOf('sos'))}
            caption={t({
              en: (
                <>
                  A public theft alert goes to the zone group; a friends-only breakdown request goes
                  to each friend’s own group. <Code>ExpireTheftAlertsWorker</Code> expires it on its
                  own after 72 hours.
                </>
              ),
              es: (
                <>
                  Una alerta pública de robo va al grupo de la zona; un auxilio «sólo amigos» va al
                  grupo de cada amigo. <Code>ExpireTheftAlertsWorker</Code> la vence sola a las 72 h.
                </>
              ),
            })}
          >
            <SosDiagram />
          </Figure>

          <DataTable
            caption={t({ en: 'SignalR hubs and how each groups connections', es: 'Hubs de SignalR y cómo agrupa cada uno' })}
            head={['Hub', t({ en: 'Route', es: 'Ruta' }), t({ en: 'Groups by', es: 'Agrupa por' })]}
            rows={hubs.map(([name, route, groups]) => [
              <Code key="name">{name}</Code>,
              <Code key="route">{route}</Code>,
              t(groups),
            ])}
          />

          <Why label={t({ en: 'The bug that taught the rule', es: 'El bug que enseñó la regla' })}>
            <p>
              {t({
                en: (
                  <>
                    A friends-only alert was being broadcast to the zone group — to anyone nearby who
                    happened to be listening. Since breakdown requests default to friends-only, that
                    was the normal case, not the edge case.{' '}
                    <strong>
                      The SignalR group is the access control: picking the wrong group is not a UI
                      bug, it is a data leak.
                    </strong>
                  </>
                ),
                es: (
                  <>
                    Una alerta «sólo amigos» se estaba difundiendo al grupo de la zona — o sea, a
                    cualquiera que estuviera cerca escuchando. Como el auxilio sale «sólo amigos» por
                    default, ese era el caso normal y no el raro.{' '}
                    <strong>
                      El grupo de SignalR es el control de acceso: elegir mal el grupo no es un bug de
                      UI, es filtrar datos.
                    </strong>
                  </>
                ),
              })}
            </p>
          </Why>
          <Prose>
            <p>
              {t({
                en: (
                  <>
                    Every push goes through a single funnel,{' '}
                    <Code>NotificationService.NotifyAsync</Code>. That is what made it a one-place fix
                    the day the Firebase credentials could not be read and push was failing silently.
                  </>
                ),
                es: (
                  <>
                    Todo el push pasa por un embudo único, <Code>NotificationService.NotifyAsync</Code>.
                    Es lo que permitió arreglarlo de una sola vez el día que las credenciales de
                    Firebase no se podían leer y el push caía en silencio.
                  </>
                ),
              })}
            </p>
          </Prose>
        </Block>

        {/* 04 */}
        <Block
          id="copilot"
          index="04"
          eyebrow={t({ en: 'Two output channels', es: 'Dos canales de salida' })}
          title={t({
            en: 'The copilot: the model chooses, the database answers',
            es: 'El copiloto: el modelo elige, la base contesta',
          })}
        >
          <Prose>
            <p>
              {t({
                en: (
                  <>
                    One chat turn with automatic tool calling on <Code>gpt-4o-mini</Code>, through
                    Semantic Kernel: the model can chain several tools without going back to the
                    user. Ten tools, covering routing, businesses, events, the marketplace, meeting
                    points and alerts.
                  </>
                ),
                es: (
                  <>
                    Un turno de chat con tool-calling automático sobre <Code>gpt-4o-mini</Code>, vía
                    Semantic Kernel: el modelo puede encadenar varias herramientas sin volver al
                    usuario. Diez herramientas, entre ruteo, comercios, eventos, marketplace, puntos
                    de encuentro y alertas.
                  </>
                ),
              })}
            </p>
          </Prose>
          <Figure
            label={t(titleOf('copilot'))}
            caption={t({
              en: 'In the accent colour, the data that must never be invented: phone numbers, opening hours, prices, event dates and route geometry travel from the database to the screen without touching the model.',
              es: 'En acento, el dato que no puede salir inventado: teléfono, horario, precio, fecha de un evento y la geometría de la ruta viajan de la base a la pantalla sin tocar el modelo.',
            })}
          >
            <CopilotDiagram />
          </Figure>

          <Split>
            <Panel label={t({ en: 'The principle', es: 'El principio' })}>
              <p className="text-accent font-mono text-sm">
                {t({ en: 'the LLM does not query — it chooses', es: 'el LLM no consulta, elige' })}
              </p>
              <p>
                {t({
                  en: 'The model understands the request, chains the steps and writes. The data comes from PostGIS repositories, MediatR queries or a routing service. A confidently invented phone number is worse than none.',
                  es: 'El modelo entiende el pedido, encadena pasos y redacta. Los datos salen de repositorios PostGIS, de queries de MediatR o de un servicio de ruteo. Un teléfono inventado con seguridad es peor que no tener teléfono.',
                })}
              </p>
            </Panel>
            <Panel label={t({ en: 'Deliberately deterministic', es: 'Lo deliberadamente determinístico' })}>
              <p className="text-accent font-mono text-sm">GET /events/{'{id}'}/route</p>
              <p>
                {t({
                  en: 'The “How do I get there” button never touches the model: the user has already chosen the event, so there is nothing to interpret. Distances (Haversine in C#), marketplace ordering (SQL), opening-hours summaries and who can see what are code too, not prompt.',
                  es: 'El botón «Cómo llego» no pasa por el modelo: el usuario ya eligió el evento, no hay nada que interpretar. También son código y no prompt las distancias (Haversine en C#), el orden del marketplace (SQL), el resumen de horarios y quién puede ver qué.',
                })}
              </p>
            </Panel>
          </Split>

          <Why label={t({ en: 'The gotcha that broke production', es: 'El gotcha que rompió producción' })}>
            <p>
              {t({
                en: (
                  <>
                    <Code>context_length_exceeded</Code>: <Code>plan_route</Code> handed the route
                    geometry back to the model and, since every tool-call result goes back into the
                    history, a multi-leg trip blew past 128k and the whole query failed. The geometry
                    now travels only through channel (b).
                  </>
                ),
                es: (
                  <>
                    <Code>context_length_exceeded</Code>: <Code>plan_route</Code> le devolvía la
                    geometría de la ruta al modelo y, como cada resultado de tool-call vuelve al
                    historial, un viaje de varios tramos pasaba los 128k y la consulta fallaba entera.
                    Hoy la geometría viaja sólo por el canal (b).
                  </>
                ),
              })}
            </p>
            <p>
              {t({
                en: 'A dependency-injection corollary: routing and geocoding are registered outside the branch that requires the OpenAI key. Otherwise a missing key would also break “How do I get there”, which does not use the model at all.',
                es: 'Corolario de inyección de dependencias: el ruteo y el geocoding se registran fuera del branch que exige la key de OpenAI. Si estuvieran adentro, una key ausente rompería también el «Cómo llego», que no usa el modelo.',
              })}
            </p>
          </Why>
        </Block>

        {/* 05 */}
        <Block
          id="workers"
          index="05"
          eyebrow={t({ en: 'What happens without anyone asking', es: 'Lo que pasa sin que nadie lo pida' })}
          title={t({ en: 'Eight background workers', es: 'Ocho workers en segundo plano' })}
        >
          <Prose>
            <p>
              {t({
                en: (
                  <>
                    All the same shape: they can be switched off in configuration — and log it on
                    startup — they work in batches, and when files are involved they delete{' '}
                    <strong>the row first, then the file</strong>. An orphaned file is a smaller
                    problem than a row pointing at a file that is not there.
                  </>
                ),
                es: (
                  <>
                    Todos con la misma forma: se apagan por configuración —y lo loguean al arrancar—,
                    trabajan por lotes y, cuando hay archivos de por medio, borran{' '}
                    <strong>primero la fila y después el archivo</strong>. Un archivo huérfano es un
                    problema menor que una fila que apunta a un archivo que no está.
                  </>
                ),
              })}
            </p>
          </Prose>
          <Figure
            label={t(titleOf('workers'))}
            caption={t({
              en: 'Stories expire after 24 hours and theft alerts after 72: nobody has to remember to take anything down.',
              es: 'Las historias vencen a las 24 h y las alertas de robo a las 72 h: nadie tiene que acordarse de bajar nada.',
            })}
          >
            <WorkersDiagram />
          </Figure>
          <Why label={t({ en: 'The decision', es: 'La decisión' })}>
            <p>
              {t({
                en: 'Anti-abuse scoring is a worker that sleeps for 24 hours and runs one query in the small hours, not a system watching in real time. Even with thousands of users that is seconds of Postgres at a time nobody is using the app. The expensive mistake would have been putting detection on the hot path of every request.',
                es: 'El scoring antiabuso es un worker que duerme 24 h y corre una query de madrugada, no un sistema vigilando en tiempo real. Con miles de usuarios son segundos de Postgres en el horario en que nadie usa la app. El error caro habría sido meter detección en el camino caliente de cada request.',
              })}
            </p>
          </Why>
        </Block>

        {/* 06 */}
        <Block
          id="anti-abuse"
          index="06"
          eyebrow={t({ en: 'Four layers, none replacing another', es: 'Cuatro capas, ninguna reemplaza a otra' })}
          title={t(titleOf('anti-abuse'))}
        >
          <Prose>
            <p>
              {t({
                en: 'Switches to turn part of the app off without redeploying anything, middleware for suspended or unverified accounts, a per-user rate limit, and trust levels for whatever is expensive when abused. A request crosses them in this order:',
                es: 'Interruptores para apagar una parte de la app sin recrear nada, middlewares para cuentas suspendidas o sin verificar, rate limit por usuario y niveles de confianza para lo que cuesta caro si se abusa. Un request las atraviesa en este orden:',
              })}
            </p>
          </Prose>
          <Figure
            label={t(titleOf('anti-abuse'))}
            caption={t({
              en: 'A switch with no row counts as “on”: one stuck off would be worse than having no switches at all. And a 429 is never shown to the user — if the app asks too often, that is our problem, not something they can fix.',
              es: 'Un interruptor sin fila vale «encendido»: uno trabado en apagado sería peor que no tener interruptores. Y el 429 no se le muestra al usuario — que pidamos de más es problema nuestro, no algo que él pueda resolver.',
            })}
          >
            <AntiAbuseDiagram />
          </Figure>
          <Why label={t({ en: 'Privacy by design', es: 'Privacidad por diseño' })}>
            <p>
              {t({
                en: (
                  <>
                    The sign-in log <strong>keeps neither full IP addresses nor raw user agents</strong>:
                    IPv4 is truncated to <Code>/24</Code>, IPv6 to <Code>/64</Code>, and the user agent
                    is hashed with SHA-256. Enough to spot a burst of sign-ups from one place; not
                    enough to identify anyone.
                  </>
                ),
                es: (
                  <>
                    El registro de intentos de login <strong>no guarda IP completa ni user-agent crudo</strong>:
                    IPv4 truncada a <Code>/24</Code>, IPv6 a <Code>/64</Code>, user-agent en SHA-256.
                    Alcanza para detectar una ronda de altas desde el mismo lugar y no alcanza para
                    identificar a nadie.
                  </>
                ),
              })}
            </p>
          </Why>
        </Block>

        {/* 07 */}
        <Block
          id="deploy"
          index="07"
          eyebrow={t({ en: 'Three paths, one way to verify', es: 'Tres caminos, una sola verificación' })}
          title={t(titleOf('deploy'))}
        >
          <Prose>
            <p>
              {t({
                en: 'Three different paths depending on what changed, and one single way of knowing what is actually running.',
                es: 'Tres caminos distintos según qué se toca, y una sola forma de saber qué está corriendo de verdad.',
              })}
            </p>
          </Prose>
          <Figure
            label={t(titleOf('deploy'))}
            caption={t({
              en: (
                <>
                  Both Android workflows run <Code>aapt2 dump permissions</Code> on the finished
                  artefact: what Play evaluates is the <em>merged</em> manifest, and any library in the
                  dependency tree can reinject a permission that is not in your own. Finding that out
                  in Play cost two rejections.
                </>
              ),
              es: (
                <>
                  Los dos workflows de Android corren <Code>aapt2 dump permissions</Code> sobre el
                  artefacto ya construido: lo que Play evalúa es el manifest <em>fusionado</em>, y
                  cualquier librería del árbol puede reinyectar un permiso que no está en el manifest
                  propio. Descubrirlo en Play costó dos rechazos.
                </>
              ),
            })}
          >
            <DeployDiagram />
          </Figure>
          <Why label={t({ en: 'How a deploy is verified', es: 'Cómo se verifica un deploy' })}>
            <p>
              {t({
                en: (
                  <>
                    Not by grepping the DLL or checking the container’s date. You ask for the SHA —{' '}
                    <Code>GET /version</Code> on the API, <Code>GET /version.json</Code> on the front —
                    and compare it with the commit. Everything else is guessing.
                  </>
                ),
                es: (
                  <>
                    No se grepea el DLL ni se mira la fecha del contenedor. Se pide el SHA —
                    <Code>GET /version</Code> en la API, <Code>GET /version.json</Code> en el front— y
                    se compara contra el commit. Todo lo demás es adivinar.
                  </>
                ),
              })}
            </p>
          </Why>
        </Block>

        {/* 08 */}
        <Block id="stack" index="08" title={t(titleOf('stack'))}>
          <DataTable
            caption={t(titleOf('stack'))}
            head={[
              t({ en: 'Layer', es: 'Capa' }),
              t({ en: 'What is used', es: 'Qué se usa' }),
              t({ en: 'Why', es: 'Por qué' }),
            ]}
            rows={[
              [
                'Front',
                t({
                  en: 'React 19, TypeScript, Vite, Leaflet, React Router, SignalR client',
                  es: 'React 19, TypeScript, Vite, Leaflet, React Router, cliente de SignalR',
                }),
                t({ en: 'Route-level code splitting; Leaflet over MapTiler tiles', es: 'Code splitting por ruta; Leaflet sobre tiles de MapTiler' }),
              ],
              [
                t({ en: 'Mobile', es: 'Móvil' }),
                'Capacitor 8 (Android)',
                t({ en: 'One codebase; native features through plugins. Published on Google Play', es: 'Un solo código; lo nativo entra por plugins. Publicada en Google Play' }),
              ],
              [
                'API',
                '.NET 10, Clean Architecture, MediatR, FluentValidation, Serilog',
                t({ en: 'Use cases by module; the domain depends on nothing', es: 'Casos de uso por módulo; el dominio no depende de nadie' }),
              ],
              [
                t({ en: 'Data', es: 'Datos' }),
                'PostgreSQL 16 + PostGIS + pgvector, EF Core',
                t({ en: 'Real spatial queries — proximity, radius, viewport — not approximations', es: 'Consultas espaciales reales —cercanía, radio, viewport—, no aproximaciones' }),
              ],
              [
                t({ en: 'Real time', es: 'Tiempo real' }),
                t({ en: 'SignalR, 3 hubs', es: 'SignalR, 3 hubs' }),
                t({ en: 'The group you broadcast to is the access control', es: 'El grupo al que se difunde es el control de acceso' }),
              ],
              [
                t({ en: 'AI', es: 'IA' }),
                t({ en: 'Semantic Kernel + gpt-4o-mini, 10 tools', es: 'Semantic Kernel + gpt-4o-mini, 10 herramientas' }),
                t({ en: 'The model chooses; the database answers', es: 'El modelo elige; la base contesta' }),
              ],
              [
                t({ en: 'Routing', es: 'Ruteo' }),
                t({ en: 'OSRM (default), OpenRouteService, Nominatim', es: 'OSRM (default), OpenRouteService, Nominatim' }),
                t({ en: 'No per-request cost; routes and geocoding cached in memory', es: 'Sin costo por request; caché de rutas y geocoding en memoria' }),
              ],
              [
                'Infra',
                t({ en: 'OCI Ampere A1 (ARM) with podman, Cloudflare Pages + R2, Sentry, UptimeRobot', es: 'OCI Ampere A1 (ARM) con podman, Cloudflare Pages + R2, Sentry, UptimeRobot' }),
                t({ en: 'One VM, which is what the project’s size justifies; no Kubernetes', es: 'Una VM que el tamaño del proyecto justifica; nada de Kubernetes' }),
              ],
              [
                'CI/CD',
                t({ en: 'GitHub Actions: tests, debug APK, signed AAB', es: 'GitHub Actions: tests, APK debug, AAB firmado' }),
                t({ en: 'Failing in CI costs a build; finding out in Play costs a whole review', es: 'Cortar en CI cuesta un build; descubrirlo en Play cuesta una revisión entera' }),
              ],
            ]}
          />
          <p className="text-muted max-w-3xl font-mono text-xs leading-relaxed">
            {t({
              en: 'Everything on this page was read from the code on 15 Sep 2026 — Program.cs, the hubs, the workers, appsettings.json and the workflows. Where the drawing and the code disagree, the code wins.',
              es: 'Todo lo que dice esta página está leído del código el 15/09/2026 — Program.cs, los hubs, los workers, appsettings.json y los workflows. Ante una diferencia entre el dibujo y el código, manda el código.',
            })}
          </p>
        </Block>
      </TechContext>
    </DeepDiveShell>
  )
}
