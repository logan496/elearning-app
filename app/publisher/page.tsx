"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import {
  BlogService,
  LessonsService,
  JobApplicationsService,
} from "@/lib/api/generated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, FileText, Users, TrendingUp, Plus, Eye } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DashboardStats {
  totalCourses: number;
  totalPosts: number;
  totalEnrollments: number;
  totalApplications: number;
  recentCourses: any[];
  recentPosts: any[];
}

export default function PublisherDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalPosts: 0,
    totalEnrollments: 0,
    totalApplications: 0,
    recentCourses: [],
    recentPosts: [],
  });
  const [loading, setLoading] = useState(true);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loadingAllCourses, setLoadingAllCourses] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.isPublisher) {
      loadDashboardData();
    }
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const courses = await LessonsService.lessonsControllerGetMyLessons();
      const totalEnrollments = courses.reduce(
        (sum: number, course: any) => sum + (course.enrollmentCount || 0),
        0,
      );

      const posts = await BlogService.blogControllerGetMyPosts();

      let totalApplications = 0;
      try {
        const jobs =
          await JobApplicationsService.applicationsControllerGetMyJobPostings();
        for (const job of jobs as any[]) {
          const jobApps =
            await JobApplicationsService.applicationsControllerGetJobApplications(
              job.id,
            );
          totalApplications += jobApps.length;
        }
      } catch (error) {
        console.log("[Dashboard] No job postings yet");
      }

      setStats({
        totalCourses: courses.length,
        totalPosts: posts.length,
        totalEnrollments,
        totalApplications,
        recentCourses: courses.slice(0, 3),
        recentPosts: posts.slice(0, 3),
      });
    } catch (error) {
      console.error("[Dashboard] Error loading data:", error);
      toast.error("Erreur lors du chargement du tableau de bord");
    } finally {
      setLoading(false);
    }
  };

  const loadAllCourses = async () => {
    if (allCourses.length > 0) return; // Already loaded

    try {
      setLoadingAllCourses(true);
      const courses = await LessonsService.lessonsControllerGetAllLessons(
        user?.id || 0,
      );
      setAllCourses(courses);
    } catch (error) {
      console.error("[Dashboard] Error loading all courses:", error);
      toast.error("Erreur lors du chargement des cours");
    } finally {
      setLoadingAllCourses(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold mb-2">Connexion requise</h2>
            <p className="text-muted-foreground mb-4">
              Veuillez vous connecter pour accéder au tableau de bord
            </p>
            <Button asChild>
              <Link href="/login">Se connecter</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!user?.isPublisher) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center px-4">
            <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
            <p className="text-muted-foreground mb-4">
              Vous devez être un éditeur pour accéder à cette page
            </p>
            <Button asChild>
              <Link href="/applications">Postuler pour devenir éditeur</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Tableau de bord Éditeur</h1>
            <p className="text-muted-foreground">
              Bienvenue, {user?.username}! Gérez vos contenus et suivez vos
              statistiques.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-8 bg-muted rounded w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Cours
                      </CardTitle>
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold">
                      {stats.totalCourses}
                    </div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Articles
                      </CardTitle>
                      <FileText className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold">{stats.totalPosts}</div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Inscriptions
                      </CardTitle>
                      <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold">
                      {stats.totalEnrollments}
                    </div>
                  </CardHeader>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Candidatures
                      </CardTitle>
                      <Users className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-3xl font-bold">
                      {stats.totalApplications}
                    </div>
                  </CardHeader>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Actions rapides</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto py-6 bg-transparent"
                  >
                    <Link
                      href="/publisher/courses/new"
                      className="flex flex-col items-center gap-2"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Nouveau cours</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto py-6 bg-transparent"
                  >
                    <Link
                      href="/publisher/blog/new"
                      className="flex flex-col items-center gap-2"
                    >
                      <Plus className="w-6 h-6" />
                      <span>Nouvel article</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto py-6 bg-transparent"
                  >
                    <Link
                      href="/publisher/applications"
                      className="flex flex-col items-center gap-2"
                    >
                      <Eye className="w-6 h-6" />
                      <span>Voir les candidatures</span>
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Recent Content */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Courses with Tabs */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Cours</h2>
                  <Tabs defaultValue="my-courses" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                      <TabsTrigger value="my-courses">Mes cours</TabsTrigger>
                      <TabsTrigger value="all-courses" onClick={loadAllCourses}>
                        Tous les cours
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="my-courses">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">
                          Cours que vous avez créés
                        </p>
                        <Button asChild variant="ghost" size="sm">
                          <Link href="/publisher/courses">Voir tout</Link>
                        </Button>
                      </div>
                      {stats.recentCourses.length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                              Aucun cours pour le moment
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {stats.recentCourses.map((course: any) => (
                            <Card key={course.id}>
                              <CardHeader>
                                <CardTitle className="text-lg">
                                  {course.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                  {course.description}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-muted-foreground">
                                    {course.enrollmentCount || 0} inscrits
                                  </span>
                                  <Button asChild size="sm" variant="ghost">
                                    <Link
                                      href={`/publisher/courses/${course.id}/edit`}
                                    >
                                      Modifier
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="all-courses">
                      <p className="text-sm text-muted-foreground mb-4">
                        Tous les cours publiés sur la plateforme
                      </p>
                      {loadingAllCourses ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Card key={i} className="animate-pulse">
                              <CardHeader>
                                <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                                <div className="h-4 bg-muted rounded w-full" />
                              </CardHeader>
                            </Card>
                          ))}
                        </div>
                      ) : allCourses.length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center">
                            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">
                              Aucun cours disponible
                            </p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto">
                          {allCourses.map((course: any) => (
                            <Card key={course.id}>
                              <CardHeader>
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <CardTitle className="text-lg">
                                      {course.title}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-2">
                                      {course.description}
                                    </CardDescription>
                                  </div>
                                  {course.instructorId === user?.id && (
                                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-2">
                                      Votre cours
                                    </span>
                                  )}
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center gap-4">
                                    <span className="text-muted-foreground">
                                      {course.enrollmentCount || 0} inscrits
                                    </span>
                                    {course.instructor && (
                                      <span className="text-muted-foreground">
                                        Par {course.instructor.username}
                                      </span>
                                    )}
                                  </div>
                                  <Button asChild size="sm" variant="ghost">
                                    <Link href={`/courses/${course.id}`}>
                                      Voir
                                    </Link>
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* Recent Posts */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Articles récents</h2>
                    <Button asChild variant="ghost" size="sm">
                      <Link href="/publisher/blog">Voir tout</Link>
                    </Button>
                  </div>
                  {stats.recentPosts.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Aucun article pour le moment
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-4">
                      {stats.recentPosts.map((post: any) => (
                        <Card key={post.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">
                              {post.title}
                            </CardTitle>
                            <CardDescription className="line-clamp-2">
                              {post.excerpt}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">
                                {new Date(post.createdAt).toLocaleDateString(
                                  "fr-FR",
                                )}
                              </span>
                              <Button asChild size="sm" variant="ghost">
                                <Link href={`/publisher/blog/${post.id}/edit`}>
                                  Modifier
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
