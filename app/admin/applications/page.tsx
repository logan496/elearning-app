"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { AdminService } from "@/lib/api/generated/services/AdminService";
import { ApproveApplicationDto } from "@/lib/api/generated/models/ApproveApplicationDto";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, ExternalLink } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function AdminApplicationsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [feedbackMap, setFeedbackMap] = useState<Record<number, string>>({});

  useEffect(() => {
    console.log("[v0] Admin Applications - Auth state:", {
      isAuthenticated,
      isAdmin: user?.isAdmin,
      authLoading,
    });

    // Wait for auth to finish loading
    if (authLoading) {
      console.log("[v0] Waiting for auth to load...");
      return;
    }

    if (isAuthenticated && user?.isAdmin) {
      console.log("[v0] Loading applications...");
      loadApplications();
    } else {
      console.log("[v0] User not authenticated or not admin");
      setLoading(false);
    }
  }, [isAuthenticated, user, selectedStatus, authLoading]);

  const loadApplications = async () => {
    try {
      console.log(
        "[v0] Fetching applications from API with status:",
        selectedStatus,
      );
      const response = await AdminService.adminControllerGetAllApplications(
        1,
        100,
        selectedStatus === "all" ? undefined : selectedStatus,
      );
      console.log("[v0] Applications response:", response);

      const apps = Array.isArray(response)
        ? response
        : response?.data || response?.applications || [];
      console.log("[v0] Parsed applications list:", apps);
      setApplications(apps);
    } catch (error) {
      console.error("[v0] Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    applicationId: number,
    status: ApproveApplicationDto.status,
  ) => {
    try {
      const feedback = feedbackMap[applicationId] || "";
      await AdminService.adminControllerApproveApplication(applicationId, {
        status,
        feedback,
      });

      alert(
        status === ApproveApplicationDto.status.ACCEPTED
          ? "Candidature acceptée! L'utilisateur est maintenant publisher."
          : `Statut mis à jour: ${status}`,
      );
      loadApplications();
      // Clear feedback after submission
      setFeedbackMap((prev) => ({ ...prev, [applicationId]: "" }));
    } catch (error) {
      console.error("[v0] Error updating status:", error);
      alert("Erreur lors de la mise à jour du statut");
    }
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

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <Link
          href="/admin"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gestion des candidatures</h1>
          <p className="text-muted-foreground">
            Examinez et approuvez les candidatures pour devenir publisher
          </p>
        </div>

        <div className="mb-6">
          <Label>Filtrer par statut</Label>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="reviewing">En révision</SelectItem>
              <SelectItem value="shortlisted">Présélectionné</SelectItem>
              <SelectItem value="interview">Entretien</SelectItem>
              <SelectItem value="accepted">Accepté</SelectItem>
              <SelectItem value="rejected">Rejeté</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                Aucune candidature pour le moment
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>
                        {application.user?.username || "Candidat"}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        {application.user?.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {application.user.email}
                          </span>
                        )}
                        {application.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {application.phone}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        application.status === "accepted"
                          ? "default"
                          : application.status === "rejected"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {application.status === "pending" && "En attente"}
                      {application.status === "reviewing" && "En révision"}
                      {application.status === "shortlisted" && "Présélectionné"}
                      {application.status === "interview" && "Entretien"}
                      {application.status === "accepted" && "Accepté"}
                      {application.status === "rejected" && "Rejeté"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Lettre de motivation</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {application.coverLetter}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {application.resumeUrl && (
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          CV
                        </Button>
                      </a>
                    )}
                    {application.portfolioUrl && (
                      <a
                        href={application.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Portfolio
                        </Button>
                      </a>
                    )}
                    {application.linkedinUrl && (
                      <a
                        href={application.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          LinkedIn
                        </Button>
                      </a>
                    )}
                    {application.githubUrl && (
                      <a
                        href={application.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" size="sm">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </a>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor={`feedback-${application.id}`}>
                        Feedback (optionnel)
                      </Label>
                      <Textarea
                        id={`feedback-${application.id}`}
                        placeholder="Ajoutez un commentaire pour le candidat..."
                        value={feedbackMap[application.id] || ""}
                        onChange={(e) =>
                          setFeedbackMap((prev) => ({
                            ...prev,
                            [application.id]: e.target.value,
                          }))
                        }
                        rows={3}
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            ApproveApplicationDto.status.REVIEWING,
                          )
                        }
                        variant="outline"
                        size="sm"
                      >
                        En révision
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            ApproveApplicationDto.status.SHORTLISTED,
                          )
                        }
                        variant="outline"
                        size="sm"
                      >
                        Présélectionner
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            ApproveApplicationDto.status.INTERVIEW,
                          )
                        }
                        variant="outline"
                        size="sm"
                      >
                        Entretien
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            ApproveApplicationDto.status.ACCEPTED,
                          )
                        }
                        size="sm"
                      >
                        Accepter (→ Publisher)
                      </Button>
                      <Button
                        onClick={() =>
                          handleStatusUpdate(
                            application.id,
                            ApproveApplicationDto.status.REJECTED,
                          )
                        }
                        variant="destructive"
                        size="sm"
                      >
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
