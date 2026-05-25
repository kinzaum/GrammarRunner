const btn = document.getElementById('toggleBtn');
const status = document.getElementById('status');
const container = document.getElementById('sentence-container');

const targetSentence = "I like to read";
const words = targetSentence.split(" ");
let currentWordIndex = 0;
let isListening = false;

// Initialize Sentence UI
words.forEach((word, index) => {
    const span = document.createElement('span');
    span.innerText = word;
    span.className = 'word';
    span.id = `word-${index}`;
    container.appendChild(span);
});

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
        if (currentWordIndex === words.length) {
            status.innerText = "Status: You did it!";
            recognition.stop();
        }
    } else {
        wordElement.className = 'word wrong';
    }
};

btn.addEventListener('click', () => {
    if (isListening) {
        recognition.stop();
        btn.innerText = "Start Listening";
        status.innerText = "Status: Idle";
    } else {
        recognition.start();
        btn.innerText = "Stop Listening";
        status.innerText = "Status: Listening...";
    }
    isListening = !isListening;
});
