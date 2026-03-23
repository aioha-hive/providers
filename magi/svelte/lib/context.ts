import type { Magi, Wallet } from '@aioha/magi'

export const MagiCtxKey = Symbol('MagiContext')

export interface MagiContext {
  magi: Magi
  user: string | undefined
  wallet: Wallet | undefined
}
