import type { InjectionKey, Ref } from 'vue'
import { Magi, Wallet } from '@aioha/magi'

// Create injection key for type safety
export const MagiCtx: InjectionKey<Magi> = Symbol('MagiContext')
export const MagiUserCtx: InjectionKey<Ref<string | undefined>> = Symbol('MagiUser')
export const MagiWalletCtx: InjectionKey<Ref<Wallet | undefined>> = Symbol('MagiWallet')
