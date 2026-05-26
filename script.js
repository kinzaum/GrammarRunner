const btn = document.getElementById('toggleBtn');
const status = document.getElementById('status');
const container = document.getElementById('sentence-container');
const boulder = document.getElementById('boulder');
const snail = document.getElementById('snail');

const targetSentence = "I like to read";
const words = targetSentence.split(" ");
let currentWordIndex = 0;
let isListening = false;

// Positioning
let boulderPos = -200;
let snailPos = 50;
let boulderInterval;

// Animation state
let snailFrame = 1;

// Initialize Sentence UI
words.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word + (index < words.length - 1 ? " " : "");
    span.className = 'word';
    span.id = `word-${index}`;
    container.appendChild(span);
});
document.getElementById('word-0').classList.add('active');

// CONSTANT ANIMATION LOOP (Runs all the time)
setInterval(() => {
    snailFrame = (snailFrame % 4) + 1;
    snail.src = `snail${snailFrame}.png`;
}, 200); // 200ms feels like a natural walking pace

function startBoulder() {
    clearInterval(boulderInterval);
    boulderInterval = setInterval(() => {
        boulderPos += 1;
        boulder.style.left = boulderPos + 'px';
        boulder.style.transform = `rotate(${boulderPos * 2}deg)`;

        // Game Over check
        if (boulderPos >= snailPos - 50) {
            status.innerText = "Status: Game Over!";
            recognition.stop();
            clearInterval(boulderInterval);
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
    
    if (lastWordSpoken === targetWord) {
        document.getElementById(`word-${currentWordIndex}`).className = 'word correct';
        
        // TRIGGER SMOOTH MOVE
        snailPos += 80;
        snail.style.left = snailPos + 'px';
        
        currentWordIndex++;
        if (currentWordIndex < words.length) {
            document.getElementById(`word-${currentWordIndex}`).classList.add('active');
        } else {
            status.innerText = "Status: Escaped!";
            recognition.stop();
            clearInterval(boulderInterval);
        }
    } else {
        document.getElementById(`word-${currentWordIndex}`).className = 'word wrong active';
    }
};

btn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        clearInterval(boulderInterval);
        btn.innerText = "Start Listening";
    } else {
        recognition.start();
        startBoulder();
        btn.innerText = "Stop Listening";
    }
    isListening = !isListening;
});
