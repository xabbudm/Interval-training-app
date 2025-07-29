import { ref, computed, onMounted } from 'vue'

export function useTimer(
  trainingMinutes,
  trainingSeconds,
  restMinutes,
  restSeconds,
  totalReps,
  isRunning,
  currentPhase,
  currentRep
) {
  const trainingTimeLeft = ref(0)
  const restTimeLeft = ref(0)
  const initialTrainingTime = ref(0)
  const initialRestTime = ref(0)
  
  let timerInterval = null

  const trainingProgress = computed(() => {
    if (initialTrainingTime.value === 0) return 0
    return ((initialTrainingTime.value - trainingTimeLeft.value) / initialTrainingTime.value) * 100
  })

  const restProgress = computed(() => {
    if (initialRestTime.value === 0) return 0
    return ((initialRestTime.value - restTimeLeft.value) / initialRestTime.value) * 100
  })

  const startTimer = () => {
    // Validation
    if ((trainingMinutes.value === 0 && trainingSeconds.value === 0) || 
        (restMinutes.value === 0 && restSeconds.value === 0) || 
        totalReps.value < 1) {
      alert('Please set valid times and repetitions!')
      return false
    }
    
    isRunning.value = true
    currentPhase.value = 'training'
    currentRep.value = 1
    
    // Set initial times
    trainingTimeLeft.value = (trainingMinutes.value * 60) + trainingSeconds.value
    restTimeLeft.value = (restMinutes.value * 60) + restSeconds.value
    initialTrainingTime.value = trainingTimeLeft.value
    initialRestTime.value = restTimeLeft.value
    
    // Start interval
    timerInterval = setInterval(tick, 1000)
    return true
  }

  const stopTimer = () => {
    isRunning.value = false
    if (timerInterval) {
      clearInterval(timerInterval)
      timerInterval = null
    }
    resetTimers()
  }

  const tick = () => {
    if (currentPhase.value === 'training') {
      trainingTimeLeft.value--
      
      if (trainingTimeLeft.value <= 0) {
        currentPhase.value = 'rest'
        restTimeLeft.value = initialRestTime.value
        // playAlert('rest') will be called from parent
      }
    } else if (currentPhase.value === 'rest') {
      restTimeLeft.value--
      
      if (restTimeLeft.value <= 0) {
        if (currentRep.value >= totalReps.value) {
          stopTimer()
          alert('Workout Complete! Great job! 🎉')
          return
        }
        
        currentRep.value++
        currentPhase.value = 'training'
        trainingTimeLeft.value = initialTrainingTime.value
        // playAlert('training') will be called from parent
      }
    }
  }

  const resetTimers = () => {
    currentRep.value = 1
    trainingTimeLeft.value = (trainingMinutes.value * 60) + trainingSeconds.value
    restTimeLeft.value = (restMinutes.value * 60) + restSeconds.value
    currentPhase.value = 'training'
  }

  onMounted(() => {
    trainingTimeLeft.value = (trainingMinutes.value * 60) + trainingSeconds.value
    restTimeLeft.value = (restMinutes.value * 60) + restSeconds.value
  })

  return {
    trainingTimeLeft,
    restTimeLeft,
    trainingProgress,
    restProgress,
    startTimer,
    stopTimer,
    tick
  }
}
