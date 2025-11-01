"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { BlogService } from "@/lib/api/generated";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PublisherGuard } from "@/lib/guards/publisher-guard";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  status: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
}

export default function PublisherBlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyPosts();
  }, []);

  const loadMyPosts = async () => {
    try {
      setLoading(true);
      const response = await BlogService.blogControllerGetMyPosts();
      setPosts(response as BlogPost[]);
    } catch (error) {
      console.error("[Publisher] Error loading posts:", error);
      toast.error("Erreur lors du chargement de vos articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;

    try {
      await BlogService.blogControllerDeletePost(id);
      toast.success("Article supprimé");
      loadMyPosts();
    } catch (error) {
      console.error("[Publisher] Error deleting post:", error);
      toast.error("Erreur lors de la suppression");
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await BlogService.blogControllerPublishPost(id);
      toast.success("Article publié");
      loadMyPosts();
    } catch (error) {
      console.error("[Publisher] Error publishing post:", error);
      toast.error("Erreur lors de la publication");
    }
  };

  return (
    <PublisherGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Mes Articles</h1>
                <p className="text-muted-foreground">
                  Gérez vos articles de blog
                </p>
              </div>
              <Button asChild>
                <Link href="/publisher/blog/new">
                  <Plus className="mr-2" />
                  Nouvel article
                </Link>
              </Button>
            </div>

            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    Vous n'avez pas encore d'articles
                  </p>
                  <Button asChild>
                    <Link href="/publisher/blog/new">
                      <Plus className="mr-2" />
                      Créer votre premier article
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                        <Badge
                          variant={
                            post.status === "published" ? "default" : "outline"
                          }
                        >
                          {post.status === "published" ? "Publié" : "Brouillon"}
                        </Badge>
                      </div>
                      <CardTitle className="line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{post.likesCount} likes</span>
                        <span>{post.commentsCount} commentaires</span>
                      </div>
                    </CardContent>

                    <CardAction>
                      <div className="flex gap-2">
                        {post.status !== "published" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePublish(post.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/publisher/blog/${post.id}/edit`}>
                            <Edit className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardAction>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PublisherGuard>
  );
}
