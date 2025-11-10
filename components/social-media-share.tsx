"use client"

import { useState, useEffect } from "react"
import { SocialMediaService } from "@/lib/api/generated"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Facebook, Twitter, Linkedin, Instagram, Share2, ExternalLink } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface SocialMediaShareProps {
  contentType: "podcasts" | "podcast" | "blog" | "course"
  contentId: number
  contentTitle: string
  contentUrl?: string
  onComplete?: () => void
}

export function SocialMediaShare({
                                   contentType,
                                   contentId,
                                   contentTitle,
                                   contentUrl,
                                   onComplete,
                                 }: SocialMediaShareProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingAccounts, setLoadingAccounts] = useState(true)

  useEffect(() => {
    loadConnectedAccounts()
  }, [])

  const loadConnectedAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const accounts = await SocialMediaService.socialControllerGetUserSocialAccounts()
      setConnectedAccounts(accounts)
    } catch (error) {
      console.error("[SocialMedia] Error loading accounts:", error)
      toast.error("Erreur lors du chargement des comptes")
    } finally {
      setLoadingAccounts(false)
    }
  }

  const handleShare = async () => {
    if (selectedPlatforms.length === 0) {
      toast.error("Veuillez sélectionner au moins une plateforme")
      return
    }

    try {
      setLoading(true)

      const getContentPath = () => {
        if (contentType === "podcast" || contentType === "podcasts") return "podcasts"
        if (contentType === "course") return "courses"
        return "blogs"
      }

      const shareUrl = contentUrl || `${window.location.origin}/${getContentPath()}/${contentId}`
      const shareText = `Découvrez: ${contentTitle}`

      for (const platform of selectedPlatforms) {
        const account = connectedAccounts.find((acc) => acc.platform === platform)
        if (!account) continue

        let shareLink = ""
        switch (platform.toLowerCase()) {
          case "facebook":
            shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
            break
          case "twitter":
            shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
            break
          case "linkedin":
            shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
            break
          case "instagram":
            toast.info("Instagram: Copiez le lien et partagez manuellement")
            navigator.clipboard.writeText(shareUrl)
            continue
        }

        if (shareLink) {
          window.open(shareLink, "_blank", "width=600,height=400")
        }
      }

      toast.success("Fenêtres de partage ouvertes")
      onComplete?.()
    } catch (error) {
      console.error("[SocialMedia] Error sharing content:", error)
      toast.error("Erreur lors du partage")
    } finally {
      setLoading(false)
    }
  }

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "facebook":
        return <Facebook className="h-5 w-5" />
      case "twitter":
        return <Twitter className="h-5 w-5" />
      case "linkedin":
        return <Linkedin className="h-5 w-5" />
      case "instagram":
        return <Instagram className="h-5 w-5" />
      default:
        return <Share2 className="h-5 w-5" />
    }
  }

  if (loadingAccounts) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-6 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (connectedAccounts.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <Share2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Aucun compte de réseau social connecté</p>
          <Button asChild>
            <a href="/profile">Connecter des comptes</a>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-2">Partager: {contentTitle}</h3>
        <p className="text-sm text-muted-foreground">
          Sélectionnez les plateformes sur lesquelles vous souhaitez partager
        </p>
      </div>

      <div className="space-y-3">
        {connectedAccounts.map((account) => (
          <Card key={account.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getPlatformIcon(account.platform)}
                  <div>
                    <p className="font-medium capitalize">{account.platform}</p>
                    <p className="text-sm text-muted-foreground">
                      {account.platformUsername ? `@${account.platformUsername}` : "Connecté"}
                    </p>
                  </div>
                </div>
                <Checkbox
                  id={`platform-${account.id}`}
                  checked={selectedPlatforms.includes(account.platform)}
                  onCheckedChange={() => togglePlatform(account.platform)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button onClick={handleShare} disabled={loading || selectedPlatforms.length === 0} className="flex-1">
          <ExternalLink className="mr-2 h-4 w-4" />
          {loading ? "Ouverture..." : "Partager"}
        </Button>
        {onComplete && (
          <Button variant="outline" onClick={onComplete}>
            Passer
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Les fenêtres de partage s'ouvriront dans de nouveaux onglets
      </p>
    </div>
  )
}
