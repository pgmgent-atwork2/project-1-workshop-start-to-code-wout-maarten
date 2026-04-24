const inputs = [...document.querySelectorAll('.woord input')];
const lettersPerRow = 6;
let word = ''; // This will be replaced by a random word in a real game


// let word = '';

// Load and get random word from words.json
async function loadRandomWord() {
    // try {
    //     const response = await fetch('./words.json');
    //     const data = await response.json();
    //     const wordList = data.words;
    //     word = wordList[Math.floor(Math.random() * wordList.length)].toUpperCase();
    //     console.log('Secret word loaded:', word);
    // } catch (error) {
    //     console.error('Error loading words:', error);
    // }
    word = 'ADVIES';
}

// Load the word when page loads
loadRandomWord();

function isRowComplete(startIndex) {
    const endIndex = startIndex + lettersPerRow;
    const rowInputs = inputs.slice(startIndex, endIndex);
    return rowInputs.every(input => input.value.trim() !== '');
}

function checkRow(startIndex) {
    const endIndex = startIndex + lettersPerRow;
    const rowInputs = inputs.slice(startIndex, endIndex);

    // STEP 1: Disable and fade row
    rowInputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.5';
    });
    

    // STEP 2: Mark GREEN letters (correct position)
    const greenLetters = {};
    rowInputs.forEach((input, index) => {
        const letter = input.value.toUpperCase();
        if (letter === word[index]) {
            input.classList.add('green');
            greenLetters[letter] = (greenLetters[letter] || 0) + 1;
            console.log(greenLetters);
        }
    });
    
    // STEP 3: Count all letters in secret word
    const availableLetters = {};
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        availableLetters[letter] = (availableLetters[letter] || 0) + 1;
    }
    
    // STEP 4: Remove greens from available pool (avoid double-counting)
    for (let letter in greenLetters) {
        availableLetters[letter] -= greenLetters[letter];
    }
    
    // STEP 5: Mark ORANGE letters (wrong position, but in word)
    rowInputs.forEach((input, index) => {
        const letter = input.value.toUpperCase();
        
        if (input.classList.contains('green')) return; // Skip greens
        
        // If letter still available, mark orange and use one instance
        if (availableLetters[letter] && availableLetters[letter] > 0) {
            input.classList.add('orange');
            availableLetters[letter]--;
        }
    });
    

    //Step 6: Check for win condition
    if (Object.keys(greenLetters).length === word.length) {
            inputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.5';
        });
        showWinModal(true);
    }
    // STEP 7: Check for lose condition (all inputs filled but not all green + no more rows)
    else if (Object.keys(greenLetters).length < word.length && endIndex === inputs.length) {
        inputs.forEach(input => {
            input.disabled = true;
            input.style.opacity = '0.5';
        });
        showWinModal(false);
    }
}

function showWinModal(isWin) {
    const modal = document.getElementById('winModal');
    const resultElement = document.getElementById('result');
    const winWordElement = document.getElementById('winWord');
    const closeButton = document.getElementById('closeModal');
    const tutorialBtn = document.getElementById('tutorialBtn');

    if (isWin) {
        resultElement.textContent = '🎉 YOU WON!!! 🎉';
    } else {
        resultElement.textContent = 'Helaas! Probeer opnieuw.';
    }

    winWordElement.textContent = word;
    modal.classList.remove('hidden');
    
    closeButton.addEventListener('click', () => {
        location.reload(); // Reload page to play again
    });
    
    tutorialBtn.addEventListener('click', () => {
        window.location.href = './tutorial.html'; // Go to tutorial page
    });
}



inputs.forEach((input, i) => {
    input.addEventListener('keydown', e => {
        if (input.disabled) return;
        
        if (e.key === 'Backspace') {
            if (input.value) { input.value = ''; }
            else if (i > 0) { inputs[i - 1].focus(); inputs[i - 1].value = ''; }
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft' && i > 0) inputs[i - 1].focus();
        if (e.key === 'ArrowRight' && i < inputs.length - 1) inputs[i + 1].focus();
    });

    input.addEventListener('input', e => {
        if (input.disabled) return;
        
        input.value = input.value.replace(/[^a-zA-Z]/g, ''); // letters only
        if (input.value && i < inputs.length - 1) inputs[i + 1].focus();
        
        // Check if current row is complete and lock it
        const rowStartIndex = Math.floor(i / lettersPerRow) * lettersPerRow;
        if (isRowComplete(rowStartIndex)) {
            checkRow(rowStartIndex);
            // Focus the first input of the next row
            const nextRowStart = rowStartIndex + lettersPerRow;
            if (nextRowStart < inputs.length) {
                inputs[nextRowStart].focus();
            }
        }
    });

    input.addEventListener('focus', () => {
        // Check which row this input is in
        const currentRowStart = Math.floor(i / lettersPerRow) * lettersPerRow;
        
        // Find the first non-disabled row
        let firstEnabledRowStart = 0;
        for (let row = 0; row < inputs.length; row += lettersPerRow) {
            if (!inputs[row].disabled) {
                firstEnabledRowStart = row;
                break;
            }
        }
        
        // If this input is in the first enabled row, allow focus and select
        if (currentRowStart === firstEnabledRowStart) {
            input.select();
        } else {
            // Otherwise, focus the first input of the first enabled row
            inputs[firstEnabledRowStart].focus();
        }
    });
});