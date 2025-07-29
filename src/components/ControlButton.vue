<template>
  <button 
    class="control-button" 
    :class="isRunning ? 'stop-button' : 'start-button'" 
    @click="$emit('toggle')"
  >
    {{ isRunning ? 'Stop' : 'Start' }}
  </button>
</template>

<script setup>
defineProps({
  isRunning: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle'])
</script>
