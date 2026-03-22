import type { Magi, Wallet } from '@aioha/magi'
import type { EIP1193Provider } from '../../types.js'

export type { EIP1193Provider }

export const MagiCtxKey = Symbol('MagiContext')

export interface MagiContext {
  magi: Magi
  user: string | undefined
  wallet: Wallet | undefined
}
