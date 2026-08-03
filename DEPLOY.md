# Desplegar en Cloudflare

Guía paso a paso, pensada para hacerse una sola vez.

---

## 1. Subir el proyecto a GitHub

Cloudflare se conecta a un repositorio. Si `portfolio-v2/` todavía no
está en GitHub, creá un repo y subilo. Confirmá antes que `.gitignore` esté
haciendo su trabajo:

```bash
git status --short
```

**No debe aparecer** `.env`, `.dev.vars`, `dist/` ni `node_modules/`. Si aparece
alguno, frená y revisá el `.gitignore` antes de commitear — una API key en el
historial de git no se borra con un commit posterior.

---

## 2. Crear el proyecto en Cloudflare

Cloudflare unificó Pages dentro de Workers: los proyectos nuevos se despliegan
como **Worker con assets estáticos** y quedan en `*.workers.dev`. Este proyecto
está configurado para eso — `wrangler.jsonc` en la raíz define el Worker
(`worker/index.ts`) y el directorio de assets (`dist`).

1. Entrá a **dash.cloudflare.com** → menú lateral **Workers & Pages**
2. **Create** → **Import a repository** → elegí el repo
3. En la configuración de build:

   | Campo | Valor |
   |---|---|
   | Build command | `npm run build` |
   | Deploy command | `npx wrangler deploy` |
   | Root directory | vacío (el repo *es* el proyecto) |

4. **Create and deploy**

El primer deploy va a funcionar, pero el asistente va a estar en modo local
hasta que agregues la key en el paso siguiente. Eso es esperable.

> **Cómo saber si el Worker está corriendo de verdad.** Si el sitio carga pero
> el asistente siempre responde *"El modelo no está disponible"*, probá:
>
> ```powershell
> curl.exe -X POST https://TU-DOMINIO/api/agent -H "content-type: application/json" -d "{}"
> ```
>
> **Ojo con PowerShell: `curl` ahí es un alias de `Invoke-WebRequest`**, que no
> entiende `-H` ni `-d` y falla con un error de parámetros que no tiene nada que
> ver con el sitio. Escribí `curl.exe` con la extensión — ese es el curl de
> verdad, y viene con Windows.
>
> Un **400** significa que el Worker corre (rechazó el body vacío, que es lo
> correcto). Un **405** significa que se está sirviendo el sitio como assets
> estáticos y el Worker no se está ejecutando: revisá que `wrangler.jsonc` esté
> en la raíz del repo y que el deploy command sea `npx wrangler deploy`.
>
> Un **503** significa que el Worker corre pero no ve la API key. La respuesta
> incluye `bindings_visible` con los nombres que sí ve, que es lo que distingue
> un typo de un secret que quedó en otro lado.

---

## 3. Poner la API key de OpenAI  ← lo importante

Cloudflare tiene **dos cosas distintas llamadas secret**, y no son
intercambiables. El Worker acepta cualquiera de las dos, pero cada una se
configura diferente.

### Opción A — Secrets Store (a nivel cuenta)

Es la que está configurada en este repo. El secret vive en un almacén central
reutilizable, y el Worker lo lee de forma asíncrona.

1. **Storage & databases** → **Secrets Store** → **Create secret**
   - Name: `OPENAI_API_KEY`
   - Value: tu key
2. Copiá el **Store ID** que aparece a la derecha
3. Verificá que coincida con el `store_id` en `wrangler.jsonc`

> ⚠️ **Crear el secret en el Store no alcanza.** Sin el bloque
> `secrets_store_secrets` en `wrangler.jsonc`, el Worker no lo ve — y el panel
> lo muestra como Active igual, que es lo confuso. El binding es lo que los
> conecta.

### Opción B — Worker secret (más simple)

1. En tu Worker: **Settings** → **Variables and secrets** → **Add**

   | Campo | Valor |
   |---|---|
   | Type | **Secret** (no "Text") |
   | Variable name | `OPENAI_API_KEY` |
   | Value | tu key, la que empieza con `sk-` |

2. **Save**

Si elegís esta, borrá el bloque `secrets_store_secrets` de `wrangler.jsonc`.

### El modelo

Opcional, como **Text** (no secret), en Variables and secrets:

| Variable name | Value |
|---|---|
| `AGENT_MODEL` | el id de modelo que quieras usar |

Por defecto usa `gpt-4.1-mini`. El agente elige una o dos acciones de un
catálogo de nueve y escribe una frase — un modelo grande ahí es plata y
latencia de más. Para ver qué modelos tenés disponibles:

