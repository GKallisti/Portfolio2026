import { handleAgentRequest, type Env } from './agent'
import { isDeepDivePath } from '../src/content/pages'

/**
 * Worker entry point.
 *
 * Cloudflare merged Pages into Workers, so this project deploys as a Worker
 * with a static-asset binding rather than as a Pages project. That changes one
 * thing structurally: there is no `functions/` directory convention doing the
 * routing for us, so the routing is explicit here.
 *
 * Everything that is not `/api/*` is handed to the asset binding, which serves
 * the Vite build in `dist/`.
 */
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    if (url.pathname === '/api/agent') {
      if (request.method !== 'POST') {
        // Explicit, so a stray GET gets a real answer instead of falling
        // through to the asset handler and returning a confusing 405.
        return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
          status: 405,
          headers: { 'content-type': 'application/json', allow: 'POST' },
        })
      }
      return handleAgentRequest(request, env)
    }

    // Any other /api/ path is a client bug, not a page — answering with the
    // HTML shell would make it look like a successful request.
    if (url.pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
    }

    // In-depth pages are client-side routes: there is no file at that path,
    // so hand over the app shell and let the store read the URL. Matched
    // against the known list rather than falling back for every unknown path,
    // so a mistyped URL is still a 404 and not a 200 that renders the home page.
    if ((request.method === 'GET' || request.method === 'HEAD') && isDeepDivePath(url.pathname)) {
      return env.ASSETS.fetch(new Request(new URL('/', url), request))
    }

    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
