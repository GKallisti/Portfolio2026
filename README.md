# Portfolio — Gisella Gonzalez

Personal site for an AI Integration Specialist, whose assistant genuinely
operates the page rather than describing it.

## The idea

The agent in the corner is the point of the site. Ask it to filter the
projects, switch language, change the theme or jump to a section, and it does
— through a typed tool catalog, with its pipeline visible while it runs. It is
a miniature of the router → planner → executor architecture behind the OTM
agent described in the work section, so the page demonstrates the thing it
claims.

## Stack

React 19 · TypeScript · Vite · Tailwind 4 · Zod · Cloudflare Pages Functions ·
OpenAI API

## Running it

```bash
npm install
npm run dev
```

The site works fully without an API key — the assistant falls back to a local
keyword router, and every command still executes. To run the real agent
locally you need the Cloudflare function, which Vite's dev server does not
serve:

```bash
npm run build && npx wrangler pages dev dist
```

Copy `.env.example` to `.dev.vars` and set `OPENAI_API_KEY` first.

## Deploying (Cloudflare Pages)

Step-by-step walkthrough in [DEPLOY.md](./DEPLOY.md). The short version:

- Build command: `npm run build`
- Output directory: `dist`
- Set `OPENAI_API_KEY` as a **secret** under Settings → Variables and Secrets,
  then re-run the deployment — a new secret does not apply to an existing one
- Optionally bind a KV namespace as `RATE_LIMIT` to enable per-IP rate limiting
  (the function runs fine without it, just uncapped)

`OPENAI_API_KEY` is deliberately not `VITE_`-prefixed: anything with that
prefix is inlined into the client bundle and would be public.

**Check `AGENT_MODEL` before the first deploy.** The default is `gpt-5`; which
model ids your account can call varies by tier, and a 404 there just drops the
agent into its offline fallback rather than surfacing an error to the visitor.

## Layout

```
functions/api/agent.ts   Cloudflare function: holds the API key, streams NDJSON
src/agent/catalog.ts     The action catalog — one Zod schema per action, which
                         produces both the model's tool definitions and the
                         runtime validation. Isomorphic; imported by both sides.
src/agent/useAgent.ts    Client loop and pipeline stages
src/agent/local.ts       Offline keyword router used when the model is away
src/store/ui.tsx         UI state; the agent's execution target
src/content/             All copy, bilingual via `Localized<T>`
```

### Adding a capability to the agent

Add an entry to `actionCatalog` in `src/agent/catalog.ts` and handle it in
`applyAction` in `src/store/ui.tsx`. The tool definition, the JSON schema and
the input validation all follow from the one Zod schema — there is no second
place to update.

## Two things worth knowing before editing

**Theme switching and CSS transitions.** A CSS transition on a colour that
resolves through a custom property never re-targets when that variable changes
— the element stays stuck on the old theme's colour. `[data-theme-switching]`
in `index.css` freezes transitions for the frame of the swap to avoid it. Don't
remove it, and prefer explicit transition properties over `transition-all`.

**`@theme inline` is load-bearing.** Without `inline`, Tailwind emits an
intermediate `--color-*` layer whose computed value descendants inherit, and
flipping the theme repaints the body while leaving cards on the old palette.

## Accessibility

Every foreground/background pair is checked against WCAG 2.1 AA in both themes
and all five accents. If you change a colour, re-check it — measure the
rendered page rather than the palette, since transitions and layering are where
it actually breaks.
