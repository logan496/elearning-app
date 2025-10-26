"use client"

import { Navigation } from "@/components/navigation"
import { useState, useEffect, useRef } from "react"
import { Send, Search, Users, MoreVertical, Loader2, MessageSquarePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n-context"
import { ChatService } from "@/lib/api/generated/services/ChatService"
import { useAuth } from "@/lib/contexts/auth-context"
import { toast } from "sonner"
import { useChatSocket } from "@/lib/hooks/use-chat-socket"

type Message = {
    id: number | string
    senderId: number
    senderName: string
    content: string
    time: string
    isOwn: boolean
    avatar: string
    createdAt: string
    tempId?: string
    isPending?: boolean
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

type OnlineUser = {
    id: number
    username: string
    email: string
    avatar: string
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

    const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false)
    const [availableUsers, setAvailableUsers] = useState<OnlineUser[]>([])
    const [isLoadingUsers, setIsLoadingUsers] = useState(false)
    const [userSearchQuery, setUserSearchQuery] = useState("")

    const {
        isConnected,
        sendGeneralMessage,
        sendDirectMessage,
        onGeneralMessage,
        onDirectMessage,
        offGeneralMessage,
        offDirectMessage,
    } = useChatSocket()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    // Charger les conversations
    useEffect(() => {
        if (!isAuthenticated) return

        const loadConversations = async () => {
            try {
                const apiConversations = await ChatService.chatControllerGetConversations()

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
                    ...apiConversations.map((conv: any) => {
                        const otherUser = conv.user || conv.otherUser
                        const lastMsg = conv.lastMessage

                        return {
                            id: otherUser?.id || conv.id,
                            name: otherUser?.username || "Utilisateur",
                            lastMessage: lastMsg?.content || "",
                            time: lastMsg?.lastMessageTime || lastMsg?.createdAt
                                ? new Date(lastMsg.lastMessageTime || lastMsg.createdAt).toLocaleTimeString("fr-FR", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })
                                : "",
                            unread: 0,
                            avatar: otherUser?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${otherUser?.username || 'user'}`,
                            isGeneral: false,
                            otherUserId: otherUser?.id,
                        }
                    }),
                ]

                setConversations(formattedConversations)

                if (formattedConversations.length > 0) {
                    setSelectedConversation(formattedConversations[0])
                }
            } catch (error) {
                console.error("Erreur chargement conversations:", error)
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

    // Charger les messages
    useEffect(() => {
        if (!isAuthenticated || !selectedConversation) return

        const loadMessages = async () => {
            setIsLoadingMessages(true)
            try {
                let apiMessages: any[] = []

                if (selectedConversation.isGeneral) {
                    apiMessages = await ChatService.chatControllerGetGeneralMessages()
                } else if (selectedConversation.otherUserId) {
                    apiMessages = await ChatService.chatControllerGetConversation(selectedConversation.otherUserId)
                }

                const formattedMessages: Message[] = apiMessages.map((msg) => {
                    const sender = msg.sender
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
                        avatar: sender?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${senderName}`,
                        createdAt: msg.createdAt,
                    }
                })

                setMessages(formattedMessages)
            } catch (error) {
                console.error("Erreur chargement messages:", error)
                setMessages([])
            } finally {
                setIsLoadingMessages(false)
            }
        }

        loadMessages()
    }, [selectedConversation?.otherUserId, isAuthenticated, user?.id])

    // ✅ Écouter les messages temps réel avec gestion intelligente
    useEffect(() => {
        if (!selectedConversation || !user) return

        console.log('🎧 Setting up listeners for conversation:', selectedConversation.name, selectedConversation.isGeneral ? 'GENERAL' : `USER ${selectedConversation.otherUserId}`)

        if (selectedConversation.isGeneral) {
            const handleGeneralMessage = (message: any) => {
                console.log('📨 Received general message:', message)

                setMessages((prev) => {
                    // Si c'est notre message avec tempId, remplacer
                    if (message.tempId) {
                        const index = prev.findIndex(m => m.tempId === message.tempId)
                        if (index !== -1) {
                            console.log('✅ Replacing temp message with real one')
                            const updated = [...prev]
                            updated[index] = {
                                ...updated[index],
                                id: message.id,
                                isPending: false,
                                tempId: undefined,
                            }
                            return updated
                        }
                    }

                    // Vérifier si le message existe déjà (éviter duplications)
                    if (prev.some(m => m.id === message.id)) {
                        console.log('⚠️ Message already exists, skipping')
                        return prev
                    }

                    // Ajouter nouveau message
                    console.log('➕ Adding new message')
                    const newMessage: Message = {
                        id: message.id,
                        senderId: message.sender.id,
                        senderName: message.sender.username,
                        content: message.content,
                        time: new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        isOwn: message.sender.id === user.id,
                        avatar: message.sender.avatar,
                        createdAt: message.createdAt,
                    }
                    return [...prev, newMessage]
                })
            }

            onGeneralMessage(handleGeneralMessage)
            return () => {
                console.log('🔇 Cleaning up general message listener')
                offGeneralMessage()
            }
        } else {
            const handleDirectMessage = (message: any) => {
                console.log('📨 Received direct message:', message)
                console.log('Current conversation otherUserId:', selectedConversation.otherUserId)
                console.log('Message sender:', message.sender.id, 'recipient:', message.recipient?.id)

                // ✅ Vérifier si le message appartient à cette conversation
                const isFromOtherUser = message.sender.id === selectedConversation.otherUserId
                const isToOtherUser = message.recipient?.id === selectedConversation.otherUserId
                const isMyMessage = message.sender.id === user.id

                const isForThisConversation = (isFromOtherUser && !isMyMessage) || (isMyMessage && isToOtherUser)

                console.log('Is for this conversation?', isForThisConversation, {
                    isFromOtherUser,
                    isToOtherUser,
                    isMyMessage
                })

                if (!isForThisConversation) {
                    console.log('❌ Message not for this conversation, ignoring')
                    return
                }

                setMessages((prev) => {
                    // ✅ Remplacer message temporaire
                    if (message.tempId) {
                        const index = prev.findIndex(m => m.tempId === message.tempId)
                        if (index !== -1) {
                            console.log('✅ Replacing temp message with real one')
                            const updated = [...prev]
                            updated[index] = {
                                ...updated[index],
                                id: message.id,
                                isPending: false,
                                tempId: undefined,
                            }
                            return updated
                        }
                    }

                    // ✅ Éviter duplications
                    if (prev.some(m => m.id === message.id)) {
                        console.log('⚠️ Message already exists, skipping')
                        return prev
                    }

                    // ✅ Ajouter nouveau message
                    console.log('➕ Adding new direct message')
                    const newMessage: Message = {
                        id: message.id,
                        senderId: message.sender.id,
                        senderName: message.sender.username,
                        content: message.content,
                        time: new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        isOwn: message.sender.id === user.id,
                        avatar: message.sender.avatar,
                        createdAt: message.createdAt,
                    }
                    return [...prev, newMessage]
                })

                // ✅ Mettre à jour la liste des conversations
                setConversations(prev => prev.map(conv => {
                    if (conv.otherUserId === selectedConversation.otherUserId) {
                        return {
                            ...conv,
                            lastMessage: message.content,
                            time: new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                            }),
                        }
                    }
                    return conv
                }))
            }

            onDirectMessage(handleDirectMessage)
            return () => {
                console.log('🔇 Cleaning up direct message listener')
                offDirectMessage()
            }
        }
    }, [selectedConversation?.otherUserId, selectedConversation?.isGeneral, user?.id, onGeneralMessage, onDirectMessage, offGeneralMessage, offDirectMessage])

    // ✅ Écouter les messages directs globalement pour créer des conversations
    useEffect(() => {
        if (!user) return

        const handleNewDirectMessage = (message: any) => {
            // Si ce n'est pas pour la conversation actuelle
            if (selectedConversation?.otherUserId !== message.sender.id &&
                selectedConversation?.otherUserId !== message.recipient?.id) {

                // Vérifier si une conversation existe déjà
                const existingConv = conversations.find(c =>
                    c.otherUserId === message.sender.id ||
                    c.otherUserId === message.recipient?.id
                )

                if (!existingConv && message.sender.id !== user.id) {
                    // Créer une nouvelle conversation
                    const newConv: Conversation = {
                        id: message.sender.id,
                        name: message.sender.username,
                        lastMessage: message.content,
                        time: new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        }),
                        unread: 1,
                        avatar: message.sender.avatar,
                        isGeneral: false,
                        otherUserId: message.sender.id,
                    }
                    setConversations(prev => [...prev, newConv])
                    toast.info(`Nouveau message de ${message.sender.username}`)
                } else if (existingConv) {
                    // Mettre à jour la conversation existante
                    setConversations(prev => prev.map(conv => {
                        if (conv.otherUserId === message.sender.id) {
                            return {
                                ...conv,
                                lastMessage: message.content,
                                time: new Date(message.createdAt).toLocaleTimeString('fr-FR', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                }),
                                unread: conv.unread + 1,
                            }
                        }
                        return conv
                    }))
                }
            }
        }

        onDirectMessage(handleNewDirectMessage)
        return () => offDirectMessage()
    }, [user?.id, selectedConversation?.otherUserId, conversations])

    const handleSendMessage = async () => {
        if (!message.trim() || !isAuthenticated || !user || isSending) return

        setIsSending(true)
        const tempId = `temp-${Date.now()}`

        try {
            if (selectedConversation?.isGeneral) {
                // Optimistic update
                const tempMessage: Message = {
                    id: tempId,
                    senderId: user.id,
                    senderName: user.username,
                    content: message,
                    time: new Date().toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    isOwn: true,
                    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
                    createdAt: new Date().toISOString(),
                    tempId,
                    isPending: true,
                }
                setMessages((prev) => [...prev, tempMessage])
                sendGeneralMessage(message, tempId)
            } else if (selectedConversation?.otherUserId) {
                // Optimistic update
                const tempMessage: Message = {
                    id: tempId,
                    senderId: user.id,
                    senderName: user.username,
                    content: message,
                    time: new Date().toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }),
                    isOwn: true,
                    avatar: user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`,
                    createdAt: new Date().toISOString(),
                    tempId,
                    isPending: true,
                }
                setMessages((prev) => [...prev, tempMessage])
                sendDirectMessage(selectedConversation.otherUserId, message, tempId)

                // Mettre à jour la conversation
                setConversations(prev => prev.map(conv => {
                    if (conv.otherUserId === selectedConversation.otherUserId) {
                        return {
                            ...conv,
                            lastMessage: message,
                            time: tempMessage.time,
                        }
                    }
                    return conv
                }))
            }

            setMessage("")
        } catch (error) {
            console.error("Erreur envoi message:", error)
            toast.error("Impossible d'envoyer le message")
            // Supprimer le message temporaire en cas d'erreur
            setMessages(prev => prev.filter(m => m.tempId !== tempId))
        } finally {
            setIsSending(false)
        }
    }

    const loadAvailableUsers = async () => {
        setIsLoadingUsers(true)
        try {
            const response = await fetch('http://localhost:3001/api/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                }
            })
            const users = await response.json()

            const existingConvUserIds = conversations
                .filter(c => !c.isGeneral)
                .map(c => c.otherUserId)

            const available = users.filter((u: any) =>
                u.id !== user?.id && !existingConvUserIds.includes(u.id)
            )

            setAvailableUsers(available)
        } catch (error) {
            console.error("Erreur chargement utilisateurs:", error)
            toast.error("Impossible de charger les utilisateurs")
        } finally {
            setIsLoadingUsers(false)
        }
    }

    const startNewChat = (selectedUser: OnlineUser) => {
        // Vérifier si la conversation existe déjà
        const existingConv = conversations.find(c => c.otherUserId === selectedUser.id)

        if (existingConv) {
            setSelectedConversation(existingConv)
            setIsNewChatModalOpen(false)
            toast.info(`Conversation avec ${selectedUser.username} ouverte`)
            return
        }

        const newConversation: Conversation = {
            id: selectedUser.id,
            name: selectedUser.username,
            lastMessage: "",
            time: "",
            unread: 0,
            avatar: selectedUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.username}`,
            isGeneral: false,
            otherUserId: selectedUser.id,
        }

        setConversations((prev) => [...prev, newConversation])
        setSelectedConversation(newConversation)
        setMessages([])
        setIsNewChatModalOpen(false)

        toast.success(`Chat démarré avec ${selectedUser.username}`)
    }

    const startChatFromGeneral = (senderId: number, senderName: string, senderAvatar: string) => {
        if (senderId === user?.id) return

        const existingConv = conversations.find(c => c.otherUserId === senderId)

        if (existingConv) {
            setSelectedConversation(existingConv)
            return
        }

        const newConversation: Conversation = {
            id: senderId,
            name: senderName,
            lastMessage: "",
            time: "",
            unread: 0,
            avatar: senderAvatar,
            isGeneral: false,
            otherUserId: senderId,
        }

        setConversations((prev) => [...prev, newConversation])
        setSelectedConversation(newConversation)
        setMessages([])

        toast.success(`Chat démarré avec ${senderName}`)
    }

    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const filteredUsers = availableUsers.filter((u) =>
        u.username.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
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
            {isConnected && (
                <div className="fixed top-20 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm z-50">
                    ● Connecté
                </div>
            )}

            <div className="pt-16 h-screen flex">
                {/* Sidebar conversations */}
                <div className="w-80 border-r border-border bg-card flex flex-col">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-foreground">{t.chat?.title || "Messages"}</h2>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => {
                                    setIsNewChatModalOpen(true)
                                    loadAvailableUsers()
                                }}
                                title="Nouveau chat"
                            >
                                <MessageSquarePlus size={20} />
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                                type="text"
                                placeholder="Rechercher..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {isLoadingConversations ? (
                            <div className="flex items-center justify-center p-8">
                                <Loader2 className="animate-spin" size={24} />
                            </div>
                        ) : (
                            filteredConversations.map((conv) => (
                                <button
                                    key={`conv-${conv.otherUserId || conv.id}`}
                                    onClick={() => {
                                        setSelectedConversation(conv)
                                        // Réinitialiser le compteur non lus
                                        if (conv.unread > 0) {
                                            setConversations(prev => prev.map(c =>
                                                c.otherUserId === conv.otherUserId ? { ...c, unread: 0 } : c
                                            ))
                                        }
                                    }}
                                    className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-all duration-200 border-b border-border ${
                                        selectedConversation?.otherUserId === conv.otherUserId ? "bg-accent" : ""
                                    }`}
                                >
                                    <div className="relative">
                                        <img src={conv.avatar} alt={conv.name} className="w-12 h-12 rounded-full" />
                                        {conv.unread > 0 && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                                                {conv.unread}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-left min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className="font-semibold flex items-center gap-2 truncate">
                                                {conv.name}
                                                {conv.isGeneral && <Users size={16} className="text-primary" />}
                                            </h3>
                                            {conv.time && <span className="text-xs text-muted-foreground">{conv.time}</span>}
                                        </div>
                                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage || "Aucun message"}</p>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Zone de chat */}
                <div className="flex-1 flex flex-col">
                    {selectedConversation ? (
                        <>
                            <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={selectedConversation.avatar} alt={selectedConversation.name} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h3 className="font-semibold flex items-center gap-2">
                                            {selectedConversation.name}
                                            {selectedConversation.isGeneral && <Users size={16} className="text-primary" />}
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            {selectedConversation.isGeneral ? "Tous les membres" : "En ligne"}
                                        </p>
                                    </div>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <MoreVertical size={20} />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="animate-spin" size={32} />
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg) => (
                                            <div
                                                key={`msg-${msg.id}`}
                                                className={`flex gap-3 ${msg.isOwn ? "flex-row-reverse" : "flex-row"} ${
                                                    msg.isPending ? "opacity-60" : ""
                                                }`}
                                            >
                                                <img
                                                    src={msg.avatar}
                                                    alt={msg.senderName}
                                                    className="w-8 h-8 rounded-full"
                                                />
                                                <div className={`flex flex-col gap-1 max-w-md ${msg.isOwn ? "items-end" : "items-start"}`}>
                                                    <div className="flex items-center gap-2">
                                                        {selectedConversation.isGeneral && !msg.isOwn ? (
                                                            <button
                                                                onClick={() => startChatFromGeneral(msg.senderId, msg.senderName, msg.avatar)}
                                                                className="text-xs font-medium text-primary hover:underline"
                                                            >
                                                                {msg.senderName}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs font-medium">{msg.senderName}</span>
                                                        )}
                                                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                                                        {msg.isPending && <Loader2 size={12} className="animate-spin" />}
                                                    </div>
                                                    <div
                                                        className={`px-4 py-2 rounded-2xl ${
                                                            msg.isOwn
                                                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                                                : "bg-card border rounded-tl-sm"
                                                        }`}
                                                    >
                                                        <p className="text-sm">{msg.content}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                )}
                            </div>

                            <div className="border-t bg-card p-4">
                                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-3">
                                    <Input
                                        type="text"
                                        placeholder="Tapez votre message..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        disabled={isSending}
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={isSending || !message.trim()}>
                                        {isSending ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            Sélectionnez une conversation
                        </div>
                    )}
                </div>
            </div>

            {/* Modal nouveau chat */}
            <Dialog open={isNewChatModalOpen} onOpenChange={setIsNewChatModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Nouveau chat</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <Input
                            placeholder="Rechercher un utilisateur..."
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                        />
                        <div className="max-h-96 overflow-y-auto space-y-2">
                            {isLoadingUsers ? (
                                <div className="flex justify-center py-8">
                                    <Loader2 className="animate-spin" size={24} />
                                </div>
                            ) : filteredUsers.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8">Aucun utilisateur disponible</p>
                            ) : (
                                filteredUsers.map((u) => (
                                    <button
                                        key={`user-${u.id}`}
                                        onClick={() => startNewChat(u)}
                                        className="w-full p-3 flex items-center gap-3 hover:bg-accent rounded-lg transition-colors"
                                    >
                                        <img src={u.avatar} alt={u.username} className="w-10 h-10 rounded-full" />
                                        <div className="text-left">
                                            <p className="font-medium">{u.username}</p>
                                            <p className="text-sm text-muted-foreground">{u.email}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}