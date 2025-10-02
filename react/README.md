# Aioha React Provider

React provider for Aioha for React apps that are **not** using the [ready-made UI](https://github.com/aioha-hive/react-ui).

This module is used and provided in the ready-made UI so there is no need to install this separately.

## Installation

```sh
pnpm i @aioha/providers @aioha/aioha
```

## Usage

1. Initialize Aioha and setup provider at the root of your application. This may be in `index.jsx`, `index.tsx` or `App.tsx` depending on the framework you use.

```tsx
import { initAioha } from '@aioha/aioha'
import { AiohaProvider } from '@aioha/providers/react'

// See options: https://aioha.dev/docs/core/usage#instantiation
const aioha = initAioha()

const App = () => {
  return (
    <AiohaProvider aioha={aioha}>
      <TheRestOfYourApplication />
    </AiohaProvider>
  )
}
```

2. Use Aioha anywhere within `AiohaProvider` through `useAioha()`.

```tsx
import { useAioha } from '@aioha/providers/react'

export const AiohaPage = () => {
  const { aioha, user, provider, otherUsers } = useAioha()

  // rest of your page goes here
}
```

Logged in username and provider may be retrieved through `user` and `provider` variables. Other authenticated accounts can be retrieved through `otherUsers` variable.

## Using Events

Listen for [events](https://aioha.dev/docs/core/jsonrpc#events) in `useEffect` hook.

```tsx title="src/components/YourComponent.tsx"
import { useEffect } from 'react'
import { useAioha } from '@aioha/providers/react'

export const YourComponent = () => {
  const { aioha } = useAioha()
  useEffect(() => {
    const handler = () => {
      // handle your event here
    }
    aioha.on('sign_tx_request', handler)

    return () => {
      aioha.off('sign_tx_request', handler)
    }
  }, [])
}
```

## SSR Apps

If you are using a framework that uses SSR (server-side rendering) such as Next.js, you may need to setup Aioha separately in a `useEffect()`.

```tsx title="src/App.tsx"
import React, { useEffect } from 'react'
import { Aioha } from '@aioha/aioha'
import { AiohaProvider } from '@aioha/providers/react'

const aioha = new Aioha()

const App = () => {
  useEffect(() => {
    // See options: https://aioha.dev/docs/core/usage#instantiation
    aioha.setup()
  }, [])
  return (
    <AiohaProvider aioha={aioha}>
      <TheRestOfYourApplication />
    </AiohaProvider>
  )
}
```