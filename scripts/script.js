import { agencies } from "./data.js";

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
const hintIcon = document.querySelector(".hint-icon");
const correctIcon = document.querySelector(".correct-icon");
const wrongIcon = document.querySelector(".wrong-icon");
const clueSpan = document.querySelector(".clue-span");
const fullName = document.querySelector(".agency-span");
const endResult = document.querySelector(".end-result");
const scoreSpan = document.querySelector(".score");
const scoreSpan2 = document.querySelector(".score-top");
const timeSpan = document.querySelector(".time");
const timeSpan2 = document.querySelector(".time-top");

function renderGame() {
    hintIcon.classList.toggle("hide", state !== "answering");
    correctIcon.classList.toggle("hide", state !== "correct");
    wrongIcon.classList.toggle("hide", state !== "wrong");
    clueSpan.classList.toggle("hide", state !== "answering");
    fullName.classList.toggle("hide", state !== "correct" && state !== "wrong");
    endResult.classList.toggle("hide", state !== "end");

    if (state === "end") {
        acronymSpan.textContent = "Finished!";
        scoreSpan.textContent = `${isNewRecord ? "New High" : ""} Score: ${score} / ${questions.length}`;
        timeSpan.textContent = `Time: ${formatTime(totalmilliseconds)}`;
        if (isNewRecord) {

        }
        return;
    }

    acronymSpan.textContent = questions[currIndex].acronym;
    clueSpan.textContent = questions[currIndex].description;
    fullName.textContent = questions[currIndex].fullName;
    scoreSpan2.textContent = `Score: ${score} / ${questions.length}`;
    timeSpan2.textContent = `Time: ${formatTime(totalmilliseconds)}`;
}

backBtn.addEventListener('click', e => {
    state = "idle";
    resetTimer();
    renderPages();
});

// Get questions
const easySet = agencies.filter(a => a.difficulty === "easy").splice(0, 3);
console.log(easySet)
const intermediateSet = agencies.filter(a => a.difficulty === "intermediate");
const hardSet = agencies.filter(a => a.difficulty === "hard");

let questions = [];

function getSetQ() {
    if (diff === "easy") questions = easySet;
    if (diff === "intermediate") questions = intermediateSet;
    if (diff === "hard") questions = hardSet;

    questions = shuffle(questions);
}

// Shuffle questions
function shuffle(arr) {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
        const random = Math.floor(Math.random() * (i + 1));

        [newArr[i], newArr[random]] = [newArr[random], newArr[i]];
    }
    return newArr;
}

// Get dificulty
const startBtns = document.querySelectorAll(".start-btn");

startBtns.forEach(btn => {
    btn.addEventListener('click', e => {
        diff = e.target.textContent.toLowerCase();
        state = "answering";
        currIndex = 0;
        score = 0;
        inputEl.disabled = false;
        isNewRecord = false;
        isConfirmed = false;

        resetTimer();
        startTimer();

        renderPages();
        getSetQ();
        renderGame();

        inputEl.focus();
    });
});

// Get current question
let currIndex = 0;

// Get and validate input
const inputEl = document.querySelector("input");
let isConfirmed = false;

inputEl.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        if (!isConfirmed) {
            pauseTimer();
            const inputVal = inputEl.value.toLocaleLowerCase().trim();

            if (inputVal === questions[currIndex].fullName.toLowerCase()) {
                state = "correct";
                score++;
            } else {
                state = "wrong";
            }
            console.log(state);
            renderGame();
            isConfirmed = true;
        } else {
            getNextQuestion();
            startTimer();
            inputEl.focus();
            inputEl.value = "";
            if (state === "end") {
                pauseTimer();
                inputEl.disabled = true;
            } else {
                startTimer();
                isConfirmed = false;
                inputEl.disabled = false;
            }
            renderGame();
        }
    }
});

function getNextQuestion() {
    currIndex++;
    if (currIndex >= questions.length) {
        state = "end";
        return;
    }
    state = "answering";
}

// Add score
let score = 0;

// Add timer
let totalmilliseconds = 0
let intervalId = null;

function startTimer() {
    if (intervalId !== null) return;

    intervalId = setInterval(() => {
        totalmilliseconds += 10;
        timeSpan2.textContent = formatTime(totalmilliseconds);
    }, 10);
}

function pauseTimer() {
    clearInterval(intervalId);
    intervalId = null;
}

function resetTimer() {
    pauseTimer();
    totalmilliseconds = 0;
    timeSpan2.textContent = formatTime(0);
    timeSpan.textContent = formatTime(0);
}

// Format time
function formatTime(totalMilliseconds) {
    const totalSeconds = Math.floor(totalMilliseconds / 1000);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const centiseconds = Math.floor((totalMilliseconds % 1000) / 10);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    const formattedCentiseconds = String(centiseconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}:${formattedCentiseconds}`;
}

// local storage
let isNewRecord = false;

function saveHighScore(difficulty, score, time) {
    const scoreKey = `highscore_${difficulty}`;
    const timeKey = `besttime_${difficulty}`;

    const savedScore = parseInt(localStorage.getItem(scoreKey)) || 0;
    const savedTime = parseInt(localStorage.getItem(timeKey)) || Infinity;

    let isNewRecord = false;

    if (score > savedScore) {
        localStorage.setItem(scoreKey, score);
        localStorage.setItem(timeKey, time);
        isNewRecord = true;
    } 

    else if (score === savedScore && time < savedTime) {
        localStorage.setItem(timeKey, time);
        isNewRecord = true;
    }

    return isNewRecord;
}

function getHighScore(difficulty) {
    return {
        score: localStorage.getItem(`highscore_${difficulty}`) || 0,
        time: localStorage.getItem(`besttime_${difficulty}`) ? formatTime(localStorage.getItem(`besttime_${difficulty}`)) : "--:--:--"
    };
}

renderPages();