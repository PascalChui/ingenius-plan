import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Clock, Brain, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold">IP</span>
            </div>
            <span className="font-bold text-xl">InGeniusPlan</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Fonctionnalités
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              Comment ça marche
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Tarifs
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/auth/signin">
              <Button variant="outline">Connexion</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>S'inscrire</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Productivité révolutionnaire avec <span className="text-primary">El_Professor</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Combinez gestion de tâches, planification, brainstorming et outils de concentration, enrichis par une
                intelligence artificielle assistante personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/signup">
                  <Button size="lg" className="w-full sm:w-auto">
                    Commencer gratuitement
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#demo">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Voir la démo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-muted/50">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Fonctionnalités principales</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Découvrez comment InGeniusPlan transforme votre façon de travailler et d'organiser vos projets.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-background p-6 rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Gestion avancée des tâches</h3>
                <p className="text-muted-foreground">
                  Organisez vos tâches avec la méthode Eisenhower, suivez votre progression avec Pomodoro, et bien plus
                  encore.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-background p-6 rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Calendrier multi-vues</h3>
                <p className="text-muted-foreground">
                  Visualisez votre emploi du temps en mode jour, semaine, mois ou année, et synchronisez avec vos
                  calendriers existants.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-background p-6 rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-tertiary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-tertiary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assistant IA El_Professor</h3>
                <p className="text-muted-foreground">
                  Bénéficiez de conseils personnalisés et de méthodes de productivité adaptées à votre style de travail.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-background p-6 rounded-lg border border-border">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Collaboration en temps réel</h3>
                <p className="text-muted-foreground">
                  Travaillez en équipe sur des projets partagés avec des mises à jour instantanées et des notifications.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold">IP</span>
              </div>
              <span className="font-bold">InGeniusPlan</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} InGeniusPlan. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
