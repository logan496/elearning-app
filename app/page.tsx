import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users, Award } from "lucide-react"
import Link from "next/link"
import {Footer} from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance animate-in fade-in slide-in-from-bottom-4 duration-700">
              Apprenez à votre rythme avec <span className="text-primary">EduLearn</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
              Une plateforme d'apprentissage moderne qui transforme votre façon d'acquérir de nouvelles compétences
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
              <Button
                size="lg"
                className="text-lg px-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg"
              >
                Commencer gratuitement
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 bg-transparent hover:scale-105 transition-transform duration-200 hover:bg-accent"
              >
                Découvrir les cours
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Nos enjeux principaux</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Découvrez comment EduLearn révolutionne l'apprentissage en ligne
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <BookOpen className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3">1</h3>
                <h4 className="text-xl font-semibold mb-3">Contenu de qualité</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Accédez à des cours créés par des experts reconnus dans leur domaine, avec des contenus régulièrement
                  mis à jour
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Users className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3">2</h3>
                <h4 className="text-xl font-semibold mb-3">Communauté active</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Rejoignez une communauté d'apprenants passionnés et échangez avec des mentors expérimentés
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-all duration-300 hover:scale-105 hover:shadow-xl group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <Award className="w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h3 className="text-2xl font-bold mb-3">3</h3>
                <h4 className="text-xl font-semibold mb-3">Certifications reconnues</h4>
                <p className="text-muted-foreground leading-relaxed">
                  Obtenez des certifications valorisées par les entreprises pour booster votre carrière professionnelle
                </p>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
                Allier innovation, flexibilité et excellence
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                EduLearn se positionne comme un acteur majeur de la formation en ligne. Nous proposons des solutions
                d'apprentissage innovantes adaptées aux besoins des apprenants modernes.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Notre plateforme combine vidéos interactives, exercices pratiques et suivi personnalisé pour garantir
                votre réussite.
              </p>
              <Button size="lg" className="px-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg">
                En savoir plus
              </Button>
            </div>
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
              <video className="w-full h-full object-cover" poster="/modern-online-learning-platform.jpg" controls>
                <source src="/demo-video.mp4" type="video/mp4" />
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Une approche globale pour un apprentissage optimal
            </h2>
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
                  Apprentissage collaboratif
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Travaillez en groupe sur des projets réels et développez vos compétences en équipe
                </p>
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
                  Parcours personnalisé
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Un programme adapté à votre niveau et à vos objectifs professionnels
                </p>
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
                  Mentorat expert
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Bénéficiez de l'accompagnement de professionnels reconnus dans leur domaine
                </p>
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
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Prêt à commencer votre parcours ?</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto text-pretty opacity-90">
                Rejoignez des milliers d'apprenants qui ont déjà transformé leur carrière avec EduLearn
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 hover:scale-105 transition-transform duration-200 hover:shadow-lg"
                asChild
              >
                <Link href="/login">Créer un compte gratuit</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  )
}
