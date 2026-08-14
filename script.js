const botaoInvert = document.getElementById('btn-invert')

botaoInvert.addEventListener('click', () =>{
    document.documentElement.classList.toggle('modo-claro');
})