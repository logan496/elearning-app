"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { AuthenticationService, OpenAPI } from "@/lib/api/generated"
import type { LoginDto, SignupDto } from "@/lib/api/generated"
import { toast } from "sonner"
import { getApiErrorMessage } from "@/lib/api/wrapper"
import { setAuthToken } from "@/lib/api/config"

// Définir le type UserResponseDto correctement basé sur votre réponse API
export interface UserResponseDto {
    id: number
    username: string
    email: string
    avatar: string
    isPublisher: boolean
}

// Type pour la réponse d'authentification
interface AuthResponse {
    access_token: string
    user: UserResponseDto
}

interface AuthContextType {
    user: UserResponseDto | null
    token: string | null  // ✅ Ajout du token
    isLoading: boolean
    isAuthenticated: boolean
    login: (data: LoginDto) => Promise<void>
    signup: (data: SignupDto) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserResponseDto | null>(null)
    const [token, setToken] = useState<string | null>(null)  // ✅ État pour le token
    const [isLoading, setIsLoading] = useState(true)

    // Initialiser l'authentification au montage
    useEffect(() => {
        const initAuth = () => {
            // Vérifier que nous sommes côté client
            if (typeof window === "undefined") {
                setIsLoading(false)
                return
            }

            const savedToken = localStorage.getItem("auth_token")
            const savedUser = localStorage.getItem("user")

            if (savedToken && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser) as UserResponseDto

                    // Vérifier que l'utilisateur a toutes les propriétés requises
                    if (
                        parsedUser.id &&
                        parsedUser.username &&
                        parsedUser.email
                    ) {
                        OpenAPI.TOKEN = savedToken
                        setToken(savedToken)  // ✅ Sauvegarder le token dans l'état
                        setUser(parsedUser)
                    } else {
                        console.warn("[Auth] Invalid user data in localStorage")
                        localStorage.removeItem("user")
                        localStorage.removeItem("auth_token")
                    }
                } catch (error) {
                    console.error("[Auth] Failed to parse saved user:", error)
                    localStorage.removeItem("user")
                    localStorage.removeItem("auth_token")
                }
            }

            setIsLoading(false)
        }

        initAuth()
    }, [])

    const login = async (data: LoginDto) => {
        try {
            setIsLoading(true)
            const response = await AuthenticationService.authControllerLogin(data) as unknown as AuthResponse

            // Vérifier que la réponse contient les données nécessaires
            if (!response.access_token || !response.user) {
                throw new Error("Réponse d'authentification invalide")
            }

            // Sauvegarder le token et l'utilisateur
            setAuthToken(response.access_token)
            localStorage.setItem("user", JSON.stringify(response.user))

            // ✅ Mettre à jour l'état du token
            setToken(response.access_token)
            setUser(response.user)

            toast.success("Connexion réussie !")
        } catch (error: any) {
            console.error("[Auth] Login error:", error)
            const errorMessage = getApiErrorMessage(error, "Échec de la connexion")
            toast.error(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const signup = async (data: SignupDto) => {
        try {
            setIsLoading(true)
            const response = await AuthenticationService.authControllerSignup(data) as unknown as AuthResponse

            // Vérifier que la réponse contient les données nécessaires
            if (!response.access_token || !response.user) {
                throw new Error("Réponse d'authentification invalide")
            }

            // Sauvegarder le token et l'utilisateur
            setAuthToken(response.access_token)
            localStorage.setItem("user", JSON.stringify(response.user))

            // ✅ Mettre à jour l'état du token
            setToken(response.access_token)
            setUser(response.user)

            toast.success("Inscription réussie !")
        } catch (error: any) {
            console.error("[Auth] Signup error:", error)
            const errorMessage = getApiErrorMessage(error, "Échec de l'inscription")
            toast.error(errorMessage)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        // Nettoyer le localStorage et le token
        setAuthToken(null)
        localStorage.removeItem("user")

        // ✅ Réinitialiser l'état du token
        setToken(null)
        setUser(null)

        toast.info("Déconnexion réussie")
    }

    const refreshUser = async () => {
        // Si vous avez un endpoint pour récupérer l'utilisateur actuel
        // vous pouvez l'implémenter ici
        try {
            // const response = await UserService.getCurrentUser()
            // setUser(response)
            // localStorage.setItem("user", JSON.stringify(response))
            console.warn("[Auth] refreshUser not implemented")
        } catch (error) {
            console.error("[Auth] Failed to refresh user:", error)
            logout()
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,  // ✅ Exposer le token
                isLoading,
                isAuthenticated: !!user,
                login,
                signup,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}