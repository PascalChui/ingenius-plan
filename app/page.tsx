import Link from "next/link"
import { ArrowRight, CheckCircle, Calendar, ListTodo, Brain, Focus, Users, Star } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">IngeniusPlan</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition">
              Fonctionnalités
            </Link>
            <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition">
              Tarifs
            </Link>
            <Link href="#about" className="text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary-400 transition">
              À propos
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link href="/auth/signin" className="hidden md:inline-flex px-4 py-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Connexion
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition">
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight animate-fadeIn">
                Transformez votre chaos en <span className="text-primary">clarté</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 animate-slideIn">
                IngeniusPlan est une application de productivité révolutionnaire qui combine gestion de tâches, planification, brainstorming et outils de concentration, enrichie par une intelligence artificielle assistante.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/auth/signup" className="px-6 py-3 rounded-md bg-primary text-white hover:bg-primary/90 transition text-center">
                  Commencer gratuitement
                </Link>
                <Link href="#features" className="px-6 py-3 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition text-center">
                  Découvrir les fonctionnalités
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 transform rotate-1 animate-fadeIn">
                <img
                  src="/placeholder.jpg"
                  alt="Dashboard IngeniusPlan"
                  className="rounded-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Tout ce dont vous avez besoin pour être productif
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Une suite complète d'outils conçus pour optimiser votre productivité et vous aider à accomplir plus, en moins de temps et avec moins de stress.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Gestion avancée des tâches
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Organisez vos tâches avec prioritisation intelligente et utilisez des méthodes éprouvées comme Pomodoro, Eisenhower et bien plus.
                </p>
                <Link href="#" className="text-primary dark:text-primary-400 inline-flex items-center">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Calendrier multi-vues
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Visualisez votre temps avec des vues jour, semaine et mois. Planifiez intelligemment en évitant les conflits d'horaire.
                </p>
                <Link href="#" className="text-primary dark:text-primary-400 inline-flex items-center">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Assistant IA El_Professor
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Bénéficiez de suggestions personnalisées et de conseils adaptés à votre style de travail grâce à notre IA intégrée.
                </p>
                <Link href="#" className="text-primary dark:text-primary-400 inline-flex items-center">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <Focus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Workspace avec brainstorming
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Créez, organisez et développez vos idées dans un espace dédié à la concentration et à la créativité.
                </p>
                <Link href="#" className="text-primary dark:text-primary-400 inline-flex items-center">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              {/* Feature 5 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Collaboration et partage
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Travaillez efficacement en équipe grâce au partage de projets, à l'attribution de tâches et à la communication intégrée.
                </p>
                <Link href="#" className="text-primary dark:text-primary-400 inline-flex items-center">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              
              {/* Feature 6 */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Système d'engagement
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Restez motivé grâce à des mécanismes d'engagement basés sur les principes de la psychologie comportementale.
                </p>
                <Link href="#" className="text-primary dark:text-primary-400 inline-flex items-center">
                  En savoir plus <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing section */}
        <section id="pricing" className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Choisissez le plan qui vous convient
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Des options flexibles pour les particuliers, les équipes et les entreprises.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Gratuit
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Parfait pour démarrer avec les bases
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">0€</span>
                  <span className="text-gray-600 dark:text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Jusqu'à 5 projets</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Gestion de tâches basique</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Vue calendrier simple</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Suggestions IA limitées</span>
                  </li>
                </ul>
                <Link href="/auth/signup" className="block w-full py-3 px-4 bg-white dark:bg-gray-700 text-primary dark:text-white border border-primary dark:border-gray-600 rounded-md text-center font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  Commencer gratuitement
                </Link>
              </div>
              
              {/* Pro plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8 border-2 border-primary dark:border-primary-400 transform scale-105 z-10">
                <div className="bg-primary text-white text-xs uppercase font-bold tracking-wider py-1 px-2 rounded-full inline-block mb-4">
                  Populaire
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Pro
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Idéal pour les professionnels exigeants
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">9€</span>
                  <span className="text-gray-600 dark:text-gray-400">/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Projets illimités</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Gestion de tâches avancée</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Toutes les vues calendrier</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Accès complet à El_Professor</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Workspace et brainstorming</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Exportations et intégrations</span>
                  </li>
                </ul>
                <Link href="/auth/signup?plan=pro" className="block w-full py-3 px-4 bg-primary text-white rounded-md text-center font-medium hover:bg-primary/90 transition">
                  Essayer 14 jours gratuitement
                </Link>
              </div>
              
              {/* Team plan */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Équipe
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Pour les équipes qui collaborent
                </p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">19€</span>
                  <span className="text-gray-600 dark:text-gray-400">/utilisateur/mois</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Tout ce qui est inclus dans Pro</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Outils de collaboration avancés</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Gestion des rôles et permissions</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Analyse et rapports d'équipe</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 dark:text-gray-300">Support prioritaire</span>
                  </li>
                </ul>
                <Link href="/auth/signup?plan=team" className="block w-full py-3 px-4 bg-white dark:bg-gray-700 text-primary dark:text-white border border-primary dark:border-gray-600 rounded-md text-center font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                  Démarrer avec l'équipe
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 dark:bg-gray-900 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">IngeniusPlan</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Transformez votre chaos en clarté avec notre application de productivité révolutionnaire.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Produit
              </h4>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Fonctionnalités</Link></li>
                <li><Link href="#pricing" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Tarifs</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Témoignages</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Guide d'utilisation</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Entreprise
              </h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">À propos</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Blog</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Carrières</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Légal
              </h4>
              <ul className="space-y-2">
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Mentions légales</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Confidentialité</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">CGU</Link></li>
                <li><Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary-400">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <p className="text-center text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} IngeniusPlan. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
