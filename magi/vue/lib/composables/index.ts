import { inject, Ref } from 'vue'
import type { Magi, Wallet } from '@aioha/magi'
import { MagiCtx, MagiUserCtx, MagiWalletCtx } from './context.js'

export interface MagiContext {
  magi: Magi
  user?: Ref<string | undefined>
  wallet: Ref<Wallet | undefined>
}

export const useMagi = (): MagiContext => {
  const magi = inject(MagiCtx)
  const user = inject(MagiUserCtx)
  const wallet = inject(MagiWalletCtx)
  if (!magi || !user || !wallet) {
    throw new Error('useMagi must be used within a MagiProvider')
  }
  return { magi, user, wallet }
}
