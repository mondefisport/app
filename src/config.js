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
 * Logo — placeholder simple en attendant un vrai logo client.
 * Remplacer par le vrai logo en base64 une fois disponible.
 */
export const LOGO_URL = 'data:image/svg+xml;base64,' + btoa(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <circle cx="100" cy="100" r="95" fill="#4A4A4A"/>
  <text x="100" y="130" font-size="100" font-family="Arial, sans-serif" font-weight="bold" fill="white" text-anchor="middle">?</text>
</svg>
`);

/**
 * ⚠️ Codes d'accès entreprise — gérés en réalité via la table Supabase
 * codes_entreprise (voir Annexe 28 du guide). Cette constante n'est plus
 * utilisée par la validation réelle, gardée uniquement pour compatibilité
 * avec l'écran admin historique.
 */
export const CODES_VALIDES = {
  'DEMO-CLIENT': { entreprise: 'Démonstration', logo: '✦' },
};
