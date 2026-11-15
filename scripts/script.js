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

backBtn.addEventListener('click', e => {
    state = "idle";
    renderPages();
})

// Get dificulty
const startBtns = document.querySelectorAll(".start-btn");

startBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        diff = e.target.textContent.toLowerCase();
        state = "answering";
        renderPages();
    });
})

renderPages();