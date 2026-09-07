/**
 * ============================================================
 * CONFIG CLIENT — à personnaliser pour chaque nouveau client
 * ============================================================
 */

export const CLIENT = {
  nom: "jordi lambert",
  proprietaire: "jordi lambert",
  emailContact: "contact@mondefisport.fr",
  siteUrl: "https://mondefisport.fr",
  urlPresentation: "https://mondefisport.fr",
  urlConfidentialite: "https://mondefisport.fr/confidentialite",
  urlMentions: "https://mondefisport.fr/mentions",
  urlCGU: "https://mondefisport.fr/cgu",
  ville: "Toulon",
  anneeCopyright: 2026,
};

/**
 * Logo de mondefisport — fichier réel dans public/logo-512.png
 */
export const LOGO_URL = '/logo-512.png';

/**
 * ⚠️ Codes d'accès entreprise — gérés en réalité via la table Supabase
 * codes_entreprise (voir Annexe 28 du guide). Cette constante n'est plus
 * utilisée par la validation réelle, gardée uniquement pour compatibilité
 * avec l'écran admin historique.
 */
export const CODES_VALIDES = {
  'DEMO-CLIENT': { entreprise: 'Démonstration', logo: '✦' },
};
