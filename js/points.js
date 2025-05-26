// Kreis Animation Punkte

window.addEventListener("load", () => {
  const number = document.getElementById("number");

  let current = 0;
  const target = 10;
  const duration = 2000; // Dauer der Kreisanimation in ms
  const interval = duration / target;

  const counter = setInterval(() => {
    current++;
    number.textContent = `+${current}`;
    if (current >= target) {
      clearInterval(counter);
    }
  }, interval);
});