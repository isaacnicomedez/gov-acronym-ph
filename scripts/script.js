let state = "idle";
let diff = "";

// Get dificulty
const startBtns = document.querySelectorAll(".start-btn");

startBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        diff = e.target.textContent.toLowerCase();
        state = "answering";
    });
})