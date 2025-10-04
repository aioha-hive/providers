# Aioha Svelte Provider

Svelte provider for Aioha that uses Svelte's [context API](https://svelte.dev/docs/svelte/context) to provide reactive states in your Svelte components.

## Installation

```sh
pnpm i @aioha/providers @aioha/aioha
```

## Usage

1. Initialize Aioha and setup provider at the root of your application. This is usually done in `App.svelte`.

```svelte
<script lang="ts">
  import { AiohaProvider } from '@aioha/providers/svelte'
  import { initAioha } from '@aioha/aioha'

  const aioha = initAioha()
  // ...
</script>

<AiohaProvider {aioha}>
  <TheRestOfYourApplication />
</AiohaProvider>
```

2. Use Aioha anywhere within `AiohaProvider` through Svelte's `getContext()` function.

```svelte
<script lang="ts">
  import { getContext } from 'svelte'
  import { AiohaCtxKey, type AiohaContext } from '@aioha/providers/svelte'

  const ctx = getContext<AiohaContext>(AiohaCtxKey)
  // ...
</script>

<p>Current User: {ctx.user}</p>
<p>Current Provider: {ctx.provider}</p>
{#each Object.entries(ctx.otherUsers) as [key, value]}
  <p>{key}: {value}</p>
{/each}
```

## Using Events

Listen for [events](https://aioha.dev/docs/core/jsonrpc#events) using lifecycle functions within Svelte components.

```svelte
<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import { AiohaCtxKey, type AiohaContext } from '@aioha/providers/svelte'

  const ctx = getContext<AiohaContext>(AiohaCtxKey)

  const handler = () => {
    // handle your event here
  }

  onMount(() => {
    ctx.aioha.on('sign_tx_request', handler)

    return () => ctx.aioha.off('sign_tx_request', handler)
  })
  // ...
</script>
```

## SSR Apps

If you are using a framework that uses SSR (server-side rendering) such as SvelteKit, you may need to setup Aioha separately in a `onMount()`.

```svelte
<script lang="ts">
  import { onMount } from 'svelte'
  import { AiohaProvider } from '@aioha/providers/svelte'
  import { Aioha } from '@aioha/aioha'

  const aioha = new Aioha()

  onMount(() => {
    // See options: https://aioha.dev/docs/core/usage#instantiation
    aioha.setup()
  })
  // ...
</script>

<AiohaProvider {aioha}>
  <TheRestOfYourApplication />
</AiohaProvider>
