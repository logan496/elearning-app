"use client";

import type React from "react";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import {
  JobApplicationsService,
  type CreateApplicationDto,
} from "@/lib/api/generated";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { toast } from "sonner";
import { MapPin, Building2, DollarSign, Calendar, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";

interface JobDetail {
  id: number;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  benefits?: string;
  company: string;
  companyLogo?: string;
  location: string;
  isRemote: boolean;
  jobType: string;
  experienceLevel: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  skills: string[];
  deadline?: string;
  createdAt: string;
  hasApplied: boolean;
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { user } = useAuth();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState<CreateApplicationDto>({
    coverLetter: "",
    resumeUrl: "",
    portfolioUrl: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  useEffect(() => {
    loadJob();
  }, [slug, user]);

  const loadJob = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const response =
        await JobApplicationsService.applicationsControllerGetJobBySlug(
          slug,
          user.id,
        );
      setJob(response as JobDetail);
    } catch (error) {
      console.error("[Job] Error loading job:", error);
      toast.error("Erreur lors du chargement de l'offre");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job || !formData.coverLetter.trim()) {
      toast.error("Veuillez remplir la lettre de motivation");
      return;
    }

    try {
      setApplying(true);
      await JobApplicationsService.applicationsControllerApplyToJob(
        job.id,
        formData,
      );
      toast.success("Candidature envoyée avec succès!");
      router.push("/applications/my-applications");
    } catch (error) {
      console.error("[Job] Error applying:", error);
      toast.error("Erreur lors de l'envoi de la candidature");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </AuthGuard>
    );
  }

  if (!job) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-2">Offre non trouvée</h1>
              <p className="text-muted-foreground">
                Cette offre n'existe pas ou a été supprimée
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Job Header */}
                <div className="mb-8">
                  <div className="flex items-start gap-4 mb-6">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo || "/placeholder.svg"}
                        alt={job.company}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="w-8 h-8" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                      <p className="text-xl text-muted-foreground">
                        {job.company}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <Badge variant="secondary">{job.jobType}</Badge>
                    <Badge variant="outline">{job.experienceLevel}</Badge>
                    {job.isRemote && (
                      <Badge className="bg-green-500">Remote</Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    {job.salaryMin && job.salaryMax && (
                      <span className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {job.salaryMin} - {job.salaryMax} {job.salaryCurrency}
                      </span>
                    )}
                    {job.deadline && (
                      <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date limite:{" "}
                        {new Date(job.deadline).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Job Details */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {job.description}
                    </p>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold mb-4">Exigences</h2>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {job.requirements}
                    </p>
                  </div>

                  {job.responsibilities && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">
                        Responsabilités
                      </h2>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {job.responsibilities}
                      </p>
                    </div>
                  )}

                  {job.benefits && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">Avantages</h2>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {job.benefits}
                      </p>
                    </div>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-4">
                        Compétences requises
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar - Application Form */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>
                      {job.hasApplied ? "Vous avez déjà postulé" : "Postuler"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {job.hasApplied ? (
                      <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">
                          Votre candidature a été envoyée. Vous serez notifié de
                          toute mise à jour.
                        </p>
                        <Button
                          asChild
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          <a href="/applications/my-applications">
                            Voir mes candidatures
                          </a>
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="coverLetter">
                            Lettre de motivation *
                          </Label>
                          <Textarea
                            id="coverLetter"
                            value={formData.coverLetter}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                coverLetter: e.target.value,
                              })
                            }
                            placeholder="Expliquez pourquoi vous êtes le candidat idéal..."
                            rows={6}
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="resumeUrl">CV (URL)</Label>
                          <Input
                            id="resumeUrl"
                            value={formData.resumeUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                resumeUrl: e.target.value,
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="portfolioUrl">Portfolio (URL)</Label>
                          <Input
                            id="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                portfolioUrl: e.target.value,
                              })
                            }
                            placeholder="https://..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone">Téléphone</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+33 6 12 34 56 78"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="linkedinUrl">LinkedIn</Label>
                          <Input
                            id="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                linkedinUrl: e.target.value,
                              })
                            }
                            placeholder="https://linkedin.com/in/..."
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="githubUrl">GitHub</Label>
                          <Input
                            id="githubUrl"
                            value={formData.githubUrl}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                githubUrl: e.target.value,
                              })
                            }
                            placeholder="https://github.com/..."
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={applying}
                          className="w-full"
                        >
                          <Send className="mr-2" />
                          {applying ? "Envoi..." : "Envoyer ma candidature"}
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
