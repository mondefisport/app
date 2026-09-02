/**
 * ============================================================
 * VOCABULAIRE — termes réutilisables selon le secteur d'activité
 * ============================================================
 *
 * Ce fichier centralise tous les mots affichés à l'écran qui
 * dépendent du secteur (yoga, Pilates, fitness, danse...).
 * Pour adapter l'app à un nouveau secteur, il suffit de changer
 * les valeurs ici — aucun texte de ce type ne doit être écrit
 * en dur ailleurs dans le code (composants).
 *
 * Exemple d'usage dans un composant :
 *   import { VOCAB } from './vocabulaire';
 *   <h1>{VOCAB.posture.pluriel}</h1>  →  "Positions" ou "Postures"
 *
 * Change juste les valeurs ci-dessous pour passer d'un secteur à l'autre.
 * ============================================================
 */

export const VOCAB = {
  posture: { singulier: 'Exercice', pluriel: 'Exercices', verbe: 'S\'entraîner' },

  seance: {
    singulier: 'Séance',
    pluriel: 'Séances',
  },

  programme: { singulier: 'Challenge', pluriel: 'Challenges' },

  energie: { actif: false, singulier: '', pluriel: '' },

  difficulte: {
    facile: 'Facile',
    moyen: 'Moyen',
    difficile: 'Difficile',
  },

  objectifs: {
    label: 'Objectifs',
    exemples: ['Haut du corps', 'Abdos', 'Cardio', 'Bas du corps'],
    // Liste structurée utilisée par les écrans de sélection d'objectifs
    // (onboarding, profil, générateur "Créer ma séance"). Les id doivent
    // correspondre aux tags présents dans la colonne objectifs de la
    // table postures, pour que le filtrage fonctionne (voir Annexe 34).
    // Organisés par zone du corps plutôt que par type d'objectif abstrait
    // — colle mieux à la structure bodyPart des données WorkoutX.
    liste: [
      { id: 'haut_du_corps', label: 'Haut du corps', icone: '💪', emoji: '💪' },
      { id: 'abdos', label: 'Abdos', icone: '🔥', emoji: '🔥' },
      { id: 'cardio', label: 'Cardio', icone: '❤️', emoji: '❤️' },
      { id: 'bas_du_corps', label: 'Bas du corps', icone: '🦵', emoji: '🦵' },
    ],
  },

  // Grille de catégories affichée au verso de chaque carte (voir
  // CATEGORIES_BIENFAITS dans App.jsx). Pour le yoga, ce sont des
  // catégories de bien-être (Poumons, Cœur, Sommeil...) ; pour le
  // fitness/musculation, ce sont les groupes musculaires travaillés.
  // Le tag de chaque entrée doit correspondre à un tag présent dans
  // la colonne bienfaits_tags de la table postures (voir Annexe 35).
  categoriesVerso: [
    { tag: 'bras', emoji: '💪', label: 'Bras' },
    { tag: 'dos', emoji: '🧗', label: 'Dos' },
    { tag: 'epaules', emoji: '🙆', label: 'Épaules' },
    { tag: 'poitrine', emoji: '🛡️', label: 'Poitrine' },
    { tag: 'abdos', emoji: '🔥', label: 'Abdominaux' },
    { tag: 'jambes', emoji: '🦵', label: 'Jambes' },
    { tag: 'mollets', emoji: '🦶', label: 'Mollets' },
    { tag: 'cardio', emoji: '❤️', label: 'Cardio' },
    { tag: 'mobilite', emoji: '🧘', label: 'Mobilité' },
    { tag: 'gainage', emoji: '🧱', label: 'Gainage' },
  ],

  navigation: {
    accueil: 'Accueil',
    maSeance: 'Créer ma séance',
    monCompte: 'Mon compte',
  },
};

/**
 * ============================================================
 * PRESETS — configurations prêtes à l'emploi par secteur
 * ============================================================
 * Décommenter le bloc correspondant et le copier dans VOCAB
 * ci-dessus pour changer rapidement de secteur.
 * ============================================================
 */

export const PRESET_YOGA = {
  posture: { singulier: 'Posture', pluriel: 'Postures', verbe: 'Pratiquer' },
  programme: { singulier: 'Défi', pluriel: 'Défis' },
  energie: { actif: true, singulier: 'Chakra', pluriel: 'Chakras' },
};

export const PRESET_PILATES = {
  posture: { singulier: 'Position', pluriel: 'Positions', verbe: 'Pratiquer' },
  programme: { singulier: 'Défi', pluriel: 'Défis' },
  energie: { actif: false, singulier: '', pluriel: '' },
};

export const PRESET_FITNESS = {
  posture: { singulier: 'Exercice', pluriel: 'Exercices', verbe: 'S\'entraîner' },
  programme: { singulier: 'Challenge', pluriel: 'Challenges' },
  energie: { actif: false, singulier: '', pluriel: '' },
};

export const PRESET_DANSE = {
  posture: { singulier: 'Mouvement', pluriel: 'Mouvements', verbe: 'Danser' },
  programme: { singulier: 'Parcours', pluriel: 'Parcours' },
  energie: { actif: false, singulier: '', pluriel: '' },
};
