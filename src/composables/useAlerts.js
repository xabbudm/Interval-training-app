import { ref } from 'vue'

export function useAlerts(alertMode) {
  const showFlashOverlay = ref(false)
  const alertPhase = ref('training')

  let audioSystem = null

  const createAudioContext = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    const playTone = (frequency, duration, type = 'sine') => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.frequency.value = frequency
      oscillator.type = type
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration)
      
      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + duration)
    }
    
    return { playTone }
  }

  const initAudio = () => {
    if (!audioSystem) {
      try {
        audioSystem = createAudioContext()
      } catch (error) {
        console.warn('Audio not supported:', error)
      }
    }
  }

  const playAlert = (phase) => {
    if (alertMode.value === 'audio') {
      initAudio()
      if (audioSystem) {
        if (phase === 'training') {
          audioSystem.playTone(800, 0.2)
          setTimeout(() => audioSystem.playTone(800, 0.2), 300)
          setTimeout(() => audioSystem.playTone(800, 0.2), 600)
        } else {
          audioSystem.playTone(400, 0.5)
          setTimeout(() => audioSystem.playTone(400, 0.5), 700)
        }
      }
    } else {
      showVisualAlert(phase)
    }
  }

  const showVisualAlert = (phase) => {
    alertPhase.value = phase
    showFlashOverlay.value = true
    
    const appContainer = document.querySelector('.app-container')
    if (appContainer) {
      appContainer.classList.add('visual-alert', `${phase}-phase`, 'pulse-effect')
    }
    
    setTimeout(() => {
      showFlashOverlay.value = false
      if (appContainer) {
        appContainer.className = 'app-container'
      }
    }, 1500)
  }

  return {
    showFlashOverlay,
    alertPhase,
    playAlert
  }
}
