// src/components/MatchesCarousel.jsx
import React from 'react';

// Importe les composants Carousel que tu viens d'ajouter
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"; // Vérifie le chemin

// Importe le composant MatchCard qu'on a créé
import MatchCard from '@/components/MatchCard';

// Le composant Carousel - Attend une liste 'matches' et un 'title' optionnel en props
export default function MatchesCarousel({ matches, title }) {

  // Vérification simple des props
  if (!matches || !Array.isArray(matches) || matches.length === 0) {
    // On peut afficher un message ou ne rien rendre si pas de matchs
    return (
      <div className="my-8">
        {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
        <p className="text-gray-500">Aucun match à afficher dans cette section pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full my-8"> {/* Marge verticale pour espacer les sections */}
      {/* Affiche le titre de la section s'il est fourni */}
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      <Carousel
        opts={{
          align: "start", // Alignement des cartes au début
          loop: false, // Mettre à true si tu veux que ça boucle
        }}
        className="w-full" // Prend toute la largeur disponible
      >
        <CarouselContent className="-ml-4"> {/* Marge négative pour compenser le padding des items */}
          {matches.map((match) => (
            // Chaque carte est un élément du carrousel
            <CarouselItem key={match.idEvent || match.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"> {/* Padding + taille par breakpoint */}
              {/* On utilise notre composant MatchCard ici ! */}
              <MatchCard match={match} />
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Flèches de navigation (optionnelles mais recommandées) */}
        <CarouselPrevious className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
}