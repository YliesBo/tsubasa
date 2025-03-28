// src/components/MatchCard.jsx
import React from 'react';
// Importe les composants Card que tu viens d'ajouter avec Shadcn
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  // CardDescription, // On n'en a peut-être pas besoin ici
  // CardFooter // On n'en a peut-être pas besoin ici
} from "@/components/ui/card"; // Assure-toi que le chemin est correct (@ pointe vers src)
import Image from 'next/image'; // Pour afficher les logos proprement

// Fonction utilitaire de Shadcn pour fusionner les classes Tailwind
import { cn } from "@/lib/utils";

// Le composant MatchCard - Il attend un objet 'match' en props
export default function MatchCard({ match }) {

  // Si pas de données de match, on n'affiche rien ou un message
  if (!match) {
    return null; // Ou <p>Données de match manquantes</p>
  }

  // Données de base (on utilisera les vraies données du 'match' prop)
  const {
    strHomeTeam = "Équipe A", // Valeurs par défaut pour l'exemple
    strAwayTeam = "Équipe B",
    strHomeTeamBadge = "/placeholder-logo.png", // Chemin vers un logo placeholder
    strAwayTeamBadge = "/placeholder-logo.png",
    strLeague = "Ligue",
    dateEventLocal = "YYYY-MM-DD", // Date locale
    strTimeLocal = "HH:MM", // Heure locale
    idEvent = "default-id" // ID du match
    // Ajoute d'autres champs dont tu auras besoin (ex: strStatus, intHomeScore, intAwayScore...)
  } = match;

  // Pour le tag "Live" (statique pour l'instant)
  const isLive = true; // Mettre à false pour le cacher si besoin

  return (
    <Card className="w-[300px] overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out"> {/* Style de base de la carte */}
      <CardHeader className="p-4 bg-gray-50 dark:bg-gray-800"> {/* En-tête avec fond léger */}
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{strLeague}</span>
          <span>{dateEventLocal} - {strTimeLocal}</span>
        </div>
        <CardTitle className="text-sm font-semibold text-center"> {/* Titre (peut-être pas nécessaire ici) */}
          {/* On met les équipes dans CardContent plutôt */}
        </CardTitle>
        {isLive && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
            LIVE
          </div>
        )}
      </CardHeader>
      <CardContent className="p-4"> {/* Contenu principal */}
        <div className="flex items-center justify-around text-center">
          {/* Équipe Domicile */}
          <div className="flex flex-col items-center w-1/3">
            <Image
              src={strHomeTeamBadge || "/placeholder-logo.png"}
              alt={`Logo ${strHomeTeam}`}
              width={40}
              height={40}
              className="mb-1"
              unoptimized // Si les URL des logos sont externes et non optimisables par Next/Image
            />
            <span className="text-xs font-medium truncate w-full">{strHomeTeam}</span>
          </div>

          {/* Score (ou VS pour l'instant) */}
          <div className="text-lg font-bold mx-2">
            VS {/* Remplacer par les scores quand disponibles */}
          </div>

          {/* Équipe Extérieur */}
          <div className="flex flex-col items-center w-1/3">
            <Image
              src={strAwayTeamBadge || "/placeholder-logo.png"}
              alt={`Logo ${strAwayTeam}`}
              width={40}
              height={40}
              className="mb-1"
              unoptimized // Si les URL des logos sont externes
            />
            <span className="text-xs font-medium truncate w-full">{strAwayTeam}</span>
          </div>
        </div>
      </CardContent>
      {/* On pourrait ajouter un CardFooter pour un bouton "Voir détails" plus tard */}
      {/* <CardFooter className="p-2 justify-center">
        <button className="text-xs text-blue-600 hover:underline">Détails</button>
      </CardFooter> */}
    </Card>
  );
}