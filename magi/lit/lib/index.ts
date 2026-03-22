import { LitElement, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createContext, provide } from '@lit/context'
import type { Aioha } from '@aioha/aioha'
import type { Magi, Wallet } from '@aioha/magi'
import type { EIP1193Provider } from '../../types.js'

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
  aioha?: Aioha

  @property({ attribute: false })
  eip1193?: EIP1193Provider

  // Persistent references that won't be cleared by Lit during component removal
  private _magiRef?: Magi
  private _aiohaRef?: Aioha
  private _eip1193Ref?: EIP1193Provider

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

    // Store persistent references before any potential clearing
    this._magiRef = this.magi
    this._aiohaRef = this.aioha
    this._eip1193Ref = this.eip1193

    // Initialize state
    this._user = this.magi.getUser()
    this._wallet = this.magi.getWallet()

    // Set up event listeners
    this.magi.on('wallet_changed', this._update)
    if (this.aioha) {
      this.aioha.on('connect', this._updateHive)
      this.aioha.on('disconnect', this._updateHive)
      this.aioha.on('account_changed', this._updateHive)
    }
    if (this.eip1193) {
      this.eip1193.on('accountsChanged', this._updateEvm)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()

    // Clean up event listeners using persistent references
    if (this._magiRef) {
      this._magiRef.off('wallet_changed', this._update)
    }
    if (this._aiohaRef) {
      this._aiohaRef.off('connect', this._updateHive)
      this._aiohaRef.off('disconnect', this._updateHive)
      this._aiohaRef.off('account_changed', this._updateHive)
    }
    if (this._eip1193Ref) {
      this._eip1193Ref.removeListener('accountsChanged', this._updateEvm)
    }
  }

  private _update = () => {
    const magiInstance = this._magiRef || this.magi
    this._user = magiInstance.getUser()
    this._wallet = magiInstance.getWallet()
  }

  private _updateHive = () => {
    const magiInstance = this._magiRef || this.magi
    if (magiInstance.getWallet() === 'hive') this._user = magiInstance.getUser()
  }

  private _updateEvm = () => {
    const magiInstance = this._magiRef || this.magi
    if (magiInstance.getWallet() === 'evm') this._user = magiInstance.getUser()
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
