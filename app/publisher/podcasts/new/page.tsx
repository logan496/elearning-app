"use client"

import type React from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PublisherGuard } from "@/lib/guards/publisher-guard"
import { toast } from "sonner"
import { ArrowLeft, Save, Upload, Music, Video } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { SocialMediaShare } from "@/components/social-media-share"
import { useAuth } from "@/lib/contexts/auth-context"
import { MediaUpload } from "@/components/media-upload"
import { ThumbnailUpload } from "@/components/thumbnail-upload"

export default function NewPodcastPage() {
  const router = useRouter()
  const { user, token } = useAuth() // ✅ Utiliser le contexte d'authentification
  const [loading, setLoading] = useState(false)
  const [createdPodcastId, setCreatedPodcastId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "audio" as "audio" | "video",
    duration: 0,
    category: "",
    tags: "",
    autoShareOnPublish: false,
  })

  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>("")
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("")

  // ✅ Vérifier l'authentification au chargement
  useEffect(() => {
    if (!user || !token) {
      toast.error("Vous devez être connecté pour créer un podcast")
      router.push("/login")
    }
  }, [user, token, router])

  const handleMediaChange = (file: File | null, preview: string) => {
    if (!file) return

    const maxSize = formData.type === "audio" ? 20 * 1024 * 1024 : 50 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`Le fichier est trop volumineux (max ${formData.type === "audio" ? "20MB" : "50MB"})`)
      return
    }

    setMediaFile(file)
    setMediaPreview(preview)
  }

  const handleThumbnailChange = (file: File | null, preview: string) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image est trop volumineuse (max 5MB)")
      return
    }

    setThumbnailFile(file)
    setThumbnailPreview(preview)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Vérification du token avant la soumission
    if (!token) {
      toast.error("Session expirée. Veuillez vous reconnecter.")
      router.push("/login")
      return
    }

    if (!formData.title || !formData.description || !mediaFile) {
      toast.error("Veuillez remplir tous les champs obligatoires et ajouter un fichier média")
      return
    }

    if (formData.duration <= 0) {
      toast.error("La durée doit être supérieure à 0")
      return
    }

    try {
      setLoading(true)

      const formDataToSend = new FormData()

      formDataToSend.append("title", formData.title)
      formDataToSend.append("description", formData.description)
      formDataToSend.append("type", formData.type)
      formDataToSend.append("duration", String(formData.duration * 60))

      if (formData.category) {
        formDataToSend.append("category", formData.category)
      }

      if (formData.tags) {
        formDataToSend.append("tags", formData.tags)
      }

      formDataToSend.append("autoShareOnPublish", String(formData.autoShareOnPublish))
      formDataToSend.append("mediaFile", mediaFile)

      if (thumbnailFile) {
        formDataToSend.append("thumbnailFile", thumbnailFile)
      }

      console.log("Envoi de la requête avec le token:", token ? "Token présent" : "Token absent")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/podcasts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      })

      console.log("Statut de la réponse:", response.status)

      if (!response.ok) {
        // ✅ Gérer les erreurs d'authentification
        if (response.status === 401 || response.status === 403) {
          toast.error("Session expirée. Veuillez vous reconnecter.")
          router.push("/login")
          return
        }

        const error = await response.json().catch(() => ({ message: "Erreur inconnue" }))
        throw new Error(error.message || "Erreur lors de la création")
      }

      const podcast = await response.json()
      setCreatedPodcastId(podcast.id)
      toast.success("Podcast créé avec succès")

      if (!formData.autoShareOnPublish) {
        router.push("/publisher/podcasts")
      }
    } catch (error: any) {
      console.error("Error creating podcast:", error)
      toast.error(error.message || "Erreur lors de la création du podcast")
    } finally {
      setLoading(false)
    }
  }

  const handleShareComplete = () => {
    router.push("/publisher/podcasts")
  }

  // ✅ Ne rien afficher si pas authentifié
  if (!user || !token) {
    return null
  }

  if (createdPodcastId && formData.autoShareOnPublish) {
    return (
      <PublisherGuard>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
            <div className="container mx-auto max-w-4xl">
              <Card>
                <CardHeader>
                  <CardTitle>Partager votre podcast</CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialMediaShare
                    contentType="podcast"
                    contentId={createdPodcastId}
                    contentTitle={formData.title}
                    onComplete={handleShareComplete}
                  />
                </CardContent>
              </Card>
            </div>
          </main>
          <Footer />
        </div>
      </PublisherGuard>
    )
  }

  return (
    <PublisherGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/publisher/podcasts">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Link>
              </Button>
              <h1 className="text-4xl font-bold">Créer un Podcast</h1>
              <p className="text-muted-foreground mt-2">Partagez votre contenu audio ou vidéo avec votre audience</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Fichier média
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type de podcast *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "audio" | "video") => {
                        setFormData({ ...formData, type: value })
                        setMediaFile(null)
                        setMediaPreview("")
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="audio">
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4" />
                            Audio (max 20MB)
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Vidéo (max 50MB)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <MediaUpload
                    type={formData.type}
                    file={mediaFile}
                    preview={mediaPreview}
                    onFileSelected={handleMediaChange}
                    onFileRemoved={() => {
                      setMediaFile(null)
                      setMediaPreview("")
                    }}
                  />

                  <ThumbnailUpload
                    file={thumbnailFile}
                    preview={thumbnailPreview}
                    onFileSelected={handleThumbnailChange}
                    onFileRemoved={() => {
                      setThumbnailFile(null)
                      setThumbnailPreview("")
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Informations du podcast</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Titre de votre podcast"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Décrivez votre podcast..."
                      rows={5}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 0 })}
                        placeholder="30"
                        min="1"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Catégorie</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Technologie, Business, etc."
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (séparés par des virgules)</Label>
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="tech, dev, web"
                    />
                    <p className="text-sm text-muted-foreground">Exemple: technologie, développement, web</p>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoShare" className="cursor-pointer">
                        Partager automatiquement
                      </Label>
                      <p className="text-sm text-muted-foreground">Partager sur vos réseaux sociaux après création</p>
                    </div>
                    <Switch
                      id="autoShare"
                      checked={formData.autoShareOnPublish}
                      onCheckedChange={(checked) => setFormData({ ...formData, autoShareOnPublish: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1" size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {loading ? "Création en cours..." : "Créer le podcast"}
                </Button>
                <Button type="button" variant="outline" asChild size="lg">
                  <Link href="/publisher/podcasts">Annuler</Link>
                </Button>
              </div>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </PublisherGuard>
  )
}
