"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { UsersService, SocialMediaService, type UpdateUserDto } from "@/lib/api/generated"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Save, LinkIcon, Unlink, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ProfilePage() {
  const { user, isAuthenticated, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [formData, setFormData] = useState<UpdateUserDto>({
    username: "",
    email: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
      })
      loadConnectedAccounts()
    }
  }, [user])

  const loadConnectedAccounts = async () => {
    try {
      setLoadingAccounts(true)
      const accounts = await SocialMediaService.socialControllerGetUserSocialAccounts()
      setConnectedAccounts(accounts)
    } catch (error) {
      console.error("[Profile] Error loading accounts:", error)
    } finally {
      setLoadingAccounts(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.id) return

    try {
      setLoading(true)
      const updatedUser = await UsersService.usersControllerUpdateUser(user.id, formData)
      updateUser(updatedUser)
      toast.success("Profil mis à jour avec succès")
    } catch (error) {
      console.error("[Profile] Error updating profile:", error)
      toast.error("Erreur lors de la mise à jour du profil")
    } finally {
      setLoading(false)
    }
  }

  const handleConnectAccount = async (platform: string) => {
    try {
      // In a real implementation, this would redirect to OAuth flow
      // For now, we'll show a message about OAuth
      const platformLower = platform.toLowerCase()

      // Construct OAuth URL based on platform
      let oauthUrl = ""
      switch (platformLower) {
        case "facebook":
          oauthUrl = "/api/social/auth/facebook"
          break
        case "twitter":
          oauthUrl = "/api/social/auth/twitter"
          break
        case "linkedin":
          oauthUrl = "/api/social/auth/linkedin"
          break
        case "instagram":
          toast.info("Instagram: Connexion OAuth à venir")
          return
      }

      if (oauthUrl) {
        // Redirect to OAuth flow
        window.location.href = oauthUrl
      }
    } catch (error) {
      console.error("[Profile] Error connecting account:", error)
      toast.error("Erreur lors de la connexion du compte")
    }
  }

  const handleDisconnectAccount = async (platform: string) => {
    if (!confirm("Êtes-vous sûr de vouloir déconnecter ce compte ?")) return

    try {
      await SocialMediaService.socialControllerDisconnectSocialAccount(platform.toLowerCase())
      toast.success("Compte déconnecté")
      loadConnectedAccounts()
    } catch (error) {
      console.error("[Profile] Error disconnecting account:", error)
      toast.error("Erreur lors de la déconnexion du compte")
    }
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
        return <LinkIcon className="h-5 w-5" />
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold mb-2">Connexion requise</h2>
            <p className="text-muted-foreground mb-4">Veuillez vous connecter pour accéder à votre profil</p>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Mon Profil</h1>
            <p className="text-muted-foreground">Gérez vos informations personnelles et vos comptes connectés</p>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Informations</TabsTrigger>
              <TabsTrigger value="social">Réseaux sociaux</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form onSubmit={handleSubmit}>
                <Card>
                  <CardHeader>
                    <CardTitle>Informations personnelles</CardTitle>
                    <CardDescription>Mettez à jour vos informations de profil</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username">Nom d'utilisateur</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        placeholder="Votre nom d'utilisateur"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="votre@email.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Rôles</Label>
                      <div className="flex gap-2">
                        {user?.isPublisher && (
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">Éditeur</span>
                        )}
                        {user?.isAdmin && (
                          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                            Administrateur
                          </span>
                        )}
                        {!user?.isPublisher && !user?.isAdmin && (
                          <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            Utilisateur
                          </span>
                        )}
                      </div>
                    </div>

                    <Button type="submit" disabled={loading}>
                      <Save className="mr-2 h-4 w-4" />
                      {loading ? "Enregistrement..." : "Enregistrer"}
                    </Button>
                  </CardContent>
                </Card>
              </form>
            </TabsContent>

            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Comptes de réseaux sociaux</CardTitle>
                  <CardDescription>Connectez vos comptes pour partager facilement vos contenus</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loadingAccounts ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                          <div className="h-16 bg-muted rounded" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {connectedAccounts.length > 0 && (
                        <div className="space-y-3 mb-6">
                          <h3 className="font-semibold">Comptes connectés</h3>
                          {connectedAccounts.map((account) => (
                            <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-3">
                                {getPlatformIcon(account.platform)}
                                <div>
                                  <p className="font-medium capitalize">{account.platform}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {account.platformUsername ? `@${account.platformUsername}` : "Connecté"}
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDisconnectAccount(account.platform)}
                              >
                                <Unlink className="mr-2 h-4 w-4" />
                                Déconnecter
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="space-y-3">
                        <h3 className="font-semibold">Connecter un compte</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {["Facebook", "Twitter", "LinkedIn", "Instagram"].map((platform) => {
                            const isConnected = connectedAccounts.some(
                              (acc) => acc.platform.toLowerCase() === platform.toLowerCase(),
                            )
                            return (
                              <Button
                                key={platform}
                                variant="outline"
                                onClick={() => handleConnectAccount(platform)}
                                disabled={isConnected}
                                className="justify-start"
                              >
                                {getPlatformIcon(platform)}
                                <span className="ml-2">
                                  {isConnected ? `${platform} connecté` : `Connecter ${platform}`}
                                </span>
                              </Button>
                            )
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-4">
                          La connexion vous redirigera vers la page d'authentification de la plateforme
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
