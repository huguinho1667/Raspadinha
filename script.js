const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Mensagem que vai aparecer
const frase = "Parabéns! Você ganhou R$50!";

// Desenhar a frase primeiro, atrás da camada da raspadinha
ctx.fillStyle = '#000';
ctx.font = '20px Arial';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(frase, canvas.width / 2, canvas.height / 2);

// Desenhar a camada cinza da raspadinha por cima
ctx.fillStyle = '#C0C0C0';
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Configura para “raspar” a camada
ctx.globalCompositeOperation = 'destination-out';

let raspando = false;

// Função para raspar
function raspar(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.fill();
}

// Eventos de mouse
canvas.addEventListener('mousedown', () => raspando = true);
canvas.addEventListener('mouseup', () => raspando = false);
canvas.addEventListener('mousemove', (e) => {
    if (raspando) {
        raspar(e.offsetX, e.offsetY);
    }
});

// Eventos para touch (celular)
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    raspar(touch.clientX - rect.left, touch.clientY - rect.top);
}, {passive: false});
