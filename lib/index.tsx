import { createContext, ReactNode, useContext, useState } from 'react'
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
  const [user, setUser] = useState<string | undefined>(aioha.getCurrentUser())
  const [provider, setProvider] = useState<Providers | undefined>(aioha.getCurrentProvider())
  const login = async (provider: Providers, username: string, options: LoginOptions): Promise<LoginResult> => {
    const result = await aioha.login(provider, username, options)
    if (result.success) {
      setUser(aioha.getCurrentUser())
      setProvider(aioha.getCurrentProvider())
    }
    return result
  }
  const logout = async (): Promise<void> => {
    try {
      await aioha.logout()
    } catch {}
    setUser(undefined)
    setProvider(undefined)
  }
  return (
    <AiohaContext.Provider
      value={{
        aioha,
        user,
        provider,
        login,
        logout
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
