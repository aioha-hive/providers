<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted, watch } from 'vue'
import { Magi, Wallet } from '@aioha/magi'
import type { Aioha } from '@aioha/aioha'
import { MagiCtx, MagiUserCtx, MagiWalletCtx } from '../composables/context.js'
import { useConnectorClient } from '@wagmi/vue'

interface Props {
  magi: Magi
  aioha?: Aioha
}

const props = defineProps<Props>()

// Reactive state
const user = ref<string | undefined>(props.magi.getUser())
const wallet = ref<Wallet | undefined>(props.magi.getWallet())

// Update functions
const update = () => {
  user.value = props.magi.getUser()
  wallet.value = props.magi.getWallet()
}

const updateHive = () => {
  if (props.magi.getWallet() === Wallet.Hive) user.value = props.magi.getUser()
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
  if (props.aioha) {
    props.aioha.on('connect', updateHive)
    props.aioha.on('disconnect', updateHive)
    props.aioha.on('account_changed', updateHive)
  }
})

onUnmounted(() => {
  props.magi.off('wallet_changed', update)
  if (props.aioha) {
    props.aioha.off('connect', updateHive)
    props.aioha.off('disconnect', updateHive)
    props.aioha.off('account_changed', updateHive)
  }
})

// Provide the context
provide(MagiCtx, props.magi)
provide(MagiUserCtx, user)
provide(MagiWalletCtx, wallet)
</script>

<template>
  <slot></slot>
</template>
