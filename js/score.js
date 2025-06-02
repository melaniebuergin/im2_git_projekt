 // Punkte laden
const score = parseInt(localStorage.getItem("score")) || 0;

// Punktzahl anzeigen
document.querySelector("h2 span").textContent = `${score}/50`;

const title = document.querySelector(".resulttext h1");
const text = document.querySelector(".resulttext p");

if (score === 0) {
    title.textContent = "Popcorn Waster";
    text.textContent = "You might've put the popcorn in your ear instead of your mouth — but hey, everyone starts somewhere! Maybe try reading the DVD cover first?";
} else if (score === 10 || score === 20) {
    title.textContent = "Series Snoozer";
    text.textContent = "You've held a remote before – that’s a good start! With a little more binge-watching, you're well on your way to stardom.";
} else if (score === 30 || score === 40) {
    title.textContent = "Binge-watch Pro";
    text.textContent = "You've clearly spent more nights with Netflix than you’d care to admit. Your knowledge is solid – almost scary. You're the friend everyone asks for recommendations.";
} else if (score === 50) {
    title.innerHTML = "Cine-Goddess <br> Cine-God!";
    text.textContent = "Wow, respect! You're the final boss of film trivia. Hollywood might call you if a director drops out. Cinema runs through your veins.";
}

// Punkte zurücksetzen nach Anzeige
localStorage.removeItem("score");
localStorage.removeItem("questionCount");
localStorage.removeItem("lastCorrect");