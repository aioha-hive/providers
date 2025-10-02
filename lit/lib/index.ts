import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createContext, provide } from '@lit/context'
import type { Aioha, Providers, PersistentLoginProvs } from '@aioha/aioha'

// Create the context
export const AiohaCtx = createContext<Aioha>(Symbol('AiohaContext'))
export const UserCtx = createContext<string | undefined>(Symbol('AiohaUser'))
export const ProviderCtx = createContext<Providers | undefined>(Symbol('AiohaProvider'))
export const OtherUsersCtx = createContext<PersistentLoginProvs>(Symbol('AiohaOtherUsers'))

@customElement('aioha-provider')
export class AiohaProvider extends LitElement {
  @provide({ context: AiohaCtx })
  @property({ attribute: false })
  aioha!: Aioha

  @provide({ context: UserCtx })
  @state()
  //@ts-ignore
  private _user?: string

  @provide({ context: ProviderCtx })
  @state()
  //@ts-ignore
  private _provider?: Providers

  @provide({ context: OtherUsersCtx })
  @state()
  //@ts-ignore
  private _otherUsers: PersistentLoginProvs = {}

  connectedCallback() {
    super.connectedCallback()

    // Initialize state
    this._user = this.aioha.getCurrentUser()
    this._provider = this.aioha.getCurrentProvider()
    this._otherUsers = this.aioha.getOtherLogins()

    // Set up event listeners
    this.aioha.on('connect', this._update)
    this.aioha.on('disconnect', this._update)
    this.aioha.on('account_changed', this._update)
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    // Clean up event listeners
    this.aioha.off('connect', this._update)
    this.aioha.off('disconnect', this._update)
    this.aioha.off('account_changed', this._update)
  }

  private _update() {
    this._user = this.aioha.getCurrentUser()
    this._provider = this.aioha.getCurrentProvider()
    this._otherUsers = this.aioha.getOtherLogins()
  }

  render() {
    return html`<slot></slot>`
  }
}
