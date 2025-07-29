<template>
  <div id="app">
    <!-- Flash Overlay for Visual Alerts -->
    <div 
      id="flashOverlay" 
      class="flash-overlay" 
      :class="{ 'rest-phase': alertPhase === 'rest' }"
      v-show="showFlashOverlay"
    ></div>
    
    <div class="app-container">
      <!-- Training Timer -->
      <TimerSection
        label="Training"
        :time-left="trainingTimeLeft"
        :is-active="isRunning && currentPhase === 'training'"
        :is-inactive="isRunning && currentPhase !== 'training'"
        :progress="trainingProgress"
        :minutes="trainingMinutes"
        :seconds="trainingSeconds"
        :is-running="isRunning"
        @update:minutes="trainingMinutes = $event"
        @update:seconds="trainingSeconds = $event"
      />
      
      <!-- Rest Timer -->
      <TimerSection
        label="Rest"
        :time-left="restTimeLeft"
        :is-active="isRunning && currentPhase === 'rest'"
        :is-inactive="isRunning && currentPhase !== 'rest'"
        :progress="restProgress"
        :minutes="restMinutes"
        :seconds="restSeconds"
        :is-running="isRunning"
        @update:minutes="restMinutes = $event"
        @update:seconds="restSeconds = $event"
      />
      
      <!-- Repeat Counter -->
      <div class="repeat-section">
        <div class="repeat-label">Repeat</div>
        <div class="repeat-display">{{ currentRep }} / {{ totalReps }}</div>
        <input 
          v-if="!isRunning"
          type="number" 
          v-model.number="totalReps" 
          class="repeat-input" 
          min="1" 
          step="1" 
          inputmode="numeric"
        >
      </div>
      
      <!-- Control Section -->
      <div class="control-section">
        <!-- Alert Mode Toggle -->
        <AlertToggle
          v-model="alertMode"
          :options="[
            { value: 'audio', label: 'Audio', icon: '🔊' },
            { value: 'visual', label: 'Visual', icon: '👁️' }
          ]"
          description="Alert Mode"
        />
        
        <!-- Keep Awake Toggle -->
        <AlertToggle
          v-model="keepAwake"
          :options="[
            { value: false, label: 'Auto Sleep', icon: '💤' },
            { value: true, label: 'Stay Awake', icon: '🔆' }
          ]"
          description="Screen"
          style="margin-top: 15px;"
          @update:model-value="handleKeepAwakeToggle"
        />
      </div>
      
      <!-- Control Button -->
      <ControlButton
        :is-running="isRunning"
        @toggle="toggleTimer"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import TimerSection from './components/TimerSection.vue'
import AlertToggle from './components/AlertToggle.vue'
import ControlButton from './components/ControlButton.vue'
import { useTimer } from './composables/useTimer'
import { useAlerts } from './composables/useAlerts'
import { useWakeLock } from './composables/useWakeLock'

// Timer settings
const trainingMinutes = ref(0)
const trainingSeconds = ref(5)
const restMinutes = ref(0)
const restSeconds = ref(1)
const totalReps = ref(5)

// Timer state
const isRunning = ref(false)
const currentPhase = ref('training')
const currentRep = ref(1)

// Alert settings
const alertMode = ref('audio')
const keepAwake = ref(false)

// Use composables
const {
  trainingTimeLeft,
  restTimeLeft,
  trainingProgress,
  restProgress,
  startTimer,
  stopTimer,
  tick
} = useTimer(
  trainingMinutes,
  trainingSeconds,
  restMinutes,
  restSeconds,
  totalReps,
  isRunning,
  currentPhase,
  currentRep
)

const {
  showFlashOverlay,
  alertPhase,
  playAlert
} = useAlerts(alertMode)

const {
  requestWakeLock,
  releaseWakeLock
} = useWakeLock()

// Timer control
const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer()
    if (keepAwake.value) {
      releaseWakeLock()
      keepAwake.value = false
    }
  } else {
    if (startTimer()) {
      playAlert('training')
    }
  }
}

// Keep awake handler
const handleKeepAwakeToggle = (value) => {
  if (value) {
    requestWakeLock()
  } else {
    releaseWakeLock()
  }
}

// Initialize
onMounted(() => {
  // Timer initialization handled by useTimer composable
})
</script>
