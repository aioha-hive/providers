<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted } from 'vue'
import { Magi, Wallet } from '@aioha/magi'
import type { Aioha } from '@aioha/aioha'
import { MagiCtx, MagiUserCtx, MagiWalletCtx } from '../composables/context.js'
import type { EIP1193Provider } from '../../../types.js'

interface Props {
  magi: Magi
  aioha?: Aioha
  eip1193?: EIP1193Provider
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

const updateEvm = () => {
  if (props.magi.getWallet() === Wallet.Ethereum) user.value = props.magi.getUser()
}

// Setup event listeners
onMounted(() => {
  props.magi.on('wallet_changed', update)
  if (props.aioha) {
    props.aioha.on('connect', updateHive)
    props.aioha.on('disconnect', updateHive)
    props.aioha.on('account_changed', updateHive)
  }
  if (props.eip1193) {
    props.eip1193.on('accountsChanged', updateEvm)
  }
})

onUnmounted(() => {
  props.magi.off('wallet_changed', update)
  if (props.aioha) {
    props.aioha.off('connect', updateHive)
    props.aioha.off('disconnect', updateHive)
    props.aioha.off('account_changed', updateHive)
  }
  if (props.eip1193) {
    props.eip1193.removeListener('accountsChanged', updateEvm)
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
