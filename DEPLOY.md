# Desplegar en Cloudflare Pages

Guía paso a paso, pensada para hacerse una sola vez.

---

## 1. Subir el proyecto a GitHub

Cloudflare Pages se conecta a un repositorio. Si `portfolio-v2/` todavía no
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

1. Entrá a **dash.cloudflare.com** → menú lateral **Workers & Pages**
2. **Create** → pestaña **Pages** → **Connect to Git**
3. Autorizá GitHub y elegí el repositorio
4. En la pantalla de configuración de build:

   | Campo | Valor |
   |---|---|
   | Framework preset | `None` (o Vite, da igual) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |
   | Root directory | `portfolio-v2` — **sólo si** el repo tiene el proyecto en un subdirectorio |

5. **Save and Deploy**

El primer deploy va a funcionar, pero el asistente va a estar en modo local
hasta que agregues la key en el paso siguiente. Eso es esperable.

---

## 3. Poner la API key de OpenAI  ← lo importante

La key va como **secret**, no como variable normal: un secret queda oculto
después de guardarlo y no se puede volver a leer desde el panel.

1. En tu proyecto de Pages: **Settings** → **Variables and secrets**
2. Asegurate de estar en el entorno **Production** (hay un selector
   Production / Preview; conviene agregarla en los dos si querés que las
   ramas de preview también tengan agente)
3. **Add** →

   | Campo | Valor |
   |---|---|
   | Type | **Secret** (no "Text") |
   | Variable name | `OPENAI_API_KEY` |
   | Value | tu key, la que empieza con `sk-` |

4. **Save**
5. Opcional, en el mismo lugar, como **Text** (no secret):

   | Variable name | Value |
   |---|---|
   | `AGENT_MODEL` | el id de modelo que quieras usar |

> ⚠️ **Un secret nuevo no se aplica solo.** Después de guardarlo tenés que ir a
> **Deployments** → el último deploy → **Retry deployment**. Si no, la función
> sigue corriendo sin la key y el agente queda en modo local sin avisarte.

### Verificar que quedó bien

Abrí el sitio, abrí el asistente y escribí cualquier cosa. Si la respuesta
**no** dice *"El modelo no está disponible ahora…"*, la key está funcionando.

Si sigue en modo local, mirá los logs: **Workers & Pages** → tu proyecto →
**Logs** → **Begin log stream**, y mandá otro mensaje. Vas a ver el error real
(lo más común es un id de modelo que tu cuenta no puede usar).

---

## 4. Rate limiting (opcional pero recomendado)

Sin esto, cualquiera puede mandarle mensajes al asistente todo el día y lo
pagás vos. Con esto, cada IP tiene 12 mensajes cada 5 minutos.

1. **Workers & Pages** → **KV** → **Create a namespace**
2. Nombre: `portfolio-rate-limit` → **Add**
3. Volvé a tu proyecto de Pages → **Settings** → **Bindings** → **Add** →
   **KV namespace**

   | Campo | Valor |
   |---|---|
   | Variable name | `RATE_LIMIT` |
   | KV namespace | `portfolio-rate-limit` |

4. **Save** y volvé a hacer **Retry deployment**

El nombre de la variable tiene que ser exactamente `RATE_LIMIT`. Si no
coincide, la función no lo encuentra y simplemente no limita nada (no rompe).

---

## 5. Dominio propio

1. Comprá el dominio (si es `.com.ar`, se compra en **NIC Argentina**)
2. En Cloudflare: **Websites** → **Add a site** → escribí el dominio
3. Cloudflare te va a dar dos **nameservers**. Entrá al panel donde compraste
   el dominio y reemplazá los nameservers por esos dos.
   - En NIC.ar: *Mis dominios* → el dominio → *Delegaciones* → editar
4. La propagación tarda entre unos minutos y 24 horas
5. Cuando Cloudflare marque el dominio como **Active**: volvé a tu proyecto de
   Pages → **Custom domains** → **Set up a domain** → escribí el dominio

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

- **Cloudflare Pages**: gratis para este tráfico (500 builds/mes, requests
  ilimitados en el plan free)
- **KV**: gratis hasta 100.000 lecturas por día
- **OpenAI**: es lo único que se paga, y sólo cuando alguien usa el asistente.
  El rate limiting del paso 4 es lo que evita sorpresas.
