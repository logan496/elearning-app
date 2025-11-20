"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Play, Pause, Volume2, VolumeX, Download, Maximize, Minimize } from 'lucide-react'
import { getThumbnailUrl } from "@/lib/utils/media"

interface PodcastPlayerModalProps {
  isOpen: boolean
  onClose: () => void
  podcast: {
    id: number
    title: string
    description: string
    type: "audio" | "video"
    duration: number
    category?: string
    thumbnailUrl?: string
    coverImage?: string
    mediaUrl?: string
  }
}

export function PodcastPlayerModal({ isOpen, onClose, podcast }: PodcastPlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [showVolumeControl, setShowVolumeControl] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isVideoLoading, setIsVideoLoading] = useState(true)

  const thumbnailUrl = getThumbnailUrl(podcast.coverImage, podcast.thumbnailUrl)

  const mediaElement = podcast.type === "video" ? videoRef.current : audioRef.current

  useEffect(() => {
    if (!isOpen && mediaElement) {
      mediaElement.pause()
      setIsPlaying(false)
      setIsFullscreen(false)
    }
  }, [isOpen, mediaElement])

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = document.fullscreenElement !== null
      setIsFullscreen(isCurrentlyFullscreen)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const handlePlayPause = () => {
    if (!mediaElement) return
    if (isPlaying) {
      mediaElement.pause()
      setIsPlaying(false)
    } else {
      mediaElement.play()
      setIsPlaying(true)
    }
  }

  const handleFullscreenToggle = () => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {
        console.error("Cannot enter fullscreen")
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number.parseFloat(e.target.value)
    setVolume(newVolume)
    if (mediaElement) {
      mediaElement.volume = newVolume
      setIsMuted(newVolume === 0)
    }
  }

  const handleToggleMute = () => {
    if (!mediaElement) return
    if (isMuted) {
      mediaElement.volume = volume === 0 ? 0.5 : volume
      setIsMuted(false)
    } else {
      mediaElement.volume = 0
      setIsMuted(true)
    }
  }

  const handleTimeUpdate = () => {
    if (mediaElement) {
      setCurrentTime(mediaElement.currentTime)
    }
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number.parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (mediaElement) {
      mediaElement.currentTime = newTime
    }
  }

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return "0:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  if (isFullscreen) {
    return (
        <div ref={containerRef} className="fixed inset-0 z-[9999] bg-black flex flex-col">
          {podcast.type === "video" ? (
              <div className="relative flex-1 bg-black">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => setIsPlaying(false)}
                    poster={thumbnailUrl || undefined}
                >
                  <source src={podcast.mediaUrl} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo
                </video>
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <button
                          onClick={handlePlayPause}
                          className="p-6 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                      >
                        <Play className="w-12 h-12 text-white fill-white" />
                      </button>
                    </div>
                )}
              </div>
          ) : (
              <div className="flex-1 flex flex-col items-center justify-center bg-black">
                {thumbnailUrl && (
                    <img
                        src={thumbnailUrl || "/placeholder.svg"}
                        alt={podcast.title}
                        className="w-48 h-48 rounded-lg object-cover mb-12 shadow-2xl"
                    />
                )}
                <button
                    onClick={handlePlayPause}
                    className="p-6 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                >
                  {isPlaying ? (
                      <Pause className="w-12 h-12 text-white fill-white" />
                  ) : (
                      <Play className="w-12 h-12 text-white fill-white" />
                  )}
                </button>
              </div>
          )}

          <div className="bg-black/80 backdrop-blur-xl p-6 space-y-4">
            <div className="space-y-2">
              <input
                  type="range"
                  min="0"
                  max={mediaElement?.duration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-sm text-white/70">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(mediaElement?.duration || 0)}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/10">
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </Button>

                <div className="relative flex items-center">
                  <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleToggleMute}
                      onMouseEnter={() => setShowVolumeControl(true)}
                      onMouseLeave={() => setShowVolumeControl(false)}
                      className="text-white hover:bg-white/10"
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </Button>
                  {showVolumeControl && (
                      <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          onMouseEnter={() => setShowVolumeControl(true)}
                          onMouseLeave={() => setShowVolumeControl(false)}
                          className="absolute bottom-full mb-2 h-24 w-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                          style={
                            {
                              writingMode: "bt-lr",
                            } as React.CSSProperties
                          }
                      />
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFullscreenToggle}
                    className="text-white hover:bg-white/10"
                >
                  <Minimize className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full p-0 border-0 bg-black/95 backdrop-blur-xl">
          <DialogTitle className="sr-only">{podcast.title}</DialogTitle>

          <div className="relative">
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>

            <div className="space-y-6 p-8">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden">
                {podcast.type === "video" ? (
                    <div className="relative aspect-video bg-black">
                      <video
                          ref={videoRef}
                          className="w-full h-full object-contain"
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={() => setIsPlaying(false)}
                          poster={thumbnailUrl || undefined}
                          onLoadedMetadata={() => setIsVideoLoading(false)}
                      >
                        <source src={podcast.mediaUrl} type="video/mp4" />
                        Votre navigateur ne supporte pas la lecture vidéo
                      </video>
                      {!isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <button
                                onClick={handlePlayPause}
                                className="p-4 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                            >
                              <Play className="w-8 h-8 text-white fill-white" />
                            </button>
                          </div>
                      )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 px-8 bg-gradient-to-br from-primary/10 to-transparent">
                      {thumbnailUrl && (
                          <img
                              src={thumbnailUrl || "/placeholder.svg"}
                              alt={podcast.title}
                              className="w-40 h-40 rounded-lg object-cover mb-8 shadow-xl"
                          />
                      )}
                      <audio
                          ref={audioRef}
                          className="w-full mb-8"
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={() => setIsPlaying(false)}
                      >
                        <source src={podcast.mediaUrl} type="audio/mpeg" />
                        Votre navigateur ne supporte pas la lecture audio
                      </audio>
                      <button
                          onClick={handlePlayPause}
                          className="p-4 rounded-full bg-primary hover:bg-primary/90 transition-colors"
                      >
                        {isPlaying ? (
                            <Pause className="w-8 h-8 text-white fill-white" />
                        ) : (
                            <Play className="w-8 h-8 text-white fill-white" />
                        )}
                      </button>
                    </div>
                )}
              </div>

              <div className="space-y-4 text-white">
                <div className="space-y-2">
                  <input
                      type="range"
                      min="0"
                      max={mediaElement?.duration || 0}
                      value={currentTime}
                      onChange={handleProgressChange}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs text-white/70">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(mediaElement?.duration || 0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/10">
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </Button>

                    <div className="relative flex items-center">
                      <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleToggleMute}
                          onMouseEnter={() => setShowVolumeControl(true)}
                          onMouseLeave={() => setShowVolumeControl(false)}
                          className="text-white hover:bg-white/10"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                      </Button>
                      {showVolumeControl && (
                          <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={isMuted ? 0 : volume}
                              onChange={handleVolumeChange}
                              onMouseEnter={() => setShowVolumeControl(true)}
                              onMouseLeave={() => setShowVolumeControl(false)}
                              className="absolute bottom-full mb-2 h-24 w-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                              style={
                                {
                                  writingMode: "bt-lr",
                                } as React.CSSProperties
                              }
                          />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                  <span className="text-sm text-white/70">
                    {formatTime(currentTime)} / {formatTime(mediaElement?.duration || 0)}
                  </span>
                    {podcast.type === "video" && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleFullscreenToggle}
                            className="text-white hover:bg-white/10"
                        >
                          <Maximize className="w-5 h-5" />
                        </Button>
                    )}
                    {podcast.mediaUrl && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (podcast.mediaUrl) {
                                const link = document.createElement("a")
                                link.href = podcast.mediaUrl
                                link.download = `${podcast.title}.${podcast.type === "video" ? "mp4" : "mp3"}`
                                link.click()
                              }
                            }}
                            className="text-white hover:bg-white/10"
                        >
                          <Download className="w-5 h-5" />
                        </Button>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-lg font-semibold mb-2">{podcast.title}</h3>
                  <p className="text-sm text-white/70 line-clamp-2">{podcast.description}</p>
                  {podcast.category && <p className="text-xs text-white/50 mt-2">Catégorie: {podcast.category}</p>}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}
