import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronRight, Check, Clock, Heart, Wind, Sun, Moon, Sparkles, Lock, Building2, KeyRound, ArrowRight, Mail, Share2, Globe, X, User, Settings, Plus, Trash2, Edit3, BarChart3, Calendar, LayoutGrid, Palette } from 'lucide-react';
import { supabase } from './supabaseClient';
import { COLORS, COLORS_PAR_DEFAUT, getCouleurChakra, chargerThemeDepuisSupabase, sauvegarderThemeSupabase } from './theme';
import { CLIENT, LOGO_URL, CODES_VALIDES } from './config';
import { VOCAB } from './vocabulaire';

// ============ DONNÉES ============

// Couleurs des 7 chakras

const TOUS_LES_CHAKRAS = [
  'Racine',
  'Sacré',
  'Plexus solaire',
  'Cœur',
  'Gorge',
  'Troisième œil',
  'Couronne',
];

// Les 10 catégories de bénéfices PlayPauseBe
const CATEGORIES_BIENFAITS = VOCAB.categoriesVerso;

// Composant Onboarding (première connexion)
function Onboarding({ user, onComplete }) {
  const [prenom, setPrenom] = useState('');
  const [objectif, setObjectif] = useState('');
  const [codeEntreprise, setCodeEntreprise] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState('');

  const objectifs = VOCAB.objectifs.liste;

  const sauvegarder = async (e) => {
    e.preventDefault();
    if (!prenom || !objectif) return;

    setEnCours(true);
    setErreur('');

    try {
      const { error } = await supabase
        .from('profils')
        .upsert({
          user_id: user.id,
          email: user.email,
          prenom: prenom,
          objectif_principal: objectif,
          code_entreprise: codeEntreprise || null,
        }, { onConflict: 'user_id' });

      if (error) throw error;
      onComplete();
    } catch (err) {
      setErreur(err.message || 'Erreur lors de la sauvegarde');
    } finally {
      setEnCours(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ backgroundColor: 'rgba(30, 41, 89, 0.85)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🪷</div>
          <h2 className="font-bold text-2xl mb-2" style={{ color: COLORS.secondary }}>
            Bienvenue dans {CLIENT.nom}
          </h2>
          <p className="text-sm" style={{ color: COLORS.textMedium }}>
            Quelques infos pour personnaliser ta pratique
          </p>
        </div>

        <form onSubmit={sauvegarder}>
          
          {/* Prénom */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textMedium }}>
              Comment t'appelles-tu ?
            </label>
            <input
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom"
              required
              disabled={enCours}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none"
              style={{ borderColor: COLORS.backgroundBeigeSoft }}
            />
          </div>

          {/* Objectif */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-3" style={{ color: COLORS.textMedium }}>
              Ton objectif principal ?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {objectifs.map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => setObjectif(obj.id)}
                  disabled={enCours}
                  className="p-3 rounded-lg text-left transition-all"
                  style={{
                    backgroundColor: objectif === obj.id ? COLORS.backgroundCreamLight : COLORS.backgroundGray,
                    border: objectif === obj.id ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.backgroundNeutral}`,
                  }}
                >
                  <div className="text-2xl mb-1">{obj.emoji}</div>
                  <div className="text-xs font-medium" 
                       style={{ color: objectif === obj.id ? COLORS.secondary : COLORS.textMedium }}>
                    {obj.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code entreprise */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textMedium }}>
              Code entreprise <span style={{ color: COLORS.textMuted, fontWeight: 'normal' }}>(optionnel)</span>
            </label>
            <input
              type="text"
              value={codeEntreprise}
              onChange={(e) => setCodeEntreprise(e.target.value.toUpperCase())}
              placeholder="Ex : BOITEIMMO2024"
              disabled={enCours}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none"
              style={{ borderColor: COLORS.backgroundBeigeSoft, fontFamily: 'monospace' }}
            />
            <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
              Fourni par ton employeur. Laisse vide pour la démo gratuite.
            </p>
          </div>

          {erreur && (
            <div className="mb-4 p-3 rounded-lg text-sm"
                 style={{ backgroundColor: COLORS.backgroundError, color: COLORS.chakraRacine }}>
              {erreur}
            </div>
          )}

          {/* Consentement RGPD */}
<div className="flex items-start gap-3 mb-5">
  <input
    type="checkbox"
    id="consentement"
    required
    className="mt-1 w-4 h-4 cursor-pointer"
    style={{ accentColor: COLORS.primary }}
  />
  <label htmlFor="consentement" className="text-xs leading-relaxed cursor-pointer"
         style={{ color: COLORS.textMedium }}>
    J'accepte que mes données (prénom, email, objectif, historique de séances) soient 
    conservées par {CLIENT.nom} pour personnaliser ma pratique. 
    Je peux supprimer mon compte à tout moment depuis mon profil.
  </label>
</div>

          <button
            type="submit"
            disabled={enCours || !prenom || !objectif}
            className="w-full py-3 rounded-full font-medium transition-all hover:shadow-lg disabled:opacity-50"
            style={{ backgroundColor: COLORS.secondary, color: COLORS.backgroundCreamLight }}
          >
            {enCours ? 'Création...' : 'Commencer ma pratique 🪷'}
          </button>
        </form>

        <p className="text-xs text-center mt-6" style={{ color: COLORS.textMuted }}>
          Tu pourras modifier ces infos plus tard depuis ton profil.
        </p>
      </div>
    </div>
  );
}

// Composant Connexion via Magic Link
function Connexion({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [enCours, setEnCours] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [erreur, setErreur] = useState('');

  // Détection Android vs iPhone
  const estAndroid = /Android/i.test(navigator.userAgent);
  const estIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  // Détection si déjà installée comme PWA
  const estDejaInstalle = window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;

  // Prompt d'installation Android
  const [installPrompt, setInstallPrompt] = useState(null);
  const [installDone, setInstallDone] = useState(estDejaInstalle);

  useEffect(() => {
    if (estDejaInstalle) { setInstallDone(true); return; }
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const envoyerLien = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setEnCours(true);
    setErreur('');
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      
      if (error) throw error;
      setEnvoye(true);
    } catch (err) {
      setErreur(err.message || 'Une erreur est survenue');
    } finally {
      setEnCours(false);
    }
  };

  if (envoye) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
           style={{ backgroundColor: 'rgba(30, 41, 89, 0.85)' }}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">📩</div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: COLORS.secondary }}>
            Vérifie ta boîte mail
          </h2>
          <p className="mb-4" style={{ color: COLORS.textMedium }}>
            Un lien magique a été envoyé à <strong>{email}</strong>.
            Clique dessus pour te connecter à {CLIENT.nom}. ✨
          </p>
          <p className="text-sm px-3 py-2 rounded-lg mb-6" style={{ background: 'rgba(193,157,11,0.1)', color: COLORS.textMedium }}>
            📂 Si vous ne le voyez pas, vérifiez votre dossier <strong>spam</strong> ou <strong>indésirables</strong>.
          </p>
          <button
            onClick={() => { setEnvoye(false); setEmail(''); }}
            className="text-sm underline"
            style={{ color: COLORS.primary }}
          >
            Utiliser une autre adresse
          </button>
        </div>
      </div>
    );
  }

 return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
         style={{ backgroundColor: 'rgba(30, 41, 89, 0.85)' }}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <img src={LOGO_URL} alt={CLIENT.nom} className="w-16 h-16 rounded-full object-cover mx-auto mb-2" style={{ boxShadow: '0 8px 20px -6px rgba(30, 41, 89, 0.3)' }} />
          <h2 className="font-bold text-3xl" style={{ color: COLORS.secondary }}>{CLIENT.nom}</h2>
          <p className="italic text-sm mt-1" style={{ color: COLORS.primary }}>
            Bienvenue dans ta pratique
          </p>
        </div>

        {/* ─── CAS 1 : Android, app non installée ─── */}
        {estAndroid && !installDone && (
          <div className="text-center">
            <div
              className="rounded-xl p-5 mb-6"
              style={{ background: 'rgba(193,157,11,0.08)', border: '1px solid rgba(193,157,11,0.25)' }}
            >
              <div className="text-3xl mb-3">📲</div>
              <p className="font-medium mb-1" style={{ color: COLORS.secondary }}>
                Installez d'abord {CLIENT.nom}
              </p>
              <p className="text-sm mb-4" style={{ color: COLORS.textMedium }}>
                Ajoutez l'app à votre écran d'accueil pour une connexion rapide et durable — vous n'aurez à vous connecter qu'une seule fois.
              </p>
              {installPrompt ? (
                <button
                  onClick={async () => {
                    await installPrompt.prompt();
                    const { outcome } = await installPrompt.userChoice;
                    if (outcome === 'accepted') setInstallDone(true);
                  }}
                  className="w-full py-3 rounded-full font-medium mb-3"
                  style={{ background: COLORS.secondary, color: COLORS.backgroundCreamLight }}
                >
                  📲 Installer {CLIENT.nom} →
                </button>
              ) : (
                <p className="text-xs mb-3" style={{ color: COLORS.textMuted }}>
                  Dans Chrome : menu ⋮ → "Ajouter à l'écran d'accueil"
                </p>
              )}
              <button
                onClick={() => setInstallDone(true)}
                className="text-xs underline"
                style={{ color: COLORS.primary }}
              >
                J'ai déjà installé, continuer →
              </button>
            </div>
          </div>
        )}

        {/* ─── CAS 2 : iPhone, instruction manuelle ─── */}
        {estIOS && !estDejaInstalle && (
          <div
            className="rounded-xl p-4 mb-6 text-center"
            style={{ background: 'rgba(193,157,11,0.08)', border: '1px solid rgba(193,157,11,0.25)' }}
          >
            <p className="text-sm font-medium mb-1" style={{ color: COLORS.secondary }}>
              📲 Installez {CLIENT.nom} sur votre iPhone
            </p>
            <p className="text-xs" style={{ color: COLORS.textMedium }}>
              Dans Safari : appuyez sur <strong>⎙ Partager</strong> → <strong>Sur l'écran d'accueil</strong>
            </p>
          </div>
        )}

        {/* ─── FORMULAIRE : visible si installé ou iPhone ─── */}
        {(!estAndroid || installDone) && (
          <form onSubmit={envoyerLien}>
            <label className="block text-sm font-medium mb-2" style={{ color: COLORS.textMedium }}>
              Ton adresse email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton.email@exemple.fr"
              required
              disabled={enCours}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-yellow-600 mb-4"
              style={{ borderColor: COLORS.backgroundBeigeSoft }}
            />
            {erreur && (
              <div className="mb-4 p-3 rounded-lg text-sm"
                   style={{ backgroundColor: COLORS.backgroundError, color: COLORS.chakraRacine }}>
                {erreur}
              </div>
            )}
            <button
              type="submit"
              disabled={enCours || !email}
              className="w-full py-3 rounded-full font-medium transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: COLORS.secondary, color: COLORS.backgroundCreamLight }}
            >
              {enCours ? 'Envoi en cours...' : 'Recevoir mon lien magique ✨'}
            </button>
          </form>
        )}

        {/* Notes de bas de page */}
        {(!estAndroid || installDone) && (
          <>
            <p className="text-xs text-center mt-6" style={{ color: COLORS.textMuted }}>
              Pas de mot de passe. Un simple clic sur le lien reçu par mail.
            </p>
            <p className="text-xs text-center mt-2" style={{ color: COLORS.textMuted }}>
              Votre entreprise n'a pas encore {CLIENT.nom} ?{' '}
              <a href={`mailto:${CLIENT.emailContact}`} style={{ color: COLORS.primary, textDecoration: 'underline' }}>
                Nous contacter
              </a>
            </p>
          </>
        )}

        {/* Lien vitrine toujours visible */}
                <p className="text-xs text-center mt-3" style={{ color: COLORS.textMuted }}>
          <a
            href={CLIENT.urlPresentation}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: COLORS.primary, textDecoration: 'underline' }}
          >
            Découvrir {CLIENT.nom} →
          </a>
        </p>

      </div>
    </div>
  );
}

// Composant Modal Carte Posture (recto/verso avec flip animation)
function ModalPosture({ posture, onClose }) {
  const [showVerso, setShowVerso] = useState(false);
  const [photoAgrandie, setPhotoAgrandie] = useState(false);
  
  if (!posture) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(30, 41, 89, 0.85)' }}
      onClick={onClose}
    >
      {/* Conteneur avec perspective 3D */}
      <div 
        className="max-w-md w-full"
        style={{ perspective: '1500px' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Carte flippable */}
        <div
          className="relative w-full transition-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: showVerso ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transitionDuration: '700ms',
            minHeight: '650px',
          }}
        >

          {/* ========== RECTO ========== */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              maxHeight: '90vh',
            }}
          >
            
            {/* Bouton fermer */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl z-10"
              style={{ color: COLORS.secondary }}
            >
              ×
            </button>

            {/* Numéro deck */}
            {posture.numeroDeck && (
              <div 
                className="absolute top-6 left-6 text-xs font-bold tracking-wider"
                style={{ color: COLORS.primary }}
              >
                #{posture.numeroDeck}
              </div>
            )}

            {/* Grosse icône — ou vraie photo si disponible */}
<div className="text-center mb-6 mt-8">
{posture.urlImage ? (
  <img
    src={posture.urlImage}
    alt={posture.nomFr}
    onClick={() => setPhotoAgrandie(true)}
    className="w-full rounded-2xl mx-auto cursor-pointer transition-transform hover:scale-105"
    style={{ maxWidth: '280px', maxHeight: '340px', objectFit: 'contain' }}
  />
) : (
  <div className="text-8xl">{posture.icone}</div>
)}
</div>

            {/* Nom français */}
            <h2 
              className="text-3xl font-bold text-center mb-1"
              style={{ color: COLORS.secondary }}
            >
              {posture.nomFr}
            </h2>

            {/* Nom sanskrit */}
            <p 
              className="text-center italic text-lg mb-6"
              style={{ color: COLORS.primary }}
            >
              {posture.nom}
            </p>

            {/* Instructions — déplacées du verso pour être visibles immédiatement */}
          {posture.instructions && (
            <div className="mb-6">
            <h4 className="text-xs font-bold mb-2 uppercase tracking-wider text-center" style={{ color: COLORS.primary }}>
              Comment faire
            </h4>
            <p className="text-sm leading-relaxed text-center" style={{ color: COLORS.textMedium }}>
          {posture.instructions}
         </p>
  </div>
)}

            {/* Métadonnées */}
            <div 
              className="flex justify-center items-center gap-3 mb-6 text-sm flex-wrap"
              style={{ color: COLORS.textMedium }}
            >
              <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(193,157,11,0.1)' }}>⏱ {posture.duree}s</span>
              <span className="px-3 py-1 rounded-full" style={{ background: 'rgba(193,157,11,0.1)' }}>⚡ {posture.difficulte}</span>
            </div>

            {/* Bouton retourner */}
            <button
              onClick={() => setShowVerso(true)}
              className="w-full py-3 rounded-full font-medium transition-all hover:shadow-lg mt-4"
              style={{ 
                backgroundColor: COLORS.secondary,
                color: COLORS.backgroundCreamLight
              }}
            >
              Voir les bienfaits 🔄
            </button>

          </div>

          {/* ========== VERSO ========== */}
          <div
            className="absolute inset-0 bg-white rounded-2xl shadow-2xl p-8 overflow-y-auto"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              maxHeight: '90vh',
            }}
          >
            
            {/* Bouton fermer */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl z-10"
              style={{ color: COLORS.secondary }}
            >
              ×
            </button>

            {/* Titre */}
            <h3 
              className="text-xl font-bold text-center mb-4 mt-4"
              style={{ color: COLORS.secondary }}
            >
              {posture.nomFr}
            </h3>

            {/* Grille des 10 catégories */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {CATEGORIES_BIENFAITS.map((cat) => {
                const estPresent = posture.bienfaitsTags?.includes(cat.tag);
                return (
                  <div
                    key={cat.tag}
                    title={cat.label}
                    className="aspect-square rounded-lg flex flex-col items-center justify-center p-1"
                    style={{
                      backgroundColor: estPresent ? COLORS.backgroundCreamLight : COLORS.backgroundGrayLight,
                      border: estPresent ? `2px solid ${COLORS.primary}` : `1px solid ${COLORS.backgroundNeutral}`,
                      opacity: estPresent ? 1 : 0.4,
                    }}
                  >
                    <div className="text-2xl">{cat.emoji}</div>
                    <div 
                      className="text-[8px] mt-1 text-center font-medium"
                      style={{ color: estPresent ? COLORS.secondary : COLORS.textMuted }}
                    >
                      {cat.label}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bienfaits */}
            {posture.bienfaits && (
              <div className="mb-5">
                <h4 className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: COLORS.primary }}>
                  Bienfaits
                </h4>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.textMedium }}>
                  {posture.bienfaits}
                </p>
              </div>
            )}

            {/* Grille fixe des 7 chakras (yoga) OU tags Objectifs (Pilates/fitness/danse) */}
{VOCAB.energie.actif ? (
<div className="mb-5">
  <h4 className="text-xs font-bold mb-2 uppercase tracking-wider text-center" style={{ color: COLORS.primary }}>
    {VOCAB.energie.pluriel} concernés
  </h4>
  <div className="flex justify-center gap-3 flex-wrap">
    {TOUS_LES_CHAKRAS.map((chakra) => {
      const actif = posture.chakras && posture.chakras.includes(chakra);
      return (
        <div key={chakra} className="flex flex-col items-center gap-1" style={{ width: '52px' }}>
          <div
            className="w-7 h-7 rounded-full shadow-md transition-all"
            style={{
              backgroundColor: actif ? getCouleurChakra(chakra) : COLORS.backgroundBeigeSoft,
              opacity: actif ? 1 : 0.35,
            }}
          />
          <span
            className="text-[8px] text-center uppercase tracking-wide leading-tight"
            style={{ color: actif ? COLORS.textDark : COLORS.textSubtle, fontWeight: actif ? 600 : 400 }}
          >
            {chakra}
          </span>
        </div>
      );
    })}
  </div>
</div>
) : (
  posture.objectifs && posture.objectifs.length > 0 && (
    <div className="mb-5">
      <h4 className="text-xs font-bold mb-2 uppercase tracking-wider text-center" style={{ color: COLORS.primary }}>
        {VOCAB.objectifs.label}
      </h4>
      <div className="flex justify-center gap-2 flex-wrap">
        {posture.objectifs.map((obj) => (
          <span
            key={obj}
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{ backgroundColor: COLORS.backgroundBeigeSoft, color: COLORS.textDark }}
          >
            {obj}
          </span>
        ))}
      </div>
    </div>
  )
)}

            {/* Précautions */}
            {posture.precautions && (
              <div 
                className="rounded-lg p-3 mb-5"
                style={{ 
                  backgroundColor: COLORS.backgroundWarning,
                  border: `1px solid ${COLORS.chakraPlexusSolaire}`
                }}
              >
                <h4 className="text-xs font-bold mb-1 uppercase tracking-wider" style={{ color: COLORS.chakraRacine }}>
                  ⚠️ Précautions
                </h4>
                <p className="text-xs" style={{ color: COLORS.textMedium }}>
                  {posture.precautions}
                </p>
              </div>
            )}

            {/* Bouton retour */}
            <button
              onClick={() => setShowVerso(false)}
              className="w-full py-3 rounded-full font-medium transition-all hover:shadow-lg mt-2"
              style={{ 
                backgroundColor: COLORS.secondary,
                color: COLORS.backgroundCreamLight
              }}
            >
             ← Retour à la posture
            </button>

          </div>

        </div>

        {/* Photo en plein écran */}
        {photoAgrandie && posture.urlImage && (
          <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-6"
            style={{ background: 'rgba(30, 41, 89, 0.95)' }}
            onClick={() => setPhotoAgrandie(false)}
          >
            <button
              onClick={() => setPhotoAgrandie(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl"
              style={{ color: COLORS.secondary }}
            >
              ×
            </button>
            <img
              src={posture.urlImage}
              alt={posture.nomFr}
              className="max-w-full max-h-full rounded-2xl"
              style={{ objectFit: 'contain' }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

      </div>
    </div>
  );
}

// Postures (fondamentales)
const posturesParDefaut = [
  // ⚠️ Contenu d'exemple minimal — à remplacer par le vrai contenu du client
  // (voir Étape 10.3 du guide : postures_[client].sql).
  // Ce tableau ne sert que de secours si Supabase ne répond pas.
  { id: 'exemple_1', nom: 'Exemple 1', nomFr: 'Premier exercice', duree: 60, difficulte: 'tous',
    bienfaits: 'Décrire les bienfaits de cet exercice',
    instructions: "Décrire les instructions de cet exercice.",
    objectifs: 'objectif1,objectif2', fonctions: 'echauffement', icone: '⭐', gratuit: true },
  { id: 'exemple_2', nom: 'Exemple 2', nomFr: 'Deuxième exercice', duree: 60, difficulte: 'facile',
    bienfaits: 'Décrire les bienfaits de cet exercice',
    instructions: "Décrire les instructions de cet exercice.",
    objectifs: 'objectif1', fonctions: 'pratique', icone: '⭐', gratuit: false },
  { id: 'exemple_ancrage', nom: 'Exemple ancrage', nomFr: 'Exercice de stabilité', duree: 60, difficulte: 'tous',
    bienfaits: 'Décrire les bienfaits de cet exercice',
    instructions: "Décrire les instructions de cet exercice.",
    objectifs: 'stabilite', fonctions: 'ancrage', icone: '⭐', gratuit: true },
  { id: 'exemple_repos', nom: 'Exemple repos', nomFr: 'Exercice de repos', duree: 60, difficulte: 'tous',
    bienfaits: 'Décrire les bienfaits de cet exercice',
    instructions: "Décrire les instructions de cet exercice.",
    objectifs: 'detente', fonctions: 'repos', icone: '⭐', gratuit: true },
];

const seancesParDefaut = [
  { id: 'matin', titre: 'Réveil Doux', duree: '15 min', icone: 'soleil', gratuit: true,
    description: 'Une séance énergisante pour commencer la journée en douceur',
    postures: ['montagne', 'arbre', 'enfant'] },
  { id: 'soir', titre: 'Détente Vespérale', duree: '20 min', icone: 'lune', gratuit: true,
    description: 'Relâchez les tensions de la journée et préparez le sommeil',
    postures: ['enfant', 'montagne'] },
  { id: 'respiration', titre: 'Souffle Conscient', duree: '10 min', icone: 'vent', gratuit: false,
    description: 'Pranayama : maîtrisez votre respiration pour apaiser le mental',
    postures: ['lotus', 'enfant', 'montagne'] },
  { id: 'antistress', titre: 'Anti-Stress Bureau', duree: '12 min', icone: 'etincelles', gratuit: false,
    description: 'Une pause efficace au milieu d\'une journée de travail',
    postures: ['montagne', 'guerrier', 'cobra', 'enfant'] },
  { id: 'sommeil', titre: 'Vers le Sommeil', duree: '15 min', icone: 'lune', gratuit: false,
    description: 'Une pratique allongée pour s\'endormir profondément',
    postures: ['enfant', 'pont', 'lotus'] },
];

// Correspondance icône (string) → composant lucide
const ICONES = { soleil: Sun, lune: Moon, vent: Wind, etincelles: Sparkles, coeur: Heart };
const iconeDe = (nom) => ICONES[nom] || Sun;

// Génère les jours d'un programme à partir d'une liste de thèmes
const genererJours = (themes, dureeBase, joursGratuits) =>
  themes.map((titre, i) => ({
    jour: i + 1,
    titre,
    duree: dureeBase + Math.floor(i / 5) * 2,
    gratuit: i < joursGratuits,
  }));

const programmesInitiaux = [
  {
    id: 'prog30',
    titre: '30 jours, un chemin',
    sousTitre: 'Le grand classique',
    description: 'Un mois pour installer une pratique régulière.',
    jours: genererJours(
      ['Premiers pas', 'Ancrage', 'Souffle', 'Équilibre', 'Ouverture', 'Force douce', 'Flexibilité', 'Présence', 'Lâcher-prise', 'Énergie', 'Stabilité', 'Confiance', 'Fluidité', 'Patience', 'Repos actif', 'Pleine conscience', 'Étirement profond', 'Centrage', 'Légèreté', 'Gratitude', 'Renforcement', 'Sérénité', 'Connexion', 'Vitalité', 'Compassion', 'Liberté', 'Sagesse', 'Harmonie', 'Plénitude', 'Renaissance'],
      5, 3
    ),
  },
  {
    id: 'prog7stress',
    titre: '7 jours anti-stress',
    sousTitre: 'Pour souffler',
    description: 'Une semaine pour relâcher la pression, idéale en période chargée.',
    jours: genererJours(
      ['Déposer les armes', 'Respirer', 'Relâcher les épaules', 'Ralentir', 'Faire de la place', 'S\'ancrer', 'Renaître'],
      8, 2
    ),
  },

  {
    id: 'anti-burnout',
    titre: 'Anti-Burn Out',
    sousTitre: '14 jours',
    objectifFiltrer: 'stress',
    description: "Un programme de récupération progressive pour les équipes en surchauffe. Chaque semaine apporte un peu plus d'espace pour respirer, relâcher, et retrouver son centre.",
    jours: [
      { jour: 1,  titre: 'Retrouver le souffle',              duree: 15, gratuit: true  },
      { jour: 2,  titre: 'Relâcher les épaules',              duree: 15, gratuit: true  },
      { jour: 3,  titre: 'Ancrage et stabilité',              duree: 20, gratuit: false },
      { jour: 4,  titre: 'Lâcher-prise',                      duree: 20, gratuit: false },
      { jour: 5,  titre: 'Ouvrir la poitrine',                duree: 20, gratuit: false },
      { jour: 6,  titre: 'Calmer le système nerveux',         duree: 15, gratuit: false },
      { jour: 7,  titre: 'Bilan de la semaine',               duree: 20, gratuit: false },
      { jour: 8,  titre: 'Énergie douce',                     duree: 20, gratuit: false },
      { jour: 9,  titre: 'Force tranquille',                  duree: 20, gratuit: false },
      { jour: 10, titre: 'Confiance en soi',                  duree: 25, gratuit: false },
      { jour: 11, titre: "Souplesse du corps et de l'esprit", duree: 25, gratuit: false },
      { jour: 12, titre: 'Circulation et vitalité',           duree: 25, gratuit: false },
      { jour: 13, titre: 'Gratitude',                         duree: 20, gratuit: false },
      { jour: 14, titre: 'Je reviens à moi',                  duree: 25, gratuit: false },
    ]
  },
  {
    id: 'yoga-bureau',
    titre: 'Yoga au Bureau',
    sousTitre: '5 jours',
    objectifFiltrer: 'dos',
    description: "5 séances de 15 minutes pensées pour la pause déjeuner ou entre deux réunions. Sans changer de tenue, depuis son bureau.",
    jours: [
      { jour: 1, titre: 'Nuque et épaules libres',      duree: 15, gratuit: true  },
      { jour: 2, titre: 'Dos dénoué',                    duree: 15, gratuit: true  },
      { jour: 3, titre: 'Hanches et jambes réveillées', duree: 15, gratuit: false },
      { jour: 4, titre: 'Respiration et concentration', duree: 15, gratuit: false },
      { jour: 5, titre: 'Corps entier, esprit apaisé',  duree: 15, gratuit: false },
    ]
  },
  {
    id: 'dos-sans-douleur',
    titre: 'Dos Sans Douleur',
    sousTitre: '14 jours',
    objectifFiltrer: 'dos',
    description: "Un programme ciblé pour soulager les douleurs dorsales liées à la sédentarité. De l'étirement vers le renforcement doux — pour un dos soulagé et plus solide.",
    jours: [
      { jour: 1,  titre: 'Comprendre son dos',          duree: 15, gratuit: true  },
      { jour: 2,  titre: 'Libérer les lombaires',       duree: 15, gratuit: true  },
      { jour: 3,  titre: 'Détendre le dos moyen',       duree: 20, gratuit: false },
      { jour: 4,  titre: 'Nuque et cervicales',         duree: 20, gratuit: false },
      { jour: 5,  titre: 'Hanches et psoas',            duree: 20, gratuit: false },
      { jour: 6,  titre: 'Repos actif',                 duree: 15, gratuit: false },
      { jour: 7,  titre: 'Bilan et écoute du corps',   duree: 20, gratuit: false },
      { jour: 8,  titre: 'Renforcer sans forcer',       duree: 20, gratuit: false },
      { jour: 9,  titre: 'Colonne vertébrale souple',  duree: 20, gratuit: false },
      { jour: 10, titre: 'Abdominaux protecteurs',      duree: 25, gratuit: false },
      { jour: 11, titre: 'Fessiers et jambes solides', duree: 25, gratuit: false },
      { jour: 12, titre: 'Posture au quotidien',        duree: 25, gratuit: false },
      { jour: 13, titre: 'Prévention longue durée',     duree: 20, gratuit: false },
      { jour: 14, titre: 'Mon dos, mon allié',          duree: 25, gratuit: false },
    ]
  },

];

// Statistiques simulées pour la démo admin
const STATS_DEMO = {
  utilisateursActifs: 47,
  seancesCompletees: 312,
  objectifPrincipal: 'Réduire le stress',
  tauxAssiduite: 68,
  parEntreprise: [
    { nom: 'ACME Industries', actifs: 28, total: 35 },
    { nom: 'Démonstration', actifs: 19, total: 24 },
  ],
};

// ============ DASHBOARD RH ============
function DashboardRH({ onClose }) {
  const [stats, setStats] = useState(null);
  const [entrepriseSelectionnee, setEntrepriseSelectionnee] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerStats();
  }, []);

  const chargerStats = async () => {
    setChargement(true);

    // Charger toutes les séances réalisées
    const { data: seances } = await supabase
      .from('seances_realisees')
      .select('*')
      .order('created_at', { ascending: false });

    // Charger tous les profils
    const { data: profils } = await supabase
      .from('profils')
      .select('*');

    if (!seances || !profils) {
      setChargement(false);
      return;
    }

    // Grouper par entreprise
    const entreprises = {};
    
    profils.forEach(p => {
      const code = p.code_entreprise || 'demo';
      if (!entreprises[code]) {
        entreprises[code] = {
          code,
          utilisateurs: [],
          seances: [],
          duree_totale: 0,
        };
      }
      entreprises[code].utilisateurs.push(p);
    });

    seances.forEach(s => {
      const code = s.code_entreprise || 'demo';
      if (!entreprises[code]) {
        entreprises[code] = {
          code,
          utilisateurs: [],
          seances: [],
          duree_totale: 0,
        };
      }
      entreprises[code].seances.push(s);
      entreprises[code].duree_totale += s.duree_secondes || 0;
    });

    setStats(entreprises);
    setChargement(false);
  };

  const formatDuree = (secondes) => {
    const h = Math.floor(secondes / 3600);
    const m = Math.floor((secondes % 3600) / 60);
    return h > 0 ? `${h}h${m.toString().padStart(2,'0')}` : `${m} min`;
  };

  const debutMois = new Date();
  debutMois.setDate(1);
  debutMois.setHours(0, 0, 0, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto"
         style={{ backgroundColor: COLORS.backgroundCreamLight }}>
      
      {/* Header */}
      <div className="sticky top-0 z-10 px-6 py-4 flex items-center justify-between"
           style={{ background: COLORS.secondary }}>
        <div>
          <h1 className="text-xl font-bold" style={{ color: COLORS.backgroundCream }}>
            📊 Dashboard RH
          </h1>
          <p className="text-xs" style={{ color: COLORS.primary }}>
            {CLIENT.nom} · Statistiques entreprises
          </p>
        </div>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.1)', color: COLORS.backgroundCream }}>
          ×
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">

        {chargement ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4 animate-pulse">🪷</div>
            <p style={{ color: COLORS.textMedium }}>Chargement des statistiques...</p>
          </div>
        ) : !stats ? (
          <div className="text-center py-20">
            <p style={{ color: COLORS.textMedium }}>Aucune donnée disponible.</p>
          </div>
        ) : (
          <>
            {/* Vue globale */}
            <h2 className="text-lg font-bold mb-4" style={{ color: COLORS.secondary }}>
              Vue globale
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="rounded-2xl p-5 text-center"
                   style={{ background: 'white', border: '1px solid rgba(193,157,11,0.2)' }}>
                <div className="text-3xl font-bold" style={{ color: COLORS.secondary }}>
                  {Object.values(stats).reduce((a, e) => a + e.utilisateurs.length, 0)}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMedium }}>Utilisateurs</div>
              </div>
              <div className="rounded-2xl p-5 text-center"
                   style={{ background: 'white', border: '1px solid rgba(193,157,11,0.2)' }}>
                <div className="text-3xl font-bold" style={{ color: COLORS.secondary }}>
                  {Object.values(stats).reduce((a, e) => a + e.seances.length, 0)}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMedium }}>Séances totales</div>
              </div>
              <div className="rounded-2xl p-5 text-center"
                   style={{ background: 'white', border: '1px solid rgba(193,157,11,0.2)' }}>
                <div className="text-3xl font-bold" style={{ color: COLORS.secondary }}>
                  {formatDuree(Object.values(stats).reduce((a, e) => a + e.duree_totale, 0))}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMedium }}>Temps pratiqué</div>
              </div>
              <div className="rounded-2xl p-5 text-center"
                   style={{ background: 'white', border: '1px solid rgba(193,157,11,0.2)' }}>
                <div className="text-3xl font-bold" style={{ color: COLORS.secondary }}>
                  {Object.keys(stats).length}
                </div>
                <div className="text-xs mt-1" style={{ color: COLORS.textMedium }}>Entreprises</div>
              </div>
            </div>

            {/* Par entreprise */}
            <h2 className="text-lg font-bold mb-4" style={{ color: COLORS.secondary }}>
              Par entreprise
            </h2>
            <div className="grid gap-4">
              {Object.values(stats).map((e) => {
                const seancesMois = e.seances.filter(s =>
                  new Date(s.created_at) >= debutMois
                ).length;

                // Séances les plus populaires
                const compteurSeances = {};
                e.seances.forEach(s => {
                  const titre = s.seance_titre || 'Séance libre';
                  compteurSeances[titre] = (compteurSeances[titre] || 0) + 1;
                });
                const top3 = Object.entries(compteurSeances)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3);

                return (
                  <div key={e.code} className="rounded-2xl p-6"
                       style={{ background: 'white', border: '1px solid rgba(193,157,11,0.2)' }}>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg" style={{ color: COLORS.secondary }}>
                          {e.code === 'demo' ? '🎭 Utilisateurs démo' : `🏢 ${e.code}`}
                        </h3>
                        <p className="text-xs" style={{ color: COLORS.primary }}>
                          {e.utilisateurs.length} utilisateur{e.utilisateurs.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold" style={{ color: COLORS.secondary }}>
                          {e.seances.length}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.textMedium }}>
                          séances totales
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="rounded-xl p-3 text-center"
                           style={{ background: COLORS.backgroundCreamLight }}>
                        <div className="font-bold" style={{ color: COLORS.secondary }}>
                          {seancesMois}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.textMedium }}>ce mois</div>
                      </div>
                      <div className="rounded-xl p-3 text-center"
                           style={{ background: COLORS.backgroundCreamLight }}>
                        <div className="font-bold" style={{ color: COLORS.secondary }}>
                          {formatDuree(e.duree_totale)}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.textMedium }}>pratiqué</div>
                      </div>
                      <div className="rounded-xl p-3 text-center"
                           style={{ background: COLORS.backgroundCreamLight }}>
                        <div className="font-bold" style={{ color: COLORS.secondary }}>
                          {e.utilisateurs.length > 0
                            ? Math.round(e.seances.length / e.utilisateurs.length * 10) / 10
                            : 0}
                        </div>
                        <div className="text-xs" style={{ color: COLORS.textMedium }}>séances/user</div>
                      </div>
                    </div>

                    {top3.length > 0 && (
                      <div>
                        <p className="text-xs font-bold mb-2 uppercase tracking-wider"
                           style={{ color: COLORS.primary }}>
                          Séances préférées
                        </p>
                        {top3.map(([titre, count], i) => (
                          <div key={titre} className="flex items-center justify-between py-1">
                            <span className="text-sm" style={{ color: COLORS.textMedium }}>
                              {i + 1}. {titre}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                                  style={{ background: COLORS.backgroundCreamLight, color: COLORS.secondary }}>
                              {count}x
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============ COMPOSANT PRINCIPAL ============
export default function YogaApp() {
  const [vue, setVue] = useState('portail');
  const [acces, setAcces] = useState(null); // null | 'demo' | { entreprise, logo } | 'admin'
  const [profil, setProfil] = useState(null); // null | { prenom, email, objectif }
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargementAuth, setChargementAuth] = useState(true);
  const [profilUtilisateur, setProfilUtilisateur] = useState(null);
  const [chargementProfil, setChargementProfil] = useState(true);
  const [postureSelectionnee, setPostureSelectionnee] = useState(null);
  const [seanceActive, setSeanceActive] = useState(null);
  const [joursTermines, setJoursTermines] = useState(new Set());
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showProfilModal, setShowProfilModal] = useState(false);
  const [statsSeances, setStatsSeances] = useState({ total: 0, semaine: 0, streak: 0 });

  // États dynamiques modifiables par l'admin
  const [seances, setSeances] = useState(seancesParDefaut);
  const [programmes, setProgrammes] = useState(programmesInitiaux);
  const [codes, setCodes] = useState(CODES_VALIDES);
  const [postures, setPostures] = useState(posturesParDefaut);
  const [nouveauContenu, setNouveauContenu] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  // Incrémenté après chargement des couleurs depuis Supabase, pour forcer
  // un re-render de toute l'app une fois COLORS mis à jour (voir theme.js)
  const [themeVersion, setThemeVersion] = useState(0);

// Vérifier la session au démarrage et écouter les changements

// Charger les couleurs personnalisées depuis Supabase au démarrage
useEffect(() => {
  chargerThemeDepuisSupabase().then((chargeAvecSucces) => {
    if (chargeAvecSucces) setThemeVersion((v) => v + 1);
  });
}, []);

// Intercepter le prompt d'installation PWA (Android/Chrome)
useEffect(() => {
  const handler = (e) => {
    e.preventDefault();
    setInstallPrompt(e);
    setShowInstallBanner(true);
  };
  window.addEventListener('beforeinstallprompt', handler);
  return () => window.removeEventListener('beforeinstallprompt', handler);
}, []);

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUtilisateur(session?.user ?? null);
      setChargementAuth(false);
    });

    // Écouter les changements de session
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUtilisateur(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Charger le profil quand l'utilisateur change
  useEffect(() => {
    if (!utilisateur) {
      setProfilUtilisateur(null);
      return;
    }

    setChargementProfil(true);
    
  supabase
  .from('profils')
  .select('*')
  .eq('user_id', utilisateur.id)
  .maybeSingle()
  .then(({ data }) => {
    setProfilUtilisateur(data);
    setChargementProfil(false);
    // Si l'utilisateur a un code entreprise mémorisé, l'injecter
    if (data?.code_entreprise) {
      setAcces({ entreprise: data.code_entreprise });
    }
  });
  }, [utilisateur]);

  useEffect(() => {
  if (!utilisateur) return;
  supabase
    .from('seances_realisees')
    .select('*')
    .eq('user_id', utilisateur.id)
    .then(({ data }) => {
      if (!data) return;
      const total = data.length;
      const debutSemaine = new Date();
      debutSemaine.setDate(debutSemaine.getDate() - debutSemaine.getDay());
      debutSemaine.setHours(0, 0, 0, 0);
      const semaine = data.filter(s => new Date(s.created_at) >= debutSemaine).length;
      
      
// Calculer le streak (jours consécutifs)
const aujourd_hui = new Date();
aujourd_hui.setHours(0, 0, 0, 0);

let streak = 0;
let jourVerifie = new Date(aujourd_hui);

// Vérifier jour par jour en remontant
while (true) {
  const debutJour = new Date(jourVerifie);
  const finJour = new Date(jourVerifie);
  finJour.setHours(23, 59, 59, 999);

  const seanceCeJour = data.some(s => {
    const date = new Date(s.created_at);
    return date >= debutJour && date <= finJour;
  });

  if (seanceCeJour) {
    streak++;
    jourVerifie.setDate(jourVerifie.getDate() - 1);
  } else if (jourVerifie.getTime() === aujourd_hui.getTime()) {
    // Pas de séance aujourd'hui — on vérifie hier
    jourVerifie.setDate(jourVerifie.getDate() - 1);
    continue;
  } else {
    break;
  }
}

setStatsSeances({ total, semaine, streak });
    });
}, [utilisateur]);

  // Au démarrage, on charge les postures depuis Supabase
  useEffect(() => {
    async function chargerPostures() {
      const { data, error } = await supabase
      .from('postures')
      .select('*')
      .eq('publiee', true)
      .order('id', { ascending: true });

      if (error) {
        console.error('Erreur chargement postures:', error);
        return;
      }

      if (data && data.length > 0) {
        // On remappe les noms de colonnes Supabase vers le format de l'appli
const posturesFormatees = data.map(p => ({
          id: p.slug,
          nom: p.nom,
          nomFr: p.nom_fr,
          duree: p.duree,
          difficulte: p.difficulte,
          bienfaits: p.bienfaits,
          instructions: p.instructions,
          chakra: p.chakra,
            chakras: p.chakra ? p.chakra.split(',').map(c => c.trim()) : [],
            icone: p.icone,
          icone: p.icone,
          gratuit: p.gratuit,
          objectif: p.objectif,
          objectifs: p.objectifs ? p.objectifs.split(',').map(o => o.trim()) : [],
          urlImage: p.url_image,
          urlAudio: p.url_audio,
          urlVideo: p.url_video,
          createdAt: p.created_at,
          fonctions: p.fonctions ? p.fonctions.split(',').map(f => f.trim()) : ['pratique'],
            numeroDeck: p.numero_deck || '',
            bienfaitsTags: p.bienfaits_tags ? p.bienfaits_tags.split(',').map(t => t.trim()) : [],
            precautions: p.precautions || '',
      }));
      
        setPostures(posturesFormatees);
      }
    }
    chargerPostures();
  }, []);
  // Au démarrage, on charge les séances depuis Supabase
  useEffect(() => {
    async function chargerSeances() {
      const { data, error } = await supabase
        .from('seances')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erreur chargement séances:', error);
        return;
      }

      if (data && data.length > 0) {
        const seancesFormatees = data.map(s => ({
          id: s.slug,
          titre: s.titre,
          duree: s.duree,
          icone: s.icone,
          description: s.description,
          gratuit: s.gratuit,
          objectif: s.objectif,
          postures: s.postures ? s.postures.split(',').map(p => p.trim()) : [],
          createdAt: s.created_at,
        }));
        setSeances(seancesFormatees);
      }
    }
  chargerSeances();
  }, []);

  // Au démarrage, on charge les programmes depuis Supabase
  useEffect(() => {
    async function chargerProgrammes() {
      const { data, error } = await supabase
        .from('programmes')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erreur chargement programmes:', error);
        return;
      }

      if (data && data.length > 0) {
        const programmesFormates = data.map(p => ({
          id: p.slug,
          titre: p.titre,
          sousTitre: p.sous_titre,
          description: p.description,
          objectifFiltrer: p.objectif_filtrer,
          jours: p.jours || [],
        }));
        setProgrammes(programmesFormates);
      }
    }
    chargerProgrammes();
  }, []);

  // Au démarrage, on charge les codes entreprise depuis Supabase
  useEffect(() => {
    async function chargerCodes() {
      const { data, error } = await supabase
        .from('codes_entreprise')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Erreur chargement codes entreprise:', error);
        return;
      }

      if (data) {
        const codesFormates = {};
        data.forEach((c) => {
          codesFormates[c.code] = { entreprise: c.libelle, logo: '◆', isAdmin: c.is_admin };
        });
        setCodes(codesFormates);
      }
    }
    chargerCodes();
  }, []);

  // Détecter s'il y a du contenu récent (posture ou séance) non encore vu
  useEffect(() => {
    if (postures.length === 0 && seances.length === 0) return;

    const seuilJours = 7;
    const limiteDate = new Date();
    limiteDate.setDate(limiteDate.getDate() - seuilJours);

    const dernierAjoutPosture = postures
      .map(p => p.createdAt)
      .filter(Boolean)
      .sort()
      .reverse()[0];

    const dernierAjoutSeance = seances
      .map(s => s.createdAt)
      .filter(Boolean)
      .sort()
      .reverse()[0];

const dateLaPlusRecente = [dernierAjoutPosture, dernierAjoutSeance]
  .filter(Boolean)
  .sort()
  .reverse()[0];

if (!dateLaPlusRecente) return;

const estRecent = new Date(dateLaPlusRecente) >= limiteDate;
const dejaVu = localStorage.getItem('sara_derniere_nouveaute_vue') === dateLaPlusRecente;

if (estRecent && !dejaVu) {
  const type = dateLaPlusRecente === dernierAjoutPosture ? 'posture' : 'seance';
  setNouveauContenu({ date: dateLaPlusRecente, type });
}
  }, [postures, seances]);

  const aAcces = acces !== null && acces !== 'admin';
useEffect(() => {
  if (aAcces && (vue === 'portail' || vue === undefined)) {
    setVue('accueil');
  }
}, [aAcces]);
  const aAccesComplet = acces && acces !== 'demo' && acces !== 'admin';
  const aProfil = profil !== null;
  const estAdmin = acces === 'admin';

  // Si en train de charger, afficher un loader
  if (chargementAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: COLORS.backgroundCreamLight }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🪷</div>
          <p style={{ color: COLORS.textMedium }}>Chargement...</p>
        </div>
      </div>
    );
  }

  // Si pas connecté, afficher l'écran de connexion
  if (!utilisateur) {
    return <Connexion />;
  }

  // Si le profil est en cours de chargement, afficher loader
  if (utilisateur && chargementProfil) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ backgroundColor: COLORS.backgroundCreamLight }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🪷</div>
          <p style={{ color: COLORS.textMedium }}>Chargement...</p>
        </div>
      </div>
    );
  }

  // Si connecté mais pas encore de profil, afficher l'onboarding
  if (utilisateur && !chargementProfil && profilUtilisateur === null) {
    return <Onboarding 
      user={utilisateur} 
      onComplete={() => {
        supabase
          .from('profils')
          .select('*')
          .eq('user_id', utilisateur.id)
          .maybeSingle()
          .then(({ data }) => setProfilUtilisateur(data));
      }} 
    />;
  }

if (utilisateur && !chargementProfil && profilUtilisateur === null) {
  return <Onboarding 
    user={utilisateur} 
    onComplete={() => {
      supabase
        .from('profils')
        .select('*')
        .eq('user_id', utilisateur.id)
        .maybeSingle()
        .then(({ data }) => setProfilUtilisateur(data));
    }} 
  />;
}

  return (
    <div className="min-h-screen" style={{
      background: `linear-gradient(180deg, ${COLORS.backgroundCream} 0%, ${COLORS.backgroundBeige} 100%)`,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes breathe { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.15); opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .fade-up { animation: fadeUp 0.6s ease-out forwards; }
        .breathe { animation: breathe 4s ease-in-out infinite; }
        .float { animation: float 3s ease-in-out infinite; }
        .grain { position: relative; }
        .grain::after { content: ''; position: absolute; inset: 0; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E"); opacity: 0.06; pointer-events: none; mix-blend-mode: multiply; }
        .card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -15px rgba(193, 157, 11, 0.2); }
        button { cursor: pointer; }
        .locked-blur { filter: blur(2px); opacity: 0.6; }
      `}</style>

      {/* Modale code d'accès */}
      {showCodeModal && (
        <ModaleCode
          codes={codes}
          onClose={() => setShowCodeModal(false)}
          onSuccess={(info) => {
            setShowCodeModal(false);
            if (info === 'admin') {
              setAcces('admin');
              setVue('admin');
            } else {
              setAcces(info);
              setVue('accueil');
              if (!profil) setShowProfilModal(true);
            }
          }}
        />
      )}

      {/* Modale profil (inscription / édition) */}
      {showProfilModal && (
        <ModaleProfil
          profil={profil}
          onClose={() => setShowProfilModal(false)}
          onSave={(p) => { setProfil(p); setShowProfilModal(false); }}
          utilisateur={utilisateur}
        />
      )}

      {/* Vue portail (sans accès) */}
      {!aAcces && !estAdmin && vue === 'portail' && (
        <Portail
          onCode={() => setShowCodeModal(true)}
          onDemo={() => { setAcces('demo'); setVue('accueil'); setShowProfilModal(true); }}
          onRH={() => setVue('rh')}
        />
      )}

      {/* Vue RH (accessible sans connexion) */}
      {vue === 'rh' && (
        <PageRH onClose={() => setVue(aAcces ? 'accueil' : 'portail')} />
      )}

      {/* Dashboard RH admin */}
{vue === 'dashboard' && (
  <DashboardRH onClose={() => setVue('accueil')} />
)}

      {/* Vue ADMIN */}
      {estAdmin && (
        <Admin
          seances={seances} setSeances={setSeances}
          programmes={programmes} setProgrammes={setProgrammes}
          codes={codes} setCodes={setCodes}
          postures={postures}
          onQuitter={() => { setAcces(null); setVue('portail'); }}
          onThemeChange={() => setThemeVersion((v) => v + 1)}
        />
      )}

      {/* Vue séance en cours */}
     {seanceActive && aAcces && (
  <SeanceEnCours seance={seanceActive} onClose={() => setSeanceActive(null)} onTermine={seanceActive?.onTermine} profil={profil} postures={postures} utilisateur={utilisateur} />
      )}

      {/* App principale (avec accès) */}
      {aAcces && !seanceActive && vue !== 'rh' && (
        <>
          <Navigation vue={vue} setVue={setVue} acces={acces} profil={profil} programmes={programmes} onEditProfil={() => setShowProfilModal(true)} onDeconnexion={async () => { await supabase.auth.signOut(); setUtilisateur(null); setProfilUtilisateur(null); setAcces(null); setProfil(null); setVue('portail'); }} />
          <main className="max-w-5xl mx-auto px-6 pb-20">
            {vue === 'accueil' && <Accueil setVue={setVue} setSeanceActive={setSeanceActive} acces={acces} aAccesComplet={aAccesComplet} profil={profil || profilUtilisateur} seances={seances} postures={postures} statsSeances={statsSeances} nouveauContenu={nouveauContenu} 
            onVuNouveaute={() => { if (nouveauContenu) { localStorage.setItem('sara_derniere_nouveaute_vue', nouveauContenu.date); setNouveauContenu(null); } }}
             />}             {vue === 'postures' && <Postures postureSelectionnee={postureSelectionnee} setPostureSelectionnee={setPostureSelectionnee} aAccesComplet={aAccesComplet} onUnlock={() => setShowCodeModal(true)} postures={postures} />}
            {vue === 'seances' && <Seances setSeanceActive={setSeanceActive} aAccesComplet={aAccesComplet} onUnlock={() => setShowCodeModal(true)} profil={profil} seances={seances} />}
            {vue === 'programme' && <Programme joursTermines={joursTermines} setJoursTermines={setJoursTermines} aAccesComplet={aAccesComplet} onUnlock={() => setShowCodeModal(true)} profil={profil} programmes={programmes} setSeanceActive={setSeanceActive} postures={postures} />}
            {vue === 'maseance' && <MaSeance postures={postures} setSeanceActive={setSeanceActive} profil={profil} aAccesComplet={aAccesComplet} onUnlock={() => setShowCodeModal(true)} />}
          </main>

          {/* Footer légal */}
          <footer className="text-center py-6 mt-4" style={{ borderTop: '1px solid rgba(193, 157, 11, 0.2)' }}>
            <div className="flex justify-center gap-6 flex-wrap">
              <a href={CLIENT.urlConfidentialite} target="_blank" rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase hover:underline"
                style={{ color: COLORS.primary }}>
                Confidentialité
              </a>
              <a href={CLIENT.urlMentions} target="_blank" rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase hover:underline"
                style={{ color: COLORS.primary }}>
                Mentions légales
              </a>
              <a href={CLIENT.urlCGU} target="_blank" rel="noopener noreferrer"
                className="text-xs tracking-widest uppercase hover:underline"
                style={{ color: COLORS.primary }}>
                CGU
              </a>
            </div>
            <p className="text-xs mt-2" style={{ color: COLORS.textMuted }}>
              © {CLIENT.anneeCopyright} {CLIENT.proprietaire} · {CLIENT.nom} · {CLIENT.ville}
            </p>
          </footer>
        </>
      )}
    
    {/* Bannière d'installation PWA */}
{showInstallBanner && (
  <div
    className="fixed bottom-0 left-0 right-0 z-50 p-4"
    style={{ background: 'rgba(30,41,89,0.97)', backdropFilter: 'blur(8px)' }}
  >
    <div className="max-w-lg mx-auto flex items-center gap-3">
      <span className="text-2xl flex-shrink-0">🪷</span>
      <div className="flex-1">
        <p className="text-sm font-medium" style={{ color: COLORS.backgroundCreamLight }}>
          Installer {CLIENT.nom} sur votre téléphone
        </p>
        <p className="text-xs" style={{ color: 'rgba(251,246,236,0.6)' }}>
          Accès rapide depuis votre écran d'accueil
        </p>
      </div>
      <button
        onClick={async () => {
          if (installPrompt) {
            await installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            if (outcome === 'accepted') setShowInstallBanner(false);
          }
        }}
        className="px-4 py-2 rounded-full text-xs font-medium flex-shrink-0"
        style={{ background: COLORS.primary, color: COLORS.backgroundCreamLight }}
      >
        Installer →
      </button>
      <button
        onClick={() => setShowInstallBanner(false)}
        className="text-xl flex-shrink-0"
        style={{ color: 'rgba(251,246,236,0.4)' }}
      >
        ✕
      </button>
    </div>
  </div>
)}
    
    </div>
  );
}

// ============ PORTAIL D'ENTRÉE ============
function Portail({ onCode, onDemo, onRH }) {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="max-w-5xl mx-auto px-6 pt-10 w-full">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt={CLIENT.nom} className="w-12 h-12 rounded-full object-cover" style={{ boxShadow: '0 4px 12px rgba(30, 41, 89, 0.2)' }} />
          <div>
            <h1 className="font-display text-3xl tracking-wide" style={{ color: COLORS.textDark, lineHeight: 1 }}>{CLIENT.nom}</h1>
            <p className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: COLORS.primary }}>{CLIENT.activite}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-3xl w-full text-center fade-up">
          <img src={LOGO_URL} alt={CLIENT.nom} className="w-32 h-32 rounded-full object-cover mx-auto mb-8 float" style={{ boxShadow: '0 20px 40px -10px rgba(30, 41, 89, 0.3)', border: '4px solid rgba(255,255,255,0.6)' }} />
          <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: COLORS.primary }}>Bienvenue</p>
          <h2 className="font-display text-5xl md:text-6xl mb-6" style={{ color: COLORS.textDark, fontWeight: 300, lineHeight: 1.1 }}>
            Une pratique douce,<br /><em style={{ color: COLORS.primary }}>offerte par votre entreprise.</em>
          </h2>
          <p className="max-w-lg mx-auto text-base mb-4 leading-relaxed" style={{ color: COLORS.textMedium }}>
            {CLIENT.nom} accompagne les équipes entre les séances en présentiel.
            Quelques minutes par jour, à votre rythme, où que vous soyez.
          </p>
          <p className="max-w-md mx-auto text-sm italic mb-12 leading-relaxed" style={{ color: COLORS.primary }}>
            Une pratique simple, accessible où que vous soyez.
          </p>

          <div className="grid md:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Carte salarié */}
            <button onClick={onCode} className="card-hover p-8 rounded-3xl text-left grain" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(193, 157, 11, 0.3)' }}>
              <KeyRound size={28} strokeWidth={1.2} style={{ color: COLORS.primary }} />
              <h3 className="font-display text-2xl mt-5 mb-2" style={{ color: COLORS.textDark }}>J'ai un code entreprise</h3>
              <p className="text-sm mb-4" style={{ color: COLORS.textMedium }}>Mon employeur a souscrit aux séances. J'accède à l'appli en illimité.</p>
              <span className="text-xs tracking-widest uppercase flex items-center gap-2" style={{ color: COLORS.textDark }}>Entrer mon code <ArrowRight size={14} /></span>
            </button>

            {/* Carte RH */}
            <button onClick={onRH} className="card-hover p-8 rounded-3xl text-left grain" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(193, 157, 11, 0.3)' }}>
              <Building2 size={28} strokeWidth={1.2} style={{ color: COLORS.primary }} />
              <h3 className="font-display text-2xl mt-5 mb-2" style={{ color: COLORS.textDark }}>Je suis RH ou dirigeant·e</h3>
              <p className="text-sm mb-4" style={{ color: COLORS.textMedium }}>J'aimerais offrir ces séances à mes équipes — dans le cadre de notre démarche QVT.</p>
              <span className="text-xs tracking-widest uppercase flex items-center gap-2" style={{ color: COLORS.textDark }}>Découvrir l'offre <ArrowRight size={14} /></span>
            </button>
          </div>

          <div className="mt-10">
            <button onClick={onDemo} className="text-sm tracking-widest uppercase hover:underline" style={{ color: COLORS.primary }}>
              Ou simplement essayer la démo gratuite →
            </button>
          </div>
        </div>
      </div>

      <footer className="px-6 pb-8 text-center text-xs tracking-widest uppercase" style={{ color: COLORS.primary }}>
        {CLIENT.siteUrl.replace('https://', '')} · {CLIENT.ville} & Var
      </footer>
    </div>
  );
}

