// src/components/MatchCard.jsx
'use client'; // <-- AJOUTÉ: Nécessaire car on utilise un hook (useRadioStore)

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from 'next/image';
import { cn } from "@/lib/utils";

// --- AJOUTÉ ---
// Importe le hook de notre store Zustand
import { useRadioStore } from '@/store/radioStore';
// --- FIN AJOUT ---

export default function MatchCard({ match }) {
  // --- AJOUTÉ ---
  // Récupère l'action setSelectedMatch depuis le store
  const setSelectedMatch = useRadioStore((state) => state.setSelectedMatch);
  // Récupère aussi le match actuellement sélectionné pour un effet visuel (optionnel)
  const selectedMatchId = useRadioStore((state) => state.selectedMatch?.idEvent);
  // --- FIN AJOUT ---

  if (!match) {
    return null;
  }

  const {
    strHomeTeam = "Équipe A",
    strAwayTeam = "Équipe B",
    strHomeTeamBadge = "/placeholder-logo.png",
    strAwayTeamBadge = "/placeholder-logo.png",
    strLeague = "Ligue",
    dateEventLocal = "YYYY-MM-DD",
    strTimeLocal = "HH:MM",
    idEvent = "default-id",
    strStatus // Récupère aussi le statut (ex: "Not Started", "Live", "Finished")
  } = match;

  // Détermine si la carte est celle du match sélectionné (pour style visuel)
  const isSelected = selectedMatchId === idEvent;

  // Adapte le tag LIVE basé sur le statut réel si disponible
  // (Attention: Les statuts de TheSportsDB peuvent varier, ex: "NS", "1H", "HT", "2H", "FT")
  // Ceci est une interprétation simple, à affiner si besoin.
  const isLive = strStatus && !["NS", "FT", "PST", "CANC", "ABD", "AWD", "WO"].includes(strStatus.toUpperCase());
  const displayStatus = strStatus === "NS" ? `${dateEventLocal} - ${strTimeLocal}` : strStatus;

  // --- MODIFIÉ : Ajout du handler ---
  const handleCardClick = () => {
    console.log("MatchCard clicked:", match.strEvent, match.idEvent);
    setSelectedMatch(match); // Appelle l'action du store avec les données du match
  };
  // --- FIN MODIFICATION ---

  return (
    // --- MODIFIÉ : Enveloppé dans un <button> et ajout onClick ---
    <button
      type="button" // Important pour un bouton qui n'est pas dans un <form>
      onClick={handleCardClick}
      className={cn(
        "w-full text-left rounded-lg overflow-hidden transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", // Style pour le bouton (reset + focus)
        isSelected ? "ring-2 ring-primary ring-offset-2" : "" // Style si sélectionné
      )}
    >
      <Card className={cn(
          "w-full shadow-lg hover:shadow-xl",
          isSelected ? "border-primary" : "" // Bordure si sélectionné
        )}
      >
         <CardHeader className="p-3 relative bg-gray-50 dark:bg-gray-800"> {/* Padding réduit */}
           <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
             <span className="truncate pr-1">{strLeague}</span> {/* Truncate League */}
             {/* Affiche Statut (ou Date/Heure si NS) */}
             <span className="flex-shrink-0">{displayStatus}</span>
           </div>
           {/* Tag Live amélioré */}
           {isLive && (
             <div className="absolute top-1 right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded z-10">
               LIVE
             </div>
           )}
         </CardHeader>
         <CardContent className="p-3"> {/* Padding réduit */}
           <div className="flex items-center justify-around text-center">
             <div className="flex flex-col items-center w-[40%]"> {/* Largeur ajustée */}
               <Image
                 src={strHomeTeamBadge || "/placeholder-logo.png"}
                 alt={`Logo ${strHomeTeam}`}
                 width={32} // Taille réduite
                 height={32}
                 className="mb-1"
                 unoptimized
               />
               <span className="text-xs font-medium truncate w-full">{strHomeTeam}</span>
             </div>
             <div className="text-base font-bold mx-1"> {/* Taille ajustée */}
               VS
             </div>
             <div className="flex flex-col items-center w-[40%]"> {/* Largeur ajustée */}
               <Image
                 src={strAwayTeamBadge || "/placeholder-logo.png"}
                 alt={`Logo ${strAwayTeam}`}
                 width={32} // Taille réduite
                 height={32}
                 className="mb-1"
                 unoptimized
               />
               <span className="text-xs font-medium truncate w-full">{strAwayTeam}</span>
             </div>
           </div>
         </CardContent>
      </Card>
    </button>
    // --- FIN MODIFICATION ---
  );
}