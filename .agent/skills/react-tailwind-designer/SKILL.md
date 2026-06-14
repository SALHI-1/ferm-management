# React Tailwind Professional Designer Skill

## Description
Ce skill donne à l'agent les compétences nécessaires pour concevoir et implémenter des composants React haut de gamme, réutilisables et professionnels en utilisant Tailwind CSS. Il doit être chargé dès que l'utilisateur demande une modification d'UI, la création d'un composant, ou l'amélioration esthétique d'une vue.

## Triggers
- "crée un composant React"
- "ajoute du style Tailwind"
- "style professionnel et élégant"
- "interface moderne"
- "refonte graphique"
- "frontend react"

## Directives de Style (UI/UX Premium)

L'agent doit STRICTEMENT appliquer les règles de design suivantes pour garantir un rendu "Software-as-a-Service" (SaaS) haut de gamme :

### 1. Palette de Couleurs & Mode Sombre/Clair
- **Arrière-plans :** Préférer des tons subtils comme `bg-slate-50` ou `bg-gray-50` pour le mode clair, et `bg-slate-900` ou `bg-zinc-950` pour le mode sombre. Éviter le noir pur (`bg-black`).
- **Textes :** Assurer un contraste optimal (`text-slate-900` pour les titres, `text-slate-600` pour le corps en mode clair).
- **Accents :** Utiliser une seule couleur d'accentuation élégante (ex: `indigo-600`, `violet-600` ou `emerald-600`) pour les actions principales.

### 2. Typographie & Espacement
- Utiliser des espacements aérés et rigoureux (`space-y-6`, `gap-8`, `p-6` ou `p-8` pour les conteneurs).
- Hiérarchie claire : Titres massifs et semi-bold (`text-2xl font-semibold tracking-tight`).

### 3. Composants Éléments (Cards, Inputs, Buttons)
- **Cards :** Structure blanche épurée avec des bordures très discrètes et une ombre légère (`bg-white border border-slate-100 shadow-sm rounded-xl`).
- **Buttons :** Coins arrondis modernes, transitions fluides et retours au survol (`px-4 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95`).
- **Inputs :** Focus soigné sans contour grossier (`focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none`).

### 4. Animations & Transitions
- Toutes les interactions (hover, focus) doivent être fluides : utiliser systématiquement `transition-all duration-200 ease-in-out`.

## Exemples de Code Attendus

### Structure d'une Card Statistique Élégante :
```tsx
import React from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

export const StatCard = ({ title, value, percentage }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase">{title}</p>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
          <ArrowUpIcon className="-ml-1 mr-0.5 h-3 w-3" />
          {percentage}%
        </span>
      </div>
    </div>
  );
};