"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Play, Clock, Calendar, Music, Video, Search, Heart } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"
import { PodcastsService } from "@/lib/api/generated/services/PodcastsService"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const PodcastsPage = () => {
  const { t } = useI18n()
  const [podcasts, setPodcasts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterCategory, setFilterCategory] = useState<string>("all")

  useEffect(() => {
    loadPodcasts()
  }, [filterType, filterCategory])

  const loadPodcasts = async () => {
    try {
      setIsLoading(true)
      const data = await PodcastsService.podcastControllerGetAllPodcasts(
        undefined,
        undefined,
        filterType !== "all" ? filterType : undefined,
        filterCategory !== "all" ? filterCategory : undefined,
      )
      console.log("[v0] API Response:", data)
      const podcastsArray = data?.podcasts || []
      setPodcasts(Array.isArray(podcastsArray) ? podcastsArray : [])
    } catch (error) {
      console.error("Failed to load podcasts:", error)
      setPodcasts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadPodcasts()
      return
    }

    try {
      setIsLoading(true)
      const data = await PodcastsService.podcastControllerSearchPodcasts(searchQuery)
      const podcastsArray = data?.podcasts || data || []
      setPodcasts(Array.isArray(podcastsArray) ? podcastsArray : [])
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = Array.from(new Set(podcasts.map((p) => p.category).filter(Boolean)))

  return (
    <div className="min-h-screen">
      <Navigation />

      <div className="pt-24 pb-20 px-4 lg:px-8">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {t.podcasts.title.split(" ")[0]} <span className="text-primary">{t.podcasts.title.split(" ")[1]}</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              {t.podcasts.subtitle}
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un podcast..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="audio">Audio</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                  </SelectContent>
                </Select>
                {categories.length > 0 && (
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button type="submit">Rechercher</Button>
              </form>
            </CardContent>
          </Card>

          {/* Podcast Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="aspect-video w-full bg-muted" />
                  <CardContent className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-3" />
                    <div className="h-4 bg-muted rounded w-full mb-2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : podcasts.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Music className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun podcast trouvé</h3>
                <p className="text-muted-foreground">Essayez de modifier vos critères de recherche</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {podcasts.map((podcast) => (
                <Card
                  key={podcast.id}
                  className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:border-primary/50 hover:scale-105"
                >
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {podcast.thumbnailUrl ? (
                      <img
                        src={podcast.thumbnailUrl || "/placeholder.svg"}
                        alt={podcast.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                        {podcast.type === "audio" ? (
                          <Music className="h-20 w-20 text-primary" />
                        ) : (
                          <Video className="h-20 w-20 text-primary" />
                        )}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <Button
                        size="lg"
                        className="rounded-full w-14 h-14 p-0 scale-90 group-hover:scale-100 transition-transform duration-300"
                        variant="secondary"
                      >
                        <Play className="w-5 h-5 ml-0.5" fill="currentColor" />
                      </Button>
                    </div>
                    <Badge
                      className="absolute top-2 left-2"
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
                    {podcast.category && (
                      <Badge className="absolute top-2 right-2" variant="outline">
                        {podcast.category}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-balance group-hover:text-primary transition-colors duration-300 line-clamp-2">
                      {podcast.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 leading-relaxed text-sm line-clamp-2">
                      {podcast.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{podcast.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{new Date(podcast.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                      {podcast.likesCount !== undefined && (
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5" />
                          <span>{podcast.likesCount}</span>
                        </div>
                      )}
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

export default PodcastsPage
