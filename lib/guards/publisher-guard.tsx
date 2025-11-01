"use client"

import type React from "react"

import { AuthGuard } from "./auth-guard"

interface PublisherGuardProps {
    children: React.ReactNode
}

export function PublisherGuard({ children }: PublisherGuardProps) {
    return <AuthGuard requirePublisher={true}>{children}</AuthGuard>
}
