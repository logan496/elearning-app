"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, Music, Play } from "lucide-react"
import { toast } from "sonner"

interface MediaUploadProps {
  type: "audio" | "video"
  onFileSelected: (file: File, preview: string) => void
  onFileRemoved: () => void
  file: File | null
  preview: string
}

export function MediaUpload({ type, onFileSelected, onFileRemoved, file, preview }: MediaUploadProps) {
  const maxSizeAudio = 20 * 1024 * 1024
  const maxSizeVideo = 50 * 1024 * 1024
  const maxSize = type === "audio" ? maxSizeAudio : maxSizeVideo
  const maxSizeMB = type === "audio" ? 20 : 50

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > maxSize) {
      toast.error(`Le fichier est trop volumineux (max ${maxSizeMB}MB)`)
      return
    }

    const previewUrl = URL.createObjectURL(selectedFile)
    onFileSelected(selectedFile, previewUrl)
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={`${type}-file`}>
        Fichier {type === "audio" ? "audio" : "vidéo"} *
        {file && (
          <span className="text-sm text-muted-foreground ml-2">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
        )}
      </Label>

      {!file ? (
        <div className="relative">
          <Input
            id={`${type}-file`}
            type="file"
            accept={type === "audio" ? "audio/*" : "video/*"}
            onChange={handleChange}
            className="cursor-pointer"
            aria-label={`Télécharger un fichier ${type}`}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Upload className="h-4 w-4" />
              <span className="text-sm">Cliquez ou déposez un fichier</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg flex items-start justify-between">
            <div className="flex items-center gap-3">
              {type === "audio" ? (
                <Music className="h-8 w-8 text-primary flex-shrink-0" />
              ) : (
                <Play className="h-8 w-8 text-primary flex-shrink-0" />
              )}
              <div>
                <p className="font-medium text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                onFileRemoved()
                const input = document.getElementById(`${type}-file`) as HTMLInputElement
                if (input) input.value = ""
              }}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {type === "video" && preview && (
            <video src={preview} controls className="w-full max-h-64 rounded-lg bg-black" />
          )}
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Format accepté: {type === "audio" ? "MP3, WAV, AAC..." : "MP4, WebM, Ogg..."} • Max {maxSizeMB}MB
      </p>
    </div>
  )
}
