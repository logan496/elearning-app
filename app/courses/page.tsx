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
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BookOpen, Clock, Users } from "lucide-react";
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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllCourses();
  }, []);

  const loadAllCourses = async () => {
    try {
      setLoading(true);
      const response = await LessonsService.lessonsControllerGetAllPublishedLessons();
      const publishedCourses = (response as Course[]).filter(
        (course) => course.status === "published",
      );
      setCourses(publishedCourses);
    } catch (error) {
      console.error("[Courses] Error loading courses:", error);
      toast.error("Erreur lors du chargement des cours");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Cours Disponibles</h1>
            <p className="text-muted-foreground">
              Découvrez tous les cours et formations disponibles
            </p>
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
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-2">
                  Aucun cours disponible pour le moment
                </p>
                <p className="text-sm text-muted-foreground">
                  Revenez bientôt pour découvrir de nouveaux cours
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{course.level}</Badge>
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
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Users className="w-4 h-4" />
                        <span>{course.enrollmentCount} inscrits</span>
                      </div>
                      {course.duration > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{course.duration} heures</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold">
                        {course.isFree ? "Gratuit" : `${course.price}€`}
                      </span>
                      <Button asChild>
                        <Link href={`/courses/${course.id}`}>
                          Voir le cours
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
