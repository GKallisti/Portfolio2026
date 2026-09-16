import { createContext } from 'react'

/**
 * Technologies a visitor can single out across every diagram on a page.
 * Kept apart from the drawing components so that file exports components only.
 */
export const TECHS = [
  { id: 'react', label: 'React' },
  { id: 'capacitor', label: 'Capacitor' },
  { id: 'dotnet', label: '.NET' },
  { id: 'signalr', label: 'SignalR' },
  { id: 'postgres', label: 'PostGIS' },
  { id: 'openai', label: 'OpenAI' },
  { id: 'cloudflare', label: 'Cloudflare' },
  { id: 'fcm', label: 'FCM' },
] as const

export type Tech = (typeof TECHS)[number]['id']

/** The technology currently singled out, or null when nothing is. */
export const TechContext = createContext<Tech | null>(null)

/** Marker ids for the diagram currently rendering, so arrows find their heads. */
export const MarkerContext = createContext<{ plain: string; accent: string }>({
  plain: '',
  accent: '',
})
