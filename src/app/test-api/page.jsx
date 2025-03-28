// src/app/test-api/page.jsx
import { getUpcomingLigue1Matches } from '@/lib/thesportsdb';
import { getFrenchRadios } from '@/lib/supabaseQueries';

export default async function TestApiPage() {
    console.log("Rendering TestApiPage...");
    const matches = await getUpcomingLigue1Matches();
    const radios = await getFrenchRadios();
    console.log("Data fetched for TestApiPage.");

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h1>Page de Test API</h1>

            <h2>Matchs Ligue 1 (Prochains via eventsnextleague)</h2>
            {matches && matches.length > 0 ? (
                <ul>
                    {matches.map((match) => (
                        <li key={match.idEvent}>
                            {/* Correction ici: utilise match.idLeague */}
                            {match.dateEvent} @ {match.strTime || 'N/A'} - {match.strEvent} (ID: {match.idEvent}, LeagueID: {match.idLeague})
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Aucun match trouvé ou erreur lors de la récupération.</p>
            )}

            {/* ... Reste du code pour afficher les radios et les données brutes ... */}
            <h2>Radios Françaises (Supabase)</h2>
            {radios && radios.length > 0 ? (
                 <ul>
                     {radios.map((radio) => (
                         <li key={radio.id}>
                             {radio.name} ({radio.country_code}) - URL: {radio.stream_url}
                         </li>
                     ))}
                 </ul>
             ) : (
                 <p>Aucune radio trouvée ou erreur lors de la récupération.</p>
             )}

             <hr style={{ margin: '20px 0' }}/>

             <h2>Données Brutes (Debug)</h2>
             <h3>Matchs:</h3>
             <pre style={{ background: '#eee', padding: '10px', maxHeight: '400px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                 {JSON.stringify(matches, null, 2)}
             </pre>
             <h3>Radios:</h3>
             <pre style={{ background: '#eee', padding: '10px', maxHeight: '300px', overflow: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                 {JSON.stringify(radios, null, 2)}
             </pre>
        </div>
    );
}

export const revalidate = 600; // Revalide toutes les 10 minutes