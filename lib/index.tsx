import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Aioha, Providers } from '@aioha/aioha'
import { LoginOptions, LoginResult } from '@aioha/aioha/build/types'

export const AiohaContext = createContext<
  | {
      aioha: Aioha
      user?: string
      provider?: Providers
      login: (provider: Providers, username: string, options: LoginOptions) => Promise<LoginResult>
      logout: () => Promise<void>
    }
  | undefined
>(undefined)

export const AiohaProvider = ({ aioha, children }: { aioha: Aioha; children: ReactNode }) => {
  const getUser = aioha.getCurrentUser
  const getProv = aioha.getCurrentProvider
  const [user, setUser] = useState<string | undefined>(getUser())
  const [provider, setProvider] = useState<Providers | undefined>(getProv())
  const update = () => {
    setUser(getUser())
    setProvider(getProv())
  }
  useEffect(() => {
    aioha.on('connect', update)
    aioha.on('disconnect', update)
    aioha.on('account_changed', update)
  }, [])
  return (
    <AiohaContext.Provider
      value={{
        aioha,
        user,
        provider,
        login: aioha.login,
        logout: aioha.logout // may be removed in the future, use aioha.login() and aioha.logout() instead
      }}
    >
      {children}
    </AiohaContext.Provider>
  )
}

export const useAioha = () => {
  const ctx = useContext(AiohaContext)
  if (!ctx) throw new Error('useAioha must be used within an AiohaProvider')
  return ctx
}
