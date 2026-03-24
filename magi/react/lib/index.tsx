import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { Magi, Wallet } from '@aioha/magi'
import { useConnectorClient } from 'wagmi'
import { AiohaContext } from '@aioha/providers/react'

export const MagiContext = createContext<
  | {
      magi: Magi
      user?: string
      wallet?: Wallet
    }
  | undefined
>(undefined)

const WagmiEthSync = ({ magi, onUpdate }: { magi: Magi; onUpdate: () => void }) => {
  const { data: walletClient } = useConnectorClient()

  useEffect(() => {
    if (!!walletClient) {
      magi.setViem(walletClient as any)
      magi.setWallet(Wallet.Ethereum)
      onUpdate()
    } else {
      magi.setWallet()
      onUpdate()
    }
  }, [walletClient])

  return null
}

export const MagiProvider = ({ magi, children }: { magi: Magi; children: ReactNode }) => {
  const aiohaCtx = useContext(AiohaContext)
  const [user, setUser] = useState<string | undefined>(magi.getUser())
  const [wallet, setWallet] = useState<Wallet | undefined>(magi.getWallet())
  const update = () => {
    setUser(magi.getUser())
    setWallet(magi.getWallet())
  }
  useEffect(() => {
    magi.on('wallet_changed', update)
    return () => {
      magi.off('wallet_changed', update)
    }
  }, [])
  useEffect(() => {
    if (aiohaCtx?.user) {
      magi.setWallet(Wallet.Hive)
    } else {
      magi.setWallet()
    }
    update()
  }, [aiohaCtx?.user])
  return (
    <MagiContext.Provider
      value={{
        magi,
        user,
        wallet
      }}
    >
      <WagmiEthSync magi={magi} onUpdate={update} />
      {children}
    </MagiContext.Provider>
  )
}

export const useMagi = () => {
  const ctx = useContext(MagiContext)
  if (!ctx) throw new Error('useMagi must be used within a MagiProvider')
  return ctx
}
