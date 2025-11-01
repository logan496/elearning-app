"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useI18n } from "@/lib/i18n-context";
import { LanguageSwitcher } from "./language-switcher";
import { useAuth } from "@/lib/contexts/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useI18n();
  const { isAuthenticated, user, logout } = useAuth();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/courses", label: t.nav.courses },
    { href: "/blogs", label: t.nav.blogs },
    { href: "/podcasts", label: t.nav.podcasts },
    { href: "/equipe", label: t.nav.team },
    ...(isAuthenticated
      ? [
          { href: "/applications", label: t.nav.applications },
          {
            href: "/applications/my-applications",
            label: t.nav.myApplications,
          },
        ]
      : []),
    { href: "/chat", label: t.nav.chat },
    ...(!isAuthenticated ? [{ href: "/login", label: t.nav.login }] : []),
  ];

  const adminMenuItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Utilisateurs" },
    { href: "/admin/applications", label: "Candidatures" },
    { href: "/admin/jobs/new", label: "Créer une offre" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border transition-all duration-300">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-2xl font-bold text-primary hover:scale-105 transition-transform duration-200"
          >
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
            {isAuthenticated && user?.isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 outline-none">
                  <Shield size={18} />
                  Admin
                  <ChevronDown size={16} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {adminMenuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild>
                      <Link
                        href={item.href}
                        className={`w-full cursor-pointer ${pathname === item.href ? "bg-accent" : ""}`}
                      >
                        {item.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {isAuthenticated && user?.isPublisher && (
              <Link
                href="/publisher"
                className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary hover:scale-105 relative group ${
                  pathname.startsWith("/publisher")
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                <LayoutDashboard size={18} />
                {t.nav.publisherDashboard}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-all duration-200 hover:scale-105 group"
              >
                <LogOut
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
                {t.nav.logout}
              </button>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden hover:bg-accent rounded-lg p-2 transition-all duration-200 active:scale-95"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div
              className={`transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
            >
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
                    pathname === link.href
                      ? "text-primary bg-accent"
                      : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAuthenticated && user?.isAdmin && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase">
                    Admin
                  </div>
                  {adminMenuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`text-sm font-medium transition-all duration-200 hover:text-primary hover:bg-accent px-4 py-2 rounded-lg ${
                        pathname === item.href
                          ? "text-primary bg-accent"
                          : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </>
              )}
              {isAuthenticated && user?.isPublisher && (
                <Link
                  href="/publisher"
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-primary hover:bg-accent px-4 py-2 rounded-lg ${
                    pathname.startsWith("/publisher")
                      ? "text-primary bg-accent"
                      : "text-foreground"
                  }`}
                >
                  <LayoutDashboard size={18} />
                  {t.nav.publisherDashboard}
                </Link>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary hover:bg-accent px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <LogOut size={18} />
                  {t.nav.logout}
                </button>
              )}
              <div className="px-4 py-2">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
