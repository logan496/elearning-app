"use client"
import Link from "next/link";

export function Footer () {
    return (
        <footer className="bg-foreground text-background py-12 px-4 lg:px-8">
            <div className="container mx-auto">
                <div className="grid md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">EduLearn</h3>
                        <p className="text-sm opacity-80 leading-relaxed">La plateforme d'apprentissage qui s'adapte à vous</p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200"
                                >
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/podcasts"
                                    className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200"
                                >
                                    Podcasts
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/equipe"
                                    className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200"
                                >
                                    Équipe
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Ressources</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200">
                                    Blog
                                </a>
                            </li>
                            <li>
                                <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200">
                                    Documentation
                                </a>
                            </li>
                            <li>
                                <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200">
                                    Support
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Contact</h4>
                        <p className="text-sm opacity-80">contact@edulearn.fr</p>
                    </div>
                </div>
                <div className="mt-12 pt-8 border-t border-background/20 text-center text-sm opacity-80">
                    © 2025 EduLearn. Tous droits réservés.
                </div>
            </div>
        </footer>
    )
}