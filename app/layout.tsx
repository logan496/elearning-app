import "@/lib/api/config"
import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "sonner"
import "./globals.css"
import { I18nProvider } from "@/lib/i18n-context"
import { AuthProvider } from "@/lib/contexts/auth-context"

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist",
})

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-geist-mono",
})

export const metadata: Metadata = {
    title: "EduLearn - Plateforme d'apprentissage",
    description: "Apprenez avec les meilleurs cours et podcasts éducatifs",
    generator: "v0.app",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="fr" suppressHydrationWarning>
        <body className={`${geist.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <I18nProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </I18nProvider>
        <Toaster
            position="top-right"
            richColors
            closeButton
            duration={4000}
        />
        <Analytics />
        </body>
        </html>
    )
}