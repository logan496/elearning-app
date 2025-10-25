"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, Calendar } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { PodcastsService as PodcastService } from "@/lib/api/generated/services/PodcastsService"
import { useState, useEffect } from "react"
import type { PodcastResponseDto } from "@/lib/api/generated"

const podcasts = [
  {
    id: 1,
    title: "Les fondamentaux du développement web",
    description: "Découvrez les bases essentielles pour débuter dans le développement web moderne",
    duration: "45 min",
    date: "15 Jan 2025",
    image: "/web-development-podcast.png",
  },
  {
    id: 2,
    title: "Intelligence artificielle et apprentissage",
    description: "Comment l'IA transforme les méthodes d'apprentissage et d'enseignement",
    duration: "38 min",
    date: "10 Jan 2025",
    image: "/ai-learning-podcast.jpg",
  },
  {
    id: 3,
    title: "Réussir sa reconversion professionnelle",
    description: "Conseils pratiques pour changer de carrière avec succès grâce à la formation",
    duration: "52 min",
    date: "5 Jan 2025",
    image: "/career-change-podcast.jpg",
  },
  {
    id: 4,
    title: "Design thinking et créativité",
    description: "Développez votre créativité avec les méthodes du design thinking",
    duration: "41 min",
    date: "28 Déc 2024",
    image: "/design-thinking-podcast.jpg",
  },
  {
    id: 5,
    title: "Gestion de projet agile",
    description: "Maîtrisez les méthodologies agiles pour gérer vos projets efficacement",
    duration: "47 min",
    date: "20 Déc 2024",
    image: "/agile-project-podcast.jpg",
  },
  {
    id: 6,
    title: "Marketing digital en 2025",
    description: "Les tendances et stratégies du marketing digital pour cette année",
    duration: "55 min",
    date: "15 Déc 2024",
    image: "/digital-marketing-podcast.jpg",
  },
]

export default function PodcastsPage() {
  const { t } = useI18n()
  const [apiPodcasts, setApiPodcasts] = useState<PodcastResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        const data = await PodcastService.podcastControllerGetAllPodcasts()
        setApiPodcasts(data)
      } catch (error) {
        console.error("[v0] Failed to load podcasts:", error)
        // Keep using mock data on error
      } finally {
        setIsLoading(false)
      }
    }

    loadPodcasts()
  }, [])

  const displayPodcasts = apiPodcasts.length > 0 ? apiPodcasts : podcasts

  return (
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 pb-20 px-4 lg:px-8">
          <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t.podcasts.title.split(" ")[0]} <span className="text-primary">{t.podcasts.title.split(" ")[1]}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                {t.podcasts.subtitle}
              </p>
            </div>

            {/* Featured Podcast */}
            <Card className="mb-16 overflow-hidden border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="aspect-video lg:aspect-auto bg-muted relative group">
                  <img
                      src="/featured-podcast-studio.jpg"
                      alt="Podcast en vedette"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <Button
                      size="lg"
                      className="absolute bottom-6 left-6 rounded-full w-16 h-16 p-0 hover:scale-110 transition-transform duration-200 hover:shadow-xl animate-pulse"
                  >
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </Button>
                </div>
                <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4 w-fit">
                    {t.podcasts.featured}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">L'avenir de l'éducation en ligne</h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Une discussion approfondie sur les innovations qui transforment l'apprentissage numérique et les
                    opportunités qu'elles créent pour les apprenants du monde entier.
                  </p>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>62 {t.podcasts.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>20 Jan 2025</span>
                    </div>
                  </div>
                  <Button size="lg" className="w-fit hover:scale-105 transition-transform duration-200 hover:shadow-lg">
                    Écouter maintenant
                  </Button>
                </CardContent>
              </div>
            </Card>

            {/* Podcast Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-muted-foreground text-lg">Chargement des podcasts...</div>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {displayPodcasts.map((podcast) => (
                      <Card
                          key={podcast.id}
                          className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:border-primary/50 hover:scale-105"
                      >
                        <div className="aspect-video bg-muted relative overflow-hidden">
                          <img
                              src={
                                "audioUrl" in podcast
                                    ? `/placeholder.svg?height=400&width=600&query=${encodeURIComponent(podcast.title)}`
                                    : podcast.image || "/placeholder.svg"
                              }
                              alt={podcast.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                            <Button
                                size="lg"
                                className="rounded-full w-14 h-14 p-0 scale-90 group-hover:scale-100 transition-transform duration-300"
                                variant="secondary"
                            >
                              <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-3 text-balance group-hover:text-primary transition-colors duration-300">
                            {podcast.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 leading-relaxed text-sm">{podcast.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>
                          {"duration" in podcast && typeof podcast.duration === "number"
                              ? `${Math.floor(podcast.duration / 60)} min`
                              : podcast.duration}
                        </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                          {"createdAt" in podcast
                              ? new Date(podcast.createdAt).toLocaleDateString("fr-FR")
                              : podcast.date}
                        </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  ))}
                </div>
            )}
          </div>
        </div>
      </div>
  )
}
