import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Aioha, Providers } from '@aioha/aioha'
import { LoginOptions, LoginResult } from '@aioha/aioha/build/types'

export const AiohaContext = createContext<
  | {
      aioha: Aioha
      user?: string
      provider?: Providers
    }
  | undefined
>(undefined)

export const AiohaProvider = ({ aioha, children }: { aioha: Aioha; children: ReactNode }) => {
  const [user, setUser] = useState<string | undefined>(aioha.getCurrentUser())
  const [provider, setProvider] = useState<Providers | undefined>(aioha.getCurrentProvider())
  const update = () => {
    setUser(aioha.getCurrentUser())
    setProvider(aioha.getCurrentProvider())
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
        provider
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
