"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { JobApplicationsService } from "@/lib/api/generated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { toast } from "sonner";
import { Briefcase, Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: number;
  status: string;
  coverLetter: string;
  createdAt: string;
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
  };
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response =
        await JobApplicationsService.applicationsControllerGetMyApplications();
      setApplications(response as Application[]);
    } catch (error) {
      console.error("[Applications] Error loading applications:", error);
      toast.error("Erreur lors du chargement de vos candidatures");
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: "En attente",
      reviewing: "En cours d'examen",
      shortlisted: "Présélectionné",
      interview: "Entretien",
      accepted: "Accepté",
      rejected: "Refusé",
      withdrawn: "Retiré",
    };
    return labels[status] || status;
  };

  const getStatusVariant = (
    status: string,
  ): "default" | "secondary" | "outline" | "destructive" => {
    if (status === "accepted") return "default";
    if (status === "rejected") return "destructive";
    if (status === "shortlisted" || status === "interview") return "secondary";
    return "outline";
  };

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2">Mes Candidatures</h1>
              <p className="text-muted-foreground">
                Suivez l'état de vos candidatures
              </p>
            </div>

            {loading ? (
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
            ) : applications.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore de candidatures
                  </p>
                  <Button asChild>
                    <a href="/applications">Voir les offres</a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((application) => (
                  <Card key={application.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="mb-2">
                            {application.job.title}
                          </CardTitle>
                          <CardDescription className="flex flex-col gap-2">
                            <span className="flex items-center gap-2">
                              <Briefcase className="w-4 h-4" />
                              {application.job.company}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {application.job.location}
                            </span>
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Postulé le{" "}
                              {new Date(
                                application.createdAt,
                              ).toLocaleDateString("fr-FR")}
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(application.status)}>
                          {getStatusLabel(application.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {application.coverLetter}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
}
