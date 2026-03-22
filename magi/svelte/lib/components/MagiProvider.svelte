<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import type { Aioha } from '@aioha/aioha'
  import type { Magi } from '@aioha/magi'
  import { Wallet } from '@aioha/magi'
  import { MagiCtxKey, type EIP1193Provider } from '../context.js'

  const { magi, aioha, eip1193, children }: { magi: Magi; aioha?: Aioha; eip1193?: EIP1193Provider; children: any } = $props()

  let ctx = $state({
    magi: magi,
    user: magi.getUser(),
    wallet: magi.getWallet()
  })

  const update = () => {
    ctx.user = magi.getUser()
    ctx.wallet = magi.getWallet()
  }

  const updateHive = () => {
    if (magi.getWallet() === Wallet.Hive) ctx.user = magi.getUser()
  }

  const updateEvm = () => {
    if (magi.getWallet() === Wallet.Ethereum) ctx.user = magi.getUser()
  }

  onMount(() => {
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
  })

  setContext(MagiCtxKey, ctx)
</script>

{@render children()}
