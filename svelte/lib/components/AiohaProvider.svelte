<script lang="ts">
  import { onMount, onDestroy, setContext } from 'svelte'
  import type { Aioha } from '@aioha/aioha'
  import { AiohaCtxKey } from '../context.js'

  const { aioha, children }: { aioha: Aioha; children: any } = $props()

  let ctx = $state({
    aioha: aioha,
    user: aioha.getCurrentUser(),
    provider: aioha.getCurrentProvider(),
    otherUsers: aioha.getOtherLogins()
  })

  const update = () => {
    ctx.user = aioha.getCurrentUser()
    ctx.provider = aioha.getCurrentProvider()
    ctx.otherUsers = aioha.getOtherLogins()
  }

  onMount(() => {
    aioha.on('connect', update)
    aioha.on('disconnect', update)
    aioha.on('account_changed', update)
  })

  onDestroy(() => {
    aioha.off('connect', update)
    aioha.off('disconnect', update)
    aioha.off('account_changed', update)
  })

  setContext(AiohaCtxKey, ctx)
</script>

{@render children()}
