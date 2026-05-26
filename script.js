const btn = document.getElementById('toggleBtn');
const status = document.getElementById('status');
const container = document.getElementById('sentence-container');
const boulder = document.getElementById('boulder');
const snail = document.getElementById('snail');

const targetSentence = "If you are splitting your sentence into words for your game, you should do this before or after the word-splitting logic";
const words = targetSentence.split(" ");
let currentWordIndex = 0;
let isListening = false;

// Helpers
let boulderPos = -200;
let snailPos = 50;
let boulderInterval;
let snailFrame = 1;

// Strip punctuation so "word," matches "word"
function cleanWord(str) {
    return str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

// Initialize Sentence UI
words.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word + (index < words.length - 1 ? " " : "");
    span.className = 'word';
    span.id = `word-${index}`;
    container.appendChild(span);
});
document.getElementById('word-0').classList.add('active');

// Animation Loop
setInterval(() => {
    snailFrame = (snailFrame % 4) + 1;
    snail.src = `snail${snailFrame}.png`;
}, 200);

function startBoulder() {
    clearInterval(boulderInterval);
    boulderInterval = setInterval(() => {
        boulderPos += 1;
        boulder.style.left = boulderPos + 'px';
        boulder.style.transform = `rotate(${boulderPos * 2}deg)`;

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
    // Get the full transcript from the latest result
    const results = event.results[event.results.length - 1];
    const transcript = results[0].transcript.toLowerCase();
    
    // Check if the user said the target word
    const targetWord = cleanWord(words[currentWordIndex]);
    
    // Check if the transcript contains the current target word
    if (transcript.includes(targetWord)) {
        document.getElementById(`word-${currentWordIndex}`).className = 'word correct';
        
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
    }
};

btn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        btn.innerText = "Start Listening";
    } else {
        recognition.start();
        startBoulder();
        btn.innerText = "Stop Listening";
    }
    isListening = !isListening;
});
