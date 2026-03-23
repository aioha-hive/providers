<script setup lang="ts">
import { provide, ref, inject, onMounted, onUnmounted, watch } from 'vue'
import { Magi, Wallet } from '@aioha/magi'
import { MagiCtx, MagiUserCtx, MagiWalletCtx } from '../composables/context.js'
import { useConnectorClient } from '@wagmi/vue'
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
  watch(aiohaUser, () => {
    if (props.magi.getWallet() === Wallet.Hive) user.value = props.magi.getUser()
  })
}

// Wagmi integration
const { data: walletClient } = useConnectorClient()

watch(walletClient, (newClient) => {
  if (!!newClient) {
    props.magi.setViem(newClient as any)
    props.magi.setWallet(Wallet.Ethereum)
  } else {
    props.magi.setWallet()
  }
})

// Setup event listeners
onMounted(() => {
  props.magi.on('wallet_changed', update)
})

onUnmounted(() => {
  props.magi.off('wallet_changed', update)
})

// Provide the context
provide(MagiCtx, props.magi)
provide(MagiUserCtx, user)
provide(MagiWalletCtx, wallet)
</script>

<template>
  <slot></slot>
</template>
