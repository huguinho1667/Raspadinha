const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Desenha a camada cinza da raspadinha
ctx.fillStyle = '#C0C0C0';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Configura para permitir raspagem
ctx.globalCompositeOperation = 'destination-out'; // permite “apagar” a camada

let raspando = false;

// Função para raspar
function raspar(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

// Evento de mouse
canvas.addEventListener('mousedown', () => raspando = true);
canvas.addEventListener('mouseup', () => raspando = false);
canvas.addEventListener('mousemove', (e) => {
    if (raspando) {
        raspar(e.offsetX, e.offsetY);
    }
});

// Evento para toque em celulares
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    raspar(touch.clientX - rect.left, touch.clientY - rect.top);
}, {passive: false});


