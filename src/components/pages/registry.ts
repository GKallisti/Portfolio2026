import { lazy, type ComponentType } from 'react'
import type { DeepDiveId } from '@/content/pages'

/**
 * In-depth pages are code-split: most visitors never open one, and between
 * them they carry more copy and SVG than the rest of the site. Kept as plain
 * loaders so a link can start fetching on hover, before the click lands.
 */
export const loadDeepDive: Record<DeepDiveId, () => Promise<{ default: ComponentType }>> = {
  'enmoto-product': () => import('./enmoto/EnMotoProduct'),
  'enmoto-architecture': () => import('./enmoto/EnMotoArchitecture'),
}

export const DeepDivePages: Record<DeepDiveId, ComponentType> = {
  'enmoto-product': lazy(loadDeepDive['enmoto-product']),
  'enmoto-architecture': lazy(loadDeepDive['enmoto-architecture']),
}
