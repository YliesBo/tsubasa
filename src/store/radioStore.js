// src/store/radioStore.js
import { create } from 'zustand';
import { getRadiosForMatch } from '@/lib/supabaseQueries';

export const useRadioStore = create((set, get) => ({
  // --- État (State) ---
  selectedMatch: null,
  radios: [],
  isLoadingRadios: false,
  errorRadios: null,

  // --- NOUVEL ÉTAT POUR LE LECTEUR ---
  selectedRadio: null, // Garde l'objet radio complet sélectionné pour lecture
  playerState: 'idle', // 'idle', 'loading', 'playing', 'paused', 'error'
  // ---------------------------------

  // --- Actions ---
  setSelectedMatch: async (match) => {
    // ... (logique existante pour fetcher les radios - INCHANGÉE) ...
     set({
         selectedMatch: match,
         radios: [],
         isLoadingRadios: true,
         errorRadios: null,
         // Réinitialise aussi l'état du lecteur si on change de match
         // selectedRadio: null, // Optionnel: Désélectionner la radio si on change de match?
         // playerState: 'idle'
     });

     if (!match) {
         set({ isLoadingRadios: false });
         return;
     }

     console.log(`Zustand: Match sélectionné - ${match.strEvent} (ID: ${match.idEvent}). Recherche des radios...`);

     try {
         const fetchedRadios = await getRadiosForMatch(
             match.idEvent,
             match.idHomeTeam,
             match.idAwayTeam
         );
         console.log(`Zustand: Radios trouvées pour ${match.idEvent}:`, fetchedRadios);
         set({
             radios: fetchedRadios || [],
             isLoadingRadios: false
         });
     } catch (error) {
         console.error("Zustand: Erreur lors de la récupération des radios via getRadiosForMatch:", error);
         set({
             errorRadios: "Impossible de charger les radios pour ce match.",
             isLoadingRadios: false
         });
     }
  },

  clearSelectedMatch: () => {
    // On peut aussi arrêter la lecture ici si on veut
    // get().stopPlayback(); // Si on crée une action stopPlayback
    get().setSelectedMatch(null);
  },

  // --- NOUVELLES ACTIONS POUR LE LECTEUR ---

  // Action appelée quand on clique sur "Écouter" une radio
  playRadio: (radio) => {
    console.log("Zustand: Demande de lecture pour", radio.name, radio.stream_url);
    // Vérifie si l'URL de stream existe
    if (!radio || !radio.stream_url) {
        console.error("Zustand: Tentative de lecture d'une radio sans URL de stream valide.");
        set({
            selectedRadio: radio, // Garde la radio sélectionnée même si l'URL manque
            playerState: 'error', // Met directement en erreur
            errorRadios: "URL de streaming manquante ou invalide pour cette radio." // Message d'erreur spécifique
        });
        return;
    }

    // Si on clique sur la même radio qui est déjà sélectionnée, on pourrait basculer Play/Pause
    // (On gérera ça plus précisément dans le composant AudioPlayer pour l'instant)

    // Met à jour la radio sélectionnée et passe l'état à 'loading' (le lecteur essaiera de charger)
    set({
      selectedRadio: radio,
      playerState: 'loading',
      errorRadios: null // Reset l'erreur précédente liée aux radios
    });
  },

  // Action pour mettre à jour l'état du lecteur (appelée par le composant AudioPlayer)
  setPlayerState: (newState) => {
    // Ajoute un log pour voir les changements d'état
    console.log("Zustand: Changement état lecteur ->", newState);
    // Validation simple de l'état (optionnel)
    const validStates = ['idle', 'loading', 'playing', 'paused', 'error'];
    if (validStates.includes(newState)) {
      set({ playerState: newState });
    } else {
        console.warn("Zustand: Tentative de définir un état de lecteur invalide:", newState);
    }
  },

  // Action pour arrêter la lecture (optionnel, pour plus de contrôle)
  stopPlayback: () => {
      console.log("Zustand: Arrêt de la lecture demandé.");
      set({
          // selectedRadio: null, // Garder la radio sélectionnée mais arrêter la lecture ?
          playerState: 'idle' // Ou 'paused' ? 'idle' semble plus logique pour un arrêt complet.
      });
      // Le composant AudioPlayer devra réagir à ce changement d'état pour mettre en pause/arrêter le <audio>
  }
  // --- FIN NOUVELLES ACTIONS ---
}));