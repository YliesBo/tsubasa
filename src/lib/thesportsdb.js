// src/lib/thesportsdb.js
const API_KEY = process.env.THESPORTSDB_API_KEY;
// URL de base V2, sans clé ni version spécifique dans le chemin ici
const BASE_URL = `https://www.thesportsdb.com/api/v2/json`;

/**
 * Récupère les prochains matchs de Ligue 1 (ID 4334)
 * en utilisant l'endpoint /schedule/next/league/ et l'authentification par Header X-API-KEY.
 */
export async function getUpcomingLigue1Matches() {
    // Vérifie si la clé API est bien chargée depuis .env.local
    if (!API_KEY) {
        console.error('CRITICAL: TheSportsDB API Key is missing from environment variables.');
        throw new Error('TheSportsDB API Key is missing.');
    }

    const leagueId = '4334'; // ID pour French Ligue 1
    const url = `${BASE_URL}/schedule/next/league/${leagueId}`;

    console.log(`Workspaceing upcoming Ligue 1 matches using validated endpoint: ${url}`);

    try {
        const response = await fetch(url, {
            method: 'GET', // Méthode GET par défaut, mais on peut être explicite
            headers: {
                // *** LA CORRECTION CRUCIALE EST ICI ***
                'X-API-KEY': API_KEY
            },
            // On garde le cache de Next.js pour éviter les appels répétés
            next: { revalidate: 3600 } // Cache 1h
        });

        if (!response.ok) {
            // Si on a encore une erreur, vérifier le statut et le message
            console.error(`Error fetching schedule/next/league: ${response.status} ${response.statusText}`);
            const errorBody = await response.text();
            console.error("Error body:", errorBody);
            // Si c'est 401 Unauthorized -> Problème de clé API
            // Si c'est 404 Not Found -> Problème d'URL d'endpoint
            // Si c'est 429 Too Many Requests -> Rate limit atteint
            return []; // Retourne un tableau vide en cas d'erreur
        }

        const data = await response.json();
        // On suppose que la réponse contient une clé 'events' ou 'schedule'
        // D'après votre capture, ça semble être 'schedule'
        const matches = data.schedule || data.events || [];

        console.log(`Found ${matches.length} upcoming matches for Ligue 1 using schedule/next/league.`);

        // On retourne directement ce que l'API nous donne
        return matches;

    } catch (error) {
        console.error("Error in getUpcomingLigue1Matches:", error);
        return []; // Retourne un tableau vide en cas d'erreur majeure
    }
}

// --- Autres fonctions ---