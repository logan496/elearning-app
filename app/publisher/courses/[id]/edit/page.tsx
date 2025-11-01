"use client";

import type React from "react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { LessonsService, CreateLessonDto } from "@/lib/api/generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PublisherGuard } from "@/lib/guards/publisher-guard";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export default function EditCoursePage() {
  const router = useRouter();
  const params = useParams();
  const courseId = Number.parseInt(params.id as string);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateLessonDto>({
    title: "",
    description: "",
    thumbnail: "",
    price: 0,
    isFree: true,
    level: CreateLessonDto.level.BEGINNER,
    duration: 0,
    tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setLoading(true);
      const course = await LessonsService.lessonsControllerGetLessonById(
        courseId,
        0,
      );
      setFormData({
        title: course.title || "",
        description: course.description || "",
        thumbnail: course.thumbnail || "",
        price: course.price || 0,
        isFree: course.isFree ?? true,
        level:
          (course.level as CreateLessonDto.level) ||
          CreateLessonDto.level.BEGINNER,
        duration: course.duration || 0,
        tags: course.tags || [],
      });
    } catch (error) {
      console.error("[Publisher] Error loading course:", error);
      toast.error("Erreur lors du chargement du cours");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      setSubmitting(true);
      await LessonsService.lessonsControllerUpdateLesson(courseId, formData);
      toast.success("Cours mis à jour avec succès");
      router.push("/publisher/courses");
    } catch (error) {
      console.error("[Publisher] Error updating course:", error);
      toast.error("Erreur lors de la mise à jour du cours");
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    });
  };

  if (loading) {
    return (
      <PublisherGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </PublisherGuard>
    );
  }

  return (
    <PublisherGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <div className="mb-8">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/publisher/courses">
                  <ArrowLeft className="mr-2" />
                  Retour
                </Link>
              </Button>
              <h1 className="text-4xl font-bold">Modifier le Cours</h1>
            </div>

            <form onSubmit={handleSubmit}>
              <Card>
                <CardHeader>
                  <CardTitle>Informations du cours</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      placeholder="Titre de votre cours"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="Description détaillée du cours"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">Image de couverture (URL)</Label>
                    <Input
                      id="thumbnail"
                      value={formData.thumbnail}
                      onChange={(e) =>
                        setFormData({ ...formData, thumbnail: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="level">Niveau *</Label>
                      <Select
                        value={formData.level}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            level: value as CreateLessonDto.level,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={CreateLessonDto.level.BEGINNER}>
                            Débutant
                          </SelectItem>
                          <SelectItem
                            value={CreateLessonDto.level.INTERMEDIATE}
                          >
                            Intermédiaire
                          </SelectItem>
                          <SelectItem value={CreateLessonDto.level.ADVANCED}>
                            Avancé
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée (minutes) *</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration: Number.parseInt(e.target.value) || 0,
                          })
                        }
                        placeholder="120"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="isFree">Cours gratuit</Label>
                    <Switch
                      id="isFree"
                      checked={formData.isFree}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          isFree: checked,
                          price: checked ? 0 : formData.price,
                        })
                      }
                    />
                  </div>

                  {!formData.isFree && (
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix (€) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: Number.parseFloat(e.target.value) || 0,
                          })
                        }
                        placeholder="29.99"
                        required={!formData.isFree}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && (e.preventDefault(), addTag())
                        }
                        placeholder="Ajouter un tag"
                      />
                      <Button type="button" onClick={addTag} variant="outline">
                        Ajouter
                      </Button>
                    </div>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="hover:text-destructive"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="flex-1"
                    >
                      <Save className="mr-2" />
                      {submitting ? "Mise à jour..." : "Mettre à jour le cours"}
                    </Button>
                    <Button type="button" variant="outline" asChild>
                      <Link href="/publisher/courses">Annuler</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </PublisherGuard>
  );
}
