import { inject, Ref } from 'vue'
import type { Aioha, Providers, PersistentLoginProvs } from '@aioha/aioha'
import { AiohaCtx, UserCtx, ProviderCtx, OtherLoginCtx } from './context.js'

export interface AiohaContext {
  aioha: Aioha
  user?: Ref<string | undefined>
  provider?: Ref<Providers | undefined>
  otherUsers: Ref<PersistentLoginProvs>
}

export const useAioha = (): AiohaContext => {
  const aioha = inject(AiohaCtx)
  const user = inject(UserCtx)
  const provider = inject(ProviderCtx)
  const otherUsers = inject(OtherLoginCtx)
  if (!aioha || !user || !provider || !otherUsers) {
    throw new Error('useAioha must be used within an AiohaProvider')
  }
  return { aioha, user, provider, otherUsers }
}