```powershell
curl.exe https://api.openai.com/v1/models -H "Authorization: Bearer TU_API_KEY"
```

> ⚠️ **Un secret nuevo no se aplica solo.** Después de guardarlo hay que
> redeployar: **Deployments** → el último → **Retry deployment**, o pushear
> cualquier commit. Si no, el Worker sigue corriendo sin la key y el agente
> queda en modo local sin avisarte.

### Verificar que quedó bien

Abrí el sitio, abrí el asistente y escribí cualquier cosa. Si la respuesta
**no** dice *"El modelo no está disponible ahora…"*, la key está funcionando.

Si sigue en modo local, mirá los logs: **Workers & Pages** → tu Worker →
**Logs** → **Begin log stream**, y mandá otro mensaje. Vas a ver el error real
(lo más común es un id de modelo que tu cuenta no puede usar). La observabilidad
ya viene activada desde `wrangler.jsonc`.

---

## 4. Rate limiting

**Ya está configurado, no tenés que hacer nada.**

Cada IP puede mandar 8 mensajes por minuto al asistente. Alcanza de sobra para
alguien que está leyendo la página y hace que no tenga sentido automatizar
pedidos contra tu cuenta de OpenAI.

Usa el limitador nativo de Workers, declarado en `wrangler.jsonc`:

```jsonc
"ratelimits": [
  { "name": "AGENT_LIMITER", "namespace_id": "1001",
    "simple": { "limit": 8, "period": 60 } }
]
```

El contador vive en el runtime del edge, así que no hay namespace que crear ni
binding que conectar en el panel, y no genera lecturas ni escrituras
facturables. `period` sólo acepta 10 o 60 segundos.

Para cambiar el límite, editá `limit` y pusheá.

### Probarlo sin gastar tokens

El límite se chequea **antes** de validar el cuerpo del mensaje, así que podés
dispararlo con pedidos vacíos que nunca llegan a OpenAI:

```powershell
1..10 | ForEach-Object { curl.exe -s -o NUL -w "%{http_code}`n" -X POST https://TU-DOMINIO/api/agent -H "content-type: application/json" -d "{}" }
```

Deberías ver varios `400` y después `429`.

---

## 5. Dominio propio

**Dominio comprado: `aidev-gg.ar`.** Falta conectarlo a Cloudflare — esta
parte es manual, no la puedo hacer por vos.

1. En Cloudflare: **Websites** → **Add a site** → escribí `aidev-gg.ar`
2. Cloudflare te va a dar dos **nameservers**. Entrá al panel donde compraste
   el dominio y reemplazá los nameservers por esos dos.
   - En NIC.ar: *Mis dominios* → el dominio → *Delegaciones* → editar
3. La propagación tarda entre unos minutos y 24 horas
4. Cuando Cloudflare marque el dominio como **Active**: volvé a tu Worker
   `portfolio2026` → **Settings** → **Domains & Routes** → **Add** →
   **Custom domain** → escribí `aidev-gg.ar`
5. Repetí el paso 4 con `www.aidev-gg.ar` si querés que ese también funcione

El certificado HTTPS lo emite Cloudflare solo, no hay que hacer nada.

### Ya hecho de este lado

El `og:image` y `og:url` en `index.html`, y el `DOMAIN` en
`scripts/make-og.py`, ya apuntan a `https://aidev-gg.ar` — no hace falta
tocarlos. `public/og.png` ya está regenerado con el dominio nuevo impreso.

Verificá que **el nombre coincida exacto**: si el custom domain en Cloudflare
queda como `www.aidev-gg.ar` mientras el HTML dice `aidev-gg.ar` (o viceversa),
la tarjeta al compartir el link va a fallar aunque el sitio cargue bien.

### Verificar antes de compartir en LinkedIn

Una vez que el dominio esté conectado y propagado:

```powershell
curl.exe -I https://aidev-gg.ar/og.png
```

Un `200` confirma que la imagen se sirve desde el dominio nuevo. Después pegá
`https://aidev-gg.ar` en el **Post Inspector** de LinkedIn: fuerza un
re-scrapeo y te muestra la tarjeta real. Es útil porque LinkedIn cachea
agresivamente y, si la ve rota una vez, puede quedarse con esa versión un buen
rato.

---

## Costos

- **Cloudflare Workers**: gratis para este tráfico (100.000 requests por día
  en el plan free)
- **KV**: gratis hasta 100.000 lecturas por día
- **OpenAI**: es lo único que se paga, y sólo cuando alguien usa el asistente.
  El rate limiting del paso 4 es lo que evita sorpresas.
