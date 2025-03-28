// src/lib/supabaseQueries.js
import { supabase } from './supabaseClient'; // Assurez-vous que le chemin est correct

// Récupère toutes les radios marquées comme 'FR'
export async function getFrenchRadios() {
    console.log("Fetching French radios from Supabase...");
    const { data, error } = await supabase
        .from('radios') // Nom de votre table
        .select('*')    // Sélectionne toutes les colonnes
        .eq('country_code', 'FR'); // Filtre où country_code est 'FR'

    if (error) {
        console.error('Error fetching French radios:', error);
        return []; // Retourne tableau vide en cas d'erreur
    }
    console.log(`Found ${data?.length || 0} French radios.`);
    return data || []; // Retourne les données ou tableau vide
}

/**
 * Trouve les radios françaises applicables pour un match donné.
 * Priorise les radios spécifiques à l'événement, sinon cherche les radios liées aux équipes.
 * @param {string} matchId - L'ID TheSportsDB de l'événement (match).
 * @param {string} teamAId - L'ID TheSportsDB de l'équipe A.
 * @param {string} teamBId - L'ID TheSportsDB de l'équipe B.
 * @returns {Promise<Array<object>>} - Une promesse résolvant avec la liste des objets radios applicables.
 */

export async function getRadiosForMatch(matchId, teamAId, teamBId) {
    console.log(`Searching radios for match ${matchId} (Teams: ${teamAId}, ${teamBId})`);
    let radioIds = [];
    let finalRadios = [];

    // 1. Vérifier les radios spécifiques à l'événement
    const { data: eventRadiosData, error: eventError } = await supabase
        .from('events_radio')
        .select('radio_ids') // Supposant que c'est un array d'IDs de radios
        .eq('event_thesportsdb_id', matchId)
        .maybeSingle(); // Prend le premier trouvé ou null

    if (eventError) {
        console.error('Error fetching event specific radios:', eventError);
        // On continue quand même pour chercher les radios des équipes
    }

    if (eventRadiosData && eventRadiosData.radio_ids && eventRadiosData.radio_ids.length > 0) {
        console.log(`Found event specific radios: ${eventRadiosData.radio_ids.join(', ')}`);
        radioIds = eventRadiosData.radio_ids;
    } else {
        // 2. Si pas de radio spécifique à l'event, chercher celles des équipes
        console.log('No event specific radios, checking team radios...');
        const { data: teamRadiosData, error: teamError } = await supabase
            .from('teams_radios')
            .select('radio_id')
            .in('team_thesportsdb_id', [teamAId, teamBId]);

        if (teamError) {
            console.error('Error fetching team radios:', teamError);
            // On ne peut pas continuer sans IDs
            return [];
        }

        if (teamRadiosData && teamRadiosData.length > 0) {
            // Dédoublonner les IDs de radio
            const uniqueIds = new Set(teamRadiosData.map(link => link.radio_id));
            radioIds = Array.from(uniqueIds);
            console.log(`Found team radios: ${radioIds.join(', ')}`);
        } else {
            console.log('No team radios found either.');
            return []; // Aucune radio trouvée
        }
    }

    // 3. Récupérer les détails des radios trouvées et filtrer par pays ('FR')
    if (radioIds.length > 0) {
        const { data: radiosData, error: radiosError } = await supabase
            .from('radios')
            .select('*')
            .in('id', radioIds) // Récupère les radios dont l'ID est dans notre liste
            .eq('country_code', 'FR'); // S'assure qu'elles sont FR

        if (radiosError) {
            console.error('Error fetching radio details:', radiosError);
            return [];
        }
        finalRadios = radiosData || [];
        console.log(`Found ${finalRadios.length} applicable French radio details.`);
    }

    return finalRadios;
}