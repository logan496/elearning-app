"use client";

import type React from "react";

import { useState } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { JobApplicationsService } from "@/lib/api/generated/services/JobApplicationsService";
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
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function SpontaneousApplicationPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: "",
    resumeUrl: "",
    portfolioUrl: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
  });

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Connexion requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour postuler
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
      // For spontaneous applications, we'll use jobId = 0 or create a special endpoint
      // This assumes the backend handles jobId = 0 as spontaneous application
      await JobApplicationsService.applicationsControllerApplyToJob(
        0,
        formData,
      );

      alert("Candidature spontanée envoyée avec succès!");
      router.push("/applications/my-applications");
    } catch (error) {
      console.error("[v0] Error submitting application:", error);
      alert("Erreur lors de l'envoi de la candidature");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/applications"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux offres
      </Link>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Candidature Spontanée</CardTitle>
          <CardDescription>
            Envoyez-nous votre candidature pour devenir publisher sur notre
            plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="coverLetter">Lettre de motivation *</Label>
              <Textarea
                id="coverLetter"
                required
                rows={8}
                placeholder="Parlez-nous de vous et de votre motivation..."
                value={formData.coverLetter}
                onChange={(e) =>
                  setFormData({ ...formData, coverLetter: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resumeUrl">CV (URL)</Label>
              <Input
                id="resumeUrl"
                type="url"
                placeholder="https://..."
                value={formData.resumeUrl}
                onChange={(e) =>
                  setFormData({ ...formData, resumeUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolioUrl">Portfolio (URL)</Label>
              <Input
                id="portfolioUrl"
                type="url"
                placeholder="https://..."
                value={formData.portfolioUrl}
                onChange={(e) =>
                  setFormData({ ...formData, portfolioUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={formData.linkedinUrl}
                onChange={(e) =>
                  setFormData({ ...formData, linkedinUrl: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub</Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/..."
                value={formData.githubUrl}
                onChange={(e) =>
                  setFormData({ ...formData, githubUrl: e.target.value })
                }
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Envoi en cours..." : "Envoyer ma candidature"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
