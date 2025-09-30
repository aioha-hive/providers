import type { InjectionKey } from 'vue'
import { Aioha, Providers, PersistentLoginProvs } from '@aioha/aioha'

// Define the context type
export interface AiohaContext {
  aioha: Aioha
  user?: string
  provider?: Providers
  otherUsers: PersistentLoginProvs
}

// Create injection key for type safety
export const AiohaContextKey: InjectionKey<AiohaContext> = Symbol('AiohaContext')