// ============ MODALE CODE ============
function ModaleCode({ codes, onClose, onSuccess }) {
  const [code, setCode] = useState('');
  const [erreur, setErreur] = useState('');

const valider = async () => {
    const c = code.trim().toUpperCase();
    setErreur('');

    const { data, error } = await supabase
      .from('codes_entreprise')
      .select('*')
      .eq('code', c)
      .eq('actif', true)
      .maybeSingle();

    if (error) {
      setErreur('Erreur de connexion à la base. Réessayez.');
      console.error(error);
      return;
    }

    if (!data) {
      setErreur('Code non reconnu. Vérifiez auprès de votre RH.');
      return;
    }

    if (data.is_admin) {
      onSuccess('admin');
    } else {
      onSuccess({ entreprise: data.libelle, logo: '🪷' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: 'rgba(30, 41, 89, 0.5)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-md w-full p-10 rounded-3xl fade-up" style={{ background: COLORS.backgroundCream }}>
        <button onClick={onClose} className="float-right" style={{ color: COLORS.primary }}><X size={20} /></button>
        <KeyRound size={32} strokeWidth={1.2} style={{ color: COLORS.primary }} />
        <h3 className="font-display text-3xl mt-4 mb-3" style={{ color: COLORS.textDark }}>Votre code d'accès</h3>
        <p className="text-sm mb-6" style={{ color: COLORS.textMedium }}>Saisissez le code transmis par votre entreprise pour débloquer l'appli en illimité.</p>
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value); setErreur(''); }}
          onKeyDown={(e) => e.key === 'Enter' && valider()}
          placeholder="ex. PILATE-DEMO"
          className="w-full px-5 py-4 rounded-full text-center tracking-widest uppercase"
          style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(193, 157, 11, 0.35)', color: COLORS.textDark, outline: 'none' }}
        />
        {erreur && <p className="text-sm mt-3 text-center" style={{ color: COLORS.textAccent }}>{erreur}</p>}
        <button onClick={valider} className="w-full mt-6 px-8 py-4 rounded-full text-sm tracking-widest uppercase" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
          Valider
        </button>
        <p className="text-xs text-center mt-6" style={{ color: COLORS.primary }}>
          Salariés : {Object.keys(codes).join(' · ')}
        </p>
        <p className="text-xs text-center mt-2" style={{ color: COLORS.secondary, opacity: 0.6 }}>
          Espace admin : ADMIN-PAULINE
        </p>
      </div>
    </div>
  );
}

