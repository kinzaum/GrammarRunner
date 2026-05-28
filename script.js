const btn = document.getElementById('toggleBtn');
const updateBtn = document.getElementById('updateBtn');
const inputField = document.getElementById('userInput');
const status = document.getElementById('status');
const transcriptDisplay = document.getElementById('transcript-display');
const container = document.getElementById('sentence-container');
const boulder = document.getElementById('boulder');
const snail = document.getElementById('snail');

const victoryScreen = document.getElementById('victory-screen');
const restartBtn = document.getElementById('restartBtn');

const gameOverScreen = document.getElementById('game-over-screen');
const retryBtn = document.getElementById('retryBtn');

const countdownOverlay = document.getElementById('countdown-overlay');
const countdownImg = document.getElementById('countdown-img');

let words = [];
let currentWordIndex = 0;
let isListening = false;
let isGameOver = false;

let isBoulderPaused = false;

// Positioning
let boulderPos = -200;
let snailPos = 50;
let boulderInterval;
let snailFrame = 1;

// Single source of truth for cleaning logic
function clean(str) {
    if (!str) return "";

    // THIS LINE WAS MISSING
    let s = str.toLowerCase();

    s = s.replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    const map = {
        "two": "to",
        "too": "to",
        "oh,": "oh", // Also: removed the comma here because your regex above strips it anyway
        "hi,": "hi",
        "ok": "okay",
        "high": "hi" // Optional: in case it mishears "Hi" as "High"
    };

    return map[s] || s;
}
function loadSentence() {
    const text = inputField.value.trim().replace(/[—–]/g, ",");
    if (!text) return alert("Please type a sentence first!");

    container.innerHTML = "";
    currentWordIndex = 0;
    isGameOver = false;
    words = text.split(" ");

    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.innerText = word + (index < words.length - 1 ? " " : "");
        span.className = 'word';
        span.id = `word-${index}`;
        span.dataset.cleanWord = clean(word);
        container.appendChild(span);
    });

    document.getElementById('word-0').classList.add('active');

    boulderPos = -200;
    snailPos = 50;
    boulder.style.left = boulderPos + 'px';
    snail.style.left = snailPos + 'px';
    status.innerText = "Status: Ready";
    transcriptDisplay.innerText = "Transcript: ";
}

updateBtn.addEventListener('click', loadSentence);

setInterval(() => {
    if (!isGameOver) {
        snailFrame = (snailFrame % 4) + 1;
        snail.src = `snail${snailFrame}.png`;
    }
}, 200);

function startBoulder() {
    if (isBoulderPaused) return;
    clearInterval(boulderInterval);
    boulderInterval = setInterval(() => {
        boulderPos += 1;
        boulder.style.left = boulderPos + 'px';
        boulder.style.transform = `rotate(${boulderPos * 2}deg)`;
        if (boulderPos >= snailPos - 50) {
            isGameOver = true;
            status.innerText = "Status: Game Over!";
            snail.src = 'deadsnail.png';
            recognition.stop();
            clearInterval(boulderInterval);
            gameOverScreen.style.display = 'flex';
        }
    }, 50);
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;


recognition.onresult = (event) => {
    if (isGameOver) return;

    // Get the latest phrase spoken
    let latestResult = event.results[event.results.length - 1][0].transcript.toLowerCase();
    transcriptDisplay.innerText = "Transcript: " + latestResult;

    let target = document.getElementById(`word-${currentWordIndex}`).dataset.cleanWord;
    // Clean ONLY the latest bit of audio
    let spoken = clean(latestResult);

    // Use exact equality or check if the latest phrase contains the target word
    if (spoken === target || spoken.includes(target)) {
        const wordElement = document.getElementById(`word-${currentWordIndex}`);
        if (wordElement && !wordElement.classList.contains('correct')) {
            wordElement.className = 'word correct';
            snailPos += 20;
            snail.style.left = snailPos + 'px';
            currentWordIndex++;

            isBoulderPaused = false;

            if (currentWordIndex < words.length) {
                document.getElementById(`word-${currentWordIndex}`).classList.add('active');
            }
            else {
                status.innerText = "Status: Escaped!";
                recognition.stop();
                clearInterval(boulderInterval);
                // Show victory screen
                victoryScreen.style.display = 'flex';
            }
        }
    }
};

document.getElementById('readBtn').addEventListener('click', () => {
    // Get the current word element text
    const currentWordEl = document.getElementById(`word-${currentWordIndex}`);
    if (!currentWordEl) return;

    // Clean the word for pronunciation (remove extra bits)
    const wordToRead = currentWordEl.innerText.trim();

    // Stop the boulder
    isBoulderPaused = true;
    clearInterval(boulderInterval);

    // Read the word
    const utterance = new SpeechSynthesisUtterance(wordToRead);
    utterance.onend = () => {
        // When reading finishes, restart the boulder
        isBoulderPaused = false;
        startBoulder();
    };
    window.speechSynthesis.speak(utterance);
});

function runCountdown(callback) {
    countdownOverlay.style.display = 'flex';

    // Sequence: 3 -> 2 -> 1
    countdownImg.src = 'Number3.png';
    setTimeout(() => {
        countdownImg.src = 'Number2.png';
        setTimeout(() => {
            countdownImg.src = 'Number1.png';
            setTimeout(() => {
                countdownOverlay.style.display = 'none';
                callback(); // Start the game logic
            }, 1000);
        }, 1000);
    }, 1000);
}

btn.addEventListener('click', () => {
    if (words.length === 0) return alert("Load a sentence first!");
    if (isListening) {
        recognition.stop();
        btn.innerText = "Start Listening";
    } else {
        recognition.start();
        // Instead of starting immediately, run the countdown
        runCountdown(() => {
            isBoulderPaused = false;
            if (isGameOver) loadSentence();
            startBoulder();
        });
        btn.innerText = "Stop Listening";
        status.innerText = "Status: Listening...";
    }
    isListening = !isListening;
});

// Fix for the Victory Screen Restart Button
restartBtn.addEventListener('click', () => {
    victoryScreen.style.display = 'none';
    loadSentence(); // <--- Add this!
    btn.innerText = "Start Listening";
    status.innerText = "Status: Ready";
    isListening = false; // Ensure the state resets
});

// Fix for the Game Over Screen Retry Button
retryBtn.addEventListener('click', () => {
    gameOverScreen.style.display = 'none';
    loadSentence(); // <--- Add this!
    btn.innerText = "Start Listening";
    status.innerText = "Status: Ready";
    isListening = false; // Ensure the state resets
});
