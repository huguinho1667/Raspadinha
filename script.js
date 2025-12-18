// Elementos do DOM
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const prizeMessage = document.getElementById('prizeMessage');
const resetBtn = document.getElementById('resetBtn');
const newCardBtn = document.getElementById('newCardBtn');
const scratchCountEl = document.getElementById('scratchCount');
const prizeCountEl = document.getElementById('prizeCount');
const totalPrizeEl = document.getElementById('totalPrize');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const confettiContainer = document.getElementById('confettiContainer');
const moneyFallContainer = document.getElementById('moneyFallContainer');

// Estado do jogo
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let scratchCount = 1;
let prizeCount = 0;
let totalPrize = 0;
let revealed = false;

// Configurações
const scratchRadius = 22;
const revealThreshold = 65;
const PRIZE_VALUES = [1000000, 500000, 100000, 50000, 10000, 5000, 1000];
const PRIZE_NAMES = [
    "1 MILHÃO DE REAIS",
    "500 MIL REAIS", 
    "100 MIL REAIS",
    "50 MIL REAIS",
    "10 MIL REAIS",
    "5 MIL REAIS",
    "1 MIL REAIS"
];

// Inicializar a raspadinha
function initScratchCard() {
    // Configurar canvas
    canvas.width = 500;
    canvas.height = 300;
    
    // Desenhar a superfície raspável
    drawScratchSurface();
    
    // Adicionar event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Configurar botões
    resetBtn.addEventListener('click', resetScratchArea);
    newCardBtn.addEventListener('click', generateNewCard);
    copyCodeBtn.addEventListener('click', copyPrizeCode);
    
    // Atualizar contadores
    updateCounters();
}

// Desenhar a superfície raspável com tema do milhão
function drawScratchSurface() {
    // Fundo gradiente dourado
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#d4af37');
    gradient.addColorStop(0.5, '#ffd700');
    gradient.addColorStop(1, '#d4af37');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Adicionar padrão de cifrão
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Desenhar cifrões de fundo
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 4; j++) {
            const x = (i + 0.5) * (canvas.width / 8);
            const y = (j + 0.5) * (canvas.height / 4);
            ctx.fillText('$', x, y);
        }
    }
    
    // Texto principal
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.font = 'bold 28px "Roboto Slab", serif';
    ctx.fillText('RASPADINHA DO MILHÃO', canvas.width/2, canvas.height/2 - 30);
    
    ctx.font = 'bold 20px Arial';
    ctx.fillText('Raspe para revelar seu prêmio', canvas.width/2, canvas.height/2 + 10);
    
    ctx.font = '16px Arial';
    ctx.fillText('Use o mouse ou dedo para raspar', canvas.width/2, canvas.height/2 + 50);
}

// Funções de desenho (mantidas do código anterior)
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getMousePos(canvas, e);
    drawDot(lastX, lastY);
}

function draw(e) {
    if (!isDrawing) return;
    
    e.preventDefault();
    
    const [x, y] = getMousePos(canvas, e);
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = scratchRadius;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    drawDot(x, y);
    
    [lastX, lastY] = [x, y];
    
    checkScratchProgress();
}

function drawDot(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, scratchRadius / 2, 0, Math.PI * 2);
    ctx.fill();
}

function stopDrawing() {
    isDrawing = false;
}

function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    
    if (e.type.includes('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        return [
            touch.clientX - rect.left,
            touch.clientY - rect.top
        ];
    } else {
        return [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        startDrawing(e);
    }
}

function handleTouchMove(e) {
    if (e.touches.length === 1) {
        e.preventDefault();
        draw(e);
    }
}

// Verificar progresso da raspagem
function checkScratchProgress() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparentPixels++;
        }
    }
    
    const totalPixels = canvas.width * canvas.height;
    const percentScratched = Math.round((transparentPixels / totalPixels) * 100);
    
    progressBar.style.width = `${percentScratched}%`;
    progressText.textContent = `${percentScratched}% raspado`;
    
    if (percentScratched >= revealThreshold && !revealed) {
        revealPrize();
    }
}

// Revelar o prêmio - AGORA MOSTRA "1 MILHÃO DE REAIS"
function revealPrize() {
    revealed = true;
    
    // Determinar prêmio (70% chance de ganhar algo)
    const winsPrize = Math.random() < 0.7;
    
    if (winsPrize) {
        // Selecionar um prêmio aleatório
        const prizeIndex = Math.floor(Math.random() * PRIZE_VALUES.length);
        const prizeValue = PRIZE_VALUES[prizeIndex];
        const prizeName = PRIZE_NAMES[prizeIndex];
        
        // Atualizar mensagem com o prêmio
        prizeMessage.querySelector('h1').innerHTML = 
            `Você ganhou <span class="highlight">${prizeName}</span>!`;
        
        // Atualizar código do prêmio
        prizeMessage.querySelector('.prize-code strong').textContent = 
            `PRÊMIO-${prizeValue.toString().padStart(7, '0')}`;
        
        // Atualizar total
        totalPrize += prizeValue;
        prizeCount++;
        
        // Efeitos especiais para prêmios maiores
        if (prizeValue >= 100000) {
            launchMoneyFall();
        }
        
    } else {
        // Não ganhou
        prizeMessage.querySelector('h2').textContent = "QUE PENA!";
        prizeMessage.querySelector('h1').innerHTML = 
            'Você <span class="highlight">não ganhou</span> desta vez!';
        prizeMessage.querySelector('.prize-description').textContent = 
            "Tente novamente com uma nova raspadinha!";
        prizeMessage.querySelector('.prize-code').style.display = 'none';
    }
    
    // Mostrar mensagem
    prizeMessage.classList.add('revealed');
    
    // Atualizar contadores
    updateCounters();
    
    // Efeitos visuais
    launchConfetti();
    playVictorySound();
}

