"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { JobApplicationsService } from "@/lib/api/generated/services/JobApplicationsService";
import type { CreateJobPostingDto } from "@/lib/api/generated/models/CreateJobPostingDto";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function NewJobPostingPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    company: "",
    companyLogo: "",
    jobType: "full_time" as CreateJobPostingDto.jobType,
    experienceLevel: "mid" as CreateJobPostingDto.experienceLevel,
    location: "",
    isRemote: false,
    salaryMin: "",
    salaryMax: "",
    salaryCurrency: "EUR",
    skills: "",
    deadline: "",
    status: "open" as any,
  });

  if (!isAuthenticated || !user?.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Accès refusé</CardTitle>
            <CardDescription>
              Vous devez être administrateur pour créer des offres
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const jobData: CreateJobPostingDto = {
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
          ? formData.skills.split(",").map((s) => s.trim())
          : undefined,
        deadline: formData.deadline || undefined,
        status: formData.status,
      };

      console.log("[v0] Submitting job data:", jobData);
      await JobApplicationsService.applicationsControllerCreateJobPosting(
        jobData,
      );
      alert("Offre créée avec succès!");
      router.push("/admin");
    } catch (error) {
      console.error("[v0] Error creating job posting:", error);
      alert("Erreur lors de la création de l'offre");
    } finally {
      setLoading(false);
    }
  };

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

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Créer une offre d'emploi</CardTitle>
            <CardDescription>
              Publiez une nouvelle offre pour recruter des publishers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Titre du poste *</Label>
                <Input
                  id="title"
                  required
                  placeholder="Ex: Développeur Full Stack"
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
                  placeholder="Ex: Tech Corp"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyLogo">Logo de l'entreprise (URL)</Label>
                <Input
                  id="companyLogo"
                  placeholder="https://example.com/logo.png"
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
                  placeholder="Description du poste..."
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
                  placeholder="Compétences et qualifications requises..."
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
                  placeholder="Tâches et responsabilités..."
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
                  placeholder="Avantages offerts..."
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
                  placeholder="Ex: React, Node.js, TypeScript"
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
                    setFormData({
                      ...formData,
                      jobType: value as CreateJobPostingDto.jobType,
                    })
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
                    setFormData({
                      ...formData,
                      experienceLevel:
                        value as CreateJobPostingDto.experienceLevel,
                    })
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
                  placeholder="Ex: Paris, France"
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
                    placeholder="40000"
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
                    placeholder="60000"
                    value={formData.salaryMax}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salaryMax: e.target.value,
                      })
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
                    setFormData({
                      ...formData,
                      deadline: e.target.value,
                    })
                  }
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Création..." : "Créer l'offre"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
