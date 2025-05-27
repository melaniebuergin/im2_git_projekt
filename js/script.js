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

    startQuiz(); // Quiz starten, sobald alles geladen ist
}

main(); // Funktion aufrufen







function startQuiz() {
    loadNewQuestion(); // erste Frage laden
}


function getRandomShow(excludeName) {
    let filtered = all_showTitles_with_details.filter(show => show.name !== excludeName);
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function loadNewQuestion() {
    const show = all_showTitles_with_details[Math.floor(Math.random() * all_showTitles_with_details.length)];
    const correctName = show.name;

    // HTML Elemente auswählen
    const img = document.getElementById('show-image');
    const tag1 = document.getElementById('tag1');
    const tag2 = document.getElementById('tag2');
    const tag3 = document.getElementById('tag3');
    const buttons = document.querySelectorAll('.choice-btn');

    // Bild setzen
    img.src = show.image;
    img.alt = show.name;

    // Tags setzen
    tag1.textContent = show.webChannel !== '—' ? show.webChannel : show.network;
    tag2.textContent = `${show.premiered} - ${show.ended}`;
    tag3.textContent = show.type;

    // Antwortoptionen vorbereiten
    const wrong1 = getRandomShow(correctName);
    const wrong2 = getRandomShow(correctName === wrong1.name ? '' : correctName);
    const options = [correctName, wrong1.name, wrong2.name].sort(() => Math.random() - 0.5);

    // Buttons befüllen
    buttons.forEach((btn, idx) => {
        btn.textContent = options[idx];
        btn.onclick = () => {
            if (btn.textContent === correctName) {
                alert('✅ Richtig!');
            } else {
                alert(`❌ Falsch! Die richtige Antwort war: ${correctName}`);
            }
            loadNewQuestion(); // Nächste Frage
        };
    });
}