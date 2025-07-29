<template>
  <div 
    class="timer-section" 
    :class="{ 
      active: isActive, 
      inactive: isInactive 
    }"
  >
    <div 
      class="status-indicator" 
      :class="{ active: isActive }"
    ></div>
    
    <div class="timer-label">{{ label }}</div>
    
    <div class="timer-display">{{ formatTime(timeLeft) }}</div>
    
    <div v-if="!isRunning" class="timer-inputs">
      <div class="time-input-group">
        <div class="time-input-label">MIN</div>
        <input 
          type="number" 
          :value="minutes"
          @input="$emit('update:minutes', parseInt($event.target.value) || 0)"
          class="time-input" 
          min="0" 
          max="59" 
          step="1" 
          inputmode="numeric"
        >
      </div>
      <div class="time-separator">:</div>
      <div class="time-input-group">
        <div class="time-input-label">SEC</div>
        <input 
          type="number" 
          :value="seconds"
          @input="$emit('update:seconds', parseInt($event.target.value) || 0)"
          class="time-input" 
          min="0" 
          max="59" 
          step="1" 
          inputmode="numeric"
        >
      </div>
    </div>
    
    <div v-if="isActive" class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: progress + '%' }"
      ></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  timeLeft: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isInactive: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    default: 0
  },
  minutes: {
    type: Number,
    default: 0
  },
  seconds: {
    type: Number,
    default: 0
  },
  isRunning: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:minutes', 'update:seconds'])

const formatTime = (seconds) => {
  const mins = Math.floor(Math.abs(seconds) / 60)
  const secs = Math.abs(seconds) % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
</script>
