"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
import { AdminService } from "@/lib/api/generated/services/AdminService";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft, Mail, Shield, Award, Trash2 } from "lucide-react";
import { Navigation } from "@/components/navigation";

export default function AdminUsersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    console.log("[v0] Admin Users - Auth state:", {
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
      console.log("[v0] Loading users...");
      loadUsers();
    } else {
      console.log("[v0] User not authenticated or not admin");
      setLoading(false);
    }
  }, [isAuthenticated, user, authLoading]);

  const loadUsers = async () => {
    try {
      console.log("[v0] Fetching users from API...");
      const response = await AdminService.adminControllerGetAllUsers(1, 100);
      console.log("[v0] Users response:", response);

      const usersList = Array.isArray(response)
        ? response
        : response?.data || response?.users || [];
      console.log("[v0] Parsed users list:", usersList);
      setUsers(usersList);
    } catch (error) {
      console.error("[v0] Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: number, currentStatus: boolean) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir ${currentStatus ? "retirer" : "donner"} les droits admin à cet utilisateur?`,
      )
    ) {
      return;
    }

    try {
      await AdminService.adminControllerMakeUserAdmin(userId, {
        isAdmin: !currentStatus,
      });
      alert("Statut admin mis à jour!");
      loadUsers();
    } catch (error) {
      console.error("[v0] Error updating admin status:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleTogglePublisher = async (
    userId: number,
    currentStatus: boolean,
  ) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir ${currentStatus ? "retirer" : "donner"} le statut publisher à cet utilisateur?`,
      )
    ) {
      return;
    }

    try {
      await AdminService.adminControllerUpdatePublisherStatus(userId, {
        isPublisher: !currentStatus,
      });
      alert("Statut publisher mis à jour!");
      loadUsers();
    } catch (error) {
      console.error("[v0] Error updating publisher status:", error);
      alert("Erreur lors de la mise à jour");
    }
  };

  const handleDeleteUser = async (userId: number, username: string) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer l'utilisateur "${username}"? Cette action est irréversible.`,
      )
    ) {
      return;
    }

    try {
      await AdminService.adminControllerDeleteUser(userId);
      alert("Utilisateur supprimé!");
      loadUsers();
    } catch (error) {
      console.error("[v0] Error deleting user:", error);
      alert("Erreur lors de la suppression");
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

  const filteredUsers = users.filter(
    (u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
          <h1 className="text-3xl font-bold mb-2">Gestion des utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les rôles et permissions des utilisateurs
          </p>
        </div>

        <div className="mb-6">
          <Input
            placeholder="Rechercher par nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">Aucun utilisateur trouvé</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((u) => (
              <Card key={u.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {u.username}
                        {u.isAdmin && (
                          <Badge variant="destructive">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </Badge>
                        )}
                        {u.isPublisher && (
                          <Badge>
                            <Award className="h-3 w-3 mr-1" />
                            Publisher
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Mail className="h-4 w-4" />
                        {u.email}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant={u.isAdmin ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => handleToggleAdmin(u.id, u.isAdmin)}
                        disabled={u.id === user?.id}
                      >
                        {u.isAdmin ? "Retirer Admin" : "Promouvoir Admin"}
                      </Button>
                      <Button
                        variant={u.isPublisher ? "secondary" : "outline"}
                        size="sm"
                        onClick={() =>
                          handleTogglePublisher(u.id, u.isPublisher)
                        }
                      >
                        {u.isPublisher
                          ? "Retirer Publisher"
                          : "Promouvoir Publisher"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteUser(u.id, u.username)}
                        disabled={u.id === user?.id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
