# InGeniusPlan

Une application de productivité révolutionnaire combinant gestion de tâches, planification, brainstorming et outils de concentration, enrichie par une intelligence artificielle assistante nommée "El_Professor".

## Vision du projet

InGeniusPlan ambitionne de devenir la référence en matière d'application de productivité, en combinant une interface minimaliste avec une intelligence artificielle intégrée qui agit comme un véritable assistant personnel adapté aux besoins spécifiques de chaque utilisateur.

## Fonctionnalités principales

- **Gestion avancée des tâches** avec prioritisation intelligente et méthodes de productivité intégrées
- **Calendrier multi-vues** (jour, semaine, mois) avec planification intelligente
- **Projets et organisation** avec visualisation Gantt et tableaux de bord
- **Assistant IA "El_Professor"** qui recommande des méthodes de productivité personnalisées
- **Workspace avec brainstorming** et outils de concentration (Pomodoro, etc.)
- **Collaboration et partage** pour le travail en équipe
- **Système d'engagement** basé sur les principes de la psychologie comportementale

## Stack technique

- **Frontend**: Next.js 14+ avec React 18+ et TypeScript 5+
- **État global**: Zustand pour la gestion d'état centrale
- **Requêtes API**: TanStack Query (React Query) avec gestion de cache avancée
- **Styling**: Tailwind CSS avec thèmes personnalisables
- **Accessibilité**: Composants Radix UI comme base accessible
- **Base de données**: Prisma ORM avec PostgreSQL

## Installation et lancement

```bash
# Cloner le répertoire
git clone https://github.com/PascalChui/IngeniusPlan.git
cd IngeniusPlan

# Installer les dépendances
npm install
# ou
pnpm install

# Configurer les variables d'environnement
cp .env.example .env.local

# Lancer le serveur de développement
npm run dev
# ou
pnpm dev
```

## Structure du projet

```
/
├── app/              # Routes et pages (Next.js App Router)
├── components/       # Composants React réutilisables
├── contexts/         # Contextes React pour l'état global
├── data/             # Données statiques et mocks
├── hooks/            # Hooks React personnalisés
├── lib/              # Bibliothèques et utilitaires
├── public/           # Fichiers statiques
├── styles/           # Styles globaux
├── types/            # Types TypeScript
└── utils/            # Fonctions utilitaires
```

## Captures d'écran

*Des captures d'écran seront ajoutées prochainement.*

## Roadmap

- [x] Structure de base et composants UI
- [x] Gestion des tâches et projets
- [x] Calendrier et planification
- [x] Tableaux de bord et statistiques
- [ ] Intégration complète de l'IA El_Professor
- [ ] Fonctionnalités de collaboration avancées
- [ ] Applications mobiles natives

## Contributeurs

- Pascal Chui - Créateur du projet

## Licence

Ce projet est sous licence privée. Tous droits réservés.
