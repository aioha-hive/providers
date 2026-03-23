import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import type { Aioha } from '@aioha/aioha'
import { Magi, Wallet } from '@aioha/magi'
import { useConnectorClient } from 'wagmi'

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

export const MagiProvider = ({ magi, aioha, children }: { magi: Magi; aioha?: Aioha; children: ReactNode }) => {
  const [user, setUser] = useState<string | undefined>(magi.getUser())
  const [wallet, setWallet] = useState<Wallet | undefined>(magi.getWallet())
  const update = () => {
    setUser(magi.getUser())
    setWallet(magi.getWallet())
  }
  const updateHive = () => {
    if (magi.getWallet() === Wallet.Hive) setUser(magi.getUser())
  }
  useEffect(() => {
    magi.on('wallet_changed', update)
    if (aioha) {
      aioha.on('connect', updateHive)
      aioha.on('disconnect', updateHive)
      aioha.on('account_changed', updateHive)
    }

    return () => {
      magi.off('wallet_changed', update)
      if (aioha) {
        aioha.off('connect', updateHive)
        aioha.off('disconnect', updateHive)
        aioha.off('account_changed', updateHive)
      }
    }
  }, [])
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
