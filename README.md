# Template Client — App mobile/PWA (type Sāra)

Ce projet est une **copie neutre, prête à lancer**, de l'app développée pour
Pauline (Sāra) puis validée sur Pilate Toulon. Toute la structure technique
et fonctionnelle (postures, séances, programmes, codes entreprise,
statistiques) est conservée telle quelle — seuls le contenu et le style sont
neutralisés, prêts à être personnalisés pour un nouveau client.

## Démarrage rapide sur un nouveau projet

1. **Dupliquer ce dossier** avec le nom du nouveau projet
2. `npm install`
3. Remplir `src/config.js` (nom du client, contact, logo)
4. Remplir `src/theme.js` (couleurs de la charte du client)
5. Remplir `src/vocabulaire.js` — choisir un preset (`PRESET_YOGA`,
   `PRESET_PILATES`, `PRESET_FITNESS`, `PRESET_DANSE`) selon le secteur, ou
   personnaliser `VOCAB` directement
6. Copier `.env.example` en `.env`, remplir avec les vraies credentials
   Supabase (peut être le **même projet** que le dashboard du client, si le
   client a aussi un site/dashboard)
7. Exécuter `SQL_App_[client].sql` dans Supabase (6 tables : postures,
   seances, programmes, codes_entreprise, seances_realisees + compléments
   sur profils)
8. Remplacer les fichiers `public/favicon.svg`, `public/logo-192.png`,
   `public/logo-512.png` par le vrai logo du client
9. Adapter le contenu de secours `posturesParDefaut` dans `src/App.jsx`
   (recherche `const posturesParDefaut`) avec 3-4 exemples représentatifs du
   nouveau secteur — **garder au moins un exercice avec `fonctions:
   'ancrage'` et un avec `fonctions: 'repos'`**, sinon "Créer ma séance" peut
   planter (voir Annexe 26 du guide)
10. `npm run dev` pour tester en local

## ⚠️ Points critiques à vérifier (leçons du test complet)

1. **Manifest PWA** (`vite.config.js` → section `manifest`) — nom/couleurs
   affichés à l'installation, distinct de `config.js`/`theme.js`
2. **Titre d'onglet** (`index.html` → `<title>`)
3. **Logos physiques** (`public/favicon.svg`, `logo-192.png`, `logo-512.png`)
   — distincts de `LOGO_URL` dans `config.js`, qui ne couvre que l'affichage
   dans les pages de l'app
4. **6 tables Supabase nécessaires**, pas seulement `postures` — vérifier
   systématiquement avec `grep -oP ".from\('[a-z_]+'\)" src/App.jsx | sort -u`
5. **Valeurs `difficulte`/`fonctions` strictes** — `difficulte` en minuscules
   (`'tous'`/`'facile'`/`'intermediaire'`), `fonctions` doit inclure au moins
   un exercice `'ancrage'` et un `'repos'`, sinon "Créer ma séance" plante
6. **Table `profils` partagée avec le dashboard** — si le client a aussi un
   dashboard (même projet Supabase), ajouter 2 colonnes
   (`objectif_principal`, `code_entreprise`) + policies d'écriture
7. **Redirect URLs Supabase Auth** — si dashboard et app partagent le même
   projet Supabase, ajouter l'URL de CHAQUE frontend dans Authentication →
   URL Configuration → Redirect URLs, sinon le Magic Link de l'un redirige
   vers l'autre
8. **Deux systèmes de codes entreprise distincts** — `CODES_VALIDES`/l'admin
   local ne remplace pas la vraie table Supabase `codes_entreprise`, utilisée
   par la validation réelle
9. **Réorganisation des sous-domaines** — si dashboard + app partagent le
   même domaine racine, `app.domaine.fr` doit pointer vers le projet Vercel
   de l'app (pas du dashboard), `admin.domaine.fr` reste sur le dashboard

## Stack

React + Vite + Tailwind + Supabase + vite-plugin-pwa

Voir le guide détaillé complet (`Guide_Detaille_Nouveau_Client.md`, Étape 10
et Annexes 18 à 30) pour la procédure pas-à-pas complète et toutes les
difficultés déjà rencontrées et résolues.
