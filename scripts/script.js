let state = "idle";
let diff = "";

// Render pages
const homePage = document.querySelector("#home");
const gamePage = document.querySelector("#game");
const backBtn = document.querySelector(".back-btn");

function renderPages() {
    homePage.classList.toggle("hide", state !== "idle");  
    gamePage.classList.toggle("hide", state !== "answering");  
}

// Render gui
const acronymSpan = document.querySelector(".acronym");
const hintIcon= document.querySelector(".hint-icon");
const correctIcon= document.querySelector(".correct-icon");
const wrongIcon = document.querySelector(".wrong-icon");
const clueSpan = document.querySelector(".clue-span");
const fullName = document.querySelector(".agency-span");

function renderGame() {
    hintIcon.classList.toggle("hide", state !== "answering");
    correctIcon.classList.toggle("hide", state !== "correct");
    wrongIcon.classList.toggle("hide", state !== "wrong");
    clueSpan.classList.toggle("hide", state !== "answering");
    fullName.classList.toggle("hide", state === "answering");
}

backBtn.addEventListener('click', e => {
    state = "idle";
    renderPages();
});

// Get dificulty
const startBtns = document.querySelectorAll(".start-btn");

startBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        diff = e.target.textContent.toLowerCase();
        state = "answering";
        renderPages();
        renderGame();
    });
});

renderPages();