// src/lib/api/custom-types.ts
// Types personnalisés pour remplacer les types générés incorrects

/**
 * Utilisateur - Structure complète
 */
export interface UserResponseDto {
    id: number
    username: string
    email: string
    avatar: string
    isPublisher: boolean
    createdAt?: string
}

/**
 * Réponse d'authentification (Login/Signup)
 */
export interface AuthResponseDto {
    access_token: string
    user: UserResponseDto
}

/**
 * Données de connexion
 */
export interface LoginDto {
    email: string
    password: string
}

/**
 * Données d'inscription
 */
export interface SignupDto {
    email: string
    username: string
    password: string
}

/**
 * Message dans le chat
 */
export interface MessageResponseDto {
    id: number
    content: string
    createdAt: string
    senderId: number
    senderName: string
    recipientId?: number
    isGeneral: boolean
    sender: {
        id: number
        username: string
        email: string
        avatar: string
    }
    recipient?: {
        id: number
        username: string
        email: string
        avatar: string
    }
}

/**
 * Conversation
 */
export interface ConversationDto {
    id: number
    otherUser: UserResponseDto
    lastMessage?: MessageResponseDto
    unreadCount: number
    updatedAt: string
}

/**
 * Podcast
 */
export interface PodcastResponseDto {
    id: number
    title: string
    description: string
    audioUrl: string
    coverImage: string
    duration: number
    publisherId: number
    publisher: UserResponseDto
    createdAt: string
    updatedAt: string
}

/**
 * Cours
 */
export interface CourseResponseDto {
    id: number
    title: string
    description: string
    coverImage: string
    price: number
    level: "beginner" | "intermediate" | "advanced"
    category: string
    instructorId: number
    instructor: UserResponseDto
    lessonsCount: number
    enrolledCount: number
    rating: number
    createdAt: string
    updatedAt: string
}