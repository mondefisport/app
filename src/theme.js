/**
 * ============================================================
 * THÈME — à personnaliser pour chaque nouveau client
 * ============================================================
 *
 * Toutes les couleurs de l'app sont ici. Pour adapter cette app
 * à un nouveau client, il suffit de changer les valeurs dans ce
 * fichier — aucune couleur ne doit être écrite en dur ailleurs
 * dans le code (composants).
 *
 * Convention de nommage : par RÔLE (primary, textDark...), pas
 * par couleur littérale (dore, marron...), pour que le fichier
 * reste cohérent même si la palette change complètement.
 * ============================================================
 */

export const COLORS = {
  // Couleur de marque principale (accents, CTA, liens)
  primary: '#4A4A4A',        // à remplacer par la couleur principale du client
  primaryLight: '#6B6B6B',   // variante claire
  primarySoft: '#D0D0D0',    // variante très claire (fonds légers)

  // Couleur secondaire (titres, éléments structurants)
  secondary: '#2C3E50',      // à remplacer par la couleur secondaire du client

  // Textes / éléments bruns
  textDark: '#3D2E1F',
  textMedium: '#5C4633',
  textAccent: '#A0522D',
  textMuted: '#999999',
  textSubtle: '#B0A18C',

  // Fonds
  backgroundCream: '#F5EFE6',
  backgroundCreamLight: '#FBF6EC',
  backgroundBeige: '#EDE4D3',
  backgroundBeigeSoft: '#E0D5C0',
  backgroundWhite: '#FFFFFF',
  backgroundGray: '#F9F9F9',
  backgroundGrayLight: '#F5F5F5',
  backgroundWarning: '#FFF8E1',
  backgroundError: '#FFE0E0',
  backgroundNeutral: '#E0E0E0',

  // Couleurs des 7 chakras (spécifique à une app de yoga —
  // à adapter/retirer si le nouveau client n'est pas dans ce secteur)
  chakraRacine: '#C0392B',
  chakraSacre: '#E67E22',
  chakraPlexusSolaire: '#F1C40F',
  chakraCoeur: '#27AE60',
  chakraGorge: '#3498DB',
  chakraTroisiemeOeil: '#6C3483',
  chakraCouronne: '#BDC3C7',
};

/**
 * Libellés + couleurs des chakras, centralisés (remplace la fonction
 * getCouleurChakra qui faisait un switch en dur dans le composant).
 */
export const CHAKRA_COLORS = {
  'Racine': COLORS.chakraRacine,
  'Sacré': COLORS.chakraSacre,
  'Plexus solaire': COLORS.chakraPlexusSolaire,
  'Cœur': COLORS.chakraCoeur,
  'Gorge': COLORS.chakraGorge,
  'Troisième œil': COLORS.chakraTroisiemeOeil,
  'Couronne': COLORS.chakraCouronne,
};

export function getCouleurChakra(nomChakra) {
  return CHAKRA_COLORS[nomChakra] || COLORS.chakraCouronne;
}

/**
 * ============================================================
 * Couleurs modifiables depuis l'admin, sans redéploiement
 * ============================================================
 *
 * COLORS reste un objet statique (importé partout dans App.jsx via
 * `import { COLORS } from './theme'`) — plutôt que de transformer les
 * 400+ usages en hooks React, on mute cet objet en place une fois les
 * vraies couleurs chargées depuis Supabase, puis on force un
 * re-render du composant racine (voir YogaApp dans App.jsx) pour que
 * tous les composants affichent les nouvelles valeurs.
 *
 * Table Supabase attendue : parametres_theme_app
 *   id bigint, colors jsonb, updated_at timestamptz
 * Une seule ligne (id fixe non requis, on prend la plus récente).
 * ============================================================
 */
import { supabase } from './supabaseClient';

// Copie des valeurs par défaut (celles définies plus haut), pour
// pouvoir proposer un "Réinitialiser" dans l'écran Réglages.
export const COLORS_PAR_DEFAUT = { ...COLORS };

export async function chargerThemeDepuisSupabase() {
  const { data, error } = await supabase
    .from('parametres_theme_app')
    .select('colors')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    console.error('Erreur chargement thème:', error.message);
    return false;
  }
  if (data?.colors) {
    Object.assign(COLORS, data.colors);
    return true;
  }
  return false;
}

export async function sauvegarderThemeSupabase(nouvellesCouleurs) {
  // On fusionne avec les couleurs actuelles pour ne jamais perdre une
  // clé non éditée dans l'écran Réglages (ex. les couleurs de chakras).
  const couleursCompletes = { ...COLORS, ...nouvellesCouleurs };

  const { error } = await supabase
    .from('parametres_theme_app')
    .upsert({ id: 1, colors: couleursCompletes, updated_at: new Date().toISOString() });

  if (error) {
    console.error('Erreur sauvegarde thème:', error.message);
    return false;
  }
  Object.assign(COLORS, couleursCompletes);
  return true;
}
