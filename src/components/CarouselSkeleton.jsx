// src/components/CarouselSkeleton.jsx
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card"; // On réutilise la structure Card
import { cn } from "@/lib/utils";

// Composant pour une carte "squelette" individuelle
function MatchCardSkeleton() {
  return (
    <Card className="w-[300px] overflow-hidden shadow-lg">
        <CardHeader className="p-3 bg-gray-200 dark:bg-gray-700 h-10">
            {/* Placeholder pour titre/date */}
            <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        </CardHeader>
        <CardContent className="p-3">
             <div className="flex items-center justify-around text-center">
                {/* Placeholder équipe A */}
                <div className="flex flex-col items-center w-[40%] space-y-2">
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                </div>
                 {/* Placeholder VS */}
                 <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-6"></div>
                 {/* Placeholder équipe B */}
                 <div className="flex flex-col items-center w-[40%] space-y-2">
                    <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-2 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
                </div>
             </div>
        </CardContent>
    </Card>
  );
}


// Le composant Squelette pour le Carousel entier
export default function CarouselSkeleton({ title, count = 4 }) { // Affiche 'count' squelettes par défaut
  return (
    <div className="w-full my-8 animate-pulse"> {/* Animation de pulsation globale */}
      {/* Affiche le titre */}
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}

      {/* Conteneur pour les squelettes (simule le carousel mais sans défilement) */}
      {/* On utilise overflow-hidden pour s'assurer qu'il ne dépasse pas */}
      <div className="relative overflow-hidden">
          {/* Utilise flex pour aligner les squelettes, mais sans permettre le scroll */}
          <div className="flex space-x-4 -ml-4 pl-4">
             {/* Affiche plusieurs squelettes de cartes */}
             {Array.from({ length: count }).map((_, index) => (
                 <div key={index} className="flex-shrink-0 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"> {/* Utilise les mêmes bases que le vrai carrousel */}
                     <MatchCardSkeleton />
                 </div>
             ))}
          </div>
          {/* Placeholders pour les boutons (optionnel) */}
          {/* <div className="absolute left-[-15px] top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div> */}
          {/* <div className="absolute right-[-15px] top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div> */}
      </div>

    </div>
  );
}