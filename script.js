const canvas = document.getElementById('raspadinha');
const ctx = canvas.getContext('2d');
const resultadoDiv = document.getElementById('resultado');
const contadorSpan = document.getElementById('contador');
const novaRaspadinhaBtn = document.getElementById('novaRaspadinha');

let prêmiosRestantes = 5;

function gerarRaspadinha() {
    resultadoDiv.classList.add('hidden');
    ctx.fillStyle = '#C0C0C0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#888';
    ctx.font = '20px Arial';
    ctx.fillText('Raspe aqui!', 90, 80);
}

function raspar(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.clearRect(x - 10, y - 10, 20, 20);
}

function revelarResultado() {
    if (prêmiosRestantes <= 0) {
        alert('Não há mais prêmios disponíveis!');
        return;
    }
    const ganhou = Math.random() < 0.5; // 50% de chance
    resultadoDiv.textContent = ganhou ? 'Parabéns! Você ganhou!' : 'Que pena! Tente novamente.';
    resultadoDiv.classList.remove('hidden');
    prêmiosRestantes--;
    contadorSpan.textContent = prêmiosRestantes;
}

canvas.addEventListener('mousemove', (e) => {
    if (e.buttons === 1) raspar(e);
});

canvas.addEventListener('click', () => {
    revelarResultado();
});

novaRaspadinhaBtn.addEventListener('click', () => {
    gerarRaspadinha();
});

gerarRaspadinha();

const fraseDiv = document.getElementById('frase');
const premios = ["R$50", "R$100", "Cupom de desconto", "Tente novamente"];
const premioSorteado = premios[Math.floor(Math.random() * premios.length)];

fraseDiv.textContent = `Parabéns! Você ganhou: ${premioSorteado}`;
fraseDiv.classList.remove('hidden');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fraseDiv = document.getElementById('frase');

// Aqui você cria a camada cinza da raspadinha
ctx.fillStyle = '#C0C0C0'; // cor da raspadinha
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Evento de raspagem
canvas.addEventListener('mousemove', function(e) {
    if(e.buttons !== 1) return; // só raspa com clique segurado

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.clearRect(x-10, y-10, 20, 20); // "raspa" a área
});

// Exemplo simples: mostrar a frase quando raspar 50% da área
canvas.addEventListener('mouseup', function() {
    fraseDiv.classList.remove('hidden'); // revela a frase
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fraseDiv = document.getElementById('frase');

// Aqui você cria a camada cinza da raspadinha
ctx.fillStyle = '#C0C0C0'; // cor da raspadinha
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Evento de raspagem
canvas.addEventListener('mousemove', function(e) {
    if(e.buttons !== 1) return; // só raspa com clique segurado

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.clearRect(x-10, y-10, 20, 20); // "raspa" a área
});

// Exemplo simples: mostrar a frase quando raspar 50% da área
canvas.addEventListener('mouseup', function() {
    fraseDiv.classList.remove('hidden'); // revela a frase
});

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Preenche o canvas com a cor da raspadinha
ctx.fillStyle = '#C0C0C0'; 
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Evento de raspagem
let raspou = false;
canvas.addEventListener('mousemove', function(e){
    if(e.buttons !== 1) return; // só quando o botão do mouse está pressionado

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.clearRect(x-10, y-10, 20, 20); // “raspa” a área
    raspou = true;
});

// Quando solta o mouse, podemos revelar a frase (opcional)
canvas.addEventListener('mouseup', function(){
    if(raspou){
        console.log('Frase visível agora!');
        // A frase já está atrás, não precisa mostrar nada, o canvas raspado deixa aparecer
    }
});
