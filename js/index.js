// DOM
const startButton = document.querySelector("#start-btn");
const restartButton = document.querySelector("#restart-btn");
const target = document.querySelector(".target");
const trackNbTarg = document.querySelector("#nbTarget");
const trackHealth = document.querySelector("#hp");
const trackTimer = document.querySelector("#timer");
const trackScore = document.querySelector("#score");
const endScreen = document.getElementById("modal");
const hideButton = document.querySelector("#launch");
const mainPage = document.querySelector("#main-page");
const gamePage = document.querySelector("#game-page");
const nbClicks = document.querySelector("#clickCount");

// Sounds
const hitSound = new Audio("/ressources/maince.dsp.wav");

hitSound.volume = 0.01;
//

let isRunning = true;
let targetGenerator;
let gameChecker;
let timerManager;
let isDead = false;
let timeoutIdArray = [];

// Base stats
let score = 0;
let numClicks = 0;
let countTarget = 0;
let health = 10;
let overAllScore = 0;
let timer = 60; // Initialize timer at 60seconds

const getRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

document.querySelector(".target").hidden = true;

// Configure start button
startButton.addEventListener("click", (event) => {
  // Disable start button
  startButton.disabled = true;
  // Configure and init game
  configureGame();
});

restartButton.addEventListener("click", (event) => {
  endScreen.close();
  configureGame();
});

// Configure game variable
function configureGame() {
  isDead = false;
  timer = 60;
  health = 10;
  overAllScore = 0;
  countTarget = 0;
  numClicks = 0;
  console.log("configuring game...");
  // run game once configured
  trackTimer.textContent = timer;
  trackHealth.textContent = health;
  trackScore.textContent = overAllScore;
  trackNbTarg.textContent = countTarget;
  nbClicks.textContent = numClicks;

  runGame();
}

function runGame() {
  // Generate a target every 500ms
  console.log("creating target generator");
  targetGenerator = setInterval(createTarget, 700);
  // Check game status every 50ms
  // console.log("creating game checker");
  // gameChecker = setInterval(checkGame, 50);
  // Decrement timer every 1 second
  console.log("creating timer manager");
  timerManager = setInterval(manageTime, 1000);
}

function manageTime() {
  console.log("decrementing time");
  if (timer === 0) {
    stopGame();
  } else {
    timer--;
    trackTimer.textContent = timer;
  }
}

function checkGame() {
  console.log("checking game status");
  // Stop game if hp == 0
  // if (document.querySelector("#hp").textContent == 0) {
  //   stopGame();
  // }
  if (timer <= 0) {
    console.log("y a pu de temps mdr");
    stopGame();
  }
}

function stopGame() {
  isDead = true;
  clearInterval(targetGenerator);
  // clearInterval(gameChecker);
  clearInterval(timerManager);
  console.log("fin du jeu !!!!");
  startButton.disabled = false;
  timeoutIdArray.forEach((id) => clearInterval(id));
  document.querySelectorAll(".target:not(.original)").forEach((element) => {
    console.log(element);
    element.remove();
  });
  endScreen.showModal();
}

function createTarget() {
  const targetClone = target.cloneNode();
  targetClone.hidden = false;
  targetClone.classList.remove("original");
  // Generate random position for this target
  targetClone.style.left = getRandom(0, 1000 - 90) + "px";
  targetClone.style.top = getRandom(0, 600 - 90) + "px";

  targetClone.addEventListener("click", function onClick(event) {
    hitSound.play();
    let targetScore = 0;
    // Compute score for this target
    let infoTarget = targetClone.getBoundingClientRect();
    let midXPos = infoTarget.left + infoTarget.width / 2;
    let midYPos = infoTarget.top + infoTarget.height / 2;
    let cursorX = event.clientX;
    let cursorY = event.clientY;
    let cursorDistToMidX = Math.abs(cursorX - midXPos);
    let cursorDistToMidY = Math.abs(cursorY - midYPos);
    targetScore = 100 / (1 + (cursorDistToMidX + cursorDistToMidY) / 100);

    // Increment user score
    overAllScore += targetScore;
    trackScore.textContent = overAllScore.toFixed();

    // Set target as clicked
    targetClone.classList.add("removed");
    targetClone.remove();
    numClicks += 1;
    document.querySelector("#clickCount").textContent = numClicks;
  });

  // Decrement if player has not clicked on target in time
  timeoutIdArray.push(
    setTimeout(() => {
      if (!targetClone.classList.contains("removed") && !isDead) {
        health--;
        console.log("lose 1hp");
        if (health === 0) {
          console.log("0 hp :(");
          stopGame();
        }
      }
      document.querySelector("#hp").textContent = health;
      targetClone.remove();
    }, 6000)
  );

  // Initiate for next target generation
  target.after(targetClone);
  countTarget++;
  trackNbTarg.textContent = countTarget;
}

// Hide the main page for the game page
hideButton.addEventListener("click", function quitMain(event) {
  mainPage.classList.add("hidden");
  gamePage.classList.remove("hidden");
});
