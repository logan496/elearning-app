"use client"

import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Twitter, Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n-context"

const team = [
  {
    name: "Sophie Martin",
    role: "Directrice Pédagogique",
    bio: "Experte en sciences de l'éducation avec 15 ans d'expérience dans la formation en ligne",
    image: "/professional-woman-portrait.png",
    linkedin: "#",
    twitter: "#",
    email: "sophie.martin@edulearn.fr",
  },
  {
    name: "Thomas Dubois",
    role: "Responsable Technique",
    bio: "Développeur full-stack passionné par les technologies éducatives innovantes",
    image: "/professional-man-portrait.png",
    linkedin: "#",
    twitter: "#",
    email: "thomas.dubois@edulearn.fr",
  },
  {
    name: "Marie Laurent",
    role: "Responsable Contenu",
    bio: "Spécialiste en création de contenu pédagogique multimédia et storytelling",
    image: "/professional-woman-smiling.png",
    linkedin: "#",
    twitter: "#",
    email: "marie.laurent@edulearn.fr",
  },
  {
    name: "Alexandre Chen",
    role: "Designer UX/UI",
    bio: "Designer créatif focalisé sur l'expérience utilisateur et l'accessibilité",
    image: "/professional-asian-man.png",
    linkedin: "#",
    twitter: "#",
    email: "alexandre.chen@edulearn.fr",
  },
  {
    name: "Camille Rousseau",
    role: "Responsable Marketing",
    bio: "Experte en marketing digital et stratégie de croissance pour l'éducation",
    image: "/professional-business-woman.png",
    linkedin: "#",
    twitter: "#",
    email: "camille.rousseau@edulearn.fr",
  },
  {
    name: "Lucas Bernard",
    role: "Responsable Communauté",
    bio: "Passionné par l'engagement communautaire et le support aux apprenants",
    image: "/professional-man-friendly.jpg",
    linkedin: "#",
    twitter: "#",
    email: "lucas.bernard@edulearn.fr",
  },
]

export default function EquipePage() {
  const { t } = useI18n()

  return (
      <div className="min-h-screen">
        <Navigation />

        <div className="pt-24 pb-20 px-4 lg:px-8">
          <div className="container mx-auto">
            {/* Header */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                {t.team.title.split(" ")[0]} <span className="text-primary">{t.team.title.split(" ")[1]}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                {t.team.subtitle}
              </p>
            </div>

            {/* Mission Statement */}
            <Card className="mb-16 border-2 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="p-8 lg:p-12">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-balance">{t.team.mission.title}</h2>
                  <p className="text-lg text-muted-foreground leading-relaxed mb-4">{t.team.mission.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {team.map((member, index) => (
                  <Card
                      key={index}
                      className="overflow-hidden group hover:shadow-2xl transition-all duration-300 hover:border-primary/50 hover:scale-105"
                  >
                    <div className="aspect-square bg-muted relative overflow-hidden">
                      <img
                          src={member.image || "/placeholder.svg"}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-semibold mb-4">{member.role}</p>
                      <p className="text-muted-foreground mb-6 leading-relaxed text-sm">{member.bio}</p>
                      <div className="flex items-center gap-3">
                        <a
                            href={member.linkedin}
                            className="w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:scale-110"
                            aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                            href={member.twitter}
                            className="w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:scale-110"
                            aria-label="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a
                            href={`mailto:${member.email}`}
                            className="w-9 h-9 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all duration-200 flex items-center justify-center hover:scale-110"
                            aria-label="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>

            {/* Join Team CTA */}
            <Card className="mt-16 bg-primary text-primary-foreground border-0 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
              <CardContent className="py-12 px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Rejoignez notre équipe</h2>
                <p className="text-lg mb-6 max-w-2xl mx-auto text-pretty opacity-90">
                  Nous recherchons constamment des talents passionnés pour nous aider à transformer l'éducation en ligne
                </p>
                <a
                    href="mailto:recrutement@edulearn.fr"
                    className="inline-block px-8 py-3 bg-background text-foreground rounded-lg font-semibold hover:bg-background/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
                  Voir les postes ouverts
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
