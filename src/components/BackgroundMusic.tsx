'use client'

import { useState, useEffect, useRef } from 'react'

export default function BackgroundMusic({ url }: { url: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = 0.4

    const getDirectUrl = (originalUrl: string) => {
      let url = originalUrl
      if (url.startsWith('http://')) url = url.replace('http://', 'https://')
      if (url.includes('drive.google.com')) {
        const fileId = url.match(/\/d\/([^/]+)/)?.[1] || url.match(/id=([^&]+)/)?.[1]
        if (fileId) return `https://drive.google.com/uc?id=${fileId}&export=download`
      }
      return url
    }

    const musicUrl = getDirectUrl(url)
    if (audioRef.current && musicUrl && audioRef.current.src !== musicUrl) {
      audioRef.current.src = musicUrl
      audioRef.current.load()
    }

    const handleInteraction = () => {
      if (audioRef.current && audioRef.current.paused && !isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
      }
      removeListeners()
    }
    const removeListeners = () => {
      window.removeEventListener('click', handleInteraction)
      window.removeEventListener('scroll', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
    }
    window.addEventListener('click', handleInteraction)
    window.addEventListener('scroll', handleInteraction)
    window.addEventListener('touchstart', handleInteraction)
    return () => removeListeners()
  }, [url])

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (audioRef.current) {
      if (isPlaying) { audioRef.current.pause(); setIsPlaying(false) }
      else { audioRef.current.play(); setIsPlaying(true) }
    }
  }

  if (!url) return null

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <audio ref={audioRef} loop onError={() => setHasError(true)} />
      <button onClick={togglePlay} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 ${hasError ? 'bg-slate-400 text-white' : isPlaying ? 'bg-white text-rose-500' : 'bg-rose-500 text-white'}`}>
        {hasError ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 9v2m0 4h.01M10.29 3.86l-7 12.95A2 2 0 0 0 4.93 19h14.14a2 2 0 0 0 1.64-3.19l-7-12.95a2 2 0 0 0-3.42 0z"/></svg>
        ) : isPlaying ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z"/></svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/><path d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>
        )}
      </button>
    </div>
  )
}
