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

## 4. Rate limiting (opcional pero recomendado)

Sin esto, cualquiera puede mandarle mensajes al asistente todo el día y lo
pagás vos. Con esto, cada IP tiene 12 mensajes cada 5 minutos.

1. **Workers & Pages** → **KV** → **Create a namespace**
2. Nombre: `portfolio-rate-limit` → **Add**
3. Volvé a tu Worker → **Settings** → **Bindings** → **Add** →
   **KV namespace**

   | Campo | Valor |
   |---|---|
   | Variable name | `RATE_LIMIT` |
   | KV namespace | `portfolio-rate-limit` |

4. **Save** y volvé a hacer **Retry deployment**

El nombre de la variable tiene que ser exactamente `RATE_LIMIT`. Si no
coincide, el Worker no lo encuentra y simplemente no limita nada (no rompe).

---

## 5. Dominio propio

1. Comprá el dominio (si es `.com.ar`, se compra en **NIC Argentina**)
2. En Cloudflare: **Websites** → **Add a site** → escribí el dominio
3. Cloudflare te va a dar dos **nameservers**. Entrá al panel donde compraste
   el dominio y reemplazá los nameservers por esos dos.
   - En NIC.ar: *Mis dominios* → el dominio → *Delegaciones* → editar
4. La propagación tarda entre unos minutos y 24 horas
5. Cuando Cloudflare marque el dominio como **Active**: volvé a tu Worker →
   **Settings** → **Domains & Routes** → **Add** → **Custom domain**

El certificado HTTPS lo emite Cloudflare solo, no hay que hacer nada.

### Después de conectar el dominio

La imagen que se ve al compartir el link tiene el dominio impreso. Actualizala:

1. Abrí `scripts/make-og.py` y cambiá `DOMAIN` por el dominio nuevo
2. `pip install pillow fonttools brotli` (una sola vez)
3. `python scripts/make-og.py`
4. Commit del `public/og.png` nuevo y redeploy

Aprovechá y pasá `og:image` en `index.html` a la URL absoluta
(`https://tudominio.com.ar/og.png`). Con la ruta relativa funciona en la
mayoría de los casos, pero algunos scrapers — LinkedIn entre ellos — son más
confiables con la absoluta.

Para verificar cómo quedó antes de publicar en LinkedIn, pegá la URL en el
**Post Inspector** de LinkedIn: fuerza un re-scrapeo y te muestra la tarjeta
real. Es útil porque LinkedIn cachea agresivamente y, si la ve rota una vez,
puede quedarse con esa versión un buen rato.

---

## Costos

- **Cloudflare Workers**: gratis para este tráfico (100.000 requests por día
  en el plan free)
- **KV**: gratis hasta 100.000 lecturas por día
- **OpenAI**: es lo único que se paga, y sólo cuando alguien usa el asistente.
  El rate limiting del paso 4 es lo que evita sorpresas.
