"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ImageIcon } from "lucide-react"
import { toast } from "sonner"

interface ThumbnailUploadProps {
  onFileSelected: (file: File, preview: string) => void
  onFileRemoved: () => void
  file: File | null
  preview: string
}

export function ThumbnailUpload({ onFileSelected, onFileRemoved, file, preview }: ThumbnailUploadProps) {
  const maxSize = 5 * 1024 * 1024

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (selectedFile.size > maxSize) {
      toast.error("L'image est trop volumineuse (max 5MB)")
      return
    }

    const previewUrl = URL.createObjectURL(selectedFile)
    onFileSelected(selectedFile, previewUrl)
  }

  return (
    <div className="space-y-3">
      <Label htmlFor="thumbnail-file">Image miniature (optionnel, max 5MB)</Label>

      {!file ? (
        <div className="relative border-2 border-dashed border-border rounded-lg p-8 flex flex-col items-center justify-center hover:border-primary/50 transition-colors">
          <Input
            id="thumbnail-file"
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground text-center">Cliquez ou déposez une image</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WebP... • Max 5MB</p>
        </div>
      ) : (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted group">
          <img
            src={preview || "/placeholder.svg"}
            alt="Aperçu de la miniature"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => {
              onFileRemoved()
              const input = document.getElementById("thumbnail-file") as HTMLInputElement
              if (input) input.value = ""
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
