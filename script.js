const btn = document.getElementById('toggleBtn');
const updateBtn = document.getElementById('updateBtn');
const inputField = document.getElementById('userInput');
const status = document.getElementById('status');
const container = document.getElementById('sentence-container');
const boulder = document.getElementById('boulder');
const snail = document.getElementById('snail');

let words = [];
let currentWordIndex = 0;
let isListening = false;

// Positioning
let boulderPos = -200;
let snailPos = 50;
let boulderInterval;
let snailFrame = 1;

// Helper to strip punctuation for accurate voice matching
function cleanWord(str) {
    return str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
}

// Function to load the sentence from the text area
function loadSentence() {
    const text = inputField.value.trim();
    if (!text) return alert("Please type a sentence first!");

    // Reset game state
    container.innerHTML = "";
    currentWordIndex = 0;
    words = text.split(" ");
    
    // Create UI elements for words
    words.forEach((word, index) => {
        const span = document.createElement('span');
        span.innerText = word + (index < words.length - 1 ? " " : "");
        span.className = 'word';
        span.id = `word-${index}`;
        container.appendChild(span);
    });
    
    document.getElementById('word-0').classList.add('active');
    
    // Reset positions
    boulderPos = -200;
    snailPos = 50;
    boulder.style.left = boulderPos + 'px';
    snail.style.left = snailPos + 'px';
    status.innerText = "Status: Ready";
}

updateBtn.addEventListener('click', loadSentence);

// Constant Animation Loop
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
    const results = event.results[event.results.length - 1];
    const transcript = results[0].transcript.toLowerCase();
    
    if (currentWordIndex < words.length) {
        const targetWord = cleanWord(words[currentWordIndex]);
        
        if (transcript.includes(targetWord)) {
            document.getElementById(`word-${currentWordIndex}`).className = 'word correct';
            
            // Move snail forward
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
    }
};

btn.addEventListener('click', () => {
    if (words.length === 0) return alert("Load a sentence first!");
    
    if (isListening) {
        recognition.stop();
        btn.innerText = "Start Listening";
    } else {
        recognition.start();
        startBoulder();
        btn.innerText = "Stop Listening";
        status.innerText = "Status: Listening...";
    }
    isListening = !isListening;
});
