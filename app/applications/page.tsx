"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { JobApplicationsService } from "@/lib/api/generated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Search,
  MapPin,
  Briefcase,
  Clock,
  Building2,
  Lock,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface JobPosting {
  id: number;
  title: string;
  description: string;
  company: string;
  companyLogo?: string;
  location: string;
  isRemote: boolean;
  jobType: string;
  experienceLevel: string;
  slug: string;
  createdAt: string;
  hasApplied: boolean;
}

export default function ApplicationsPage() {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (isAuthenticated && user) {
      loadJobs();
    }
  }, [user, isAuthenticated]);

  const loadJobs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log("[v0] Loading jobs...");
      const response =
        await JobApplicationsService.applicationsControllerGetAllJobPostings();

      console.log("[v0] Jobs response:", response);

      let jobsData: JobPosting[] = [];
      if (Array.isArray(response)) {
        jobsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response?.jobs && Array.isArray(response.jobs)) {
        jobsData = response.jobs;
      } else {
        console.error("[v0] Unexpected response format:", response);
        toast.error("Format de réponse inattendu");
        return;
      }

      setJobs(jobsData);
    } catch (error) {
      console.error("[Applications] Error loading jobs:", error);
      toast.error("Erreur lors du chargement des offres");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadJobs();
      return;
    }

    try {
      setLoading(true);
      const response =
        await JobApplicationsService.applicationsControllerSearchJobs(
          searchQuery,
        );

      console.log("[v0] Search response:", response);

      let jobsData: JobPosting[] = [];
      if (Array.isArray(response)) {
        jobsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        jobsData = response.data;
      } else if (response?.jobs && Array.isArray(response.jobs)) {
        jobsData = response.jobs;
      }

      setJobs(jobsData);
    } catch (error) {
      console.error("[Applications] Error searching jobs:", error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      full_time: "Temps plein",
      part_time: "Temps partiel",
      contract: "Contrat",
      internship: "Stage",
      freelance: "Freelance",
    };
    return labels[type] || type;
  };

  const getExperienceLevelLabel = (level: string) => {
    const labels: Record<string, string> = {
      entry: "Débutant",
      junior: "Junior",
      mid: "Intermédiaire",
      senior: "Senior",
      lead: "Lead",
    };
    return labels[level] || level;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Connexion requise</CardTitle>
              <CardDescription className="text-base">
                Connectez-vous pour découvrir les offres d'emploi et postuler
                pour devenir éditeur
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-medium">
                  En tant qu'éditeur, vous pourrez :
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Publier vos propres cours</li>
                  <li>Créer des articles de blog</li>
                  <li>Gérer votre contenu</li>
                  <li>Interagir avec votre audience</li>
                </ul>
              </div>
            </CardContent>
            <CardAction>
              <Button asChild className="w-full" size="lg">
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  Se connecter
                </Link>
              </Button>
            </CardAction>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-2">Offres d'emploi</h1>
            <p className="text-muted-foreground">
              Postulez pour devenir éditeur et publier vos propres cours
            </p>

            <div className="mt-8 flex gap-2">
              <Input
                placeholder="Rechercher des offres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} variant="outline">
                <Search />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                    <div className="h-4 bg-muted rounded w-full" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Aucune offre disponible
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? "Aucune offre ne correspond à votre recherche. Essayez d'autres mots-clés."
                    : "Il n'y a pas d'offres d'emploi pour le moment. Revenez plus tard."}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      loadJobs();
                    }}
                    variant="outline"
                  >
                    Voir toutes les offres
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <Card
                  key={job.id}
                  className="hover:shadow-lg hover:border-primary/50 transition-all duration-300"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4 mb-4">
                      {job.companyLogo ? (
                        <img
                          src={job.companyLogo || "/placeholder.svg"}
                          alt={job.company}
                          className="w-14 h-14 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border">
                          <Building2 className="w-7 h-7 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <CardTitle className="mb-1 line-clamp-1">
                          {job.title}
                        </CardTitle>
                        <p className="text-sm font-medium text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary" className="font-medium">
                        {getJobTypeLabel(job.jobType)}
                      </Badge>
                      <Badge variant="outline">
                        {getExperienceLevelLabel(job.experienceLevel)}
                      </Badge>
                      {job.isRemote && (
                        <Badge className="bg-green-600 hover:bg-green-700">
                          Remote
                        </Badge>
                      )}
                      {job.hasApplied && (
                        <Badge className="bg-blue-600 hover:bg-blue-700">
                          Postulé
                        </Badge>
                      )}
                    </div>

                    <CardDescription className="line-clamp-3 text-sm leading-relaxed">
                      {job.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        {new Date(job.createdAt).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </CardContent>

                  <CardAction>
                    <Button
                      asChild
                      variant={job.hasApplied ? "outline" : "default"}
                      className="w-full"
                      size="lg"
                    >
                      <Link href={`/applications/${job.slug}`}>
                        {job.hasApplied
                          ? "Voir ma candidature"
                          : "Postuler maintenant"}
                      </Link>
                    </Button>
                  </CardAction>
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
