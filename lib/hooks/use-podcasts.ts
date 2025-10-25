"use client"

import { useState, useEffect } from "react"
import { PodcastsService } from "@/lib/api/generated"
import type { PodcastResponseDto, CreatePodcastDto } from "@/lib/api/generated"

export function usePodcasts() {
    const [podcasts, setPodcasts] = useState<PodcastResponseDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        loadPodcasts()
    }, [])

    const loadPodcasts = async () => {
        try {
            setIsLoading(true)
            const data = await PodcastsService.podcastControllerGetAllPodcasts()
            setPodcasts(data)
            setError(null)
        } catch (err) {
            setError(err as Error)
            console.error("[v0] Failed to load podcasts:", err)
        } finally {
            setIsLoading(false)
        }
    }

    const createPodcast = async (data: CreatePodcastDto) => {
        const newPodcast = await PodcastsService.podcastControllerCreatePodcast(data)
        setPodcasts([...podcasts, newPodcast])
        return newPodcast
    }

    const deletePodcast = async (id: number) => {
        await PodcastsService.podcastControllerDeletePodcast(id)
        setPodcasts(podcasts.filter((p) => p.id !== id))
    }

    return {
        podcasts,
        isLoading,
        error,
        loadPodcasts,
        createPodcast,
        deletePodcast,
    }
}
