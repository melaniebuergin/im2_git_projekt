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

// alles abrufen – in async Funktion einpacken
async function main() {
    for (const showTitle of showTitles) {
        const details = await loadShowDetails(showTitle);
        if (details) all_showTitles_with_details.push(details);
    }

    console.log(all_showTitles_with_details); // Test-Ausgabe

    loadRandomShow(); // Quiz laden Sobald alle Daten geladen sind
}

main(); // Funktion aufrufen



// Initialisiere Punktestand und Fragezähler in localStorage
let currentRound = parseInt(localStorage.getItem("quizRound")) || 1;
localStorage.setItem("quizRound", currentRound); // Falls noch nicht gesetzt

// Funktion zum Anzeigen des Quiz

function loadRandomShow() {
    document.querySelector(".sharp-edges").classList.remove("unblur");

    const randomIndex = Math.floor(Math.random() * all_showTitles_with_details.length);
    const correctShow = all_showTitles_with_details[randomIndex];

    // Tags vorbereiten
    const tag1 = correctShow.webChannel !== '—' ? correctShow.webChannel : correctShow.network;
    const premieredYear = new Date(correctShow.premiered).getFullYear();
    const endedYear = correctShow.ended !== "Läuft noch" && correctShow.ended !== "—"
        ? new Date(correctShow.ended).getFullYear()
        : "now";
    const tag2 = `${premieredYear} - ${endedYear}`;
    const tag3 = correctShow.type;

    // Bild + Genres
    document.getElementById("show-image").src = correctShow.image;
    document.getElementById("genres").textContent = "Genres: " + correctShow.genres;

    // Tags auf beiden Versionen setzen
    document.querySelectorAll(".tag1").forEach(el => el.textContent = tag1);
    document.querySelectorAll(".tag2").forEach(el => el.textContent = tag2);
    document.querySelectorAll(".tag3").forEach(el => el.textContent = tag3);

    // Antworten-Container leeren
    const answersContainer = document.getElementById("answer-buttons");
    answersContainer.innerHTML = "";

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
                button.disabled = true;

                if (button.textContent === correctShow.name) {
                    button.classList.add("correct");
                } else if (button === btn) {
                    button.classList.add("wrong");
                } else {
                    button.classList.add("disabled");
                }
            });

            // Punkteberechnung
            const isCorrect = btn.textContent === correctShow.name;
            let score = parseInt(localStorage.getItem("score")) || 0;
            let questionCount = parseInt(localStorage.getItem("questionCount")) || 0;

            if (isCorrect) score += 10;
            questionCount++;

            localStorage.setItem("score", score);
            localStorage.setItem("questionCount", questionCount);
            localStorage.setItem("lastCorrect", isCorrect); // für points.html merken

            // Bild entbluren
            document.querySelector(".sharp-edges").classList.add("unblur");

            // Weiterleitung – mobile oder desktop
            if (window.innerWidth <= 768) {
                document.getElementById("mobile-overlay").classList.remove("hide");
                document.getElementById("mobile-overlay").onclick = () => {
                    document.getElementById("mobile-overlay").classList.add("hide");
                    window.location.href = "points.html";
                };
            } else {
                document.getElementById("continue-button").classList.remove("hide");
                document.getElementById("continue-button").onclick = () => {
                    document.getElementById("continue-button").classList.add("hide");
                    window.location.href = "points.html";
                };
            }
        });

        answersContainer.appendChild(btn);
    });
}


