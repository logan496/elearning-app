"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { AdminService } from "@/lib/api/generated/services/AdminService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Users,
  Briefcase,
  BookOpen,
  FileText,
  MapPin,
  Clock,
} from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("[v0] Admin Dashboard - Auth state:", {
      isAuthenticated,
      isAdmin: user?.isAdmin,
      authLoading,
    });

    if (authLoading) {
      console.log("[v0] Waiting for auth to load...");
      return;
    }

    if (isAuthenticated && user?.isAdmin) {
      console.log("[v0] Loading dashboard stats...");
      loadDashboardStats();
    } else {
      console.log("[v0] User not authenticated or not admin");
      setLoading(false);
    }
  }, [isAuthenticated, user, authLoading]);

  const loadDashboardStats = async () => {
    try {
      console.log("[v0] Fetching dashboard stats from API...");
      const response = await AdminService.adminControllerGetDashboardStats();
      console.log("[v0] Dashboard stats received:", response);
      setStats(response);
    } catch (error) {
      console.error("[v0] Error loading dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatJobType = (type: string) => {
    const types: Record<string, string> = {
      full_time: "Temps plein",
      part_time: "Temps partiel",
      contract: "Contrat",
      internship: "Stage",
      freelance: "Freelance",
    };
    return types[type] || type;
  };

  const formatExperienceLevel = (level: string) => {
    const levels: Record<string, string> = {
      entry: "Débutant",
      junior: "Junior",
      mid: "Intermédiaire",
      senior: "Senior",
      lead: "Lead",
    };
    return levels[level] || level;
  };

  const formatStatus = (status: string) => {
    const statuses: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      draft: { label: "Brouillon", variant: "secondary" },
      published: { label: "Publié", variant: "default" },
      closed: { label: "Fermé", variant: "destructive" },
    };
    return statuses[status] || { label: status, variant: "outline" };
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous devez être administrateur pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/login">
              <Button className="w-full">Se connecter</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs, offres d'emploi et candidatures
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Utilisateurs
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.users?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.users?.admins || 0} admin(s),{" "}
                {stats?.users?.publishers || 0} éditeur(s)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Offres d'emploi
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.jobs?.total || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.jobs?.open || 0} ouvert(es)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Articles de blog
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.content?.blogPosts || 0}
              </div>
              <p className="text-xs text-muted-foreground">Articles publiés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Candidatures
              </CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.applications?.pending || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.applications?.total || 0} total,{" "}
                {stats?.applications?.pending || 0} en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cours</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? "..." : stats?.content?.lessons || 0}
              </div>
              <p className="text-xs text-muted-foreground">Cours publiés</p>
            </CardContent>
          </Card>
        </div>

        {stats?.users?.recent && stats.users.recent.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Utilisateurs récents</CardTitle>
              <CardDescription>
                Les derniers utilisateurs inscrits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.users.recent.map((user: any) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="jobs" className="space-y-4">
          <TabsList>
            <TabsTrigger value="jobs">Offres d'emploi</TabsTrigger>
            <TabsTrigger value="applications">Candidatures</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Gestion des offres d'emploi</CardTitle>
                    <CardDescription>
                      Créez et gérez les offres d'emploi
                    </CardDescription>
                  </div>
                  <Link href="/admin/jobs/new">
                    <Button>Créer une offre</Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : stats?.jobs?.recent && stats.jobs.recent.length > 0 ? (
                  <div className="space-y-4">
                    {stats.jobs.recent.map((job: any) => (
                      <div
                        key={job.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                              <span className="font-medium">{job.company}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {job.location}
                              </span>
                              {job.isRemote && (
                                <>
                                  <span>•</span>
                                  <span>Remote</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Badge variant={formatStatus(job.status).variant}>
                            {formatStatus(job.status).label}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          <Badge variant="outline">
                            {formatJobType(job.jobType)}
                          </Badge>
                          <Badge variant="outline">
                            {formatExperienceLevel(job.experienceLevel)}
                          </Badge>
                          <Badge variant="outline">
                            {Number(job.salaryMin).toLocaleString()} -{" "}
                            {Number(job.salaryMax).toLocaleString()}{" "}
                            {job.salaryCurrency}
                          </Badge>
                        </div>

                        {job.skills && job.skills.length > 0 && (
                          <div className="flex items-center gap-2 flex-wrap mb-3">
                            {job.skills
                              .slice(0, 5)
                              .map((skill: string, index: number) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {job.skills.length > 5 && (
                              <span className="text-xs text-muted-foreground">
                                +{job.skills.length - 5} plus
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <span>{job.applicationCount} candidature(s)</span>
                            <span>{job.viewCount} vue(s)</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Expire le{" "}
                              {new Date(job.deadline).toLocaleDateString(
                                "fr-FR",
                              )}
                            </span>
                          </div>
                          <Link href={`/admin/jobs/${job.id}`}>
                            <Button variant="outline" size="sm">
                              Voir détails
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Aucune offre d'emploi pour le moment
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des candidatures</CardTitle>
                <CardDescription>
                  Examinez et approuvez les candidatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/applications">
                  <Button>Voir toutes les candidatures</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les rôles et permissions des utilisateurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/admin/users">
                  <Button>Gérer les utilisateurs</Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