// ============ MODALE PROFIL (inscription / édition) ============
function ModaleProfil({ profil, onClose, onSave, utilisateur }) {
  const [prenom, setPrenom] = useState(profil?.prenom || '');
  const [email, setEmail] = useState(profil?.email || '');
  const [objectif, setObjectif] = useState(profil?.objectif || '');
  const [erreur, setErreur] = useState('');

  const objectifs = VOCAB.objectifs.liste;

  const valider = () => {
    if (!prenom.trim()) {
      setErreur('Votre prénom est nécessaire pour personnaliser votre pratique.');
      return;
    }
    if (!objectif) {
      setErreur('Choisissez un objectif (vous pourrez le changer plus tard).');
      return;
    }
    onSave({ prenom: prenom.trim(), email: email.trim(), objectif });
  };

  const estEdition = profil !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 py-10 overflow-y-auto" style={{ background: 'rgba(30, 41, 89, 0.5)', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-lg w-full p-10 rounded-3xl fade-up my-auto" style={{ background: COLORS.backgroundCream }}>
        {estEdition && (
          <button onClick={onClose} className="float-right" style={{ color: COLORS.primary }}><X size={20} /></button>
        )}
        <User size={32} strokeWidth={1.2} style={{ color: COLORS.primary }} />
        <h3 className="font-display text-3xl mt-4 mb-2" style={{ color: COLORS.textDark }}>
          {estEdition ? 'Mon profil' : 'Faisons connaissance'}
        </h3>
        <p className="text-sm mb-6" style={{ color: COLORS.textMedium }}>
          {estEdition
            ? 'Modifiez vos informations à tout moment.'
            : "Quelques détails pour personnaliser votre pratique — c'est juste pour vous, rien n'est partagé."}
        </p>

        {/* Prénom */}
        <label className="text-xs tracking-[0.2em] uppercase mb-2 block" style={{ color: COLORS.primary }}>Prénom *</label>
        <input
          type="text"
          value={prenom}
          onChange={(e) => { setPrenom(e.target.value); setErreur(''); }}
          placeholder="Marie"
          className="w-full px-5 py-3 rounded-full mb-5"
          style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(193, 157, 11, 0.35)', color: COLORS.textDark, outline: 'none' }}
        />

        {/* Email */}
        <label className="text-xs tracking-[0.2em] uppercase mb-2 block" style={{ color: COLORS.primary }}>E-mail (optionnel)</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="marie@exemple.fr"
          className="w-full px-5 py-3 rounded-full mb-5"
          style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(193, 157, 11, 0.35)', color: COLORS.textDark, outline: 'none' }}
        />

        {/* Objectif */}
        <label className="text-xs tracking-[0.2em] uppercase mb-3 block" style={{ color: COLORS.primary }}>Votre objectif *</label>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {objectifs.map((o) => (
            <button
              key={o.id}
              onClick={() => { setObjectif(o.id); setErreur(''); }}
              className="px-4 py-3 rounded-2xl text-sm text-left transition-all flex items-center gap-2"
              style={{
                background: objectif === o.id ? `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)` : 'rgba(255,255,255,0.6)',
                color: objectif === o.id ? COLORS.backgroundCream : COLORS.textDark,
                border: `1px solid ${objectif === o.id ? 'transparent' : 'rgba(193, 157, 11, 0.25)'}`,
                fontWeight: objectif === o.id ? 500 : 400,
              }}
            >
              <span className="text-lg">{o.icone}</span>
              <span className="text-xs">{o.label}</span>
            </button>
          ))}
        </div>

        {erreur && <p className="text-sm mb-3 text-center" style={{ color: COLORS.textAccent }}>{erreur}</p>}

<button onClick={valider} className="w-full px-8 py-4 rounded-full text-sm tracking-widest uppercase" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
          {estEdition ? 'Enregistrer' : 'Commencer ma pratique'}
        </button>

        {/* Bouton suppression compte — uniquement en mode édition */}
        {estEdition && utilisateur && (
          <button
            onClick={async () => {
              const confirme = window.confirm(
                "⚠️ Supprimer votre compte supprimera définitivement toutes vos données (profil, historique de séances). Cette action est irréversible. Continuer ?"
              );
              if (!confirme) return;

              await supabase
                .from('profils')
                .delete()
                .eq('user_id', utilisateur.id);

              await supabase.auth.signOut();
              onClose();
            }}
            className="w-full mt-4 text-xs tracking-widest uppercase hover:underline"
            style={{ color: COLORS.chakraRacine }}
          >
            Supprimer mon compte
          </button>
        )}

      </div>
    </div>
  );
}

