import { LitElement, html, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createContext, consume, provide } from '@lit/context'
import { type Magi, Wallet } from '@aioha/magi'
import { type Config, watchConnection, getConnectorClient } from '@wagmi/core'
import { UserCtx } from '@aioha/providers/lit'

// Create the context
export const MagiCtx = createContext<Magi>(Symbol('MagiContext'))
export const MagiUserCtx = createContext<string | undefined>(Symbol('MagiUser'))
export const MagiWalletCtx = createContext<Wallet | undefined>(Symbol('MagiWallet'))

@customElement('magi-provider')
export class MagiProvider extends LitElement {
  @provide({ context: MagiCtx })
  @property({ attribute: false })
  magi!: Magi

  @property({ attribute: false })
  wagmiConfig?: Config

  @consume({ context: UserCtx, subscribe: true })
  @state()
  //@ts-ignore
  private _aiohaUser?: string

  // Persistent reference that won't be cleared by Lit during component removal
  private _magiRef?: Magi
  private _unwatchConnection?: () => void

  @provide({ context: MagiUserCtx })
  @state()
  //@ts-ignore
  private _user?: string

  @provide({ context: MagiWalletCtx })
  @state()
  //@ts-ignore
  private _wallet?: Wallet

  protected createRenderRoot(): HTMLElement | DocumentFragment {
    return this
  }

  connectedCallback() {
    super.connectedCallback()

    // Store persistent reference before any potential clearing
    this._magiRef = this.magi

    // Initialize state
    this._user = this.magi.getUser()
    this._wallet = this.magi.getWallet()

    // Set up event listeners
    this.magi.on('wallet_changed', this._update)
    if (this.wagmiConfig) {
      this._unwatchConnection = watchConnection(this.wagmiConfig, {
        onChange: async (connection) => {
          const magiInstance = this._magiRef || this.magi
          if (connection.status === 'connected') {
            try {
              const client = await getConnectorClient(this.wagmiConfig!)
              magiInstance.setViem(client as any)
              magiInstance.setWallet(Wallet.Ethereum)
              this._update()
            } catch {}
          } else if (connection.status === 'disconnected') {
            magiInstance.setWallet()
            this._update()
          }
        }
      })
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    // Clean up event listeners using persistent reference
    if (this._magiRef) {
      this._magiRef.off('wallet_changed', this._update)
    }
    this._unwatchConnection?.()
  }

  protected willUpdate(changedProperties: PropertyValues) {
    if (changedProperties.has('_aiohaUser')) {
      const magiInstance = this._magiRef || this.magi
      if (this._aiohaUser) {
        magiInstance.setWallet(Wallet.Hive)
      } else {
        magiInstance.setWallet()
      }
      this._update()
    }
  }

  private _update = () => {
    const magiInstance = this._magiRef || this.magi
    this._user = magiInstance.getUser()
    this._wallet = magiInstance.getWallet()
  }

  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'magi-provider': MagiProvider
  }
}
