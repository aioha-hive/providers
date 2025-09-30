import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Aioha, Providers, PersistentLoginProvs } from '@aioha/aioha'

export const AiohaContext = createContext<
  | {
      aioha: Aioha
      user?: string
      provider?: Providers
      otherUsers: PersistentLoginProvs
    }
  | undefined
>(undefined)

export const AiohaProvider = ({ aioha, children }: { aioha: Aioha; children: ReactNode }) => {
  const [user, setUser] = useState<string | undefined>(aioha.getCurrentUser())
  const [provider, setProvider] = useState<Providers | undefined>(aioha.getCurrentProvider())
  const [otherUsers, setOtherUsers] = useState<PersistentLoginProvs>(aioha.getOtherLogins())
  const update = () => {
    setUser(aioha.getCurrentUser())
    setProvider(aioha.getCurrentProvider())
    setOtherUsers(aioha.getOtherLogins())
  }
  useEffect(() => {
    aioha.on('connect', update)
    aioha.on('disconnect', update)
    aioha.on('account_changed', update)

    return () => {
      aioha.off('connect', update)
      aioha.off('disconnect', update)
      aioha.off('account_changed', update)
    }
  }, [])
  return (
    <AiohaContext.Provider
      value={{
        aioha,
        user,
        provider,
        otherUsers
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
