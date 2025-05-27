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

    loadRandomShow(); // Quiz laden Sobald alle Daten geladen sind
}

main(); // Funktion aufrufen

// Funktion zum Anzeigen des Quiz
function loadRandomShow() {
    document.querySelector(".sharp-edges").classList.remove("unblur");
    const randomIndex = Math.floor(Math.random() * all_showTitles_with_details.length);
    const correctShow = all_showTitles_with_details[randomIndex];

    // Tag 1: Netzwerk oder WebChannel prüfen
    const tag1 = correctShow.webChannel !== '—' ? correctShow.webChannel : correctShow.network;

    // Tag 2: Jahr(e)
    const premieredYear = new Date(correctShow.premiered).getFullYear();
    const endedYear = correctShow.ended !== "Läuft noch" && correctShow.ended !== "—"
        ? new Date(correctShow.ended).getFullYear()
        : "now";
    const tag2 = `${premieredYear} - ${endedYear}`;

    // Tag 3: Typ
    const tag3 = correctShow.type;

    // Bild und Genres setzen
    document.getElementById("show-image").src = correctShow.image;
    document.getElementById("genres").textContent = "Genres: " + correctShow.genres;

    // Tags einfügen
    document.querySelectorAll(".tag1").forEach(el => el.textContent = tag1);
    document.querySelectorAll(".tag2").forEach(el => el.textContent = tag2);
    document.querySelectorAll(".tag3").forEach(el => el.textContent = tag3);

    // Antwortbuttons erstellen
    const answersContainer = document.getElementById("answer-buttons");
    answersContainer.innerHTML = ""; // vorherige löschen

    // Titel mischen
    const allTitles = all_showTitles_with_details.map(show => show.name);
    const wrongTitles = allTitles.filter(title => title !== correctShow.name);
    const randomWrong = wrongTitles.sort(() => 0.5 - Math.random()).slice(0, 2);
    const allOptions = [correctShow.name, ...randomWrong].sort(() => 0.5 - Math.random());

    allOptions.forEach(option => {
        const btn = document.createElement("button");
        btn.textContent = option;
        btn.classList.add("quiz-button");

        btn.addEventListener("click", () => {
            const allButtons = document.querySelectorAll("#answer-buttons button");

            allButtons.forEach(button => {
                button.disabled = true; // HTML deaktivieren

                if (button.textContent === correctShow.name) {
                    button.classList.add("correct");
                } else if (button === btn) {
                    button.classList.add("wrong");
                } else {
                    button.classList.add("disabled");
                }
            });

            // Bild entbluren
            document.querySelector(".sharp-edges").classList.add("unblur");

            // Mobile vs. Desktop unterscheiden
            if (window.innerWidth <= 768) {
                document.getElementById("mobile-overlay").classList.remove("hide");

                // Overlay klick -> nächste Frage laden
                document.getElementById("mobile-overlay").onclick = () => {
                    document.getElementById("mobile-overlay").classList.add("hide");
                    loadRandomShow(); // nächste Frage
                };
            } else {
                document.getElementById("continue-button").classList.remove("hide");

                document.getElementById("continue-button").onclick = () => {
                    document.getElementById("continue-button").classList.add("hide");
                    loadRandomShow(); // nächste Frage
                };
            }
        });

        answersContainer.appendChild(btn);
    });
}

