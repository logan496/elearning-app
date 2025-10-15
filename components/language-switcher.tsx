"use client"

import { useI18n } from "@/lib/i18n-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
    const { locale, setLocale } = useI18n()

    return (
        <button
            onClick={() => setLocale(locale === "en" ? "fr" : "en")}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-accent transition-all duration-200 hover:scale-105 active:scale-95 group"
            aria-label="Switch language"
        >
            <Globe className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
            <span className="text-sm font-medium uppercase group-hover:text-primary transition-colors duration-200">
        {locale}
      </span>
        </button>
    )
}
