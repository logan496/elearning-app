"use client"

import { Navigation } from "@/components/navigation"
import { useState } from "react"
import { Send, Search, Users, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useI18n } from "@/lib/i18n-context"

type Message = {
    id: number
    sender: string
    content: string
    time: string
    isOwn: boolean
    avatar: string
}

type Conversation = {
    id: number
    name: string
    lastMessage: string
    time: string
    unread: number
    avatar: string
    isGeneral: boolean
}

const conversations: Conversation[] = [
    {
        id: 1,
        name: "Chat Général",
        lastMessage: "Bienvenue à tous !",
        time: "10:30",
        unread: 3,
        avatar: "https://api.dicebear.com/7.x/shapes/svg?seed=general",
        isGeneral: true,
    },
    {
        id: 2,
        name: "Sophie Martin",
        lastMessage: "Merci pour le cours !",
        time: "09:45",
        unread: 1,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
        isGeneral: false,
    },
    {
        id: 3,
        name: "Thomas Dubois",
        lastMessage: "À demain pour la session",
        time: "Hier",
        unread: 0,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
        isGeneral: false,
    },
    {
        id: 4,
        name: "Marie Laurent",
        lastMessage: "Super explication !",
        time: "Hier",
        unread: 0,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
        isGeneral: false,
    },
]

const generalMessages: Message[] = [
    {
        id: 1,
        sender: "Admin",
        content: "Bienvenue dans le chat général de EduLearn ! N'hésitez pas à poser vos questions.",
        time: "10:00",
        isOwn: false,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=admin",
    },
    {
        id: 2,
        sender: "Sophie Martin",
        content: "Bonjour à tous ! Quelqu'un a des recommandations pour le cours de JavaScript ?",
        time: "10:15",
        isOwn: false,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    },
    {
        id: 3,
        sender: "Vous",
        content: "Je recommande de commencer par les bases avec le cours de Marie !",
        time: "10:20",
        isOwn: true,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
    },
    {
        id: 4,
        sender: "Thomas Dubois",
        content: "Merci pour le conseil ! Je vais regarder ça.",
        time: "10:25",
        isOwn: false,
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    },
]

export default function ChatPage() {
    const { t } = useI18n()

    const [selectedConversation, setSelectedConversation] = useState<Conversation>(conversations[0])
    const [message, setMessage] = useState("")
    const [messages, setMessages] = useState<Message[]>(generalMessages)
    const [searchQuery, setSearchQuery] = useState("")

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: "Vous",
                content: message,
                time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
                isOwn: true,
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=You",
            }
            setMessages([...messages, newMessage])
            setMessage("")
        }
    }

    const filteredConversations = conversations.filter((conv) =>
        conv.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="pt-16 h-screen flex">
                {/* Sidebar - Liste des conversations */}
                <div className="w-80 border-r border-border bg-card flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-border">
                        <h2 className="text-xl font-bold text-foreground mb-4">{t.chat.title}</h2>
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
                        {filteredConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => {
                                    setSelectedConversation(conv)
                                    if (conv.isGeneral) {
                                        setMessages(generalMessages)
                                    } else {
                                        setMessages([
                                            {
                                                id: 1,
                                                sender: conv.name,
                                                content: conv.lastMessage,
                                                time: conv.time,
                                                isOwn: false,
                                                avatar: conv.avatar,
                                            },
                                        ])
                                    }
                                }}
                                className={`w-full p-4 flex items-start gap-3 hover:bg-accent transition-all duration-200 border-b border-border group ${
                                    selectedConversation.id === conv.id ? "bg-accent" : ""
                                }`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img
                                        src={conv.avatar || "/placeholder.svg"}
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
                                            {conv.isGeneral && <Users size={16} className="text-primary flex-shrink-0" />}
                                        </h3>
                                        <span className="text-xs text-muted-foreground flex-shrink-0">{conv.time}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Zone de chat principale */}
                <div className="flex-1 flex flex-col">
                    {/* Header du chat */}
                    <div className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src={selectedConversation.avatar || "/placeholder.svg"}
                                alt={selectedConversation.name}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h3 className="font-semibold text-foreground flex items-center gap-2">
                                    {selectedConversation.name}
                                    {selectedConversation.isGeneral && <Users size={16} className="text-primary" />}
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    {selectedConversation.isGeneral ? "Tous les membres" : t.chat.online}
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-accent transition-all duration-200 hover:scale-110">
                            <MoreVertical size={20} />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 animate-in slide-in-from-bottom-2 duration-300 ${
                                    msg.isOwn ? "flex-row-reverse" : "flex-row"
                                }`}
                            >
                                <img
                                    src={msg.avatar || "/placeholder.svg"}
                                    alt={msg.sender}
                                    className="w-8 h-8 rounded-full flex-shrink-0 transition-transform duration-200 hover:scale-110"
                                />
                                <div className={`flex flex-col gap-1 max-w-md ${msg.isOwn ? "items-end" : "items-start"}`}>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-foreground">{msg.sender}</span>
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
                                placeholder={t.chat.placeholder}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="flex-1 transition-all duration-200 focus:ring-2 focus:ring-primary"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg"
                            >
                                <Send size={20} />
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
