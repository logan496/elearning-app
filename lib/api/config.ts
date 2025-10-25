// src/lib/api/config.ts
import { OpenAPI } from "./generated"

// Configuration de l'API
export function configureAPI() {
    // ⚠️ IMPORTANT: Ne pas inclure /api dans l'URL de base
    // Le service ajoute déjà /api dans les routes
    OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

    // Récupérer le token depuis le localStorage si disponible
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token")
        if (token) {
            OpenAPI.TOKEN = token
        }
    }

    // Headers personnalisés pour chaque requête
    OpenAPI.HEADERS = async () => {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        }

        const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

        if (token) {
            headers["Authorization"] = `Bearer ${token}`
        }

        return headers
    }
}

// Fonction pour mettre à jour le token
export function setAuthToken(token: string | null) {
    if (token) {
        OpenAPI.TOKEN = token
        if (typeof window !== "undefined") {
            localStorage.setItem("auth_token", token)
        }
    } else {
        OpenAPI.TOKEN = undefined
        if (typeof window !== "undefined") {
            localStorage.removeItem("auth_token")
        }
    }
}

// Fonction pour obtenir le token actuel
export function getAuthToken(): string | null {
    if (typeof window !== "undefined") {
        return localStorage.getItem("auth_token")
    }
    return null
}

// Fonction pour obtenir l'URL complète de l'API
export function getApiUrl(): string {
    return OpenAPI.BASE
}

// Initialiser la configuration
configureAPI()