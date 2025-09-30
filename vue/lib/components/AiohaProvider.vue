<script setup lang="ts">
import { provide, ref, onMounted, onUnmounted } from 'vue'
import { Aioha, Providers, PersistentLoginProvs } from '@aioha/aioha'
import { AiohaContextKey } from '../composables/context.js'

// Props interface
interface Props {
  aioha: Aioha
}

const props = defineProps<Props>()

// Reactive state
const user = ref<string | undefined>(props.aioha.getCurrentUser())
const provider = ref<Providers | undefined>(props.aioha.getCurrentProvider())
const otherUsers = ref<PersistentLoginProvs>(props.aioha.getOtherLogins())

// Update function
const update = () => {
  user.value = props.aioha.getCurrentUser()
  provider.value = props.aioha.getCurrentProvider()
  otherUsers.value = props.aioha.getOtherLogins()
}

// Setup event listeners
onMounted(() => {
  props.aioha.on('connect', update)
  props.aioha.on('disconnect', update)
  props.aioha.on('account_changed', update)
})

onUnmounted(() => {
  props.aioha.off('connect', update)
  props.aioha.off('disconnect', update)
  props.aioha.off('account_changed', update)
})

// Provide the context
provide(AiohaContextKey, {
  aioha: props.aioha,
  user: user.value,
  provider: provider.value,
  otherUsers: otherUsers.value
})
</script>

<template>
  <slot></slot>
</template>