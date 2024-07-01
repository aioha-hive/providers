# Aioha React Provider

React provider for Aioha for React apps that are **not** using the [ready-made UI](https://github.com/aioha-hive/react-ui).

This module is used and provided in the ready-made UI so there is no need to install this separately.

## Installation

```sh
pnpm i @aioha/react-provider @aioha/aioha
```

## Usage

1. Initialize Aioha and setup provider at the root of your application. This may be in `index.jsx`, `index.tsx` or `App.tsx` depending on the framework you use.

```tsx
import { initAioha } from '@aioha/aioha'
import { AiohaProvider } from '@aioha/react-provider'

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
import { useAioha } from '@aioha/react-provider'

export const AiohaPage = () => {
  const { aioha, user, provider, login, logout } = useAioha()

  // rest of your page goes here
}
```

Logins and logouts shall be performed using the `login()` and `logout()` method provided above, not `aioha.login()` or `aioha.logout()`. Logged in username and provider may be retrieved through `user` and `provider` variables.