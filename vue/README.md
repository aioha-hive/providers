# Aioha Vue Provider

Vue provider for Aioha that uses Vue's [provide/inject](https://vuejs.org/guide/components/provide-inject.html) to provide reactive states in your Vue components.

## Installation

```sh
pnpm i @aioha/vue-provider @aioha/aioha
```

## Usage

1. Initialize Aioha and setup provider at the root of your application. This is usually done in `App.vue`.

```vue
<script setup lang="ts">
import { AiohaProvider } from '@aioha/vue-provider'
import { initAioha } from '@aioha/aioha'

const aioha = initAioha()
// ...
</script>

<template>
  <AiohaProvider :aioha="aioha">
    <TheRestOfYourApplication />
  </AiohaProvider>
</template>
```

2. Use Aioha anywhere within `AiohaProvider` through the `useAioha()` composable.

```vue
<script setup lang="ts">
import { useAioha } from '@aioha/vue-provider'

const { aioha, user, provider, otherUsers } = useAioha()
// ...
</script>

<template>
  <p>Current User: {{user}}</p>
  <p>Current Provider: {{provider}}</p>
  <p v-for="(value, key) in otherUsers" :key="key">{{key}}: {{value}}</p>
</template>
```

Alternatively using Vue's `inject()` function:

```vue
<script setup lang="ts">
import { inject } from 'vue'
import { AiohaCtx, UserCtx, ProviderCtx, OtherUsersCtx } from '@aioha/vue-provider'

const aioha = inject(AiohaCtx)
const user = inject(UserCtx)
const provider = inject(ProviderCtx)
const otherUsers = inject(OtherUsersCtx)
// ...
</script>

<template>
  <p>Current User: {{user}}</p>
  <p>Current Provider: {{provider}}</p>
  <p v-for="(value, key) in otherUsers" :key="key">{{key}}: {{value}}</p>
</template>
```

## Using Events

Listen for [events](https://aioha.dev/docs/core/jsonrpc#events) using lifecycle hooks within Vue's composition API.

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useAioha } from '@aioha/vue-provider'

const { aioha } = useAioha()

const handler = () => {
  // handle your event here
}

onMounted(() => {
  aioha.on('sign_tx_request', handler)
})

onUnmounted(() => {
  aioha.off('sign_tx_request', handler)
})
// ...
</script>
```

## SSR Apps

If you are using a framework that uses SSR (server-side rendering) such as Nuxt, you may need to setup Aioha separately in a `onMounted()`.

```vue
<script setup lang="ts">
import { AiohaProvider } from '@aioha/vue-provider'
import { Aioha } from '@aioha/aioha'

const aioha = new Aioha()

onMounted(() => {
  // See options: https://aioha.dev/docs/core/usage#instantiation
  aioha.setup()
})
// ...
</script>

<template>
  <AiohaProvider :aioha="aioha">
    <TheRestOfYourApplication />
  </AiohaProvider>
</template>
```