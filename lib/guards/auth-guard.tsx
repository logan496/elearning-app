"use client";

import type React from "react";

import { useAuth } from "@/lib/contexts/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2, Lock, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AuthGuardProps {
  children: React.ReactNode;
  requirePublisher?: boolean;
  fallbackUrl?: string;
}

export function AuthGuard({
  children,
  requirePublisher = false,
  fallbackUrl = "/login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(fallbackUrl);
      } else if (requirePublisher && !user?.isPublisher) {
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, requirePublisher, user, router, fallbackUrl]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-6 flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">
              Vérification de l'authentification...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Authentification requise</CardTitle>
            <CardDescription className="text-base">
              Vous devez être connecté pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Connectez-vous pour accéder à vos contenus et fonctionnalités
                personnalisées
              </p>
            </div>
          </CardContent>
          <CardAction>
            <Button asChild className="w-full" size="lg">
              <Link href={fallbackUrl}>
                <LogIn className="mr-2 h-4 w-4" />
                Se connecter
              </Link>
            </Button>
          </CardAction>
        </Card>
      </div>
    );
  }

  if (requirePublisher && !user?.isPublisher) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Accès refusé</CardTitle>
            <CardDescription className="text-base">
              Vous devez être un éditeur pour accéder à cette page
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Postulez pour devenir éditeur et publier vos propres contenus
                sur la plateforme
              </p>
            </div>
          </CardContent>
          <CardAction>
            <Button
              asChild
              className="w-full bg-transparent"
              size="lg"
              variant="outline"
            >
              <Link href="/applications">Voir les offres d'éditeur</Link>
            </Button>
          </CardAction>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
