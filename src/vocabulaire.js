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
    exemples: ['Renforcement', 'Cardio', 'Mobilité', 'Gainage', 'Forme générale'],
    // Liste structurée utilisée par les écrans de sélection d'objectifs
    // (onboarding, profil, générateur "Créer ma séance"). Les id doivent
    // correspondre aux tags présents dans la colonne objectifs de la
    // table postures, pour que le filtrage fonctionne (voir Annexe 34).
    liste: [
      { id: 'renforcement', label: 'Me renforcer', icone: '💪', emoji: '💪' },
      { id: 'cardio', label: 'Travailler mon cardio', icone: '❤️', emoji: '❤️' },
      { id: 'mobilite', label: 'Gagner en mobilité', icone: '🧘', emoji: '🧘' },
      { id: 'gainage', label: 'Renforcer mon gainage', icone: '🔥', emoji: '🔥' },
      { id: 'general', label: 'Forme générale', icone: '✨', emoji: '✨' },
    ],
  },

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
