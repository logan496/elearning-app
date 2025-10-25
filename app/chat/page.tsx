"use client"

import { Navigation } from "@/components/navigation"
import { useState, useEffect, useRef } from "react"
import { Send, Search, Users, MoreVertical, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n-context"
import { ChatService } from "@/lib/api/generated/services/ChatService"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"
import type { MessageResponseDto } from "@/lib/api/generated/models/MessageResponseDto"

type Message = {
    id: number
    senderId: number
    senderName: string
    content: string
    time: string
    isOwn: boolean
    avatar: string
    createdAt: string
}

type Conversation = {
    id: number
    name: string
    lastMessage: string
    time: string
    unread: number
    avatar: string
    isGeneral: boolean
    otherUserId?: number
}

export default function ChatPage() {
    const { t } = useI18n()
    const { user, isAuthenticated } = useAuth()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)
    const [isSending, setIsSending] = useState(false)

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Charger les conversations au montage
    useEffect(() => {
        if (!isAuthenticated) return

        const loadConversations = async () => {
            try {
                const apiConversations = await ChatService.chatControllerGetConversations()

                // Ajouter le chat général en premier
                const formattedConversations: Conversation[] = [
                    {
                        id: 0,
                        name: "Chat Général",
                        lastMessage: "Bienvenue à tous !",
                        time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                        unread: 0,
                        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=general",
                        isGeneral: true,
                    },
                    ...apiConversations.map((conv: any) => ({
                        id: conv.id,
                        name: conv.otherUser?.username || "Utilisateur",
                        lastMessage: conv.lastMessage?.content || "",
                        time: conv.lastMessage
                            ? new Date(conv.lastMessage.createdAt).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })
                            : "",
                        unread: conv.unreadCount || 0,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${conv.otherUser?.username}`,
                        isGeneral: false,
                        otherUserId: conv.otherUser?.id,
                    })),
                ]

                setConversations(formattedConversations)

                // Sélectionner le chat général par défaut
                if (formattedConversations.length > 0) {
                    setSelectedConversation(formattedConversations[0])
                }
            } catch (error) {
                console.error("Erreur lors du chargement des conversations:", error)
                toast.error("Impossible de charger les conversations")

                // Fallback: afficher au moins le chat général
                const generalChat: Conversation = {
                    id: 0,
                    name: "Chat Général",
                    lastMessage: "Bienvenue à tous !",
                    time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                    unread: 0,
                    avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=general",
                    isGeneral: true,
                }
                setConversations([generalChat])
                setSelectedConversation(generalChat)
            } finally {
                setIsLoadingConversations(false)
            }
        }

        loadConversations()
    }, [isAuthenticated])

    // Charger les messages quand une conversation est sélectionnée
    useEffect(() => {
        if (!isAuthenticated || !selectedConversation) return

        const loadMessages = async () => {
            setIsLoadingMessages(true)
            try {
                let apiMessages: MessageResponseDto[] = []

                if (selectedConversation.isGeneral) {
                    apiMessages = await ChatService.chatControllerGetGeneralMessages()
                } else if (selectedConversation.otherUserId) {
                    apiMessages = await ChatService.chatControllerGetConversation(selectedConversation.otherUserId)
                }

                const formattedMessages: Message[] = apiMessages.map((msg) => {
                    const sender = msg.sender as any
                    const senderId = sender?.id || 0
                    const senderName = sender?.username || "Utilisateur"

                    return {
                        id: msg.id,
                        senderId,
                        senderName,
                        content: msg.content,
                        time: new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                        isOwn: senderId === user?.id,
                        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName}`,
                        createdAt: msg.createdAt,
                    }
                })

                setMessages(formattedMessages)
            } catch (error) {
                console.error("Erreur lors du chargement des messages:", error)
                toast.error("Impossible de charger les messages")
                setMessages([])
            } finally {
                setIsLoadingMessages(false)
            }
        }

        loadMessages()
    }, [selectedConversation, isAuthenticated, user])

    const handleSendMessage = async () => {
        if (!message.trim() || !isAuthenticated || !user || isSending) return

        setIsSending(true)

        try {
            let apiMessage: MessageResponseDto

            if (selectedConversation?.isGeneral) {
                apiMessage = await ChatService.chatControllerSendGeneralMessage({
                    content: message,
                })
            } else if (selectedConversation?.otherUserId) {
                apiMessage = await ChatService.chatControllerSendDirectMessage({
                    recipientId: selectedConversation.otherUserId,
                    content: message,
                })
            } else {
                throw new Error("Aucune conversation sélectionnée")
            }

            // Ajouter le message à la liste locale
            const newMessage: Message = {
                id: apiMessage.id,
                senderId: user.id,
                senderName: user.username || "Vous",
                content: apiMessage.content,
                time: new Date(apiMessage.createdAt).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                isOwn: true,
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
                createdAt: apiMessage.createdAt,
            }

            setMessages((prev) => [...prev, newMessage])
            setMessage("")
        } catch (error) {
            console.error("Erreur lors de l'envoi du message:", error)
            toast.error("Impossible d'envoyer le message")
        } finally {
            setIsSending(false)
        }
    }

    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="pt-16 flex items-center justify-center h-[calc(100vh-4rem)]">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Connexion requise</h2>
                        <p className="text-muted-foreground">Veuillez vous connecter pour accéder au chat</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-16 h-screen flex">
                {/* Sidebar - Liste des conversations */}
                <div className="w-80 border-r border-border bg-card flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-border">
                        <h2 className="text-xl font-bold text-foreground mb-4">{t.chat?.title || "Messages"}</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                type="text"
                                placeholder="Rechercher une conversation..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    </div>

                    {/* Liste des conversations */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoadingConversations ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="animate-spin text-muted-foreground" size={24} />
                            </div>
                        ) : filteredConversations.length === 0 ? (
                            <div className="flex items-center justify-center p-8 text-muted-foreground">
                                Aucune conversation
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-all duration-200 border-b border-border group ${
                                        selectedConversation?.id === conv.id ? "bg-accent" : ""
                                    }`}
                                >
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={conv.avatar}
                                            alt={conv.name}
                                            className="w-12 h-12 rounded-full transition-transform duration-200 group-hover:scale-110"
                                        />
                                        {conv.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold animate-in zoom-in-50 duration-200">
                                                {conv.unread}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold text-foreground flex items-center gap-2 truncate">
                                                {conv.name}
                                                {conv.isGeneral && (
                                                    <Users size={16} className="text-primary flex-shrink-0" />
                                                )}
                                            </h3>
                                            <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Zone de chat principale */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            {/* Header du chat */}
                            <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={selectedConversation.avatar}
                                        alt={selectedConversation.name}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                                            {selectedConversation.name}
                                            {selectedConversation.isGeneral && (
                                                <Users size={16} className="text-primary" />
                                            )}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedConversation.isGeneral
                                                ? "Tous les membres"
                                                : t.chat?.online || "En ligne"}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-accent transition-all duration-200 hover:scale-110"
                                >
                                    <MoreVertical size={20} />
                                </Button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="animate-spin text-muted-foreground" size={32} />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-muted-foreground">
                                        Aucun message pour le moment
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                                                    msg.isOwn ? "flex-row-reverse" : "flex-row"
                                                }`}
                                            >
                                                <img
                                                    src={msg.avatar}
                                                    alt={msg.senderName}
                                                    className="w-8 h-8 rounded-full flex-shrink-0 transition-transform duration-200 hover:scale-110"
                                                />
                                                <div
                                                    className={`flex flex-col gap-1 max-w-md ${
                                                        msg.isOwn ? "items-end" : "items-start"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-medium text-foreground">
                                                            {msg.senderName}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                                                    </div>
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl transition-all duration-200 hover:shadow-md ${
                                                            msg.isOwn
                                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                                : "bg-card border border-border rounded-tl-sm"
                                                        }`}
                                                    >
                                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            {/* Formulaire d'envoi */}
                            <div className="border-t border-border bg-card p-4">
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault()
                                        handleSendMessage()
                                    }}
                                    className="flex gap-3"
                                >
                                    <Input
                                        type="text"
                                        placeholder={t.chat?.placeholder || "Tapez votre message..."}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={isSending}
                                        className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        disabled={isSending || !message.trim()}
                                        className="transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg disabled:opacity-50"
                                    >
                                        {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Sélectionnez une conversation pour commencer
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}