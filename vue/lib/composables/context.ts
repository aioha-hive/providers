import type { InjectionKey, Ref } from 'vue'
import { Aioha, Providers, PersistentLoginProvs } from '@aioha/aioha'

// Create injection key for type safety
export const AiohaCtx: InjectionKey<Aioha> = Symbol('AiohaContext')
export const UserCtx: InjectionKey<Ref<string | undefined>> = Symbol('AiohaUser')
export const ProviderCtx: InjectionKey<Ref<Providers | undefined>> = Symbol('AiohaProvider')
export const OtherLoginCtx: InjectionKey<Ref<PersistentLoginProvs>> = Symbol('AiohaOtherLogin')
