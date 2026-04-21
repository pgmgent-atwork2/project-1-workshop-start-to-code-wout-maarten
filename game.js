const inputs = [...document.querySelectorAll('#otp input')];

inputs.forEach((input, i) => {
    input.addEventListener('keydown', e => {
        if (e.key === 'Backspace') {
            if (input.value) { input.value = ''; }
            else if (i > 0) { inputs[i - 1].focus(); inputs[i - 1].value = ''; }
            e.preventDefault();
        }
        if (e.key === 'ArrowLeft' && i > 0) inputs[i - 1].focus();
        if (e.key === 'ArrowRight' && i < inputs.length - 1) inputs[i + 1].focus();
    });

    input.addEventListener('input', e => {
        input.value = input.value.replace(/[^a-zA-Z]/g, ''); // letters only
        if (input.value && i < inputs.length - 1) inputs[i + 1].focus();
    });

    input.addEventListener('focus', () => input.select());
});