// Efeito de dinheiro caindo
function launchMoneyFall() {
    const moneySymbols = ['💵', '💴', '💶', '💷', '💰', '💸'];
    
    for (let i = 0; i < 50; i++) {
        const money = document.createElement('div');
        money.className = 'money-bill';
        money.textContent = moneySymbols[Math.floor(Math.random() * moneySymbols.length)];
        
        // Posição inicial aleatória
        const startX = Math.random() * 100;
        money.style.left = `${startX}vw`;
        
        // Tamanho aleatório
        const size = Math.random() * 3 + 2;
        money.style.fontSize = `${size}rem`;
        
        // Rotação inicial
        const rotation = Math.random() * 360;
        money.style.transform = `rotate(${rotation}deg)`;
        
        moneyFallContainer.appendChild(money);
        
        // Animar
        animateMoneyFall(money, startX);
    }
    
    // Limpar após 6 segundos
    setTimeout(() => {
        moneyFallContainer.innerHTML = '';
    }, 6000);
}

function animateMoneyFall(money, startX) {
    const duration = Math.random() * 4 + 4;
    const horizontalMove = (Math.random() - 0.5) * 100;
    const rotationSpeed = Math.random() * 720 + 360;
    
    money.style.transition = `all ${duration}s cubic-bezier(0.1, 0.7, 0.6, 1)`;
    
    setTimeout(() => {
        money.style.top = '100vh';
        money.style.left = `calc(${startX}vw + ${horizontalMove}px)`;
        money.style.opacity = '0';
        money.style.transform = `rotate(${rotationSpeed}deg)`;
    }, 10);
}

// Criar efeito de confete
function launchConfetti() {
    const colors = ['#ffd700', '#28a745', '#ff6b6b', '#4d96ff', '#ff8e53'];
    
    for (let i = 0; i < 120; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        const startX = Math.random() * 100;
        confetti.style.left = `${startX}vw`;
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;
        
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size * 1.5}px`;
        
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        confettiContainer.appendChild(confetti);
        animateConfetti(confetti, startX);
    }
    
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000);
}

function animateConfetti(confetti, startX) {
    const duration = Math.random() * 3 + 3;
    const horizontalMove = (Math.random() - 0.5) * 80;
    
    confetti.style.transition = `all ${duration}s linear`;
    
    setTimeout(() => {
        confetti.style.top = '100vh';
        confetti.style.left = `calc(${startX}vw + ${horizontalMove}px)`;
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
    }, 10);
}

function playVictorySound() {
    // Som simulado - pode substituir por arquivo real
    console.log("🎉 Parabéns! Prêmio revelado!");
}

// Limpar área raspada
function resetScratchArea() {
    drawScratchSurface();
    progressBar.style.width = '0%';
    progressText.textContent = '0% raspado';
    
    if (revealed) {
        prizeMessage.classList.remove('revealed');
        revealed = false;
        
        // Restaurar mensagem padrão
        prizeMessage.querySelector('h2').textContent = "PARABÉNS!";
        prizeMessage.querySelector('h1').innerHTML = 
            'Você ganhou <span class="highlight">1 MILHÃO DE REAIS</span>!';
        prizeMessage.querySelector('.prize-description').textContent = 
            "Prêmio garantido! Entre em contato para resgatar.";
        prizeMessage.querySelector('.prize-code').style.display = 'flex';
        prizeMessage.querySelector('.prize-code strong').textContent = 
            'MILHÃO-2024-BR-001';
    }
}

// Gerar nova raspadinha
function generateNewCard() {
    resetScratchArea();
    scratchCount++;
    updateCounters();
    
    canvas.style.transform = 'scale(0.95)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 300);
}

// Copiar código do prêmio
function copyPrizeCode() {
    const codeElement = prizeMessage.querySelector('.prize-code strong');
    const code = codeElement ? codeElement.textContent : "MILHÃO-2024-BR-001";
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code)
            .then(() => {
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Código Copiado!';
                copyCodeBtn.style.background = '#28a745';
                
                setTimeout(() => {
                    copyCodeBtn.innerHTML = originalText;
                    copyCodeBtn.style.background = '';
                }, 2000);
            })
            .catch(err => {
                console.error('Erro ao copiar: ', err);
                fallbackCopyText(code);
            });
    } else {
        fallbackCopyText(code);
    }
}

function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        
        const originalText = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Código Copiado!';
        copyCodeBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyCodeBtn.innerHTML = originalText;
            copyCodeBtn.style.background = '';
        }, 2000);
    } catch (err) {
        console.error('Erro ao copiar: ', err);
        alert('Copie manualmente: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Atualizar contadores
function updateCounters() {
    scratchCountEl.textContent = scratchCount;
    prizeCountEl.textContent = prizeCount;
    
    // Formatador de moeda brasileira
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
    
    totalPrizeEl.textContent = formatter.format(totalPrize);
}

// Inicializar quando a página carregar
window.addEventListener('load', initScratchCard);

// Ajustar para dispositivos móveis
window.addEventListener('resize', function() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 40;
    
    if (containerWidth < canvas.width) {
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerWidth * 0.6}px`;
    } else {
        canvas.style.width = '';
        canvas.style.height = '';
    }
});