// ============ PAGE RH ============
function PageRH({ onClose }) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 fade-up">
      <button onClick={onClose} className="text-sm tracking-widest uppercase mb-8 hover:underline" style={{ color: COLORS.primary }}>← Retour</button>

      <div className="text-center mb-16">
        <img src={LOGO_URL} alt={CLIENT.nom} className="w-24 h-24 rounded-full object-cover mx-auto mb-6" style={{ boxShadow: '0 12px 30px -8px rgba(30, 41, 89, 0.3)', border: '3px solid rgba(255,255,255,0.6)' }} />
        <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: COLORS.primary }}>Yoga en entreprise</p>
        <h1 className="font-display text-5xl md:text-6xl mb-6" style={{ color: COLORS.textDark, fontWeight: 300, lineHeight: 1.1 }}>
          Respirer. <em style={{ color: COLORS.primary }}>Ensemble.</em>
        </h1>
        <p className="max-w-xl mx-auto leading-relaxed" style={{ color: COLORS.textMedium }}>
          {CLIENT.activite} — séances hebdomadaires en présentiel,
          prolongées par un accès illimité à l'appli {CLIENT.nom} pour vos collaborateurs.
        </p>
      </div>

      {/* Citation */}
      <div className="text-center mb-16 p-10 rounded-3xl" style={{ background: 'rgba(255,255,255,0.5)' }}>
        <span className="font-display text-5xl block" style={{ color: COLORS.primaryLight }}>"</span>
        <p className="font-display text-xl italic max-w-xl mx-auto" style={{ color: COLORS.textMedium }}>
          Un salarié épuisé n'a pas besoin d'un cours sportif de plus. Il a besoin d'un espace où poser son téléphone,
          sentir sa respiration, et repartir avec quelque chose en moins — la tension.
        </p>
        <p className="text-xs tracking-[0.2em] uppercase mt-4" style={{ color: COLORS.primary }}>— {CLIENT.nom}</p>
      </div>

      {/* Ce que vous obtenez */}
      <h2 className="font-display text-3xl mb-8" style={{ color: COLORS.textDark }}>Ce que vos équipes obtiennent</h2>
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {[
          { icone: Heart, titre: 'Séances en présentiel', desc: 'Une intervention hebdomadaire ou bimensuelle dans vos locaux, 1h par séance.' },
          { icone: Wind, titre: `Appli ${CLIENT.nom} incluse`, desc: 'Accès illimité à toutes les postures, séances et programmes — pour prolonger la pratique entre les cours.' },
          { icone: Sparkles, titre: 'Bilan trimestriel', desc: 'Un point régulier avec vos RH pour ajuster la pratique aux besoins de l\'équipe.' },
        ].map((b, i) => {
          const Ic = b.icone;
          return (
            <div key={i} className="p-6 rounded-2xl grain" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(193, 157, 11, 0.2)' }}>
              <Ic size={24} strokeWidth={1.2} style={{ color: COLORS.primary }} />
              <h3 className="font-display text-xl mt-4 mb-2" style={{ color: COLORS.textDark }}>{b.titre}</h3>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textMedium }}>{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Tarifs */}
      <h2 className="font-display text-3xl mb-8" style={{ color: COLORS.textDark }}>Les formats</h2>
      <div className="grid md:grid-cols-3 gap-5 mb-16">
        {[
          { titre: 'Séance régulière', prix: '100 €', unite: '/ séance d\'1h', desc: 'Hebdomadaire ou bimensuelle. Le format le plus impactant — engagement 3 mois minimum.' },
          { titre: 'Atelier thématique', prix: '180 €', unite: '/ atelier 1h30', desc: 'Gestion du stress, sommeil, respiration. Idéal pour journée QVT ou séminaire.' },
          { titre: 'Journée bien-être', prix: 'Sur devis', unite: '', desc: 'Intervention sur-mesure dans le cadre d\'un séminaire ou événement d\'équipe.' },
        ].map((t, i) => (
          <div key={i} className="p-8 rounded-2xl grain" style={{ background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(193, 157, 11, 0.2)' }}>
            <h3 className="font-display text-2xl mb-3" style={{ color: COLORS.textDark }}>{t.titre}</h3>
            <p className="font-display text-4xl mb-1" style={{ color: COLORS.primary }}>{t.prix}</p>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.primary }}>{t.unite}</p>
            <p className="text-sm leading-relaxed" style={{ color: COLORS.textMedium }}>{t.desc}</p>
          </div>
        ))}
      </div>

      {/* Découverte */}
      <div className="p-10 rounded-3xl text-center grain mb-12" style={{ background: 'linear-gradient(135deg, rgba(240, 215, 122, 0.4) 0%, rgba(193, 157, 11, 0.3) 100%)' }}>
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>Séance découverte</p>
        <h3 className="font-display text-3xl mb-4" style={{ color: COLORS.textDark }}>
          45 minutes pour <em style={{ color: COLORS.primary }}>vous convaincre</em>
        </h3>
        <p className="max-w-md mx-auto mb-6 text-sm" style={{ color: COLORS.textMedium }}>
          Le plus simple est souvent de tester. Je propose une séance découverte à <strong>50 €</strong> pour une partie de votre équipe.
        </p>
      </div>

      {/* Contact */}
      <div className="text-center">
        <h3 className="font-display text-2xl mb-6" style={{ color: COLORS.textDark }}>Échangeons</h3>
        <div className="flex justify-center gap-3 flex-wrap">
          <a href="https://www.Share2.com" target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full text-sm tracking-widest uppercase flex items-center gap-2" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
            <Share2 size={16} /> Me contacter sur Share2
          </a>
          <a href={CLIENT.siteUrl} target="_blank" rel="noopener noreferrer" className="px-6 py-3 rounded-full text-sm tracking-widest uppercase flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.7)', color: COLORS.textDark }}>
            <Globe size={16} /> {CLIENT.siteUrl.replace('https://', '')}
          </a>
        </div>
        <p className="text-xs mt-6 tracking-widest uppercase" style={{ color: COLORS.primary }}>{CLIENT.ville} · {CLIENT.activite}</p>
      </div>
    </div>
  );
}

// ============ NAVIGATION ============



