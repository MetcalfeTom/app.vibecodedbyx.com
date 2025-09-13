const sun = document.querySelector('.sun');

setInterval(() => {
    sun.classList.toggle('wink');
    sun.classList.toggle('smile');
}, 500);