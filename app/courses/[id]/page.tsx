"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { LessonsService } from "@/lib/api/generated";
import { useAuth } from "@/lib/contexts/auth-context";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  Users,
  Star,
  PlayCircle,
  CheckCircle,
  Lock,
} from "lucide-react";

interface Module {
  id: number;
  title: string;
  description: string;
  order: number;
  contents: Content[];
}

interface Content {
  id: number;
  title: string;
  type: string;
  duration: number;
  order: number;
  isFree: boolean;
}

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
  thumbnail?: string;
  instructor: {
    id: number;
    username: string;
    avatar?: string;
  };
  modules: Module[];
  isEnrolled?: boolean;
  progress?: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const courseId = Number.parseInt(params.id as string);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId, user]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const response = await LessonsService.lessonsControllerGetLessonById(
        courseId,
        user?.id || 0,
      );
      setCourse(response as Course);
    } catch (error) {
      console.error("[Course] Error loading course:", error);
      toast.error("Erreur lors du chargement du cours");
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour vous inscrire");
      return;
    }

    try {
      setEnrolling(true);
      await LessonsService.lessonsControllerEnrollLesson({
        lessonId: courseId,
      });
      toast.success("Inscription réussie !");
      loadCourse();
    } catch (error) {
      console.error("[Course] Error enrolling:", error);
      toast.error("Erreur lors de l'inscription");
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartCourse = () => {
    if (course?.modules?.[0]?.contents?.[0]) {
      router.push(`/courses/${courseId}/learn`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Cours non trouvé</h1>
            <p className="text-muted-foreground">
              Ce cours n'existe pas ou a été supprimé
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalLessons =
    course.modules?.reduce(
      (acc, module) => acc + (module.contents?.length || 0),
      0,
    ) || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Header */}
              <div>
                {course.thumbnail && (
                  <div className="relative h-96 rounded-xl overflow-hidden mb-6">
                    <img
                      src={course.thumbnail || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{course.level}</Badge>
                  <Badge variant={course.isFree ? "default" : "outline"}>
                    {course.isFree ? "Gratuit" : `${course.price}€`}
                  </Badge>
                </div>

                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                <p className="text-lg text-muted-foreground mb-6">
                  {course.description}
                </p>

                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        course.instructor?.avatar ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${course.instructor?.username || "/placeholder.svg"}`
                      }
                      alt={course.instructor?.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <span className="font-medium text-foreground">
                      {course.instructor?.username}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.enrollmentCount} inscrits
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration}h
                  </span>
                </div>
              </div>

              <Separator />

              {/* Course Content */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Contenu du cours</h2>
                <div className="space-y-4">
                  {course.modules?.map((module, index) => (
                    <Card key={module.id}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                            {index + 1}
                          </span>
                          {module.title}
                        </CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {module.contents?.map((content) => (
                            <div
                              key={content.id}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {content.isFree || course.isEnrolled ? (
                                  <PlayCircle className="w-5 h-5 text-primary" />
                                ) : (
                                  <Lock className="w-5 h-5 text-muted-foreground" />
                                )}
                                <div>
                                  <p className="font-medium">{content.title}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {content.type} • {content.duration} min
                                  </p>
                                </div>
                              </div>
                              {content.isFree && !course.isEnrolled && (
                                <Badge variant="outline">Aperçu gratuit</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Price */}
                    <div className="text-center">
                      {course.isFree ? (
                        <div className="text-3xl font-bold text-green-600">
                          Gratuit
                        </div>
                      ) : (
                        <div className="text-3xl font-bold">
                          {course.price}€
                        </div>
                      )}
                    </div>

                    {/* CTA Button */}
                    {course.isEnrolled ? (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleStartCourse}
                      >
                        <PlayCircle className="w-5 h-5 mr-2" />
                        Continuer le cours
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={handleEnroll}
                        disabled={enrolling || !user}
                      >
                        {enrolling ? (
                          "Inscription..."
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" />
                            S'inscrire maintenant
                          </>
                        )}
                      </Button>
                    )}

                    {!user && (
                      <p className="text-sm text-center text-muted-foreground">
                        Connectez-vous pour vous inscrire
                      </p>
                    )}

                    <Separator />

                    {/* Course Stats */}
                    <div className="space-y-4">
                      <h3 className="font-semibold">Ce cours inclut :</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                          <span>{totalLessons} leçons</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-muted-foreground" />
                          <span>{course.duration} heures de contenu</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Users className="w-5 h-5 text-muted-foreground" />
                          <span>
                            {course.enrollmentCount} étudiants inscrits
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-muted-foreground" />
                          <span>Niveau {course.level}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
