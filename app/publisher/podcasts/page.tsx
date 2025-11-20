"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { PodcastsService } from "@/lib/api/generated"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { PublisherGuard } from "@/lib/guards/publisher-guard"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Share2, Music, Video, Eye, Clock, Upload } from 'lucide-react'
import Link from "next/link"
import { SocialMediaShare } from "@/components/social-media-share"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { getThumbnailUrl } from "@/lib/utils/media"

export default function PodcastsPage() {
  const [podcasts, setPodcasts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [publishingId, setPublishingId] = useState<number | null>(null)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [selectedPodcast, setSelectedPodcast] = useState<any>(null)

  useEffect(() => {
    loadPodcasts()
  }, [])

  const loadPodcasts = async () => {
    try {
      setLoading(true)
      const data = await PodcastsService.podcastControllerGetMyPodcasts()
      const podcastsArray = data?.podcasts || data || []
      console.log('[v0] Loaded publisher podcasts:', podcastsArray)
      if (podcastsArray.length > 0) {
        console.log('[v0] First publisher podcast sample:', podcastsArray[0])
      }
      setPodcasts(Array.isArray(podcastsArray) ? podcastsArray : [])
    } catch (error) {
      console.error("Error loading podcasts:", error)
      toast.error("Erreur lors du chargement des podcasts")
      setPodcasts([])
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (id: number) => {
    try {
      setPublishingId(id)
      await PodcastsService.podcastControllerPublishPodcast(id)
      toast.success("Podcast publié avec succès")
      loadPodcasts()
    } catch (error) {
      console.error("Error publishing podcast:", error)
      toast.error("Erreur lors de la publication du podcast")
    } finally {
      setPublishingId(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce podcast ?")) return

    try {
      await PodcastsService.podcastControllerDeletePodcast(id)
      toast.success("Podcast supprimé avec succès")
      loadPodcasts()
    } catch (error) {
      console.error("Error deleting podcast:", error)
      toast.error("Erreur lors de la suppression du podcast")
    }
  }

  const handleShare = (podcast: any) => {
    setSelectedPodcast(podcast)
    setShareDialogOpen(true)
  }

  return (
      <PublisherGuard>
        <div className="min-h-screen flex flex-col">
          <Navigation />

          <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
            <div className="container mx-auto max-w-7xl">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">Mes Podcasts</h1>
                    <p className="text-muted-foreground">Gérez vos podcasts et partagez-les avec votre audience</p>
                  </div>
                  <Button asChild size="lg">
                    <Link href="/publisher/podcasts/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau podcast
                    </Link>
                  </Button>
                </div>

                {!loading && podcasts.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total</p>
                              <p className="text-2xl font-bold">{podcasts.length}</p>
                            </div>
                            <Music className="h-8 w-8 text-muted-foreground" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Audio</p>
                              <p className="text-2xl font-bold">{podcasts.filter((p) => p.type === "audio").length}</p>
                            </div>
                            <Music className="h-8 w-8 text-blue-500" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Vidéo</p>
                              <p className="text-2xl font-bold">{podcasts.filter((p) => p.type === "video").length}</p>
                            </div>
                            <Video className="h-8 w-8 text-purple-500" />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                )}
              </div>

              {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="animate-pulse">
                          <div className="aspect-video w-full bg-muted" />
                          <CardHeader>
                            <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                            <div className="h-4 bg-muted rounded w-full" />
                          </CardHeader>
                        </Card>
                    ))}
                  </div>
              ) : podcasts.length === 0 ? (
                  <Card>
                    <CardContent className="py-16 text-center">
                      <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Aucun podcast</h3>
                      <p className="text-muted-foreground mb-6">Commencez à partager votre contenu audio et vidéo</p>
                      <Button asChild size="lg">
                        <Link href="/publisher/podcasts/new">
                          <Plus className="mr-2 h-4 w-4" />
                          Créer votre premier podcast
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
              ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {podcasts.map((podcast) => {
                      const thumbnailUrl = getThumbnailUrl(podcast.coverImage, podcast.thumbnailUrl)
                      console.log('[v0] Publisher Podcast:', podcast.title, 'thumbnailUrl:', thumbnailUrl)

                      return (
                          <Card key={podcast.id} className="group hover:shadow-lg transition-all duration-300">
                            <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted relative">
                              {thumbnailUrl ? (
                                  <img
                                      src={thumbnailUrl || "/placeholder.svg"}
                                      alt={podcast.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      onError={(e) => {
                                        console.error('[v0] Publisher image failed to load:', thumbnailUrl)
                                        e.currentTarget.style.display = 'none'
                                      }}
                                  />
                              ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                                    {podcast.type === "audio" ? (
                                        <Music className="h-16 w-16 text-primary" />
                                    ) : (
                                        <Video className="h-16 w-16 text-primary" />
                                    )}
                                  </div>
                              )}
                              <Badge
                                  className="absolute top-2 right-2"
                                  variant={podcast.type === "audio" ? "default" : "secondary"}
                              >
                                {podcast.type === "audio" ? (
                                    <>
                                      <Music className="h-3 w-3 mr-1" /> Audio
                                    </>
                                ) : (
                                    <>
                                      <Video className="h-3 w-3 mr-1" /> Vidéo
                                    </>
                                )}
                              </Badge>
                              {podcast.isPublished === false && (
                                  <Badge className="absolute top-2 left-2" variant="outline">
                                    Brouillon
                                  </Badge>
                              )}
                            </div>
                            <CardHeader>
                              <CardTitle className="text-lg line-clamp-2">{podcast.title}</CardTitle>
                              <CardDescription className="line-clamp-2">{podcast.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{podcast.duration} min</span>
                                </div>
                                {podcast.viewsCount !== undefined && (
                                    <div className="flex items-center gap-1">
                                      <Eye className="h-4 w-4" />
                                      <span>{podcast.viewsCount}</span>
                                    </div>
                                )}
                              </div>

                              {podcast.status !== "published" && (
                                  <Button
                                      size="sm"
                                      className="w-full mb-2"
                                      onClick={() => handlePublish(podcast.id)}
                                      disabled={publishingId === podcast.id}
                                  >
                                    <Upload className="mr-2 h-4 w-4" />
                                    {publishingId === podcast.id ? "Publication..." : "Publier le podcast"}
                                  </Button>
                              )}

                              <div className="flex gap-2">
                                <Button asChild size="sm" variant="outline" className="flex-1 bg-transparent">
                                  <Link href={`/publisher/podcasts/${podcast.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Modifier
                                  </Link>
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleShare(podcast)}>
                                  <Share2 className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => handleDelete(podcast.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                      )
                    })}
                  </div>
              )}
            </div>
          </main>

          <Footer />
        </div>

        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Partager le podcast</DialogTitle>
            </DialogHeader>
            {selectedPodcast && (
                <SocialMediaShare
                    contentType="podcast"
                    contentId={selectedPodcast.id}
                    contentTitle={selectedPodcast.title}
                    onComplete={() => setShareDialogOpen(false)}
                />
            )}
          </DialogContent>
        </Dialog>
      </PublisherGuard>
  )
}
