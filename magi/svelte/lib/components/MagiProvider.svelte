<script lang="ts">
  import { onMount, setContext } from 'svelte'
  import type { Aioha } from '@aioha/aioha'
  import type { Magi } from '@aioha/magi'
  import { Wallet } from '@aioha/magi'
  import { type Config, watchConnection, getConnectorClient } from '@wagmi/core'
  import { MagiCtxKey } from '../context.js'

  const { magi, aioha, wagmiConfig, children }: { magi: Magi; aioha?: Aioha; wagmiConfig?: Config; children: any } = $props()

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

  onMount(() => {
    magi.on('wallet_changed', update)
    if (aioha) {
      aioha.on('connect', updateHive)
      aioha.on('disconnect', updateHive)
      aioha.on('account_changed', updateHive)
    }

    let unwatchConnection: (() => void) | undefined
    if (wagmiConfig) {
      unwatchConnection = watchConnection(wagmiConfig, {
        onChange: async (connection) => {
          if (connection.status === 'connected') {
            try {
              const client = await getConnectorClient(wagmiConfig)
              magi.setViem(client as any)
              magi.setWallet(Wallet.Ethereum)
              update()
            } catch {}
          } else if (connection.status === 'disconnected') {
            magi.setWallet()
            update()
          }
        }
      })
    }

    return () => {
      magi.off('wallet_changed', update)
      if (aioha) {
        aioha.off('connect', updateHive)
        aioha.off('disconnect', updateHive)
        aioha.off('account_changed', updateHive)
      }
      unwatchConnection?.()
    }
  })

  setContext(MagiCtxKey, ctx)
</script>

{@render children()}
