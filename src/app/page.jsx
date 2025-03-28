// src/app/page.jsx

// Imports nécessaires
import { Suspense } from 'react';
import { getUpcomingLigue1Matches } from '@/lib/thesportsdb';
import MatchesCarousel from '@/components/MatchesCarousel';
import RadioDisplay from '@/components/RadioDisplay';
import CarouselSkeleton from '@/components/CarouselSkeleton'; // Importe le squelette

// La page principale reste un Server Component async
export default async function HomePage() {

  // Lance l'appel API mais SANS await ici, on garde la promesse
  const matchesPromise = getUpcomingLigue1Matches();

  // On déplacera la gestion d'erreur fine dans le composantFetcher

  return (
    <div>
      {/* On peut ajouter un titre général à la page si on veut */}
      {/* <h1 className="text-3xl font-bold mb-6">Matchs à venir</h1> */}

      {/*
        Utilisation de Suspense :
        - fallback: Ce qui est montré pendant que le composant enfant "suspend".
        - Le composant enfant (UpcomingMatchesFetcher) va gérer l'attente (await) de la promesse.
      */}
      <Suspense fallback={<CarouselSkeleton title="Prochains Matchs de Ligue 1" />}>
        {/* Composant enfant qui attend la promesse */}
        <UpcomingMatchesFetcher promise={matchesPromise} />
      </Suspense>

      {/* Le RadioDisplay reste ici, car il ne dépend pas directement des matchs */}
      <RadioDisplay />

      {/* --- TODO pour plus tard --- */}
      {/* Ajouter d'autres sections de carrousels ici, potentiellement chacune dans son propre Suspense */}

    </div>
  );
}


// --- NOUVEAU Composant Intermédiaire ---
// Ce composant 'async' est celui qui va réellement attendre la promesse des matchs.
// Son rendu est "suspendu" jusqu'à ce que l'await soit résolu.
async function UpcomingMatchesFetcher({ promise }) {
  let upcomingMatches = [];
  let fetchError = null;

  try {
    // C'est ICI qu'on attend la résolution de la promesse
    const data = await promise;

    // Logique pour extraire les matchs du résultat (comme avant)
    if (Array.isArray(data)) {
      upcomingMatches = data;
    } else if (data && Array.isArray(data.events)) {
      upcomingMatches = data.events;
    } else if (data && Array.isArray(data.schedule)) { // Prise en compte de 'schedule'
      upcomingMatches = data.schedule;
    } else {
      console.warn("UpcomingMatchesFetcher: Could not find matches array in data:", data);
      fetchError = "Format de données de match inattendu.";
    }
    if(!fetchError) {
        console.log(`UpcomingMatchesFetcher: Fetched ${upcomingMatches.length} matches.`);
    }

  } catch (error) {
    console.error("UpcomingMatchesFetcher: Error resolving matches promise:", error);
    fetchError = "Impossible de charger les matchs pour le moment.";
    // Dans un vrai cas, on pourrait vouloir logger l'erreur plus en détail ici ou utiliser une Error Boundary
  }

  // Si une erreur s'est produite
  if (fetchError) {
    return (
      // Affiche un message d'erreur à la place du carrousel
       <div className="my-8 p-4 border border-red-400 bg-red-100 text-red-700 rounded-lg text-center">
           Erreur lors du chargement des matchs : {fetchError}
       </div>
    );
  }

  // Si tout s'est bien passé, rend le carrousel avec les données
  return (
    <MatchesCarousel
        matches={upcomingMatches}
        title="Prochains Matchs de Ligue 1"
    />
  );
}
// --- FIN NOUVEAU Composant ---