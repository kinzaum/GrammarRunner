const btn = document.getElementById('toggleBtn');
const status = document.getElementById('status');
const container = document.getElementById('sentence-container');
const boulder = document.getElementById('boulder');
const snail = document.getElementById('snail');

const targetSentence = "I like to read";
const words = targetSentence.split(" ");
let currentWordIndex = 0;
let isListening = false;

// Movement state variables
let boulderPos = -200;
let snailPos = 50;
let snailFrame = 1;
let boulderInterval; // New variable for independent boulder movement

// Initialize Sentence UI
words.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word + (index < words.length - 1 ? " " : "");
    span.className = 'word';
    span.id = `word-${index}`;
    container.appendChild(span);
});

document.getElementById('word-0').classList.add('active');

// Boulder moves automatically and independently
function startBoulder() {
    clearInterval(boulderInterval);
    boulderInterval = setInterval(() => {
        boulderPos += 1; // Slower speed for the boulder
        boulder.style.left = boulderPos + 'px';
        boulder.style.transform = `rotate(${boulderPos * 2}deg)`;

        // If boulder catches the snail, game over
        if (boulderPos >= snailPos) {
            status.innerText = "Status: Game Over!";
            recognition.stop();
            clearInterval(boulderInterval);
        }
    }, 20);
}

// Snail moves ONLY when called
function moveSnail() {
    snailPos += 60; // Larger jump for the snail
    snail.style.left = snailPos + 'px';
    
    // Cycle through snail frames
    snailFrame = (snailFrame % 4) + 1;
    snail.src = `snail${snailFrame}.png`;
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    const lastWordSpoken = transcript.split(" ").pop().toLowerCase();
    const targetWord = words[currentWordIndex].toLowerCase();
    const wordElement = document.getElementById(`word-${currentWordIndex}`);

    if (lastWordSpoken === targetWord) {
        wordElement.className = 'word correct';
        
        // TRIGGER SNAIL MOVE
        moveSnail();
        
        currentWordIndex++;
        if (currentWordIndex < words.length) {
            document.getElementById(`word-${currentWordIndex}`).classList.add('active');
        } else {
            status.innerText = "Status: Escaped!";
            recognition.stop();
            clearInterval(boulderInterval);
        }
    } else {
        wordElement.className = 'word wrong active';
    }
};

btn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        clearInterval(boulderInterval);
        btn.innerText = "Start Listening";
        status.innerText = "Status: Idle";
    } else {
        recognition.start();
        startBoulder(); // Start independent movement
        btn.innerText = "Stop Listening";
        status.innerText = "Status: Listening...";
    }
    isListening = !isListening;
});