function Navigation({ vue, setVue, acces, profil, programmes, onEditProfil, onDeconnexion }) {
  const items = [
    { id: 'accueil', label: VOCAB.navigation.accueil },
    { id: 'postures', label: VOCAB.posture.pluriel },
    { id: 'seances', label: VOCAB.seance.pluriel },
    { id: 'programme', label: VOCAB.programme.pluriel },
    { id: 'maseance', label: VOCAB.navigation.maSeance },
  ];

  return (
    <header className="max-w-5xl mx-auto px-6 pt-10 pb-8">
      {/* Bandeau entreprise */}
      {acces && acces !== 'demo' && (
        <div className="mb-6 px-5 py-3 rounded-full inline-flex items-center gap-3 text-sm" style={{ background: 'rgba(193, 157, 11, 0.2)', color: COLORS.textMedium }}>
          <span className="text-lg">{acces.logo}</span>
          <span>Accès offert par <strong>{acces.entreprise}</strong></span>
        </div>
      )}
      {acces === 'demo' && (
        <div className="mb-6 px-5 py-3 rounded-full inline-flex items-center gap-3 text-sm" style={{ background: 'rgba(193, 157, 11, 0.2)', color: COLORS.textMedium }}>
          <Lock size={14} /> <span>Mode démo — accès limité</span>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} alt={CLIENT.nom} className="w-12 h-12 rounded-full object-cover" style={{ boxShadow: '0 4px 12px rgba(30, 41, 89, 0.2)' }} />
          <div>
            <h1 className="font-display text-3xl tracking-wide" style={{ color: COLORS.textDark, lineHeight: 1 }}>{CLIENT.nom}</h1>
            <p className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: COLORS.primary }}>{CLIENT.activite}</p>
          </div>
        </div>
        <nav className="flex gap-1 p-1 rounded-full flex-wrap items-center" style={{ background: 'rgba(255,255,255,0.4)' }}>
          {items.map((item) => (
            <button key={item.id} onClick={() => setVue(item.id)} className="px-5 py-2 rounded-full text-sm transition-all"
              style={{ background: vue === item.id ? COLORS.secondary : 'transparent', color: vue === item.id ? COLORS.backgroundCream : COLORS.textDark, fontWeight: vue === item.id ? 500 : 400 }}>
              {item.label}
            </button>
          ))}
          {profil && (
            <button onClick={onEditProfil} className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-105" style={{ background: 'rgba(193, 157, 11, 0.2)', color: COLORS.secondary }} title={`Profil de ${profil.prenom}`}>
              <User size={16} />
            </button>
          )}

          {/* Accès admin dashboard */}
  {acces && profil?.email === CLIENT.emailContact && ( 
  <button
    onClick={() => setVue('dashboard')}
    className="text-xs px-3 py-1 rounded-full"
    style={{ background: 'rgba(193,157,11,0.2)', color: COLORS.primary }}
  >
    📊
  </button>
)}
          <button onClick={onDeconnexion} className="px-3 py-2 text-xs tracking-widest uppercase" style={{ color: COLORS.primary }}>Sortir</button>
        </nav>
      </div>
    </header>
  );
}

