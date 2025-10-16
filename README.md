
 # MovieVLT - Explorateur de Films
 
 MovieVLT est une application web dynamique développée avec Vue.js 3 et Tailwind CSS. Elle permet aux utilisateurs de naviguer, rechercher et explorer un vaste catalogue de films, d'acteurs et de réalisateurs en utilisant l'API de The Movie Database (TMDB).
 
 ## 🚀 Aperçu
 
 L'application offre une interface moderne et réactive pour une expérience de découverte cinématographique fluide.
 
 *(Vous pouvez ajouter une capture d'écran ou un GIF de l'application ici)*
 
 ## ✨ Fonctionnalités
 
 - **Page d'accueil dynamique** : Affiche par défaut les films les plus populaires de l'année en cours.
 - **Recherche de films** : Un moteur de recherche sur la page d'accueil permet de trouver des films par leur titre.
 - **Pagination "Voir plus"** : Chargez davantage de films sur la page d'accueil sans recharger la page.
 - **Exploration par Personnes** :
   - Une page dédiée à la recherche d'**acteurs**.
   - Une page dédiée à la recherche de **réalisateurs**.
 - **Pages de Détails Complètes** :
   - **Détails de Film** : Affiche le synopsis, l'année, le réalisateur et le casting principal.
   - **Détails de Personne** : Affiche la biographie, l'âge, la date de naissance et une filmographie sélective (en tant qu'acteur et/ou réalisateur).
 - **Navigation Intelligente** :
   - Cliquez sur un acteur dans le casting d'un film pour accéder directement à sa page de détails.
   - Cliquez sur un film dans la filmographie d'une personne pour voir les détails du film.
 - **Recherche Globale** : Une barre de recherche dans l'en-tête permet de trouver instantanément des films, acteurs ou réalisateurs, avec des résultats clairs et catégorisés.
 - **Design Moderne et Réactif** : Interface soignée construite avec Tailwind CSS, incluant des animations de survol pour une meilleure expérience utilisateur.
 
 ## 🛠️ Technologies Utilisées
 
 - **Frontend** : [Vue.js 3](https://vuejs.org/) (Composition API)
 - **Build Tool** : [Vite](https://vitejs.dev/)
 - **Styling** : [Tailwind CSS](https://tailwindcss.com/)
 - **API Externe** : [The Movie Database (TMDB)](https://www.themoviedb.org/documentation/api)
 
 ## ⚙️ Installation et Lancement
 
 Suivez ces étapes pour lancer le projet en local.
 
 ### 1. Prérequis
 
 - [Node.js](https://nodejs.org/) (version 16+ recommandée)
 - Un éditeur de code (ex: [VS Code](https://code.visualstudio.com/))
 - Une clé d'API de [TMDB](https://www.themoviedb.org/signup). C'est gratuit et rapide à obtenir.
 
 ### 2. Cloner le dépôt
 
 ```bash
 git clone <url-du-depot>
 cd my-vue-tailwind-app
 ```
 
 ### 3. Installer les dépendances
 
 ```bash
 npm install
 ```
 
 ### 4. Configurer les variables d'environnement
 
 Créez un fichier `.env` à la racine du projet et ajoutez-y votre clé d'API TMDB :
 
 ```
 VITE_TMDB_API_KEY=VOTRE_CLE_API_TMDB_ICI
 ```
 
 ### 5. Lancer le serveur de développement
 
 ```bash
 npm run dev
 ```
 
 L'application sera accessible à l'adresse `http://localhost:5173` (ou un autre port si celui-ci est déjà utilisé).
 
 ## 📂 Structure du Projet
 
 ```
 my-vue-tailwind-app/
 ├── public/
 │   └── img/              # Images statiques
 ├── src/
 │   ├── components/       # Composants Vue réutilisables
 │   │   ├── ActeursPage.vue
 │   │   ├── FilmCard.vue
 │   │   ├── FilmDetails.vue
 │   │   ├── HomeFilms.vue
 │   │   ├── PersonDetails.vue
 │   │   └── RealisateursPage.vue
 │   ├── services/
 │   │   └── tmdb.js       # Logique pour les appels à l'API TMDB
 │   └── App.vue           # Composant racine de l'application
 ├── .env                  # Fichier pour les variables d'environnement (non versionné)
 ├── index.html            # Point d'entrée HTML
 └── package.json          # Dépendances et scripts du projet
 ```
 
 ---
 
 Ce projet a été conçu pour être modulaire et facile à maintenir, en séparant clairement la logique (services), les vues (composants) et la gestion de l'état (composant `App.vue`).
