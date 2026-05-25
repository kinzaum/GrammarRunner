const btn = document.getElementById('toggleBtn');
const status = document.getElementById('status');
const container = document.getElementById('sentence-container');
const boulder = document.getElementById('boulder');

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

function moveBoulder() {
    let position = -150;
    const speed = 2;

    // Clear any existing interval before starting a new one
    clearInterval(moveInterval);

    moveInterval = setInterval(() => {
        position += speed;
        
        // Update horizontal position
        boulder.style.left = position + 'px';
        
        // Update rotation based on position
        boulder.style.transform = `rotate(${position * 2}deg)`;

        if (position >= window.innerWidth) {
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
        moveBoulder();
        btn.innerText = "Stop Listening";
        status.innerText = "Status: Listening...";
    }
    isListening = !isListening;
});
