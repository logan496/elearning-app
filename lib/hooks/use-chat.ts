// src/hooks/use-chat.ts
import { useState, useEffect, useCallback } from "react"
import { ChatService } from "@/lib/api/generated/services/ChatService"
import { toast } from "sonner"
import type { MessageResponseDto } from "@/lib/api/generated/models/MessageResponseDto"

export type Message = {
    id: number
    senderId: number
    senderName: string
    content: string
    time: string
    isOwn: boolean
    avatar: string
    createdAt: string
}

export type Conversation = {
    id: number
    name: string
    lastMessage: string
    time: string
    unread: number
    avatar: string
    isGeneral: boolean
    otherUserId?: number
}

interface UseChatOptions {
    userId?: number
    autoRefresh?: boolean
    refreshInterval?: number
}

export function useChat(options: UseChatOptions = {}) {
    const { userId, autoRefresh = false, refreshInterval = 30000 } = options

    const [conversations, setConversations] = useState<Conversation[]>([])
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoadingConversations, setIsLoadingConversations] = useState(true)
    const [isLoadingMessages, setIsLoadingMessages] = useState(false)
    const [isSending, setIsSending] = useState(false)

    // Charger les conversations
    const loadConversations = useCallback(async () => {
        if (!userId) return

        try {
            const apiConversations = await ChatService.chatControllerGetConversations()

            const formattedConversations: Conversation[] = [
                {
                    id: 0,
                    name: "Chat Général",
                    lastMessage: "Bienvenue à tous !",
                    time: new Date().toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
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

            if (!selectedConversation && formattedConversations.length > 0) {
                setSelectedConversation(formattedConversations[0])
            }
        } catch (error) {
            console.error("Erreur lors du chargement des conversations:", error)
            toast.error("Impossible de charger les conversations")

            const generalChat: Conversation = {
                id: 0,
                name: "Chat Général",
                lastMessage: "Bienvenue à tous !",
                time: new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                unread: 0,
                avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=general",
                isGeneral: true,
            }
            setConversations([generalChat])
            setSelectedConversation(generalChat)
        } finally {
            setIsLoadingConversations(false)
        }
    }, [userId, selectedConversation])

    // Charger les messages d'une conversation
    const loadMessages = useCallback(
        async (conversation: Conversation) => {
            if (!userId) return

            setIsLoadingMessages(true)
            try {
                let apiMessages: MessageResponseDto[] = []

                if (conversation.isGeneral) {
                    apiMessages = await ChatService.chatControllerGetGeneralMessages()
                } else if (conversation.otherUserId) {
                    apiMessages = await ChatService.chatControllerGetConversation(conversation.otherUserId)
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
                        isOwn: senderId === userId,
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
        },
        [userId]
    )

    // Envoyer un message
    const sendMessage = useCallback(
        async (content: string, username?: string) => {
            if (!content.trim() || !userId || !selectedConversation || isSending) return

            setIsSending(true)

            try {
                let apiMessage: MessageResponseDto

                if (selectedConversation.isGeneral) {
                    apiMessage = await ChatService.chatControllerSendGeneralMessage({ content })
                } else if (selectedConversation.otherUserId) {
                    apiMessage = await ChatService.chatControllerSendDirectMessage({
                        recipientId: selectedConversation.otherUserId,
                        content,
                    })
                } else {
                    throw new Error("Aucune conversation sélectionnée")
                }

                const newMessage: Message = {
                    id: apiMessage.id,
                    senderId: userId,
                    senderName: username || "Vous",
                    content: apiMessage.content,
                    time: new Date(apiMessage.createdAt).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    isOwn: true,
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
                    createdAt: apiMessage.createdAt,
                }

                setMessages((prev) => [...prev, newMessage])
                return true
            } catch (error) {
                console.error("Erreur lors de l'envoi du message:", error)
                toast.error("Impossible d'envoyer le message")
                return false
            } finally {
                setIsSending(false)
            }
        },
        [userId, selectedConversation, isSending]
    )

    // Marquer un message comme lu
    const markAsRead = useCallback(async (messageId: number) => {
        try {
            await ChatService.chatControllerMarkAsRead(messageId)
        } catch (error) {
            console.error("Erreur lors du marquage comme lu:", error)
        }
    }, [])

    // Charger les conversations au montage
    useEffect(() => {
        if (userId) {
            loadConversations()
        }
    }, [userId, loadConversations])

    // Charger les messages quand la conversation change
    useEffect(() => {
        if (selectedConversation && userId) {
            loadMessages(selectedConversation)
        }
    }, [selectedConversation, userId, loadMessages])

    // Auto-refresh
    useEffect(() => {
        if (!autoRefresh || !selectedConversation) return

        const interval = setInterval(() => {
            if (selectedConversation) {
                loadMessages(selectedConversation)
            }
        }, refreshInterval)

        return () => clearInterval(interval)
    }, [autoRefresh, refreshInterval, selectedConversation, loadMessages])

    return {
        conversations,
        selectedConversation,
        messages,
        isLoadingConversations,
        isLoadingMessages,
        isSending,
        setSelectedConversation,
        sendMessage,
        markAsRead,
        refreshConversations: loadConversations,
        refreshMessages: () => selectedConversation && loadMessages(selectedConversation),
    }
}