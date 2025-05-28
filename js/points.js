const score = parseInt(localStorage.getItem("score")) || 0;
const questionCount = parseInt(localStorage.getItem("questionCount")) || 0;
const lastCorrect = localStorage.getItem("lastCorrect") === "true";
const lastPoints = lastCorrect ? 10 : 0;

document.querySelector("h1").textContent = lastCorrect ? "Well Done!" : "Maybe next time!";
document.querySelector(".number").textContent = "+0";

// Zahl hochzählen (nur wenn Punkte > 0)
if (lastPoints > 0) {
    let current = 0;
    const interval = setInterval(() => {
        if (current >= lastPoints) {
            clearInterval(interval);
        } else {
            current++;
            document.querySelector(".number").textContent = `+${current}`;
        }
    }, 80);
}

// Kreis rot bei Fehler
if (!lastCorrect) {
    document.querySelector(".number").classList.add("false");
    document.querySelector("circle").classList.add("red");
}

// Gesamtscore anzeigen
document.querySelector(".current-score").textContent = `Current score: ${score}`;

// Weiterleitung vorbereiten
const button = document.querySelector(".buttonStandard");
if (questionCount >= 5) {
    button.textContent = "See final score";
    button.href = "score.html";
} else {
    button.textContent = "Next question";
    button.href = "quiz.html";
}

