"use client"

import {useAuth} from "@/lib/contexts/auth-context";

export function useLessonAccess(lessonId: number, isFree = false) {
    const { isAuthenticated, user } = useAuth()

    // Free lessons are accessible to everyone
    if (isFree) {
        return {
            canAccess: true,
            reason: null,
            isAuthenticated,
        }
    }

    // Paid lessons require authentication
    if (!isAuthenticated) {
        return {
            canAccess: false,
            reason: "login_required" as const,
            isAuthenticated: false,
        }
    }

    // Note: You'll need to add enrolledLessons and purchasedLessons to your UserResponseDto
    // For now, we'll assume all authenticated users have access
    // TODO: Implement proper lesson access checking with your backend
    const hasLessonAccess = true // Replace with actual check when backend is ready

    return {
        canAccess: hasLessonAccess,
        reason: hasLessonAccess ? null : ("payment_required" as const),
        isAuthenticated: true,
    }
}
