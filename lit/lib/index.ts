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

  // Persistent reference that won't be cleared by Lit during component removal
  private _aiohaRef?: Aioha

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

    // Store persistent reference before any potential clearing
    this._aiohaRef = this.aioha

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

    // Clean up event listeners using persistent reference
    if (this._aiohaRef) {
      this._aiohaRef.off('connect', this._update)
      this._aiohaRef.off('disconnect', this._update)
      this._aiohaRef.off('account_changed', this._update)
    }
  }

  private _update = () => {
    // Use persistent reference to avoid issues during component removal
    const aiohaInstance = this._aiohaRef || this.aioha
    this._user = aiohaInstance.getCurrentUser()
    this._provider = aiohaInstance.getCurrentProvider()
    this._otherUsers = aiohaInstance.getOtherLogins()
  }

  render() {
    return html`<slot></slot>`
  }
}
