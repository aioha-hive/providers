import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import type { Aioha } from '@aioha/aioha'
import { Magi, Wallet } from '@aioha/magi'
import type { EIP1193Provider } from '../../types.js'

export const MagiContext = createContext<
  | {
      magi: Magi
      user?: string
      wallet?: Wallet
    }
  | undefined
>(undefined)

export const MagiProvider = ({
  magi,
  aioha,
  eip1193,
  children
}: {
  magi: Magi
  aioha?: Aioha
  eip1193?: EIP1193Provider
  children: ReactNode
}) => {
  const [user, setUser] = useState<string | undefined>(magi.getUser())
  const [wallet, setWallet] = useState<Wallet | undefined>(magi.getWallet())
  const update = () => {
    setUser(magi.getUser())
    setWallet(magi.getWallet())
  }
  const updateHive = () => {
    if (magi.getWallet() === Wallet.Hive) setUser(magi.getUser())
  }
  const updateEvm = () => {
    if (magi.getWallet() === Wallet.Ethereum) setUser(magi.getUser())
  }
  useEffect(() => {
    magi.on('wallet_changed', update)
    if (aioha) {
      aioha.on('connect', updateHive)
      aioha.on('disconnect', updateHive)
      aioha.on('account_changed', updateHive)
    }
    if (eip1193) {
      eip1193.on('accountsChanged', updateEvm)
    }

    return () => {
      magi.off('wallet_changed', update)
      if (aioha) {
        aioha.off('connect', updateHive)
        aioha.off('disconnect', updateHive)
        aioha.off('account_changed', updateHive)
      }
      if (eip1193) {
        eip1193.removeListener('accountsChanged', updateEvm)
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
      {children}
    </MagiContext.Provider>
  )
}

export const useMagi = () => {
  const ctx = useContext(MagiContext)
  if (!ctx) throw new Error('useMagi must be used within a MagiProvider')
  return ctx
}
