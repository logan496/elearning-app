"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import { useI18n } from "@/lib/i18n-context"
import { LanguageSwitcher } from "./language-switcher"

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useI18n()

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/podcasts", label: t.nav.podcasts },
    { href: "/equipe", label: t.nav.team },
    { href: "/chat", label: t.nav.chat },
    { href: "/login", label: t.nav.login },
  ]

  return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold text-primary hover:scale-105 transition-transform duration-200">
              EduLearn
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                  <Link
                      key={link.href}
                      href={link.href}
                      className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 relative group ${
                          pathname === link.href ? "text-primary" : "text-foreground"
                      }`}
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
              ))}
              <LanguageSwitcher />
            </div>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden hover:bg-accent rounded-lg p-2 transition-all duration-200 active:scale-95"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
            >
              <div className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
              <div className="md:hidden py-4 border-t border-border animate-in slide-in-from-top-2 duration-300">
                <div className="flex flex-col gap-4">
                  {links.map((link) => (
                      <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:bg-accent px-4 py-2 rounded-lg ${
                              pathname === link.href ? "text-primary bg-accent" : "text-foreground"
                          }`}
                      >
                        {link.label}
                      </Link>
                  ))}
                  <div className="px-4 py-2">
                    <LanguageSwitcher />
                  </div>
                </div>
              </div>
          )}
        </div>
      </nav>
  )
}
