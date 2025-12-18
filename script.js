const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let raspando = false;
const raio = 15;

// Frase que vai aparecer
const frase = "Parabéns, você ganhou o Marcelinho Safadinho";

// Desenhar camada da raspadinha e frase
function iniciarRaspadinha() {
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenha a camada cinza por cima (raspadinha)
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenha a frase por baixo (vamos usar um canvas auxiliar)
    // Aqui a frase ficará visível quando raspado
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over'; // por baixo da camada cinza
    ctx.fillStyle = '#000';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(frase, canvas.width / 2, canvas.height / 2);
    ctx.restore();

    // Configura para raspagem
    ctx.globalCompositeOperation = 'destination-out';
}

// Função para raspar
function raspar(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, raio, 0, Math.PI * 2);
    ctx.fill();
}

// Eventos do mouse
canvas.addEventListener('mousedown', () => raspando = true);
canvas.addEventListener('mouseup', () => raspando = false);
canvas.addEventListener('mousemove', (e) => {
    if (raspando) raspar(e.offsetX, e.offsetY);
});

// Eventos para touch (celular)
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    raspar(touch.clientX - rect.left, touch.clientY - rect.top);
}, {passive: false});

// Inicia a raspadinha
iniciarRaspadinha();