// ============ ACCUEIL ============
function Accueil({ setVue, setSeanceActive, acces, aAccesComplet, profil, seances, postures, statsSeances, nouveauContenu, onVuNouveaute }) {
  const heure = new Date().getHours();
  const salutation = heure < 12 ? 'Namasté' : heure < 18 ? 'Bel après-midi' : 'Douce soirée';
  const seanceJour = seances[0];

  const suggestionObjectif = {
    stress: { id: 'antistress', message: 'Idéale pour relâcher la pression' },
    sommeil: { id: 'sommeil', message: 'Préparez votre nuit en douceur' },
    energie: { id: 'matin', message: 'Pour démarrer en pleine forme' },
    souplesse: { id: 'matin', message: 'Étirez votre corps en conscience' },
    centrage: { id: 'respiration', message: 'Revenez à votre centre' },
    decouvrir: { id: 'matin', message: 'Une belle première séance' },
  };
  const suggestion = profil?.objectif 
  ? suggestionObjectif[profil.objectif] 
  : profil?.objectif_principal 
    ? suggestionObjectif[profil.objectif_principal] 
    : null;
  const seanceSuggeree = suggestion ? seances.find((s) => s.id === suggestion.id) || seanceJour : seanceJour;
  const seanceAccessible = aAccesComplet || seanceSuggeree.gratuit ? seanceSuggeree : seanceJour;

return (
  <div className="fade-up">

  {nouveauContenu && (
  <div
    onClick={() => {
      setVue(nouveauContenu.type === 'posture' ? 'postures' : 'seances');
      onVuNouveaute();
    }}
    className="cursor-pointer text-center py-3 px-6 mb-2 text-sm font-medium"
    style={{ background: `linear-gradient(90deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)`, color: COLORS.backgroundCreamLight }}
  >
    {nouveauContenu.type === 'posture'
      ? '✨ Nouvelle posture disponible — découvrez-la !'
      : '✨ Nouvelle séance disponible — découvrez-la !'}
  </div>
)}

    <section className="py-12 md:py-16 text-center relative grain">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full opacity-30" style={{ background: `radial-gradient(circle, ${COLORS.primarySoft} 0%, transparent 70%)` }} />
        </div>
        <div className="relative">
         <p className="text-sm tracking-[0.3em] uppercase mb-6" style={{ color: COLORS.primary }}>
  {salutation}{profil?.prenom ? `, ${profil.prenom}` : ''}
</p>

{statsSeances?.total > 0 && (
  <div className="flex flex-col items-center gap-2 mb-6">

    {/* Streak */}
    {statsSeances.streak > 1 && (
      <div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold"
        style={{ background: 'rgba(193, 157, 11, 0.15)', color: COLORS.primary }}
      >
        🔥 {statsSeances.streak} jours consécutifs !
      </div>
    )}

    {/* Compteur séances */}
    <div
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-base font-medium"
      style={{ background: 'rgba(193, 157, 11, 0.08)', color: COLORS.primary }}
    >
      🪷 {statsSeances.semaine > 0
        ? `${statsSeances.semaine} séance${statsSeances.semaine > 1 ? 's' : ''} cette semaine`
        : `${statsSeances.total} séance${statsSeances.total > 1 ? 's' : ''} au total`
      }
    </div>

  </div>
)}
          <h2 className="font-display text-5xl md:text-7xl mb-6" style={{ color: COLORS.textDark, lineHeight: 1.1, fontWeight: 300 }}>
            Respirez.<br />
            <em style={{ color: COLORS.primary }}>Étirez-vous.</em><br />
            Revenez à vous.
          </h2>
          {suggestion ? (
            <p className="max-w-md mx-auto text-base mb-10 leading-relaxed" style={{ color: COLORS.textMedium }}>
              {suggestion.message} — la séance <em>« {seanceAccessible.titre} »</em> vous attend.
            </p>
          ) : (
            <p className="max-w-md mx-auto text-base mb-10 leading-relaxed" style={{ color: COLORS.textMedium }}>
              {aAccesComplet ? 'Votre pratique complète vous attend.' : "Découvrez l'appli avec quelques séances gratuites."}
            </p>
          )}
          <button onClick={() => setSeanceActive(seanceAccessible)} className="px-8 py-4 rounded-full text-sm tracking-widest uppercase transition-all hover:scale-105"
            style={{ background: COLORS.secondary, color: COLORS.backgroundCream, boxShadow: '0 10px 30px -10px rgba(30, 41, 89, 0.4)' }}>
            Commencer la séance du jour
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-12">
        {[
          { icone: Heart, titre: VOCAB.posture.pluriel, desc: `${postures.length} ${VOCAB.posture.pluriel.toLowerCase()} fondamentales`, vue: 'postures' },
          { icone: Sparkles, titre: 'Séances', desc: `${seances.length} pratiques guidées`, vue: 'seances' },
          { icone: Sun, titre: 'Programmes', desc: 'Plusieurs parcours', vue: 'programme' },
        ].map((carte, i) => {
          const Ic = carte.icone;
          return (
            <button key={carte.titre} onClick={() => setVue(carte.vue)} className="card-hover p-8 rounded-3xl text-left grain"
              style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(193, 157, 11, 0.2)', animation: `fadeUp 0.6s ease-out ${i * 0.1}s both` }}>
              <Ic size={28} strokeWidth={1.2} style={{ color: COLORS.primary }} />
              <h3 className="font-display text-3xl mt-6 mb-2" style={{ color: COLORS.textDark }}>{carte.titre}</h3>
              <p className="text-sm" style={{ color: COLORS.textMedium }}>{carte.desc}</p>
              <ChevronRight size={18} className="mt-4" style={{ color: COLORS.primaryLight }} />
            </button>
          );
        })}
      </section>

      {/* Carte cours */}
<section className="mt-6">
  <a href={CLIENT.siteUrl} target="_blank" rel="noopener noreferrer" className="card-hover p-8 rounded-3xl text-left grain" style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(193, 157, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div>
      <span style={{ fontSize: '1.75rem' }}>🧘</span>
      <h3 className="font-display text-3xl mt-6 mb-2" style={{ color: COLORS.textDark }}>Cours particuliers</h3>
      <p className="text-sm" style={{ color: COLORS.textMedium }}>Présentiel & Zoom · Toulon et alentours</p>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
      <span className="text-xs tracking-widest uppercase font-medium" style={{ color: COLORS.primary }}>Réserver</span>
      <ChevronRight size={18} style={{ color: COLORS.primaryLight }} />
    </div>
  </a>
</section>
    </div>
  );
}

// ============ POSTURES ============
function Postures({ postureSelectionnee, setPostureSelectionnee, aAccesComplet, onUnlock, postures }) {
  if (postureSelectionnee) {
    const p = postures.find((x) => x.id === postureSelectionnee);
    return <ModalPosture posture={p} onClose={() => setPostureSelectionnee(null)} />;
  }

  return (
    <div className="fade-up py-8">
      <div className="mb-12">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>Bibliothèque</p>
        <h2 className="font-display text-5xl" style={{ color: COLORS.textDark, fontWeight: 300 }}>
          Les {VOCAB.posture.pluriel} <em style={{ color: COLORS.primary }}>essentiels</em>
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
  {[...postures]
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .map((p, i) => {
          const verrou = !p.gratuit && !aAccesComplet;
          return (
            <button key={p.id} onClick={() => verrou ? onUnlock() : setPostureSelectionnee(p.id)}
              className="card-hover p-6 rounded-2xl text-left flex items-center gap-5 grain relative"
              style={{ background: 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(193, 157, 11, 0.2)', animation: `fadeUp 0.5s ease-out ${i * 0.05}s both` }}>
              {verrou && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(61, 46, 31, 0.8)' }}>
                  <Lock size={12} style={{ color: COLORS.backgroundCream }} />
                </div>
              )}

              {verrou && (
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(61, 46, 31, 0.8)' }}>
                  <Lock size={12} style={{ color: COLORS.backgroundCream }} />
                </div>
              )}
              {i === 0 && p.createdAt && new Date(p.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                  style={{ background: COLORS.primary, color: COLORS.backgroundCreamLight }}
                >
                  Nouveau
                </div>
              )}

              <div className={`text-5xl float ${verrou ? 'locked-blur' : ''}`} style={{ animationDelay: `${i * 0.2}s` }}>{p.icone}</div>
              <div className={`flex-1 ${verrou ? 'locked-blur' : ''}`}>
                <p className="text-xs tracking-[0.2em] uppercase mb-1" style={{ color: COLORS.primary }}>{p.nom}</p>
                <h3 className="font-display text-2xl mb-2" style={{ color: COLORS.textDark }}>{p.nomFr}</h3>
                <div className="flex gap-3 text-xs" style={{ color: COLORS.textMedium }}>
                  <span className="flex items-center gap-1"><Clock size={12} /> {p.duree}s</span>
                  <span>·</span><span>{p.difficulte}</span>
                </div>
              </div>
              <ChevronRight size={20} style={{ color: COLORS.primaryLight }} />
            </button>
          );
        })}
      </div>

      {!aAccesComplet && (
        <BandeauDeblocage onUnlock={onUnlock} />
      )}
    </div>
  );
}



// ============ SÉANCES ============
function Seances({ setSeanceActive, aAccesComplet, onUnlock, profil, seances }) {
  const objectifToSeance = {
    stress: 'antistress', sommeil: 'sommeil', energie: 'matin',
    souplesse: 'matin', centrage: 'respiration', decouvrir: 'matin',
  };
  const seanceRecommandee = profil?.objectif ? objectifToSeance[profil.objectif] : null;

  return (
    <div className="fade-up py-8">
      <div className="mb-12">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>Pratiques guidées</p>
        <h2 className="font-display text-5xl" style={{ color: COLORS.textDark, fontWeight: 300 }}>
          Des <em style={{ color: COLORS.primary }}>moments</em> pour vous
        </h2>
      </div>

      <div className="space-y-6">
  {[...seances]
    .sort((a, b) => {
      if (!a.createdAt && !b.createdAt) return 0;
      if (!a.createdAt) return 1;
      if (!b.createdAt) return -1;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .map((s, i) => {
          const Ic = iconeDe(s.icone);
          const verrou = !s.gratuit && !aAccesComplet;
          const recommande = s.id === seanceRecommandee;
          return (
            <div key={s.id} className="p-8 rounded-3xl grain relative" style={{ background: recommande ? 'linear-gradient(135deg, rgba(240, 215, 122, 0.4) 0%, rgba(193, 157, 11, 0.15) 100%)' : 'rgba(255, 255, 255, 0.5)', border: recommande ? `2px solid ${COLORS.primary}` : '1px solid rgba(193, 157, 11, 0.2)', animation: `fadeUp 0.5s ease-out ${i * 0.1}s both` }}>
              {recommande && (
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs tracking-widest uppercase" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
                  Pour vous
                </div>
              )}
              {verrou && (
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(30, 41, 89, 0.8)' }}>
                  <Lock size={14} style={{ color: COLORS.backgroundCream }} />
                </div>
              )}

              {verrou && (
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(30, 41, 89, 0.8)' }}>
                  <Lock size={14} style={{ color: COLORS.backgroundCream }} />
                </div>
              )}
              {i === 0 && s.createdAt && new Date(s.createdAt) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                <div
                  className="absolute -top-3 right-6 px-3 py-1 rounded-full text-xs tracking-widest uppercase"
                  style={{ background: COLORS.primary, color: COLORS.backgroundCreamLight }}
                >
                  Nouveau
                </div>
              )}

              <div className={`flex items-start gap-6 flex-wrap ${verrou ? 'locked-blur' : ''}`}>
                <div className="p-4 rounded-2xl" style={{ background: `linear-gradient(135deg, ${COLORS.primarySoft} 0%, ${COLORS.primaryLight} 100%)` }}>
                  <Ic size={32} strokeWidth={1.2} style={{ color: COLORS.backgroundCream }} />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <h3 className="font-display text-3xl mb-2" style={{ color: COLORS.textDark }}>{s.titre}</h3>
                  <p className="text-sm mb-3" style={{ color: COLORS.textMedium }}>{s.description}</p>
                  <div className="flex gap-3 text-xs" style={{ color: COLORS.primary }}>
                    <span>{s.duree}</span><span>·</span><span>{s.postures.length} postures</span>
                  </div>
                </div>
                <button onClick={() => verrou ? onUnlock() : setSeanceActive(s)} className="px-6 py-3 rounded-full text-sm tracking-widest uppercase transition-all hover:scale-105 flex items-center gap-2"
                  style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
                  {verrou ? <><Lock size={14} /> Débloquer</> : <><Play size={14} /> Démarrer</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!aAccesComplet && <BandeauDeblocage onUnlock={onUnlock} />}
    </div>
  );
}

// ============ SÉANCE EN COURS ============
function SeanceEnCours({ seance, onClose, profil, postures, utilisateur, onTermine }) {
  const posturesS = seance.postures.map((id) => postures.find((p) => p.id === id));
  const [indexActuel, setIndexActuel] = useState(0);
  const [tempsRestant, setTempsRestant] = useState(posturesS[0].duree);
  const [enPause, setEnPause] = useState(false);
  const [termine, setTermine] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => { setTempsRestant(posturesS[indexActuel].duree); }, [indexActuel]);

  useEffect(() => {
    if (enPause || termine) return;
    intervalRef.current = setInterval(() => {
      setTempsRestant((t) => {
        if (t <= 1) {
          if (indexActuel < posturesS.length - 1) {
            setIndexActuel((i) => i + 1);
            return posturesS[indexActuel + 1].duree;
          } else { setTermine(true); return 0; }
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [enPause, indexActuel, termine]);

  const postureActuelle = posturesS[indexActuel];
  const progression = ((postureActuelle.duree - tempsRestant) / postureActuelle.duree) * 100;
  const postureSuivante = posturesS[indexActuel + 1];
  const estDerniere = indexActuel === posturesS.length - 1;
  const afficherApercu = tempsRestant <= 10 && tempsRestant > 0;


  if (termine) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6" style={{ background: `linear-gradient(180deg, ${COLORS.backgroundCream} 0%, ${COLORS.backgroundBeige} 100%)` }}>
        <div className="text-center fade-up max-w-md">
          <div className="mb-6">
  <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
       style={{ background: `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)` }}>
    <span className="text-3xl font-bold" style={{ color: COLORS.backgroundCream }}>S</span>
  </div>
</div>
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>
            Namasté{profil?.prenom ? `, ${profil.prenom}` : ''}
          </p>
          <h2 className="font-display text-5xl mb-4" style={{ color: COLORS.textDark, fontWeight: 300 }}>
            Séance <em style={{ color: COLORS.primary }}>accomplie</em>
          </h2>
          <p className="mb-10 leading-relaxed" style={{ color: COLORS.textMedium }}>
            Prenez un instant pour ressentir. Observez votre souffle, votre corps, votre esprit.
          </p>
          <div className="flex flex-col gap-3 items-center">
  <button
    onClick={async () => {
      if (utilisateur) {
      await supabase.from('seances_realisees').insert({
  user_id: utilisateur.id,
  seance_id: seance?.id || 'libre',
  seance_titre: seance?.titre || 'Séance libre',
  duree_secondes: posturesS.reduce((acc, p) => acc + p.duree, 0),
  code_entreprise: null,
});
      }
      onTermine?.(); // ← cocher le jour du programme si applicable
      onClose();
    }}
    className="px-8 py-4 rounded-full text-sm tracking-widest uppercase"
    style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}
  >
    ✅ Marquer comme terminée
  </button>
  <button
    onClick={onClose}
    className="text-sm tracking-widest uppercase hover:underline"
    style={{ color: COLORS.primary }}
  >
    Revenir sans enregistrer
  </button>
</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 pt-10 pb-32" style={{ background: `linear-gradient(180deg, ${COLORS.backgroundCream} 0%, ${COLORS.backgroundBeige} 100%)` }}>
  <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <button onClick={onClose} className="text-sm tracking-widest uppercase hover:underline" style={{ color: COLORS.primary }}>← Quitter</button>
          <p className="text-xs tracking-[0.3em] uppercase" style={{ color: COLORS.primary }}>{indexActuel + 1} / {posturesS.length}</p>
        </div>

        <div className="text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>{postureActuelle.nom}</p>
          <h2 className="font-display text-5xl mb-12" style={{ color: COLORS.textDark, fontWeight: 300 }}>{postureActuelle.nomFr}</h2>

          <div className="relative w-80 h-80 mx-auto mb-4">
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(193, 157, 11, 0.2)" strokeWidth="2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke={COLORS.primary} strokeWidth="2"
              strokeDasharray={`${progression * 2.827} 282.7`} strokeLinecap="round"
              style={{ transition: 'stroke-dasharray 1s linear' }} />
           </svg>
         <div className="absolute inset-3 rounded-full overflow-hidden flex items-center justify-center breathe">
          {postureActuelle.urlImage ? (
        <img
            src={postureActuelle.urlImage}
          alt={postureActuelle.nomFr}
          className="w-full h-full object-cover"
        />
          ) : (
         <div className="text-7xl">{postureActuelle.icone}</div>
    )}
  </div>
</div>
<p className="font-display text-4xl mb-10" style={{ color: COLORS.textDark }}>{tempsRestant}s</p>

<p className="max-w-md mx-auto text-sm mb-6 leading-relaxed" style={{ color: COLORS.textMedium }}>{postureActuelle.instructions}</p>

{postureActuelle.urlAudio && (
  <div className="flex justify-center mb-10">
    <audio
      key={postureActuelle.id}
      controls
      autoPlay
      className="rounded-full"
      style={{ height: '40px' }}
    >
      <source src={postureActuelle.urlAudio} type="audio/mpeg" />
    </audio>
  </div>
)}
{/* Aperçu de la posture suivante — apparaît dans les dernières secondes */}
{afficherApercu && (
  <div
    className="inline-flex items-center gap-3 px-5 py-3 rounded-full mb-8 mx-auto fade-up"
    style={{ background: 'rgba(193, 157, 11, 0.1)', border: '1px solid rgba(193, 157, 11, 0.25)' }}
  >
    {estDerniere ? (
      <span className="text-sm" style={{ color: COLORS.primary }}>
        🪷 Dernière posture
      </span>
    ) : (
      <>
        <span className="text-xs uppercase tracking-wider" style={{ color: COLORS.primary }}>
          Ensuite
        </span>
        <span className="text-2xl">{postureSuivante.icone}</span>
        <span className="text-sm font-medium" style={{ color: COLORS.textDark }}>
          {postureSuivante.nomFr}
        </span>
      </>
    )}
  </div>
)}

<div
  className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 py-6 z-20"
  style={{ background: `linear-gradient(0deg, ${COLORS.backgroundBeige} 60%, transparent 100%)` }}
>
  <button onClick={() => setEnPause(!enPause)} className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
    {enPause ? <Play size={24} /> : <Pause size={24} />}
  </button>
  <button onClick={() => { if (indexActuel < posturesS.length - 1) setIndexActuel(indexActuel + 1); else setTermine(true); }}
    className="w-16 h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg" style={{ background: 'rgba(255,255,255,0.9)', color: COLORS.textDark }}>
    <ChevronRight size={24} />
  </button>
</div>
        </div>
      </div>
    </div>
  );
}

// ============ PROGRAMMES (multi) ============
function Programme({ joursTermines, setJoursTermines, aAccesComplet, onUnlock, profil, programmes, setSeanceActive, postures }) {
  const [progActifId, setProgActifId] = useState(programmes[0]?.id);
  const progActif = programmes.find((p) => p.id === progActifId) || programmes[0];

  // Clé unique par programme + jour pour suivre la progression séparément
  const cleJour = (pid, jour) => `${pid}:${jour}`;
  const toggleJour = (j) => {
    if (!j.gratuit && !aAccesComplet) { onUnlock(); return; }
    const cle = cleJour(progActif.id, j.jour);
    const n = new Set(joursTermines);
    n.has(cle) ? n.delete(cle) : n.add(cle);
    setJoursTermines(n);
  };

  const faitsCeProg = progActif.jours.filter((j) => joursTermines.has(cleJour(progActif.id, j.jour))).length;
  const pct = (faitsCeProg / progActif.jours.length) * 100;

  return (
    <div className="fade-up py-8">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>
          Programmes{profil?.prenom ? ` de ${profil.prenom}` : ''}
        </p>
        <h2 className="font-display text-5xl mb-6" style={{ color: COLORS.textDark, fontWeight: 300 }}>
          Choisissez votre <em style={{ color: COLORS.primary }}>chemin</em>
        </h2>
      </div>

      {/* Sélecteur de programme */}
      <div className="flex gap-3 flex-wrap mb-10">
        {programmes.map((p) => {
          const actif = p.id === progActif.id;
          return (
            <button key={p.id} onClick={() => setProgActifId(p.id)} className="px-6 py-4 rounded-2xl text-left transition-all"
              style={{
                background: actif ? `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)` : 'rgba(255,255,255,0.5)',
                border: `1px solid ${actif ? 'transparent' : 'rgba(193, 157, 11, 0.25)'}`,
                minWidth: '180px',
              }}>
              <p className="text-xs tracking-widest uppercase mb-1" style={{ color: actif ? 'rgba(245,239,230,0.8)' : COLORS.primary }}>{p.sousTitre}</p>
              <p className="font-display text-xl" style={{ color: actif ? COLORS.backgroundCream : COLORS.textDark }}>{p.titre}</p>
              <p className="text-xs mt-1" style={{ color: actif ? 'rgba(245,239,230,0.7)' : COLORS.textMedium }}>{p.jours.length} jours</p>
            </button>
          );
        })}
      </div>

      <p className="mb-8 max-w-xl" style={{ color: COLORS.textMedium }}>{progActif.description}</p>

      {/* Barre de progression du programme actif */}
      <div className="p-6 rounded-2xl mb-10" style={{ background: 'rgba(255, 255, 255, 0.5)' }}>
        <div className="flex justify-between items-end mb-3">
          <p className="text-xs tracking-[0.2em] uppercase" style={{ color: COLORS.primary }}>Votre progression</p>
          <p className="font-display text-3xl" style={{ color: COLORS.textDark }}>{faitsCeProg}<span className="text-lg" style={{ color: COLORS.primary }}>/{progActif.jours.length}</span></p>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(193, 157, 11, 0.2)' }}>
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)` }} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {progActif.jours.map((j, i) => {
          const fait = joursTermines.has(cleJour(progActif.id, j.jour));
          const verrou = !j.gratuit && !aAccesComplet;
          return (
            <button key={j.jour} onClick={() => {
                if (verrou) { onUnlock(); return; }
                if (fait) { toggleJour(j); return; }
               setSeanceActive({
  id: `prog-${progActif.id}-j${j.jour}`,
  titre: `J${j.jour} — ${j.titre}`,
      postures: (j.postures && j.postures.length > 0)
        ? j.postures
        : postures
            .filter(p => p.fonctions?.includes('pratique') && 
              (progActif.objectifFiltrer ? p.objectifs?.includes(progActif.objectifFiltrer) : true))
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.max(3, Math.round(j.duree * 60 / 90)))
            .map(p => p.id),
  onTermine: () => toggleJour(j),
});
}}

className="card-hover p-5 rounded-2xl text-left grain relative"
              style={{ background: fait ? `linear-gradient(135deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)` : 'rgba(255, 255, 255, 0.5)', border: '1px solid rgba(193, 157, 11, 0.2)', animation: `fadeUp 0.4s ease-out ${i * 0.02}s both` }}>
              {verrou && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'rgba(30, 41, 89, 0.8)' }}>
                  <Lock size={10} style={{ color: COLORS.backgroundCream }} />
                </div>
              )}
              <div className={verrou ? 'locked-blur' : ''}>
                <div className="flex justify-between items-start mb-3">
                  <span className="font-display text-2xl" style={{ color: fait ? COLORS.backgroundCream : COLORS.textDark }}>J{j.jour}</span>
                  {fait && <Check size={16} style={{ color: COLORS.backgroundCream }} />}
                </div>
                <p className="text-sm mb-1" style={{ color: fait ? COLORS.backgroundCream : COLORS.textDark, fontWeight: 500 }}>{j.titre}</p>
                <p className="text-xs" style={{ color: fait ? 'rgba(245, 239, 230, 0.7)' : COLORS.primary }}>{j.duree} min</p>
              </div>
            </button>
          );
        })}
      </div>

      {!aAccesComplet && <BandeauDeblocage onUnlock={onUnlock} />}
    </div>
  );
}
// ============ MA SÉANCE (générateur personnalisé) ============
function MaSeance({ postures, setSeanceActive, profil, aAccesComplet, onUnlock }) {
  const [etape, setEtape] = useState(1);
  const [duree, setDuree] = useState(null);
  const [objectifsChoisis, setObjectifsChoisis] = useState([]);
  const [niveau, setNiveau] = useState(null);
  const [seanceGeneree, setSeanceGeneree] = useState(null);

  // Liste des objectifs avec leurs icônes
  const objectifs = VOCAB.objectifs.liste;

  // Liste des durées
  const durees = [5, 10, 15, 20, 30];

  // Fonction de réinitialisation
  const recommencer = () => {
    setEtape(1);
    setDuree(null);
    setObjectifsChoisis([]);
    setNiveau(null);
    setSeanceGeneree(null);
  };
// Algorithme de génération de séance
  const genererSeance = () => {
    const dureeTotal = duree * 60;
    const budgetAncrage = Math.floor(dureeTotal * 0.12);
    const budgetRepos = Math.floor(dureeTotal * 0.18);
    const budgetPratique = dureeTotal - budgetAncrage - budgetRepos;

const filtreNiveau = (p) => {
      if (niveau === 'premier') {
        return p.difficulte === 'tous';
      }
      if (niveau === 'debutant') {
        return p.difficulte === 'tous' || p.difficulte === 'facile';
      }
      if (niveau === 'confirme') {
        return p.difficulte === 'tous'
            || p.difficulte === 'facile'
            || p.difficulte === 'intermediaire';
      }
      return true;
    };

    const posturesEligibles = postures.filter(filtreNiveau);

    const matchObjectif = (p) =>
  objectifsChoisis.length === 0 ||
  objectifsChoisis.some(obj => p.objectifs?.includes(obj)) ||
  p.objectifs?.includes('general') ||
  p.objectif === objectifsChoisis[0];
    
    const ancrages = posturesEligibles.filter(p => p.fonctions?.includes('ancrage'));
    const pratiques = posturesEligibles.filter(p => p.fonctions?.includes('pratique') && matchObjectif(p));
    const repos = posturesEligibles.filter(p => p.fonctions?.includes('repos'));

    const pratiquesFinales = pratiques.length > 0 
      ? pratiques 
      : posturesEligibles.filter(p => p.fonctions?.includes('pratique'));

    const melanger = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const seance = [];
    const idsUtilises = new Set();
    
    if (ancrages.length > 0) {
      const choix = melanger(ancrages)[0];
      seance.push(choix);
      idsUtilises.add(choix.id);
    }

    const pratiquesAleatoires = melanger(pratiquesFinales);
    let tempsAccumule = 0;
    
    for (const p of pratiquesAleatoires) {
      if (idsUtilises.has(p.id)) continue;
      if (tempsAccumule + p.duree > budgetPratique) continue;
      seance.push(p);
      idsUtilises.add(p.id);
      tempsAccumule += p.duree;
      if (tempsAccumule >= budgetPratique * 0.85) break;
    }

    const reposPossibles = repos.filter(p => !idsUtilises.has(p.id));
    if (reposPossibles.length > 0) {
      let choixRepos;
      if (objectifsChoisis.includes('sommeil') || objectifsChoisis.includes('stress')) {
        const calmants = reposPossibles.filter(p => 
          p.id === 'spine_stretch_forward'
        );
        choixRepos = calmants.length > 0 ? melanger(calmants)[0] : melanger(reposPossibles)[0];
      } else {
        choixRepos = melanger(reposPossibles)[0];
      }
      seance.push(choixRepos);
    }

    const dureeReelle = seance.reduce((sum, p) => sum + p.duree, 0);

    return {
      id: 'maseance-' + Date.now(),
      titre: 'Ma séance sur mesure',
      duree: Math.round(dureeReelle / 60) + ' min',
      icone: 'etincelles',
     description: `${duree} minutes · ${objectifsChoisis.map(id => objectifs.find(o => o.id === id)?.label).join(', ')} · ${niveau === 'premier' ? 'Premier cours' : niveau === 'debutant' ? 'Débutant' : 'Confirmé'}`,
      gratuit: true,
      postures: seance.map(p => p.id),
      _detailsPostures: seance,
    };
  };

  // Dès que le niveau est choisi, on génère la séance et passe à l'étape 4
  useEffect(() => {
    if (niveau && duree && objectifsChoisis.length > 0) {
      const seance = genererSeance();
      setSeanceGeneree(seance);
      setEtape(4);
    }
  }, [niveau]);

  return (
    <div className="fade-up py-8">
      <div className="mb-8 text-center">
        <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>Sur mesure</p>
        <h2 className="font-display text-5xl mb-4" style={{ color: COLORS.textDark, fontWeight: 300 }}>
          Crée ta <em style={{ color: COLORS.primary }}>séance idéale</em>
        </h2>
        <p style={{ color: COLORS.textMedium }}>3 questions pour une pratique sur mesure</p>
      </div>

      {/* Barre de progression */}
      <div className="max-w-md mx-auto mb-10">
        <div className="flex justify-between text-xs tracking-widest uppercase mb-2" style={{ color: COLORS.primary }}>
          <span>Étape {etape}/4</span>
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(193, 157, 11, 0.2)' }}>
          <div className="h-full rounded-full transition-all duration-500" 
               style={{ width: `${etape * 25}%`, background: `linear-gradient(90deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)` }} />
        </div>
      </div>

      {/* Étape 1 — Durée */}
      {etape === 1 && (
        <div className="max-w-2xl mx-auto fade-up">
          <h3 className="font-display text-3xl mb-8 text-center" style={{ color: COLORS.textDark }}>
            De combien de temps disposes-tu{profil?.prenom ? `, ${profil.prenom}` : ''} ?
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {durees.map((d) => (
              <button
                key={d}
                onClick={() => { setDuree(d); setEtape(2); }}
                className="p-5 rounded-2xl transition-all hover:scale-105"
                style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(193, 157, 11, 0.3)' }}
              >
                <p className="font-display text-3xl" style={{ color: COLORS.secondary }}>{d}</p>
                <p className="text-xs tracking-widest uppercase mt-1" style={{ color: COLORS.primary }}>min</p>
              </button>
            ))}
          </div>
        </div>
      )}

{/* Étape 2 — Objectifs (multi-sélection) */}
{etape === 2 && (
  <div className="max-w-2xl mx-auto fade-up">
    <h3 className="font-display text-3xl mb-3 text-center" style={{ color: COLORS.textDark }}>
      Que cherches-tu aujourd'hui ?
    </h3>
    <p className="text-center text-sm mb-8" style={{ color: COLORS.primary }}>
      Tu peux choisir plusieurs objectifs
    </p>
    <div className="grid md:grid-cols-2 gap-3">
      {objectifs.map((o) => {
        const selectionne = objectifsChoisis.includes(o.id);
        return (
          <button
            key={o.id}
            onClick={() => {
              setObjectifsChoisis(prev =>
                prev.includes(o.id)
                  ? prev.filter(x => x !== o.id)
                  : [...prev, o.id]
              );
            }}
            className="p-5 rounded-2xl text-left flex items-center gap-4 transition-all hover:scale-105"
            style={{
              background: selectionne ? 'rgba(193,157,11,0.15)' : 'rgba(255,255,255,0.6)',
              border: selectionne ? `2px solid ${COLORS.primary}` : '1px solid rgba(193,157,11,0.3)',
            }}
          >
            <span className="text-3xl">{o.icone}</span>
            <span style={{ color: COLORS.textDark, fontWeight: selectionne ? 600 : 500 }}>{o.label}</span>
            {selectionne && <span className="ml-auto text-lg">✓</span>}
          </button>
        );
      })}
    </div>
    <button
      onClick={() => { if (objectifsChoisis.length > 0) setEtape(3); }}
      disabled={objectifsChoisis.length === 0}
      className="w-full py-3 rounded-full font-medium mt-6 transition-all"
      style={{
        background: objectifsChoisis.length > 0 ? COLORS.secondary : COLORS.backgroundBeigeSoft,
        color: objectifsChoisis.length > 0 ? COLORS.backgroundCreamLight : COLORS.textMuted,
      }}
    >
      {objectifsChoisis.length === 0
        ? 'Sélectionne au moins un objectif'
        : `Continuer avec ${objectifsChoisis.length} objectif${objectifsChoisis.length > 1 ? 's' : ''} →`}
    </button>
    <button onClick={() => setEtape(1)} className="mt-4 text-sm tracking-widest uppercase mx-auto block" style={{ color: COLORS.primary }}>
      ← Étape précédente
    </button>
  </div>
)}

      {/* Étape 3 — Niveau */}
      {etape === 3 && (
        <div className="max-w-2xl mx-auto fade-up">
          <h3 className="font-display text-3xl mb-8 text-center" style={{ color: COLORS.textDark }}>
            Quel niveau te convient ?
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            <button
              onClick={() => { setNiveau('premier'); }}
              className="p-6 rounded-2xl text-left transition-all hover:scale-105"
              style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(193, 157, 11, 0.3)' }}
            >
              <span className="text-3xl">🌱</span>
              <p className="font-display text-2xl mt-3" style={{ color: COLORS.secondary }}>Premier cours</p>
              <p className="text-sm mt-1" style={{ color: COLORS.textMedium }}>Postures faciles uniquement</p>
            </button>

            <button
              onClick={() => { setNiveau('debutant'); }}
              className="p-6 rounded-2xl text-left transition-all hover:scale-105"
              style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(193, 157, 11, 0.3)' }}
            >
              <span className="text-3xl">🌱</span>
              <p className="font-display text-2xl mt-3" style={{ color: COLORS.secondary }}>Débutant</p>
              <p className="text-sm mt-1" style={{ color: COLORS.textMedium }}>Postures faciles uniquement</p>
            </button>

            <button
              onClick={() => { setNiveau('confirmé'); }}
              className="p-6 rounded-2xl text-left transition-all hover:scale-105"
              style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(193, 157, 11, 0.3)' }}
            >
              <span className="text-3xl">🌳</span>
              <p className="font-display text-2xl mt-3" style={{ color: COLORS.secondary }}>Tous niveaux</p>
              <p className="text-sm mt-1" style={{ color: COLORS.textMedium }}>Toutes les postures accessibles</p>
            </button>
          </div>
          <button onClick={() => setEtape(2)} className="mt-6 text-sm tracking-widest uppercase mx-auto block" style={{ color: COLORS.primary }}>
            ← Étape précédente
          </button>
        </div>
      )}

      {/* Étape 4 — Résultat */}
      {/* Étape 4 — Résultat */}
      {etape === 4 && seanceGeneree && (
        <div className="max-w-2xl mx-auto fade-up text-center">
          <p className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: COLORS.primary }}>Voici ta séance</p>
          <h3 className="font-display text-4xl mb-4" style={{ color: COLORS.textDark }}>
            Sur mesure <em style={{ color: COLORS.primary }}>pour toi</em> 🪷
          </h3>
          <p className="mb-8" style={{ color: COLORS.textMedium }}>
            {seanceGeneree.duree} · {objectifsChoisis.map(id => objectifs.find(o => o.id === id)?.label).join(' + ')} · {niveau === 'premier' ? 'Premier cours' : niveau === 'debutant' ? 'Débutant' : 'Confirmé'}
          </p>

          <div className="p-6 rounded-2xl mb-8 text-left" style={{ background: 'rgba(255, 255, 255, 0.6)', border: '1px solid rgba(193, 157, 11, 0.3)' }}>
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: COLORS.primary }}>Programme</p>
            {seanceGeneree._detailsPostures.map((p, i) => (
              <div key={p.id} className="flex items-center gap-4 py-2 border-b last:border-0" style={{ borderColor: 'rgba(193, 157, 11, 0.15)' }}>
                <span className="text-2xl">{p.icone}</span>
                <div className="flex-1">
                  <p style={{ color: COLORS.textDark, fontWeight: 500 }}>{p.nomFr}</p>
                  <p className="text-xs" style={{ color: COLORS.primary }}>{p.duree}s · {p.difficulte}</p>
                </div>
                <span className="text-xs tracking-widest uppercase" style={{ color: COLORS.primary }}>{i + 1}/{seanceGeneree._detailsPostures.length}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <button 
              onClick={() => setSeanceActive(seanceGeneree)} 
              className="px-6 py-3 rounded-full text-sm tracking-widest uppercase flex items-center gap-2"
              style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}
            >
              <Play size={14} /> Démarrer ma séance
            </button>
            <button 
              onClick={() => setSeanceGeneree(genererSeance())} 
              className="px-6 py-3 rounded-full text-sm tracking-widest uppercase"
              style={{ background: 'rgba(255,255,255,0.6)', color: COLORS.textDark }}
            >
              🔄 Régénérer
            </button>
            <button 
              onClick={recommencer} 
              className="px-6 py-3 rounded-full text-sm tracking-widest uppercase"
              style={{ background: 'rgba(255,255,255,0.6)', color: COLORS.textDark }}
            >
              Recommencer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
// ============ BANDEAU DÉBLOCAGE ============
function BandeauDeblocage({ onUnlock }) {
  return (
    <div className="mt-12 p-8 rounded-3xl text-center grain" style={{ background: 'linear-gradient(135deg, rgba(240, 215, 122, 0.4) 0%, rgba(193, 157, 11, 0.3) 100%)', border: '1px solid rgba(193, 157, 11, 0.3)' }}>
      <Lock size={24} strokeWidth={1.2} style={{ color: COLORS.primary }} className="mx-auto" />
      <h3 className="font-display text-3xl mt-4 mb-3" style={{ color: COLORS.textDark }}>
        Envie d'<em style={{ color: COLORS.primary }}>aller plus loin</em> ?
      </h3>
      <p className="max-w-md mx-auto text-sm mb-6 leading-relaxed" style={{ color: COLORS.textMedium }}>
        L'accès complet à {CLIENT.nom} est offert aux salariés des entreprises partenaires.
        Demandez à votre RH si votre société peut souscrire à l'offre yoga en entreprise.
      </p>
      <button onClick={onUnlock} className="px-8 py-3 rounded-full text-sm tracking-widest uppercase" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
        J'ai mon code d'accès
      </button>
    </div>
  );
}

// ============ ESPACE ADMINISTRATEUR ============
function Admin({ seances, setSeances, programmes, setProgrammes, codes, setCodes, postures, onQuitter, onThemeChange }) {
  const [onglet, setOnglet] = useState('tableau');

  const onglets = [
    { id: 'tableau', label: 'Tableau de bord', icone: BarChart3 },
    { id: 'seances', label: 'Séances', icone: LayoutGrid },
    { id: 'programmes', label: 'Programmes', icone: Calendar },
    { id: 'codes', label: 'Codes entreprise', icone: KeyRound },
    { id: 'reglages', label: 'Réglages', icone: Palette },
  ];

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${COLORS.backgroundCream} 0%, ${COLORS.backgroundBeige} 100%)` }}>
      {/* En-tête admin */}
      <header className="px-6 pt-10 pb-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: COLORS.secondary }}>
              <Settings size={22} style={{ color: COLORS.backgroundCream }} />
            </div>
            <div>
              <h1 className="font-display text-3xl" style={{ color: COLORS.textDark, lineHeight: 1 }}>Espace administrateur</h1>
              <p className="text-xs tracking-[0.2em] uppercase mt-1" style={{ color: COLORS.primary }}>{CLIENT.nom} · Gestion de contenu</p>
            </div>
          </div>
          <button onClick={onQuitter} className="px-5 py-2 rounded-full text-xs tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.6)', color: COLORS.secondary }}>
            Quitter l'admin
          </button>
        </div>
      </header>

      {/* Onglets */}
      <div className="px-6 max-w-6xl mx-auto">
        <div className="flex gap-1 p-1 rounded-full mb-8 flex-wrap" style={{ background: 'rgba(255,255,255,0.5)', width: 'fit-content' }}>
          {onglets.map((o) => {
            const Ic = o.icone;
            const actif = onglet === o.id;
            return (
              <button key={o.id} onClick={() => setOnglet(o.id)} className="px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2"
                style={{ background: actif ? COLORS.secondary : 'transparent', color: actif ? COLORS.backgroundCream : COLORS.textDark, fontWeight: actif ? 500 : 400 }}>
                <Ic size={15} /> {o.label}
              </button>
            );
          })}
        </div>
      </div>

      <main className="px-6 max-w-6xl mx-auto pb-20">
        {onglet === 'tableau' && <AdminTableau seances={seances} programmes={programmes} codes={codes} />}
        {onglet === 'seances' && <AdminSeances seances={seances} setSeances={setSeances} postures={postures} />}
        {onglet === 'programmes' && <AdminProgrammes programmes={programmes} setProgrammes={setProgrammes} postures={postures} />}
        {onglet === 'codes' && <AdminCodes codes={codes} setCodes={setCodes} />}
        {onglet === 'reglages' && <AdminReglages onThemeChange={onThemeChange} />}
      </main>
    </div>
  );
}

// --- Admin : Réglages (couleurs de l'app) ---
function AdminReglages({ onThemeChange }) {
  // Rôles de couleur les plus visibles à l'écran — volontairement un
  // sous-ensemble des ~19 clés de COLORS pour garder l'écran simple.
  // Les autres clés (fonds secondaires, couleurs de chakras...) restent
  // éditables directement dans src/theme.js si besoin.
  const roles = [
    { cle: 'primary', label: 'Couleur principale (CTA, accents)' },
    { cle: 'secondary', label: 'Couleur secondaire (titres, en-têtes)' },
    { cle: 'textDark', label: 'Texte foncé' },
    { cle: 'textMedium', label: 'Texte moyen' },
    { cle: 'backgroundCream', label: 'Fond principal' },
    { cle: 'backgroundBeige', label: 'Fond secondaire' },
  ];

  const [valeurs, setValeurs] = useState(() =>
    Object.fromEntries(roles.map((r) => [r.cle, COLORS[r.cle]]))
  );
  const [enregistrement, setEnregistrement] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (cle, valeur) => {
    setValeurs((v) => ({ ...v, [cle]: valeur }));
  };

  const handleEnregistrer = async () => {
    setEnregistrement(true);
    setMessage('');
    const ok = await sauvegarderThemeSupabase(valeurs);
    setEnregistrement(false);
    if (ok) {
      setMessage('Couleurs enregistrées ✓');
      onThemeChange?.();
    } else {
      setMessage("Erreur lors de l'enregistrement — réessayer.");
    }
  };

  const handleReinitialiser = () => {
    const defauts = Object.fromEntries(roles.map((r) => [r.cle, COLORS_PAR_DEFAUT[r.cle]]));
    setValeurs(defauts);
  };

  return (
    <div className="max-w-2xl">
      <h2 className="font-bold text-2xl mb-2" style={{ color: COLORS.secondary }}>Réglages — Couleurs de l'app</h2>
      <p className="text-sm mb-6" style={{ color: COLORS.textMedium }}>
        Ces couleurs s'appliquent à toute l'app pour tous les utilisateurs, sans redéploiement.
        Les changements sont visibles après enregistrement, au prochain chargement de l'app pour
        les autres utilisateurs (ou immédiatement ici après avoir cliqué Enregistrer).
      </p>

      <div className="space-y-4">
        {roles.map((r) => (
          <div key={r.cle} className="flex items-center justify-between p-3 rounded-xl" style={{ background: COLORS.backgroundGrayLight }}>
            <label className="text-sm font-medium" style={{ color: COLORS.textDark }}>{r.label}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={valeurs[r.cle]}
                onChange={(e) => handleChange(r.cle, e.target.value)}
                className="w-10 h-10 rounded-lg border cursor-pointer"
                style={{ borderColor: COLORS.backgroundBeigeSoft }}
              />
              <span className="text-xs font-mono" style={{ color: COLORS.textMuted }}>{valeurs[r.cle]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={handleEnregistrer}
          disabled={enregistrement}
          className="px-6 py-2.5 rounded-full text-sm font-medium"
          style={{ background: COLORS.secondary, color: COLORS.backgroundCreamLight, opacity: enregistrement ? 0.6 : 1 }}
        >
          {enregistrement ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <button
          onClick={handleReinitialiser}
          className="px-6 py-2.5 rounded-full text-sm"
          style={{ background: 'rgba(255,255,255,0.6)', color: COLORS.textMedium }}
        >
          Réinitialiser aux couleurs par défaut
        </button>
        {message && <span className="text-xs" style={{ color: COLORS.textAccent }}>{message}</span>}
      </div>
    </div>
  );
}

// --- Admin : Tableau de bord ---
function AdminTableau({ seances, programmes, codes }) {
  const stats = [
    { label: 'Salariés actifs', valeur: STATS_DEMO.utilisateursActifs, sousTexte: 'ce mois-ci' },
    { label: 'Séances complétées', valeur: STATS_DEMO.seancesCompletees, sousTexte: 'au total' },
    { label: "Taux d'assiduité", valeur: `${STATS_DEMO.tauxAssiduite}%`, sousTexte: 'pratique régulière' },
    { label: 'Entreprises clientes', valeur: Object.keys(codes).length, sousTexte: 'actives' },
  ];

  return (
    <div className="fade-up">
      <div className="mb-8 p-5 rounded-2xl" style={{ background: 'rgba(193, 157, 11, 0.12)', border: '1px solid rgba(193, 157, 11, 0.25)' }}>
        <p className="text-sm" style={{ color: COLORS.textMedium }}>
          <strong>Note :</strong> ces chiffres sont simulés pour la démonstration. En production, ils refléteront l'usage réel — un argument précieux pour renouveler vos contrats entreprise.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s, i) => (
          <div key={i} className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(193, 157, 11, 0.2)' }}>
            <p className="font-display text-4xl mb-1" style={{ color: COLORS.secondary }}>{s.valeur}</p>
            <p className="text-sm" style={{ color: COLORS.textDark, fontWeight: 500 }}>{s.label}</p>
            <p className="text-xs" style={{ color: COLORS.primary }}>{s.sousTexte}</p>
          </div>
        ))}
      </div>

      <h3 className="font-display text-2xl mb-4" style={{ color: COLORS.textDark }}>Usage par entreprise</h3>
      <div className="space-y-3 mb-10">
        {STATS_DEMO.parEntreprise.map((e, i) => {
          const pct = Math.round((e.actifs / e.total) * 100);
          return (
            <div key={i} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.6)' }}>
              <div className="flex justify-between items-center mb-2">
                <p style={{ color: COLORS.textDark, fontWeight: 500 }}>{e.nom}</p>
                <p className="text-sm" style={{ color: COLORS.textMedium }}>{e.actifs}/{e.total} salariés actifs · {pct}%</p>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(193, 157, 11, 0.15)' }}>
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.primaryLight} 0%, ${COLORS.primary} 100%)` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.6)' }}>
          <p className="font-display text-3xl" style={{ color: COLORS.secondary }}>{seances.length}</p>
          <p className="text-sm" style={{ color: COLORS.textMedium }}>séances publiées</p>
        </div>
        <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.6)' }}>
          <p className="font-display text-3xl" style={{ color: COLORS.secondary }}>{programmes.length}</p>
          <p className="text-sm" style={{ color: COLORS.textMedium }}>programmes actifs</p>
        </div>
        <div className="p-6 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.6)' }}>
          <p className="font-display text-3xl" style={{ color: COLORS.secondary }}>{STATS_DEMO.objectifPrincipal}</p>
          <p className="text-sm" style={{ color: COLORS.textMedium }}>objectif n°1 des salariés</p>
        </div>
      </div>
    </div>
  );
}

// --- Admin : Gestion des séances ---
function AdminSeances({ seances, setSeances, postures }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(null);

  const nouvelle = () => {
    setEditId('nouveau');
    setForm({ id: '', titre: '', duree: '15 min', icone: 'soleil', gratuit: false, description: '', postures: [] });
  };
  const editer = (s) => { setEditId(s.id); setForm({ ...s, postures: [...s.postures] }); };
  const annuler = () => { setEditId(null); setForm(null); };

  const enregistrer = async () => {
    if (!form.titre.trim()) return;
    const id = form.id.trim() || form.titre.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 20);
    const seanceFinale = { ...form, id };

    // Sauvegarde en base Supabase (upsert : crée ou met à jour selon le slug)
    const { error } = await supabase.from('seances').upsert({
      slug: id,
      titre: seanceFinale.titre,
      duree: seanceFinale.duree,
      icone: seanceFinale.icone,
      description: seanceFinale.description,
      gratuit: seanceFinale.gratuit,
      objectif: seanceFinale.objectif || null,
      postures: seanceFinale.postures.join(','),
    }, { onConflict: 'slug' });

    if (error) {
      console.error('Erreur sauvegarde séance:', error);
      alert('Erreur lors de la sauvegarde. Vérifiez votre connexion.');
      return;
    }

    if (editId === 'nouveau') {
      setSeances([...seances, seanceFinale]);
    } else {
      setSeances(seances.map((s) => (s.id === editId ? seanceFinale : s)));
    }
    annuler();
  };

  const supprimer = async (id) => {
    const { error } = await supabase.from('seances').delete().eq('slug', id);
    if (error) {
      console.error('Erreur suppression séance:', error);
      alert('Erreur lors de la suppression. Vérifiez votre connexion.');
      return;
    }
    setSeances(seances.filter((s) => s.id !== id));
  };

  const togglePosture = (pid) => {
    const has = form.postures.includes(pid);
    setForm({ ...form, postures: has ? form.postures.filter((x) => x !== pid) : [...form.postures, pid] });
  };

  const iconesDispo = [
    { id: 'soleil', label: '☀️ Soleil' }, { id: 'lune', label: '🌙 Lune' },
    { id: 'vent', label: '🌬️ Vent' }, { id: 'etincelles', label: '✨ Étincelles' },
    { id: 'coeur', label: '🤍 Cœur' },
  ];

  return (
    <div className="fade-up">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="font-display text-3xl" style={{ color: COLORS.textDark }}>Gérer les séances</h3>
        <button onClick={nouvelle} className="px-5 py-3 rounded-full text-sm tracking-widest uppercase flex items-center gap-2" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
          <Plus size={16} /> Nouvelle séance
        </button>
      </div>

      {/* Formulaire d'édition */}
      {form && (
        <div className="mb-8 p-6 rounded-3xl fade-up" style={{ background: 'rgba(255,255,255,0.7)', border: `2px solid ${COLORS.primary}` }}>
          <h4 className="font-display text-2xl mb-4" style={{ color: COLORS.secondary }}>{editId === 'nouveau' ? 'Créer une séance' : 'Modifier la séance'}</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Titre *</label>
              <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Ex. Pause méridienne" className="w-full px-4 py-2 rounded-xl" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Durée</label>
              <input value={form.duree} onChange={(e) => setForm({ ...form, duree: e.target.value })} placeholder="15 min" className="w-full px-4 py-2 rounded-xl" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Une courte description de la séance" className="w-full px-4 py-2 rounded-xl" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
          </div>
          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase mb-2 block" style={{ color: COLORS.primary }}>Icône</label>
            <div className="flex gap-2 flex-wrap">
              {iconesDispo.map((ic) => (
                <button key={ic.id} onClick={() => setForm({ ...form, icone: ic.id })} className="px-3 py-2 rounded-xl text-sm" style={{ background: form.icone === ic.id ? COLORS.secondary : COLORS.backgroundWhite, color: form.icone === ic.id ? COLORS.backgroundCream : COLORS.textDark, border: '1px solid rgba(193,157,11,0.3)' }}>{ic.label}</button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase mb-2 block" style={{ color: COLORS.primary }}>Postures incluses ({form.postures.length})</label>
            <div className="flex gap-2 flex-wrap">
              {postures.map((p) => (
                <button key={p.id} onClick={() => togglePosture(p.id)} className="px-3 py-2 rounded-xl text-sm flex flex-col items-center gap-0.5" style={{ background: form.postures.includes(p.id) ? `linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})` : COLORS.backgroundWhite, color: form.postures.includes(p.id) ? COLORS.backgroundCream : COLORS.textDark, border: '1px solid rgba(193,157,11,0.3)' }}>
                  <span>{p.icone} {p.nomFr}</span>
                  <span className="text-[10px] opacity-75">{p.duree}s</span>
                </button>
              ))}
            </div>
            {form.postures.length > 0 && (() => {
              const totalSecondes = form.postures.reduce((acc, pid) => {
                const p = postures.find((x) => x.id === pid);
                return acc + (p ? p.duree : 0);
              }, 0);
              const totalMinutes = Math.round(totalSecondes / 60);
              return (
                <div className="mt-2 flex items-center gap-2 text-xs" style={{ color: COLORS.primary }}>
                  <span>⏱ Durée estimée : ~{totalMinutes} min ({totalSecondes}s cumulées)</span>
                  <button
                    onClick={() => setForm({ ...form, duree: `${totalMinutes} min` })}
                    className="px-2 py-1 rounded-full text-[10px] uppercase tracking-wide"
                    style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}
                  >
                    Utiliser cette estimation
                  </button>
                </div>
              );
            })()}
          </div>
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setForm({ ...form, gratuit: !form.gratuit })} className="px-4 py-2 rounded-full text-sm" style={{ background: form.gratuit ? `linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})` : 'rgba(255,255,255,0.8)', color: form.gratuit ? COLORS.backgroundCream : COLORS.textDark, border: '1px solid rgba(193,157,11,0.3)' }}>
              {form.gratuit ? '✓ Accessible en démo gratuite' : 'Réservée aux entreprises'}
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={enregistrer} className="px-6 py-3 rounded-full text-sm tracking-widest uppercase" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>Enregistrer</button>
            <button onClick={annuler} className="px-6 py-3 rounded-full text-sm tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.6)', color: COLORS.textDark }}>Annuler</button>
          </div>
        </div>
      )}

      {/* Liste des séances */}
      <div className="space-y-3">
        {seances.map((s) => {
          const Ic = iconeDe(s.icone);
          return (
            <div key={s.id} className="p-5 rounded-2xl flex items-center gap-4 flex-wrap" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(193, 157, 11, 0.2)' }}>
              <div className="p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${COLORS.primarySoft}, ${COLORS.primaryLight})` }}>
                <Ic size={22} style={{ color: COLORS.backgroundCream }} />
              </div>
              <div className="flex-1 min-w-[180px]">
                <p className="font-display text-xl" style={{ color: COLORS.textDark }}>{s.titre}</p>
                <p className="text-xs" style={{ color: COLORS.textMedium }}>{s.duree} · {s.postures.length} postures · {s.gratuit ? 'Démo gratuite' : 'Entreprises'}</p>
              </div>
              <button onClick={() => editer(s)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(193,157,11,0.15)', color: COLORS.secondary }}><Edit3 size={15} /></button>
              <button onClick={() => supprimer(s.id)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(160,82,45,0.12)', color: COLORS.textAccent }}><Trash2 size={15} /></button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- Admin : Gestion des programmes ---
function AdminProgrammes({ programmes, setProgrammes, postures }) {
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [erreur, setErreur] = useState('');

  const nouveau = () => {
    setEditId('nouveau');
    setErreur('');
    setForm({ id: '', titre: '', sousTitre: '', description: '', jours: [{ titre: '', duree: 5, gratuit: true, postures: [] }] });
  };
  const editer = (p) => {
    setEditId(p.id);
    setErreur('');
    setForm({ id: p.id, titre: p.titre, sousTitre: p.sousTitre, description: p.description, jours: p.jours.map((j) => ({ titre: j.titre, duree: j.duree, gratuit: j.gratuit, postures: j.postures || [] })) });
  };
  const annuler = () => { setForm(null); setEditId(null); };

  const ajouterJour = () => {
    setForm({ ...form, jours: [...form.jours, { titre: '', duree: 5, gratuit: false, postures: [] }] });
  };
  const supprimerJour = (index) => {
    setForm({ ...form, jours: form.jours.filter((_, i) => i !== index) });
  };
  const modifierJour = (index, champ, valeur) => {
    const jours = [...form.jours];
    jours[index] = { ...jours[index], [champ]: valeur };
    setForm({ ...form, jours });
  };
  const toggleJourPosture = (index, pid) => {
    const jours = [...form.jours];
    const dejaChoisi = jours[index].postures.includes(pid);
    jours[index] = { ...jours[index], postures: dejaChoisi ? jours[index].postures.filter((x) => x !== pid) : [...jours[index].postures, pid] };
    setForm({ ...form, jours });
  };

  const enregistrer = async () => {
    setErreur('');
    if (!form.titre.trim()) { setErreur('Renseignez un titre pour le programme.'); return; }
    const joursValides = form.jours.filter((j) => j.titre.trim());
    if (joursValides.length === 0) { setErreur('Renseignez au moins un jour avec un titre.'); return; }
    const id = form.id.trim() || 'prog-' + form.titre.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 15);
    const jours = joursValides.map((j, i) => ({ jour: i + 1, titre: j.titre.trim(), duree: Number(j.duree) || 5, gratuit: !!j.gratuit, postures: j.postures || [] }));
    const progFinal = { id, titre: form.titre, sousTitre: form.sousTitre || 'Programme', description: form.description, jours };

    // Sauvegarde en base Supabase (upsert : crée ou met à jour selon le slug)
    const { error } = await supabase.from('programmes').upsert({
      slug: id,
      titre: progFinal.titre,
      sous_titre: progFinal.sousTitre,
      description: progFinal.description,
      jours: progFinal.jours,
    }, { onConflict: 'slug' });

    if (error) {
      console.error('Erreur sauvegarde programme:', error);
      setErreur('Erreur lors de la sauvegarde. Vérifiez votre connexion.');
      return;
    }

    if (editId === 'nouveau') setProgrammes([...programmes, progFinal]);
    else setProgrammes(programmes.map((p) => (p.id === editId ? progFinal : p)));
    annuler();
  };

  const supprimer = async (id) => {
    const { error } = await supabase.from('programmes').delete().eq('slug', id);
    if (error) {
      console.error('Erreur suppression programme:', error);
      alert('Erreur lors de la suppression. Vérifiez votre connexion.');
      return;
    }
    setProgrammes(programmes.filter((p) => p.id !== id));
  };

  return (
    <div className="fade-up">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <h3 className="font-display text-3xl" style={{ color: COLORS.textDark }}>Gérer les programmes</h3>
        <button onClick={nouveau} className="px-5 py-3 rounded-full text-sm tracking-widest uppercase flex items-center gap-2" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
          <Plus size={16} /> Nouveau programme
        </button>
      </div>

      {form && (
        <div className="mb-8 p-6 rounded-3xl fade-up" style={{ background: 'rgba(255,255,255,0.7)', border: `2px solid ${COLORS.primary}` }}>
          <h4 className="font-display text-2xl mb-4" style={{ color: COLORS.secondary }}>{editId === 'nouveau' ? 'Créer un programme' : 'Modifier le programme'}</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Titre *</label>
              <input value={form.titre} onChange={(e) => setForm({ ...form, titre: e.target.value })} placeholder="Ex. 21 jours vers le sommeil" className="w-full px-4 py-2 rounded-xl" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
            </div>
            <div>
              <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Sous-titre</label>
              <input value={form.sousTitre} onChange={(e) => setForm({ ...form, sousTitre: e.target.value })} placeholder="Ex. Pour mieux dormir" className="w-full px-4 py-2 rounded-xl" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-xl" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
          </div>
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs tracking-widest uppercase block" style={{ color: COLORS.primary }}>Jours du programme ({form.jours.length}) *</label>
              <button onClick={ajouterJour} className="px-3 py-1.5 rounded-full text-xs tracking-widest uppercase flex items-center gap-1" style={{ background: COLORS.primaryLight, color: COLORS.backgroundCream }}>
                <Plus size={13} /> Ajouter un jour
              </button>
            </div>
            <div className="space-y-2">
              {form.jours.map((j, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl flex-wrap" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)' }}>
                  <span className="text-xs font-bold" style={{ color: COLORS.primary, minWidth: '50px' }}>Jour {i + 1}</span>
                  <input
                    value={j.titre}
                    onChange={(e) => modifierJour(i, 'titre', e.target.value)}
                    placeholder="Titre / thème du jour"
                    className="flex-1 min-w-[160px] px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'white', border: '1px solid rgba(193,157,11,0.2)', color: COLORS.textDark, outline: 'none' }}
                  />
                  <input
                    type="number"
                    value={j.duree}
                    onChange={(e) => modifierJour(i, 'duree', e.target.value)}
                    placeholder="Min"
                    className="w-20 px-3 py-2 rounded-lg text-sm"
                    style={{ background: 'white', border: '1px solid rgba(193,157,11,0.2)', color: COLORS.textDark, outline: 'none' }}
                  />
                  <span className="text-xs" style={{ color: COLORS.textMedium }}>min</span>
                  <label className="flex items-center gap-1 cursor-pointer text-xs" style={{ color: COLORS.primary }}>
                    <input type="checkbox" checked={j.gratuit} onChange={(e) => modifierJour(i, 'gratuit', e.target.checked)} className="w-4 h-4" />
                    Gratuit
                  </label>
                  {form.jours.length > 1 && (
                    <button onClick={() => supprimerJour(i)} className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: 'rgba(160,82,45,0.12)', color: COLORS.textAccent }}>
                      <Trash2 size={13} />
                    </button>
                  )}
                  <div className="w-full mt-2">
                    <p className="text-[10px] uppercase tracking-wide mb-1.5" style={{ color: COLORS.textMedium }}>
                      Postures de ce jour ({j.postures.length}) — laisser vide pour une génération aléatoire
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {postures.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => toggleJourPosture(i, p.id)}
                          className="px-2 py-1 rounded-lg text-xs"
                          style={{
                            background: j.postures.includes(p.id) ? `linear-gradient(135deg, ${COLORS.primaryLight}, ${COLORS.primary})` : 'white',
                            color: j.postures.includes(p.id) ? COLORS.backgroundCream : COLORS.textDark,
                            border: '1px solid rgba(193,157,11,0.25)',
                          }}
                        >
                          {p.icone} {p.nomFr}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            {erreur && <p className="text-sm mb-3 w-full" style={{ color: COLORS.textAccent }}>{erreur}</p>}
            <button onClick={enregistrer} className="px-6 py-3 rounded-full text-sm tracking-widest uppercase" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>Publier</button>
            <button onClick={annuler} className="px-6 py-3 rounded-full text-sm tracking-widest uppercase" style={{ background: 'rgba(255,255,255,0.6)', color: COLORS.textDark }}>Annuler</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {programmes.map((p) => (
          <div key={p.id} className="p-5 rounded-2xl flex items-center gap-4 flex-wrap" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(193, 157, 11, 0.2)' }}>
            <div className="p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${COLORS.primarySoft}, ${COLORS.primaryLight})` }}>
              <Calendar size={22} style={{ color: COLORS.backgroundCream }} />
            </div>
            <div className="flex-1 min-w-[180px]">
              <p className="font-display text-xl" style={{ color: COLORS.textDark }}>{p.titre}</p>
              <p className="text-xs" style={{ color: COLORS.textMedium }}>{p.sousTitre} · {p.jours.length} jours</p>
            </div>
            <button onClick={() => editer(p)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(193,157,11,0.15)', color: COLORS.secondary }}><Edit3 size={15} /></button>
            <button onClick={() => supprimer(p.id)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(160,82,45,0.12)', color: COLORS.textAccent }}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Admin : Gestion des codes entreprise ---
function AdminCodes({ codes, setCodes }) {
  const [nouveauCode, setNouveauCode] = useState('');
  const [nouvelleEntreprise, setNouvelleEntreprise] = useState('');
  const [nouveauLogo, setNouveauLogo] = useState('◆');
  const [isAdmin, setIsAdmin] = useState(false);
  const [erreur, setErreur] = useState('');
  const [codeEnEdition, setCodeEnEdition] = useState(null);

  const commencerEdition = (code, info) => {
    setCodeEnEdition(code);
    setNouveauCode(code);
    setNouvelleEntreprise(info.entreprise);
    setNouveauLogo(info.logo || '◆');
    setIsAdmin(!!info.isAdmin);
    setErreur('');
  };

  const annulerEdition = () => {
    setCodeEnEdition(null);
    setNouveauCode(''); setNouvelleEntreprise(''); setNouveauLogo('◆'); setIsAdmin(false); setErreur('');
  };

  const enregistrer = async () => {
    const code = nouveauCode.trim().toUpperCase();
    if (!code || !nouvelleEntreprise.trim()) { setErreur('Renseignez un code et un nom d\'entreprise.'); return; }
    if (!codeEnEdition && codes[code]) { setErreur('Ce code existe déjà.'); return; }

    const { error } = await supabase.from('codes_entreprise').upsert({
      code,
      libelle: nouvelleEntreprise.trim(),
      actif: true,
      is_admin: isAdmin,
    }, { onConflict: 'code' });

    if (error) {
      setErreur('Erreur lors de l\'enregistrement. Vérifiez votre connexion.');
      console.error('Erreur enregistrement code entreprise:', error);
      return;
    }

    const nouveauxCodes = { ...codes };
    if (codeEnEdition && codeEnEdition !== code) delete nouveauxCodes[codeEnEdition];
    nouveauxCodes[code] = { entreprise: nouvelleEntreprise.trim(), logo: nouveauLogo || '◆', isAdmin };
    setCodes(nouveauxCodes);
    annulerEdition();
  };

  const supprimer = async (code) => {
    const { error } = await supabase.from('codes_entreprise').delete().eq('code', code);
    if (error) {
      console.error('Erreur suppression code entreprise:', error);
      alert('Erreur lors de la suppression. Vérifiez votre connexion.');
      return;
    }
    const c = { ...codes };
    delete c[code];
    setCodes(c);
  };

  const logosDispo = ['◆', '✦', '●', '◯', '■', '🪷', '🌿', '☀️'];

  return (
    <div className="fade-up">
      <h3 className="font-display text-3xl mb-2" style={{ color: COLORS.textDark }}>Codes entreprise</h3>
      <p className="text-sm mb-6" style={{ color: COLORS.textMedium }}>Chaque code donne aux salariés d'une entreprise l'accès complet à l'appli. Créez-en un nouveau à chaque contrat signé.</p>

      {/* Formulaire d'ajout */}
      <div className="mb-8 p-6 rounded-3xl" style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(193, 157, 11, 0.3)' }}>
        <h4 className="font-display text-xl mb-4" style={{ color: COLORS.secondary }}>Créer un code</h4>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Code d'accès</label>
            <input value={nouveauCode} onChange={(e) => { setNouveauCode(e.target.value); setErreur(''); }} placeholder="PILATE-ENTREPRISE2026" className="w-full px-4 py-2 rounded-xl uppercase" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
          </div>
          <div>
            <label className="text-xs tracking-widest uppercase mb-1 block" style={{ color: COLORS.primary }}>Nom de l'entreprise</label>
            <input value={nouvelleEntreprise} onChange={(e) => { setNouvelleEntreprise(e.target.value); setErreur(''); }} placeholder="Renault Toulon" className="w-full px-4 py-2 rounded-xl" style={{ background: COLORS.backgroundWhite, border: '1px solid rgba(193,157,11,0.3)', color: COLORS.textDark, outline: 'none' }} />
          </div>
        </div>
        <label className="text-xs tracking-widest uppercase mb-2 block" style={{ color: COLORS.primary }}>Symbole</label>
        <div className="flex gap-2 flex-wrap mb-4">
          {logosDispo.map((l) => (
            <button key={l} onClick={() => setNouveauLogo(l)} className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: nouveauLogo === l ? COLORS.secondary : COLORS.backgroundWhite, color: nouveauLogo === l ? COLORS.backgroundCream : COLORS.textDark, border: '1px solid rgba(193,157,11,0.3)' }}>{l}</button>
          ))}
        </div>
        <label className="flex items-center gap-2 mb-4 cursor-pointer">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={(e) => setIsAdmin(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-xs tracking-widest uppercase" style={{ color: isAdmin ? COLORS.textAccent : COLORS.primary }}>
            ⚠️ Accès administrateur (ce code donnera accès au tableau de bord admin)
          </span>
        </label>
        {erreur && <p className="text-sm mb-3" style={{ color: COLORS.textAccent }}>{erreur}</p>}
        <div className="flex gap-2">
          <button onClick={enregistrer} className="px-6 py-3 rounded-full text-sm tracking-widest uppercase flex items-center gap-2" style={{ background: COLORS.secondary, color: COLORS.backgroundCream }}>
            <Plus size={16} /> {codeEnEdition ? 'Enregistrer les modifications' : 'Ajouter le code'}
          </button>
          {codeEnEdition && (
            <button onClick={annulerEdition} className="px-6 py-3 rounded-full text-sm tracking-widest uppercase" style={{ background: 'transparent', border: `1px solid ${COLORS.primary}`, color: COLORS.primary }}>
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* Liste des codes */}
      <div className="space-y-3">
        {Object.entries(codes).map(([code, info]) => (
          <div key={code} className="p-5 rounded-2xl flex items-center gap-4 flex-wrap" style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(193, 157, 11, 0.2)' }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(193,157,11,0.15)' }}>{info.logo}</div>
            <div className="flex-1 min-w-[180px]">
              <p className="font-display text-xl" style={{ color: COLORS.textDark }}>{info.entreprise}</p>
              <p className="text-xs tracking-widest uppercase" style={{ color: COLORS.primary }}>{code}</p>
            </div>
            {info.isAdmin && (
              <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide" style={{ background: COLORS.textAccent, color: 'white' }}>
                ⚠️ Admin
              </span>
            )}
            <button onClick={() => commencerEdition(code, info)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(74,124,111,0.12)', color: COLORS.primary }}><Edit3 size={15} /></button>
            <button onClick={() => supprimer(code)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(160,82,45,0.12)', color: COLORS.textAccent }}><Trash2 size={15} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
