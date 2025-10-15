"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import en from "@/messages/en.json"
import fr from "@/messages/fr.json"

type Locale = "en" | "fr"
type Messages = typeof en

interface I18nContextType {
    locale: Locale
    setLocale: (locale: Locale) => void
    t: Messages
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

const messages: Record<Locale, Messages> = {
    en,
    fr,
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>("fr")

    useEffect(() => {
        const savedLocale = localStorage.getItem("locale") as Locale | null
        if (savedLocale && (savedLocale === "en" || savedLocale === "fr")) {
            setLocaleState(savedLocale)
        }
    }, [])

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale)
        localStorage.setItem("locale", newLocale)
    }

    return <I18nContext.Provider value={{ locale, setLocale, t: messages[locale] }}>{children}</I18nContext.Provider>
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (!context) {
        throw new Error("useI18n must be used within I18nProvider")
    }
    return context
}
