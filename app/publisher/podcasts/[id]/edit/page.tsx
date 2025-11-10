"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { PodcastsService } from "@/lib/api/generated"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PublisherGuard } from "@/lib/guards/publisher-guard"
import { toast } from "sonner"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PodcastFormData {
  title: string
  description: string
  type: "audio" | "video"
  duration: number
  tags: string[]
  category: string
}

export default function EditPodcastPage() {
  const router = useRouter()
  const params = useParams()
  const podcastId = Number.parseInt(params.id as string)
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [formData, setFormData] = useState<PodcastFormData>({
    title: "",
    description: "",
    type: "audio",
    duration: 0,
    tags: [],
    category: "OTHER",
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    loadPodcast()
  }, [podcastId])

  const loadPodcast = async () => {
    try {
      setLoadingData(true)
      const podcast = await PodcastsService.podcastControllerGetPodcastById(podcastId)
      setFormData({
        title: podcast.title,
        description: podcast.description,
        type: podcast.type,
        duration: podcast.duration,
        tags: podcast.tags || [],
        category: podcast.category,
      })
    } catch (error) {
      console.error("[Publisher] Error loading podcasts:", error)
      toast.error("Erreur lors du chargement du podcasts")
      router.push("/publisher/podcasts")
    } finally {
      setLoadingData(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    try {
      setLoading(true)
      await PodcastsService.podcastControllerUpdatePodcast(podcastId, formData as any)
      toast.success("Podcast mis à jour avec succès")
      router.push("/publisher/podcasts")
    } catch (error) {
      console.error("[Publisher] Error updating podcasts:", error)
      toast.error("Erreur lors de la mise à jour du podcasts")
    } finally {
      setLoading(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    })
  }

  if (loadingData) {
    return (
      <PublisherGuard>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
            <div className="container mx-auto max-w-4xl">
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-8 bg-muted rounded w-1/2" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-10 bg-muted rounded" />
                  <div className="h-32 bg-muted rounded" />
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
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/publisher/podcasts">
                  <ArrowLeft className="mr-2" />
                  Retour
                </Link>
              </Button>
              <h1 className="text-4xl font-bold">Modifier le Podcast</h1>
            </div>

            <form onSubmit={handleSubmit}>
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
                      placeholder="Description de votre podcast"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value: "audio" | "video") =>
                          setFormData({
                            ...formData,
                            type: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="audio">Audio</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="30"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="Technologie, Business, etc."
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        placeholder="Ajouter un tag"
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Ajouter
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {tag}
                            <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      <Save className="mr-2" />
                      {loading ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/publisher/podcasts">Annuler</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </PublisherGuard>
  )
}
