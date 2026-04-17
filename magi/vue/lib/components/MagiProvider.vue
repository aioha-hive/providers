<script setup lang="ts">
import { provide, ref, computed, inject, onMounted, onUnmounted, watch } from 'vue'
import { Magi, Wallet, BtcClient } from '@aioha/magi'
import { MagiCtx, MagiUserCtx, MagiWalletCtx } from '../composables/context.js'
import { useConnectorClient, useConnections } from '@wagmi/vue'
import { UserCtx } from '@aioha/providers/vue'

interface Props {
  magi: Magi
  btcClient?: BtcClient
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
    } else if (props.magi.getWallet() === Wallet.Hive) {
      props.magi.setWallet()
    }
    update()
  })
}

// Wagmi integration — useConnectorClient has a bug in wagmi/vue@0.5.0
// where account changes don't invalidate the query, so we also watch
// the connection address and refetch manually.
const { data: walletClient, refetch } = useConnectorClient()
const connections = useConnections()
const currentAddress = computed(() => connections.value[0]?.accounts[0])
watch(currentAddress, () => refetch())
watch(walletClient, (client) => {
  if (client) {
    props.magi.setViem(client)
    props.magi.setWallet(Wallet.Ethereum)
  } else if (props.magi.getWallet() === Wallet.Ethereum) {
    props.magi.setWallet()
  }
  update()
})

// Bitcoin
watch(
  () => props.btcClient,
  (client) => {
    if (client) {
      props.magi.setBitcoin(client)
      props.magi.setWallet(Wallet.Bitcoin)
    } else if (props.magi.getWallet() === Wallet.Bitcoin) {
      props.magi.setWallet()
    }
    update()
  }
)

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
