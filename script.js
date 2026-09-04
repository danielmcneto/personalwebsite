const invertButton = document.getElementById('btn-invert')

invertButton.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
})