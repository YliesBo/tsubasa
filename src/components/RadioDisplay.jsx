// src/components/RadioDisplay.jsx
'use client';

import React from 'react';
import { useRadioStore } from '@/store/radioStore';
import { useShallow } from 'zustand/react/shallow';
// Importe une icône (optionnel, exemple avec lucide-react)
// Installe avec: npm install lucide-react
import { PlayCircle, PauseCircle, Loader2 } from 'lucide-react';

export default function RadioDisplay() {
  // Récupère l'état nécessaire pour l'affichage
  const { selectedMatch, radios, isLoadingRadios, errorRadios } = useRadioStore(
    useShallow((state) => ({
      selectedMatch: state.selectedMatch,
      radios: state.radios,
      isLoadingRadios: state.isLoadingRadios,
      errorRadios: state.errorRadios,
    }))
  );

  // --- AJOUTÉ : Récupère l'action playRadio et l'état du lecteur ---
  const playRadio = useRadioStore((state) => state.playRadio);
  const selectedRadio = useRadioStore((state) => state.selectedRadio);
  const playerState = useRadioStore((state) => state.playerState);
  // --- FIN AJOUT ---


  if (!selectedMatch) {
    return (
        <div className="mt-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-center text-gray-500">
            Sélectionnez un match dans le carrousel pour voir les radios disponibles.
        </div>
    );
  }

  const matchTitle = selectedMatch.strEvent || `${selectedMatch.strHomeTeam} vs ${selectedMatch.strAwayTeam}`;

  return (
    <div className="mt-8 p-4 border rounded-lg shadow-md dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-3">Radios pour : {matchTitle}</h3>

      {isLoadingRadios && (
        <div className="flex items-center justify-center text-blue-600 space-x-2 mt-4"> {/* Centré avec flex */}
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Chargement des radios...</span>
        </div>
      )}

      {errorRadios && !isLoadingRadios && (
        <div className="text-red-600">Erreur : {errorRadios}</div>
      )}

      {!isLoadingRadios && !errorRadios && radios.length > 0 && (
        // --- MODIFIÉ : Structure de la liste pour inclure le bouton ---
        <ul className="space-y-2">
          {radios.map((radio) => {
            // Détermine si cette radio est celle qui est sélectionnée/en cours de lecture/chargement
            const isCurrentRadio = selectedRadio?.id === radio.id;
            const isPlaying = isCurrentRadio && playerState === 'playing';
            const isLoading = isCurrentRadio && playerState === 'loading';

            return (
              <li key={radio.id} className="flex items-center justify-between p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150">
                <span className={cn("font-medium", isCurrentRadio ? "text-primary" : "")}>
                    {radio.name}
                </span>
                <button
                  onClick={() => playRadio(radio)} // Appelle l'action du store avec la radio
                  className={cn(
                      "p-1 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1",
                      isLoading ? "text-gray-400 cursor-wait" : "text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-600",
                      isPlaying ? "text-green-600 dark:text-green-400" : "" // Style différent si en lecture
                  )}
                  aria-label={`Écouter ${radio.name}`}
                  disabled={isLoading} // Désactive le bouton pendant le chargement
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" /> // Icône de chargement
                  ) : isPlaying ? (
                    <PauseCircle className="h-5 w-5" /> // Icône Pause (pourrait être utilisé plus tard pour pauser)
                  ) : (
                    <PlayCircle className="h-5 w-5" /> // Icône Play
                  )}
                </button>
              </li>
            );
           })}
        </ul>
        // --- FIN MODIFICATION ---
      )}

      {!isLoadingRadios && !errorRadios && radios.length === 0 && (
        <div className="text-gray-500">Aucune radio française trouvée pour ce match.</div>
      )}
    </div>
  );
}

// --- AJOUTÉ: Fonction cn si elle n'est pas déjà importée globalement ---
// (Normalement import { cn } from "@/lib/utils"; suffit si utils.js existe)
function cn(...inputs) {
  // Logique simple pour fusionner les classes (peut être plus complexe)
  return inputs.filter(Boolean).join(' ');
}
// --- FIN AJOUT ---