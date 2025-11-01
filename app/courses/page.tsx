"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { LessonsService } from "@/lib/api/generated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublisherGuard } from "@/lib/guards/publisher-guard";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  isFree: boolean;
  level: string;
  status: string;
  enrollmentCount: number;
  duration: number;
}

export default function PublisherCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyCourses();
  }, []);

  const loadMyCourses = async () => {
    try {
      setLoading(true);
      const response = await LessonsService.lessonsControllerGetMyLessons();
      setCourses(response as Course[]);
    } catch (error) {
      console.error("[Publisher] Error loading courses:", error);
      toast.error("Erreur lors du chargement de vos cours");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce cours ?")) return;

    try {
      await LessonsService.lessonsControllerDeleteLesson(id);
      toast.success("Cours supprimé");
      loadMyCourses();
    } catch (error) {
      console.error("[Publisher] Error deleting course:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await LessonsService.lessonsControllerPublishLesson(id);
      toast.success("Cours publié");
      loadMyCourses();
    } catch (error) {
      console.error("[Publisher] Error publishing course:", error);
      toast.error("Erreur lors de la publication");
    }
  };

  return (
    <PublisherGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Mes Cours</h1>
                <p className="text-muted-foreground">
                  Gérez vos cours et formations
                </p>
              </div>
              <Button asChild>
                <Link href="/publisher/courses/new">
                  <Plus className="mr-2" />
                  Nouveau cours
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore de cours
                  </p>
                  <Button asChild>
                    <Link href="/publisher/courses/new">
                      <Plus className="mr-2" />
                      Créer votre premier cours
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{course.level}</Badge>
                        <Badge
                          variant={
                            course.status === "published"
                              ? "default"
                              : "outline"
                          }
                        >
                          {course.status === "published"
                            ? "Publié"
                            : "Brouillon"}
                        </Badge>
                        {course.isFree && (
                          <Badge className="bg-green-500">Gratuit</Badge>
                        )}
                      </div>
                      <CardTitle className="line-clamp-2">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{course.enrollmentCount} inscrits</span>
                        <span>
                          {course.isFree ? "Gratuit" : `${course.price}€`}
                        </span>
                      </div>
                    </CardContent>

                    <CardAction>
                      <div className="flex gap-2">
                        {course.status !== "published" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePublish(course.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/publisher/courses/${course.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(course.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardAction>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PublisherGuard>
  );
}
