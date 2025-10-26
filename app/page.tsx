"use client"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Award, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n-context"

export default function HomePage() {
  const { t } = useI18n()

  return (
      <div className="min-h-screen">
        <Navigation />

        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-4 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
          <div className="container mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left Content */}
              <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-700">
                <div>
                  <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                    {t.home.hero.title} <span className="text-primary">EduLearn</span>
                  </h1>
                  <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md leading-relaxed">
                    {t.home.hero.subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                        size="lg"
                        className="text-lg px-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                    >
                      {t.home.hero.cta_start}
                    </Button>
                    <Button
                        size="lg"
                        variant="outline"
                        className="text-lg px-8 bg-transparent hover:scale-105 transition-transform duration-200 hover:bg-accent"
                    >
                      {t.home.hero.cta_discover}
                    </Button>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 group">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-foreground font-medium text-lg">{t.home.features.quality.title}</span>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-foreground font-medium text-lg">{t.home.features.community.title}</span>
                  </div>
                  <div className="flex items-center space-x-3 group">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-6 h-6 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <span className="text-foreground font-medium text-lg">{t.home.features.certifications.title}</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Image with Clip Path */}
              <div className="relative h-full flex items-center animate-in fade-in slide-in-from-right-8 duration-700 delay-150">
                <div
                    className="relative w-full overflow-hidden transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 83% 100%, 10% 82%)",
                      minHeight: "500px",
                    }}
                >
                  <img
                      src="/modern-online-learning-platform.jpg"
                      alt="Plateforme d'apprentissage moderne"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "center" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">{t.home.features.title}</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">{t.home.features.subtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="border-2 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <BookOpen className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">1</h3>
                  <h4 className="text-xl font-semibold mb-3">{t.home.features.quality.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{t.home.features.quality.description}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">2</h3>
                  <h4 className="text-xl font-semibold mb-3">{t.home.features.community.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{t.home.features.community.description}</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                <CardContent className="pt-8 pb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                    <Award className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">3</h3>
                  <h4 className="text-xl font-semibold mb-3">{t.home.features.certifications.title}</h4>
                  <p className="text-muted-foreground leading-relaxed">{t.home.features.certifications.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Video Section */}
        <section className="py-20 px-4 lg:px-8">
          <div className="container mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{t.home.video.title}</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">{t.home.video.description1}</p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">{t.home.video.description2}</p>
                <Button size="lg" className="px-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg">
                  {t.home.video.cta}
                </Button>
              </div>
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                <video className="w-full h-full object-cover" poster="/modern-online-learning-platform.jpg" controls>
                  <source src="/1.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="py-20 px-4 lg:px-8 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">{t.home.approach.title}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                      src="/collaborative-learning-students.jpg"
                      alt="Apprentissage collaboratif"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {t.home.approach.collaborative.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{t.home.approach.collaborative.description}</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                      src="/personalized-learning-path.jpg"
                      alt="Parcours personnalisé"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {t.home.approach.personalized.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{t.home.approach.personalized.description}</p>
                </CardContent>
              </Card>

              <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                  <img
                      src="/expert-mentorship-teaching.jpg"
                      alt="Mentorat expert"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="pt-6 pb-6">
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors duration-300">
                    {t.home.approach.mentorship.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{t.home.approach.mentorship.description}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 lg:px-8">
          <div className="container mx-auto">
            <Card className="bg-primary text-primary-foreground border-0 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="py-16 px-8 text-center">
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{t.home.cta.title}</h2>
                <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty opacity-90">{t.home.cta.subtitle}</p>
                <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg px-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                    asChild
                >
                  <Link href="/login">{t.home.cta.button}</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-foreground text-background py-12 px-4 lg:px-8">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">EduLearn</h3>
                <p className="text-sm opacity-80 leading-relaxed">{t.home.footer.tagline}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{t.home.footer.navigation}</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                        href="/"
                        className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200"
                    >
                      {t.nav.home}
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/podcasts"
                        className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200"
                    >
                      {t.nav.podcasts}
                    </Link>
                  </li>
                  <li>
                    <Link
                        href="/equipe"
                        className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200"
                    >
                      {t.nav.team}
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{t.home.footer.resources}</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200">
                      {t.home.footer.blog}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200">
                      {t.home.footer.documentation}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="opacity-80 hover:opacity-100 hover:text-primary transition-all duration-200">
                      {t.home.footer.support}
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">{t.home.footer.contact}</h4>
                <p className="text-sm opacity-80">contact@edulearn.fr</p>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-background/20 text-center text-sm opacity-80">
              © 2025 EduLearn. {t.home.footer.rights}.
            </div>
          </div>
        </footer>
      </div>
  )
}
