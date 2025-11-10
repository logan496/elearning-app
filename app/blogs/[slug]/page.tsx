"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect, memo, useCallback } from "react"
import { useAuth } from "@/lib/contexts/auth-context"
import { BlogService } from "@/lib/api/generated"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { AuthGuard } from "@/lib/guards/auth-guard"
import { toast } from "sonner"
import { Heart, MessageCircle, Calendar, Send, Reply, Edit2, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useParams } from "next/navigation"

interface Comment {
  id: number
  content: string
  user: {
    id: number
    username: string
    avatar?: string
  }
  userId: number
  parentId: number | null
  createdAt: string
  replies?: Comment[]
}

interface BlogPost {
  id: number
  title: string
  excerpt: string
  content: string
  slug: string
  featuredImage?: string
  category: string
  tags: string[]
  author: {
    id: number
    username: string
    avatar?: string
  }
  likesCount: number
  commentsCount: number
  isLiked: boolean
  comments: Comment[]
  createdAt: string
  updatedAt: string
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const { user } = useAuth()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  // ✅ Remplacer Map par un objet simple
  const [replyContents, setReplyContents] = useState<Record<number, string>>({})
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [editingComment, setEditingComment] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  const buildCommentTree = (comments: any[]): Comment[] => {
    const commentMap = new Map<number, Comment>()
    const rootComments: Comment[] = []

    comments.forEach((comment) => {
      commentMap.set(comment.id, {
        ...comment,
        replies: [],
      })
    })

    comments.forEach((comment) => {
      const commentNode = commentMap.get(comment.id)!
      if (comment.parentId === null) {
        rootComments.push(commentNode)
      } else {
        const parent = commentMap.get(comment.parentId)
        if (parent) {
          parent.replies = parent.replies || []
          parent.replies.push(commentNode)
          parent.replies.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        }
      }
    })

    rootComments.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    return rootComments
  }

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      const response = await BlogService.blogControllerGetPostBySlug(slug, user?.id || 0)
      const commentsTree = buildCommentTree(response.comments || [])
      setPost({
        ...response,
        comments: commentsTree,
      } as BlogPost)
    } catch (error) {
      console.error("[Blog] Error loading post:", error)
      toast.error("Erreur lors du chargement de l'article")
    } finally {
      setLoading(false)
    }
  }

  const refreshComments = async () => {
    if (!post) return

    try {
      const response = await BlogService.blogControllerGetPostBySlug(slug, user?.id || 0)
      const commentsTree = buildCommentTree(response.comments || [])

      setPost((prev) =>
          prev
              ? {
                ...prev,
                comments: commentsTree,
                commentsCount: response.commentsCount,
              }
              : null,
      )
    } catch (error) {
      console.error("[Blog] Error refreshing comments:", error)
    }
  }

  const handleLike = async () => {
    if (!post) return

    const previousLiked = post.isLiked
    const previousCount = post.likesCount

    setPost({
      ...post,
      isLiked: !post.isLiked,
      likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1,
    })

    try {
      await BlogService.blogControllerToggleLike(post.id)
    } catch (error) {
      console.error("[Blog] Error toggling like:", error)
      toast.error("Erreur lors du like")

      setPost({
        ...post,
        isLiked: previousLiked,
        likesCount: previousCount,
      })
    }
  }

  const handleSubmitComment = async () => {
    if (!post || !commentContent.trim() || !user) return

    try {
      setSubmittingComment(true)
      await BlogService.blogControllerAddComment(post.id, {
        content: commentContent,
      })

      toast.success("Commentaire ajouté")
      setCommentContent("")

      await refreshComments()
    } catch (error) {
      console.error("[Blog] Error adding comment:", error)
      toast.error("Erreur lors de l'ajout du commentaire")
    } finally {
      setSubmittingComment(false)
    }
  }

  // ✅ Simplifier la gestion du contenu des réponses
  const handleReplyContentChange = useCallback((commentId: number, content: string) => {
    setReplyContents((prev) => ({
      ...prev,
      [commentId]: content,
    }))
  }, [])

  const handleSubmitReply = async (parentId: number) => {
    const replyContent = replyContents[parentId] || ""
    if (!post || !replyContent.trim() || !user) return

    try {
      setSubmittingComment(true)
      await BlogService.blogControllerAddComment(post.id, {
        content: replyContent,
        parentId,
      })

      toast.success("Réponse ajoutée")
      // ✅ Supprimer la réponse de l'objet
      setReplyContents((prev) => {
        const newContents = { ...prev }
        delete newContents[parentId]
        return newContents
      })
      setReplyingTo(null)

      await refreshComments()
    } catch (error) {
      console.error("[Blog] Error adding reply:", error)
      toast.error("Erreur lors de l'ajout de la réponse")
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) return

    try {
      await BlogService.blogControllerDeleteComment(commentId)
      toast.success("Commentaire supprimé")

      await refreshComments()
    } catch (error) {
      console.error("[Blog] Error deleting comment:", error)
      toast.error("Erreur lors de la suppression du commentaire")
    }
  }

  const handleStartEdit = (comment: Comment) => {
    setEditingComment(comment.id)
    setEditContent(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingComment(null)
    setEditContent("")
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editContent.trim()) return

    try {
      // We need to pass the content in the request body
      await BlogService.blogControllerUpdateComment(commentId, {
        content: editContent,
      } as any)
      toast.success("Commentaire modifié")
      setEditingComment(null)
      setEditContent("")

      await refreshComments()
    } catch (error) {
      console.error("[Blog] Error updating comment:", error)
      toast.error("Erreur lors de la modification du commentaire")
    }
  }

  const CommentItem = memo(({ comment, depth = 0 }: { comment: Comment; depth?: number }) => {
    const isOwner = user?.id === comment.user?.id
    const isEditing = editingComment === comment.id
    const isReplying = replyingTo === comment.id

    const authorName = comment.user?.username || "Utilisateur inconnu"
    const authorAvatar = comment.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${authorName}`

    // ✅ Accéder directement à l'objet
    const currentReplyContent = replyContents[comment.id] || ""

    return (
        <div className={depth > 0 ? "ml-12 mt-4" : ""}>
          <Card>
            <CardHeader>
              <div className="flex items-start gap-3">
                <img
                    src={authorAvatar || "/placeholder.svg"}
                    alt={authorName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{authorName}</span>
                      <span className="text-sm text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                    </div>
                    {isOwner && !isEditing && (
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" onClick={() => handleStartEdit(comment)}>
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                    )}
                  </div>

                  {isEditing ? (
                      <div className="space-y-2 mt-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            rows={2}
                            className="text-sm"
                            autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleUpdateComment(comment.id)}>
                            Enregistrer
                          </Button>
                          <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                  ) : (
                      <>
                        <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>
                        {user && depth < 3 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="mt-2 h-8"
                                onClick={() => {
                                  setReplyingTo(comment.id)
                                  // ✅ Initialiser avec une chaîne vide si nécessaire
                                  if (!(comment.id in replyContents)) {
                                    handleReplyContentChange(comment.id, "")
                                  }
                                }}
                            >
                              <Reply className="w-3 h-3 mr-1" />
                              Répondre
                            </Button>
                        )}
                      </>
                  )}

                  {isReplying && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                            placeholder="Écrire une réponse..."
                            value={currentReplyContent}
                            onChange={(e) => handleReplyContentChange(comment.id, e.target.value)}
                            rows={2}
                            className="text-sm"
                            autoFocus
                            dir="ltr"
                            style={{ direction: "ltr" }}
                        />
                        <div className="flex gap-2">
                          <Button
                              size="sm"
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={!currentReplyContent.trim() || submittingComment}
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Répondre
                          </Button>
                          <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReplyingTo(null)
                                // ✅ Supprimer la réponse de l'objet
                                setReplyContents((prev) => {
                                  const newContents = { ...prev }
                                  delete newContents[comment.id]
                                  return newContents
                                })
                              }}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Annuler
                          </Button>
                        </div>
                      </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {comment.replies && comment.replies.length > 0 && (
              <div className="mt-2">
                {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                ))}
              </div>
          )}
        </div>
    )
  })

  CommentItem.displayName = "CommentItem"

  if (loading) {
    return (
        <AuthGuard>
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        </AuthGuard>
    )
  }

  if (!post) {
    return (
        <AuthGuard>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Article non trouvé</h1>
                <p className="text-muted-foreground">Cet article n'existe pas ou a été supprimé</p>
              </div>
            </main>
            <Footer />
          </div>
        </AuthGuard>
    )
  }

  return (
      <AuthGuard>
        <div className="min-h-screen flex flex-col">
          <Navigation />

          <main className="flex-1 pt-24 pb-12 px-4 lg:px-8">
            <article className="container mx-auto max-w-4xl">
              {post.featuredImage && (
                  <div className="relative h-96 rounded-xl overflow-hidden mb-8">
                    <img
                        src={post.featuredImage || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                  </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{post.category}</Badge>
                  {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                  ))}
                </div>

                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <img
                          src={
                              post.author?.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author?.username || "author"}`
                          }
                          alt={post.author?.username || "Auteur"}
                          className="w-10 h-10 rounded-full"
                      />
                      <span className="font-medium text-foreground">
                      {post.author?.username || "Utilisateur inconnu"}
                    </span>
                    </div>
                    <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                      {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                  </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={handleLike} className={post.isLiked ? "text-red-500" : ""}>
                      <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? "fill-current" : ""}`} />
                      {post.likesCount}
                    </Button>
                    <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                      {post.commentsCount}
                  </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Commentaires ({post.commentsCount})</h2>

                {user && (
                    <Card className="mb-8">
                      <CardContent className="pt-6">
                        <Textarea
                            placeholder="Ajouter un commentaire..."
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            rows={3}
                            className="mb-4"
                            spellCheck="true"
                        />
                        <Button onClick={handleSubmitComment} disabled={!commentContent.trim() || submittingComment}>
                          <Send className="w-4 h-4 mr-2" />
                          Publier
                        </Button>
                      </CardContent>
                    </Card>
                )}

                <div className="space-y-4">
                  {post.comments.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">Aucun commentaire pour le moment</p>
                  ) : (
                      post.comments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
                  )}
                </div>
              </div>
            </article>
          </main>

          <Footer />
        </div>
      </AuthGuard>
  )
}
