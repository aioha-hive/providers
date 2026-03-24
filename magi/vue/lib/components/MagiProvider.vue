<script setup lang="ts">
import { provide, ref, inject, onMounted, onUnmounted, watch } from 'vue'
import { Magi, Wallet } from '@aioha/magi'
import { MagiCtx, MagiUserCtx, MagiWalletCtx } from '../composables/context.js'
import { useConfig } from '@wagmi/vue'
import { watchConnection, getConnectorClient } from '@wagmi/core'
import { UserCtx } from '@aioha/providers/vue'

interface Props {
  magi: Magi
}

const props = defineProps<Props>()

// Reactive state
const user = ref<string | undefined>(props.magi.getUser())
const wallet = ref<Wallet | undefined>(props.magi.getWallet())

// Update function
const update = () => {
  user.value = props.magi.getUser()
  wallet.value = props.magi.getWallet()
}

// Consume Aioha user context (optional, undefined if no AiohaProvider ancestor)
const aiohaUser = inject(UserCtx, undefined)
if (aiohaUser) {
  watch(aiohaUser, (newUser) => {
    if (newUser) {
      props.magi.setWallet(Wallet.Hive)
    } else {
      props.magi.setWallet()
    }
    update()
  })
}

// Wagmi integration
const config = useConfig()
let unwatchConnection: (() => void) | undefined

// Setup event listeners
onMounted(() => {
  props.magi.on('wallet_changed', update)
  unwatchConnection = watchConnection(config, {
    onChange: async (connection) => {
      if (connection.status === 'connected') {
        try {
          const client = await getConnectorClient(config)
          props.magi.setViem(client as any)
          props.magi.setWallet(Wallet.Ethereum)
          update()
        } catch {}
      } else if (connection.status === 'disconnected') {
        props.magi.setWallet()
        update()
      }
    }
  })
})

onUnmounted(() => {
  props.magi.off('wallet_changed', update)
  unwatchConnection?.()
})

// Provide the context
provide(MagiCtx, props.magi)
provide(MagiUserCtx, user)
provide(MagiWalletCtx, wallet)
</script>

<template>
  <slot></slot>
</template>
