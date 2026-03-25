<script lang="ts">
  import { getContext, onMount, setContext } from 'svelte'
  import type { Magi } from '@aioha/magi'
  import { Wallet } from '@aioha/magi'
  import { type Config, watchConnection, getConnectorClient } from '@wagmi/core'
  import { MagiCtxKey } from '../context.js'
  import { AiohaCtxKey, type AiohaContext } from '@aioha/providers/svelte'

  const { magi, wagmiConfig, children }: { magi: Magi; wagmiConfig?: Config; children: any } = $props()

  const aiohaCtx = getContext<AiohaContext | undefined>(AiohaCtxKey)

  let ctx = $state({
    magi: magi,
    user: magi.getUser(),
    wallet: magi.getWallet()
  })

  const update = () => {
    ctx.user = magi.getUser()
    ctx.wallet = magi.getWallet()
  }

  $effect(() => {
    if (aiohaCtx?.user) {
      magi.setWallet(Wallet.Hive)
    } else if (magi.getWallet() === Wallet.Hive) {
      magi.setWallet()
    }
    update()
  })

  onMount(() => {
    magi.on('wallet_changed', update)

    let unwatchConnection: (() => void) | undefined
    if (wagmiConfig) {
      unwatchConnection = watchConnection(wagmiConfig, {
        onChange: async (connection) => {
          if (connection.status === 'connected') {
            try {
              const client = await getConnectorClient(wagmiConfig)
              magi.setViem(client)
              magi.setWallet(Wallet.Ethereum)
              update()
            } catch {}
          } else if (connection.status === 'disconnected' && magi.getWallet() === Wallet.Ethereum) {
            magi.setWallet()
            update()
          }
        }
      })
    }

    return () => {
      magi.off('wallet_changed', update)
      unwatchConnection?.()
    }
  })

  setContext(MagiCtxKey, ctx)
</script>

{@render children()}
