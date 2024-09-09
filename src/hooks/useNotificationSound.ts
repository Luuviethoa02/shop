import { useEffect, useRef } from "react"

const useNotificationSound = (audioUrl: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null)

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

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error)
      })
    }
  }

  return playSound
}

export default useNotificationSound
