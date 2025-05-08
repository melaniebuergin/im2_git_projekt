// Import movieTitles vom File movieTitels.js
import { showTitles } from './showTitles.js';

console.log(showTitles); // Zum Testen



const all_showTitles_with_details = [];

async function loadShowDetails(title) {
    const url = `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(title)}`;
    try {
        const response = await fetch(url);
        const answer = await response.json();
        return {
            name: answer.name,
            webChannel: answer.webChannel?.name || '—',
            network: answer.network?.name || '—',
            premiered: answer.premiered || 'Unbekannt',
            ended: answer.ended || 'Läuft noch',
            genres: answer.genres?.join(', ') || 'Keine Genres',
            image: answer.image?.original || '',
            type: answer.type
        };
    } catch (error) {
        console.error(`Fehler bei "${title}":`, error);
        return null;
    } 
}

// alles abrufen – in async Funktion einpacken!
async function main() {
    for (const showTitle of showTitles) {
        const details = await loadShowDetails(showTitle);
        if (details) all_showTitles_with_details.push(details);
    }

    console.log(all_showTitles_with_details); // Test-Ausgabe
}

main(); // Funktion aufrufen


