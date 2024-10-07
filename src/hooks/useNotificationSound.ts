import { useEffect, useRef, useState } from "react"

const useNotificationSound = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [canPlay, setCanPlay] = useState(false)

  useEffect(() => {
    // Tạo audio element khi component mount
    audioRef.current = new Audio(audioUrl)

    // Cleanup khi component unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioUrl])

  useEffect(() => {
    const enableAudio = () => setCanPlay(true)

    // Listen for user interaction to enable audio playback
    document.addEventListener("click", enableAudio)
    document.addEventListener("keydown", enableAudio)

    return () => {
      document.removeEventListener("click", enableAudio)
      document.removeEventListener("keydown", enableAudio)
    }
  }, [])

  const playSound = () => {
    if (canPlay && audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error)
      })
    }
  }

  return playSound
}

export default useNotificationSound
