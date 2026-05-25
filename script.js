// 1. VARIABLES (Top of file)
const btn = document.getElementById('toggleBtn');
const targetSentence = "I like to read";
const words = targetSentence.split(" ");
let currentWordIndex = 0;

// 2. INITIALIZATION (Middle of file)
words.forEach((word, index) => {
    // ... logic to create span elements ...
});
document.getElementById('word-0').classList.add('active'); // Add this!

// 3. LOGIC (Inside your existing function)
recognition.onresult = (event) => {
    // ... get the last word spoken ...
    
    // NEW LOGIC CHUNK:
    if (lastWordSpoken === targetWord) {
        wordElement.className = 'word correct';
        currentWordIndex++;
        
        // Check if there is another word to activate
        if (currentWordIndex < words.length) {
            document.getElementById(`word-${currentWordIndex}`).classList.add('active');
        }
    } else {
        wordElement.className = 'word wrong active'; // Keep the red word active
    }
};
