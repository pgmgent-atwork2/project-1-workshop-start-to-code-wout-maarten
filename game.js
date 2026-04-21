const inputs = [...document.querySelectorAll('.woord input')];
const lettersPerRow = 6;

function isRowComplete(startIndex) {
    const endIndex = startIndex + lettersPerRow;
    const rowInputs = inputs.slice(startIndex, endIndex);
    return rowInputs.every(input => input.value.trim() !== '');
}

function lockRow(startIndex) {
    const endIndex = startIndex + lettersPerRow;
    const rowInputs = inputs.slice(startIndex, endIndex);
    rowInputs.forEach(input => {
        input.disabled = true;
        input.style.opacity = '0.5';
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
            lockRow(rowStartIndex);
        }
    });

    input.addEventListener('focus', () => input.select());
});