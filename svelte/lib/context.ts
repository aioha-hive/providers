import type { Aioha, PersistentLoginProvs, Providers } from '@aioha/aioha'

export const AiohaCtxKey = Symbol('AiohaContext')

export interface AiohaContext {
  aioha: Aioha
  user: string | undefined
  provider: Providers | undefined
  otherUsers: PersistentLoginProvs
}
