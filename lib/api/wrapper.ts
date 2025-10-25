// src/lib/api/wrapper.ts
import { ApiError } from "./generated"

export interface ApiErrorResponse {
    message: string
    statusCode?: number
    error?: string
}

/**
 * Wrapper pour gérer les erreurs des appels API
 */
export async function handleApiCall<T>(
    apiCall: () => Promise<T>,
    errorMessage = "Une erreur est survenue"
): Promise<T> {
    try {
        return await apiCall()
    } catch (error) {
        console.error("[API Error]", error)

        if (error instanceof ApiError) {
            const body = error.body as ApiErrorResponse
            throw new Error(body?.message || errorMessage)
        }

        if (error instanceof Error) {
            throw error
        }

        throw new Error(errorMessage)
    }
}

/**
 * Extraire le message d'erreur d'une erreur API
 */
export function getApiErrorMessage(error: unknown, defaultMessage = "Une erreur est survenue"): string {
    if (error instanceof ApiError) {
        const body = error.body as ApiErrorResponse
        return body?.message || defaultMessage
    }

    if (error instanceof Error) {
        return error.message
    }

    return defaultMessage
}

/**
 * Vérifier si une erreur est une erreur d'authentification (401)
 */
export function isAuthError(error: unknown): boolean {
    if (error instanceof ApiError) {
        return error.status === 401
    }
    return false
}

/**
 * Vérifier si une erreur est une erreur de validation (400)
 */
export function isValidationError(error: unknown): boolean {
    if (error instanceof ApiError) {
        return error.status === 400
    }
    return false
}

/**
 * Vérifier si une erreur est une erreur serveur (500+)
 */
export function isServerError(error: unknown): boolean {
    if (error instanceof ApiError) {
        return error.status >= 500
    }
    return false
}