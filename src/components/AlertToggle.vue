<template>
  <div class="alert-toggle">
    <span class="toggle-label">{{ options[0].icon }}</span>
    <div 
      class="toggle-switch" 
      :class="currentClass"
      @click="toggle"
    >
      <div class="toggle-slider"></div>
    </div>
    <span class="toggle-label">{{ options[1].icon }}</span>
  </div>
  <div class="alert-mode">
    {{ description }}: {{ currentLabel }}
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    required: true
  },
  options: {
    type: Array,
    required: true,
    validator: (options) => options.length === 2
  },
  description: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const currentClass = computed(() => {
  const currentOption = props.options.find(opt => opt.value === props.modelValue)
  return currentOption ? currentOption.value.toString() : props.options[0].value.toString()
})

const currentLabel = computed(() => {
  const currentOption = props.options.find(opt => opt.value === props.modelValue)
  return currentOption ? currentOption.label : props.options[0].label
})

const toggle = () => {
  const currentIndex = props.options.findIndex(opt => opt.value === props.modelValue)
  const nextIndex = currentIndex === 0 ? 1 : 0
  emit('update:modelValue', props.options[nextIndex].value)
}
</script>
