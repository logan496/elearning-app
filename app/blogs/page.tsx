"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/contexts/auth-context";
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
import { Input } from "@/components/ui/input";
import { AuthGuard } from "@/lib/guards/auth-guard";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Heart,
  MessageCircle,
  Calendar,
  User,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: {
    id: number;
    username: string;
    avatar?: string;
  };
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BlogPage() {
  const { user, isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    "technology",
    "design",
    "business",
    "marketing",
    "programming",
    "tutorial",
    "news",
    "other",
  ];

  useEffect(() => {
    if (isAuthenticated) {
      loadPosts();
    }
  }, [selectedCategory, isAuthenticated]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      console.log("[v0] Loading posts...");
      let response;

      if (selectedCategory) {
        response =
          await BlogService.blogControllerGetPostsByCategory(selectedCategory);
      } else {
        response = await BlogService.blogControllerGetAllPosts();
      }

      console.log("[v0] Posts response:", response);

      let postsData: BlogPost[] = [];
      if (Array.isArray(response)) {
        postsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (response?.posts && Array.isArray(response.posts)) {
        postsData = response.posts;
      } else {
        console.error("[v0] Unexpected response format:", response);
        toast.error("Format de réponse inattendu");
        return;
      }

      setPosts(postsData);
    } catch (error) {
      console.error("[Blog] Error loading posts:", error);
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadPosts();
      return;
    }

    try {
      setLoading(true);
      const response = await BlogService.blogControllerSearchPosts(searchQuery);

      console.log("[v0] Search response:", response);

      let postsData: BlogPost[] = [];
      if (Array.isArray(response)) {
        postsData = response;
      } else if (response?.data && Array.isArray(response.data)) {
        postsData = response.data;
      } else if (response?.posts && Array.isArray(response.posts)) {
        postsData = response.posts;
      }

      setPosts(postsData);
    } catch (error) {
      console.error("[Blog] Error searching posts:", error);
      toast.error("Erreur lors de la recherche");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-16 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Connexion requise</CardTitle>
              <CardDescription>
                Vous devez être connecté pour accéder au blog et découvrir nos
                articles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Connectez-vous pour lire des articles, laisser des
                  commentaires et interagir avec la communauté
                </p>
              </div>
            </CardContent>
            <CardAction>
              <Button asChild className="w-full" size="lg">
                <Link href="/login">Se connecter</Link>
              </Button>
            </CardAction>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-12">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Blog</h1>
                  <p className="text-muted-foreground">
                    Découvrez nos derniers articles et tutoriels
                  </p>
                </div>

                {user?.isPublisher && (
                  <Button asChild>
                    <Link href="/app/publisher/blog/new">
                      <Plus className="mr-2" />
                      Nouvel article
                    </Link>
                  </Button>
                )}
              </div>

              {/* Search and Filters */}
              <div className="mt-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Rechercher des articles..."
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

              {/* Category Filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  Tous
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Blog Posts Grid */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-xl" />
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Aucun article trouvé</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card
                    key={post.id}
                    className="group hover:shadow-lg transition-all duration-300"
                  >
                    {post.featuredImage && (
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={post.featuredImage || "/placeholder.svg"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{post.category}</Badge>
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {post.likesCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            {post.commentsCount}
                          </span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">
                          {post.author?.username || "Utilisateur inconnu"}
                        </span>
                      </div>
                    </CardContent>

                    <CardAction>
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/blogs/${post.slug}`}>Lire plus</Link>
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
    </AuthGuard>
  );
}
