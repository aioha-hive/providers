import { inject } from 'vue'
import { AiohaContextKey, type AiohaContext } from './context.js'

export const useAioha = (): AiohaContext => {
  const context = inject(AiohaContextKey)
  if (!context) {
    throw new Error('useAioha must be used within an AiohaProvider')
  }
  return context
}
