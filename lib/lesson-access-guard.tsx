"use client"

import type React from "react"

import { useLessonAccess } from "@/hooks/use-lesson-access"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Lock, CreditCard } from "lucide-react"
import Link from "next/link"

interface LessonAccessGuardProps {
    lessonId: number
    isFree: boolean
    price?: number
    children: React.ReactNode
}

export function LessonAccessGuard({ lessonId, isFree, price = 0, children }: LessonAccessGuardProps) {
    const { canAccess, reason, isAuthenticated } = useLessonAccess(lessonId, isFree)

    if (canAccess) {
        return <>{children}</>
    }

    if (reason === "login_required") {
        return (
            <Alert className="max-w-2xl mx-auto my-8">
                <Lock className="h-4 w-4" />
                <AlertTitle>Login Required</AlertTitle>
                <AlertDescription className="mt-2 space-y-4">
                    <p>Please sign in to access this lesson.</p>
                    <div className="flex gap-2">
                        <Button asChild>
                            <Link href="/login">Sign In</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/register">Create Account</Link>
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        )
    }

    if (reason === "payment_required") {
        return (
            <Alert className="max-w-2xl mx-auto my-8">
                <CreditCard className="h-4 w-4" />
                <AlertTitle>Purchase Required</AlertTitle>
                <AlertDescription className="mt-2 space-y-4">
                    <p>This lesson requires purchase to access. Price: ${price}</p>
                    <Button>Purchase Lesson</Button>
                </AlertDescription>
            </Alert>
        )
    }

    return <>{children}</>
}
