const btn = document.getElementById('toggleBtn');
const status = document.getElementById('status');
const container = document.getElementById('sentence-container');
const boulder = document.getElementById('boulder');
const snail = document.getElementById('snail');

const targetSentence = "I like to read";
const words = targetSentence.split(" ");
let currentWordIndex = 0;
let isListening = false;
let moveInterval;

// Initialize Sentence UI
words.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word + (index < words.length - 1 ? " " : "");
    span.className = 'word';
    span.id = `word-${index}`;
    container.appendChild(span);
});

document.getElementById('word-0').classList.add('active');

function moveGameObjects() {
    let boulderPos = -200;
    let snailPos = 50;
    let snailFrame = 1;

    // Clear any existing interval
    clearInterval(moveInterval);

    moveInterval = setInterval(() => {
        boulderPos += 2;
        snailPos += 2;
        
        // Move both elements
        boulder.style.left = boulderPos + 'px';
        snail.style.left = snailPos + 'px';
        
        // Rotate the boulder
        boulder.style.transform = `rotate(${boulderPos * 2}deg)`;

        // Cycle through snail frames (1-4) every 20 pixels
        if (boulderPos % 20 === 0) {
            snailFrame = (snailFrame % 4) + 1;
            snail.src = `snail${snailFrame}.png`;
        }

        // End game if boulder crosses screen
        if (boulderPos >= window.innerWidth) {
            clearInterval(moveInterval);
        }
    }, 20);
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
        currentWordIndex++;
        if (currentWordIndex < words.length) {
            document.getElementById(`word-${currentWordIndex}`).classList.add('active');
        } else {
            status.innerText = "Status: Escaped!";
            clearInterval(moveInterval);
            recognition.stop();
        }
    } else {
        wordElement.className = 'word wrong active';
    }
};

btn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        clearInterval(moveInterval);
        btn.innerText = "Start Listening";
        status.innerText = "Status: Idle";
    } else {
        recognition.start();
        moveGameObjects();
        btn.innerText = "Stop Listening";
        status.innerText = "Status: Listening...";
    }
    isListening = !isListening;
});
