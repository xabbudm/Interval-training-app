export function useWakeLock() {
  let wakeLock = null

  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock = await navigator.wakeLock.request('screen')
        console.log('Screen wake lock acquired')
      }
    } catch (error) {
      console.log('Wake lock not available or failed:', error)
    }
  }

  const releaseWakeLock = async () => {
    try {
      if (wakeLock) {
        await wakeLock.release()
        wakeLock = null
        console.log('Screen wake lock released')
      }
    } catch (error) {
      console.error('Failed to release wake lock:', error)
    }
  }

  return {
    requestWakeLock,
    releaseWakeLock
  }
}
