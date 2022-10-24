const startButton = document.querySelector("#start-btn");
const restartButton = document.querySelector("restart-btn");
const target = document.querySelector(".target");
const getRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// document.querySelector(".target").hidden = true;
let countTarget = 0;
console.log(countTarget);

const trackNbTarg = document.querySelector("#nbTarget");
const trackScore = document.querySelector("#score");
const targetBox = document.querySelector("#target width");
function addTarget() {
  const targetClone = target.cloneNode();
  targetClone.style.left = getRandom(0, 900 - 90) + "px";
  targetClone.style.top = getRandom(0, 600 - 90) + "px";
  //numWidth = targetBox.width;
  targetClone.addEventListener("click", function onClick(event) {
    numClicks += 1;
    // score += 100 / ((100 * numWidth) / 70);
    document.querySelector("#clickCount").textContent = numClicks;
    targetClone.remove();
  });
  target.after(targetClone);
  countTarget++;
  trackNbTarg.textContent = countTarget;
}

let numClicks = 0;
let score = 0;

startButton.addEventListener("click", () => {
  setInterval(addTarget, 1000);
});
