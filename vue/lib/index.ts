import AiohaProvider from './components/AiohaProvider.vue'
import { useAioha } from './composables/index.js'

export { AiohaProvider, useAioha }

// For module augmentation
export type { AiohaContext } from './composables/context.js'
