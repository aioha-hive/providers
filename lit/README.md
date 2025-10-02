# Aioha Lit Provider

Lit provider for Aioha that uses Lit's [context](https://lit.dev/docs/data/context) to provide reactive states in your Lit Element components.

## Installation

```sh
pnpm i @aioha/providers @aioha/aioha
```

## Usage

1. Initialize Aioha and setup provider at the root of your application. This is usually done at the entrypoint file (i.e. `index.ts` or `my-element.ts`).

```ts
import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Aioha } from '@aioha/aioha'
import '@aioha/providers/lit'

@customElement('my-element')
export class MyElement extends LitElement {
  aioha: Aioha = new Aioha()

  connectedCallback() {
    super.connectedCallback()
    this.aioha.setup()
  }

  render() {
    return html`
      <aioha-provider .aioha=${this.aioha}>
        <the-rest-of-your-app></the-rest-of-your-app>
      </aioha-provider>
    `
  }
}
```

2. Use Aioha anywhere within `<aioha-provider>` through the `@consume` decorator.

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { consume } from '@lit/context'
import { AiohaCtx, ProviderCtx, UserCtx, OtherUsersCtx } from '@aioha/providers/lit'
import type { Aioha, Providers, PersistentLoginProvs } from '@aioha/aioha'

@customElement('aioha-page')
export class AiohaPage extends LitElement {
  @consume({ context: AiohaCtx })
  @state()
  private aioha: Aioha | undefined

  @consume({ context: UserCtx, subscribe: true })
  @state()
  private _user: string | undefined

  @consume({ context: ProviderCtx, subscribe: true })
  @state()
  private _prov: Providers | undefined

  @consume({ context: OtherUsersCtx, subscribe: true })
  @state()
  private _otherUsers: PersistentLoginProvs = {}

  render() {
    return html`
      <div>
        <p>User: ${this._user} Provider: ${this._prov}</p>
        ${Object.keys(this._otherUsers).map((u) => {
          return html`<p>Other user: ${u} Provider: ${this._otherUsers[u]}</p>`
        })}
      </div>
    `
  }
}
```

## Using Events

Listen for [events](https://aioha.dev/docs/core/jsonrpc#events) using lifecycle callbacks.

```ts
import { LitElement, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { consume } from '@lit/context'
import { AiohaCtx } from '@aioha/providers/lit'
import { Aioha } from '@aioha/aioha'

@customElement('some-element')
export class SomeElement extends LitElement {
  @consume({ context: AiohaCtx })
  @state()
  private aioha: Aioha | undefined

  private _handler() {
    // handle your event here
  }

  connectedCallback() {
    super.connectedCallback()
    this.aioha.on('sign_tx_request', this._handler)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.aioha.off('sign_tx_request', this._handler)
  }

  render() {
    return html`<your-element-contents-here></<your-element-contents-here>`
  }
}
```