"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/contexts/auth-context";
import { JobApplicationsService } from "@/lib/api/generated/services/JobApplicationsService";
import { AdminService } from "@/lib/api/generated/services/AdminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (authLoading) return;

    if (isAuthenticated && user?.isAdmin) {
      loadJobDetails();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user, authLoading, params.id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      // Get dashboard stats which includes recent jobs
      const stats = await AdminService.adminControllerGetDashboardStats();

      // Find the job with matching ID
      const foundJob = stats.jobs?.recent?.find(
        (j: any) => j.id === Number(params.id),
      );

      if (foundJob) {
        setJob(foundJob);
        setFormData({
          title: foundJob.title,
          description: foundJob.description,
          requirements: foundJob.requirements,
          responsibilities: foundJob.responsibilities || "",
          benefits: foundJob.benefits || "",
          company: foundJob.company,
          companyLogo: foundJob.companyLogo || "",
          jobType: foundJob.jobType,
          experienceLevel: foundJob.experienceLevel,
          location: foundJob.location,
          isRemote: foundJob.isRemote,
          salaryMin: foundJob.salaryMin?.toString() || "",
          salaryMax: foundJob.salaryMax?.toString() || "",
          salaryCurrency: foundJob.salaryCurrency || "EUR",
          skills: foundJob.skills?.join(", ") || "",
          deadline: foundJob.deadline
            ? new Date(foundJob.deadline).toISOString().split("T")[0]
            : "",
        });
      } else {
        alert("Offre d'emploi non trouvée");
        router.push("/admin");
      }
    } catch (error) {
      console.error("Error loading job details:", error);
      alert("Erreur lors du chargement de l'offre");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData: any = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        responsibilities: formData.responsibilities || undefined,
        benefits: formData.benefits || undefined,
        company: formData.company,
        companyLogo: formData.companyLogo || undefined,
        location: formData.location,
        isRemote: formData.isRemote,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        salaryCurrency: formData.salaryCurrency || undefined,
        skills: formData.skills
          ? formData.skills.split(",").map((s: string) => s.trim())
          : undefined,
        deadline: formData.deadline || undefined,
      };

      await JobApplicationsService.applicationsControllerUpdateJobPosting(
        Number(params.id),
        updateData,
      );
      alert("Offre mise à jour avec succès!");
      setIsEditing(false);
      loadJobDetails();
    } catch (error) {
      console.error("Error updating job:", error);
      alert("Erreur lors de la mise à jour de l'offre");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await JobApplicationsService.applicationsControllerPublishJobPosting(
        Number(params.id),
      );
      alert("Offre publiée avec succès!");
      loadJobDetails();
    } catch (error) {
      console.error("Error publishing job:", error);
      alert("Erreur lors de la publication de l'offre");
    }
  };

  const handleClose = async () => {
    try {
      await JobApplicationsService.applicationsControllerCloseJobPosting(
        Number(params.id),
      );
      alert("Offre fermée avec succès!");
      loadJobDetails();
    } catch (error) {
      console.error("Error closing job:", error);
      alert("Erreur lors de la fermeture de l'offre");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette offre ?")) return;

    try {
      await JobApplicationsService.applicationsControllerDeleteJobPosting(
        Number(params.id),
      );
      alert("Offre supprimée avec succès!");
      router.push("/admin");
    } catch (error) {
      console.error("Error deleting job:", error);
      alert("Erreur lors de la suppression de l'offre");
    }
  };

  const formatStatus = (status: string) => {
    const statuses: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" }
    > = {
      draft: { label: "Brouillon", variant: "secondary" },
      published: { label: "Publié", variant: "default" },
      closed: { label: "Fermé", variant: "destructive" },
    };
    return statuses[status] || { label: status, variant: "secondary" };
  };

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </>
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <>
        <Navigation />
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
      </>
    );
  }

  if (!job) {
    return (
      <>
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Offre non trouvée</CardTitle>
              <CardDescription>
                L'offre d'emploi demandée n'existe pas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin">
                <Button className="w-full">Retour au tableau de bord</Button>
              </Link>
            </CardContent>
          </Card>
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

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-2xl">{job.title}</CardTitle>
                  <Badge variant={formatStatus(job.status).variant}>
                    {formatStatus(job.status).label}
                  </Badge>
                </div>
                <CardDescription>
                  {job.company} • {job.location} {job.isRemote && "• Remote"}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                {!isEditing && (
                  <>
                    {job.status === "draft" && (
                      <Button onClick={handlePublish} variant="default">
                        Publier
                      </Button>
                    )}
                    {job.status === "published" && (
                      <Button onClick={handleClose} variant="outline">
                        Fermer
                      </Button>
                    )}
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                    >
                      Modifier
                    </Button>
                    <Button
                      onClick={handleDelete}
                      variant="destructive"
                      size="icon"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleUpdate} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Titre du poste *</Label>
                  <Input
                    id="title"
                    required
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Entreprise *</Label>
                  <Input
                    id="company"
                    required
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyLogo">
                    Logo de l'entreprise (URL)
                  </Label>
                  <Input
                    id="companyLogo"
                    value={formData.companyLogo}
                    onChange={(e) =>
                      setFormData({ ...formData, companyLogo: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    rows={5}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requirements">Exigences *</Label>
                  <Textarea
                    id="requirements"
                    required
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsabilités</Label>
                  <Textarea
                    id="responsibilities"
                    rows={4}
                    value={formData.responsibilities}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        responsibilities: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="benefits">Avantages</Label>
                  <Textarea
                    id="benefits"
                    rows={3}
                    value={formData.benefits}
                    onChange={(e) =>
                      setFormData({ ...formData, benefits: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills">
                    Compétences (séparées par des virgules)
                  </Label>
                  <Input
                    id="skills"
                    value={formData.skills}
                    onChange={(e) =>
                      setFormData({ ...formData, skills: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jobType">Type de contrat *</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, jobType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full_time">Temps plein</SelectItem>
                      <SelectItem value="part_time">Temps partiel</SelectItem>
                      <SelectItem value="contract">Contrat</SelectItem>
                      <SelectItem value="internship">Stage</SelectItem>
                      <SelectItem value="freelance">Freelance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Niveau d'expérience *</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, experienceLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Débutant</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="mid">Intermédiaire</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="lead">Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localisation *</Label>
                  <Input
                    id="location"
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isRemote"
                    checked={formData.isRemote}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isRemote: checked })
                    }
                  />
                  <Label htmlFor="isRemote">Télétravail possible</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryMin">Salaire minimum</Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={formData.salaryMin}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMin: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salaryMax">Salaire maximum</Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={formData.salaryMax}
                      onChange={(e) =>
                        setFormData({ ...formData, salaryMax: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryCurrency">Devise</Label>
                  <Select
                    value={formData.salaryCurrency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, salaryCurrency: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline">Date limite de candidature</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Enregistrement..." : "Enregistrer"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Exigences</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>

                {job.responsibilities && (
                  <div>
                    <h3 className="font-semibold mb-2">Responsabilités</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {job.responsibilities}
                    </p>
                  </div>
                )}

                {job.benefits && (
                  <div>
                    <h3 className="font-semibold mb-2">Avantages</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {job.benefits}
                    </p>
                  </div>
                )}

                {job.skills && job.skills.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">Compétences requises</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Type de contrat</p>
                    <p className="text-sm text-muted-foreground">
                      {job.jobType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Niveau d'expérience</p>
                    <p className="text-sm text-muted-foreground">
                      {job.experienceLevel}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Salaire</p>
                    <p className="text-sm text-muted-foreground">
                      {Number(job.salaryMin).toLocaleString()} -{" "}
                      {Number(job.salaryMax).toLocaleString()}{" "}
                      {job.salaryCurrency}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Date limite</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(job.deadline).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Candidatures</p>
                    <p className="text-sm text-muted-foreground">
                      {job.applicationCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vues</p>
                    <p className="text-sm text-muted-foreground">
                      {job.viewCount}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
