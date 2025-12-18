// Elementos principais
const canvas = document.getElementById('scratchCanvas');
const ctx = canvas.getContext('2d');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const prizeReveal = document.getElementById('prizeReveal');
const prizeAmount = document.getElementById('prizeAmount');
const prizeCode = document.getElementById('prizeCode');

// Elementos de controle
const resetBtn = document.getElementById('resetBtn');
const newCardBtn = document.getElementById('newCardBtn');
const claimBtn = document.getElementById('claimBtn');
const shareBtn = document.getElementById('shareBtn');

// Elementos de estatísticas
const scratchCountEl = document.getElementById('scratchCount');
const prizeCountEl = document.getElementById('prizeCount');
const totalPrizeEl = document.getElementById('totalPrize');

// Modal
const claimModal = document.getElementById('claimModal');
const modalPrizeAmount = document.getElementById('modalPrizeAmount');
const modalPrizeCode = document.getElementById('modalPrizeCode');
const closeModal = document.getElementById('closeModal');
const copyAllBtn = document.getElementById('copyAllBtn');

// Efeitos
const particlesContainer = document.getElementById('particles');
const confettiContainer = document.getElementById('confettiContainer');

// Estado do jogo
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let scratchCount = 1;
let prizeCount = 0;
let totalPrize = 0;
let revealed = false;

// Configurações
const scratchRadius = 25;
const revealThreshold = 70;

// Tabela de prêmios
const PRIZES = [
    { name: "1 MILHÃO DE REAIS", value: 1000000, code: "JACKPOT-001" },
    { name: "500 MIL REAIS", value: 500000, code: "GOLD-500K" },
    { name: "100 MIL REAIS", value: 100000, code: "SILVER-100K" },
    { name: "50 MIL REAIS", value: 50000, code: "BRONZE-50K" },
    { name: "10 MIL REAIS", value: 10000, code: "COPPER-10K" },
    { name: "5 MIL REAIS", value: 5000, code: "LUCKY-5K" },
    { name: "1 MIL REAIS", value: 1000, code: "MINI-1K" },
    { name: "500 REAIS", value: 500, code: "MICRO-500" }
];

// Inicialização
function init() {
    // Configurar canvas
    setupCanvas();
    
    // Criar partículas de fundo
    createParticles();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Atualizar estatísticas
    updateStats();
    
    // Ajustar canvas para dispositivos móveis
    adjustCanvasForMobile();
}

// Configurar canvas
function setupCanvas() {
    // Definir dimensões
    canvas.width = 600;
    canvas.height = 350;
    
    // Desenhar superfície da raspadinha
    drawScratchSurface();
}

// Desenhar superfície da raspadinha
function drawScratchSurface() {
    // Fundo gradiente prateado
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#b0b0b0');
    gradient.addColorStop(0.3, '#d0d0d0');
    gradient.addColorStop(0.7, '#e0e0e0');
    gradient.addColorStop(1, '#b0b0b0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Padrão de segurança
    drawSecurityPattern();
    
    // Texto principal
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.font = 'bold 32px "Oswald", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASPADINHA DO MILHÃO', canvas.width/2, canvas.height/2 - 40);
    
    // Instruções
    ctx.font = '18px "Montserrat", sans-serif';
    ctx.fillText('Clique e arraste para raspar', canvas.width/2, canvas.height/2 + 10);
    
    // Símbolos decorativos
    ctx.font = 'bold 48px Arial';
    for (let i = 0; i < 5; i++) {
        const x = (i + 1) * (canvas.width / 6);
        const y = canvas.height / 2 + 60;
        ctx.fillText('$', x, y);
    }
}

// Desenhar padrão de segurança
function drawSecurityPattern() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    // Linhas diagonais
    for (let i = -canvas.height; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + canvas.height, canvas.height);
        ctx.stroke();
    }
    
    // Microtexto
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = '8px Arial';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillText('SEGURANÇA', x, y);
    }
}

// Criar partículas de fundo
function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Posição aleatória
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        
        // Tamanho aleatório
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Opacidade aleatória
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        // Cor dourada
        const hue = Math.random() * 20 + 40; // 40-60 (dourado)
        particle.style.backgroundColor = `hsla(${hue}, 100%, 50%, 0.3)`;
        
        // Animação
        particle.style.animation = `particleFloat ${Math.random() * 20 + 10}s infinite alternate`;
        particle.style.setProperty('--tx', `${Math.random() * 100 - 50}px`);
        particle.style.setProperty('--ty', `${Math.random() * 100 - 50}px`);
        
        particlesContainer.appendChild(particle);
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Eventos do mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Eventos de toque
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Botões
    resetBtn.addEventListener('click', resetScratchArea);
    newCardBtn.addEventListener('click', generateNewCard);
    claimBtn.addEventListener('click', showClaimModal);
    shareBtn.addEventListener('click', sharePrize);
    closeModal.addEventListener('click', () => claimModal.classList.remove('active'));
    copyAllBtn.addEventListener('click', copyAllInfo);
    
    // Fechar modal clicando fora
    claimModal.addEventListener('click', (e) => {
        if (e.target === claimModal) {
            claimModal.classList.remove('active');
        }
    });
    
    // Redimensionamento da janela
    window.addEventListener('resize', adjustCanvasForMobile);
}

// Começar a desenhar
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getMousePos(e);
    drawDot(lastX, lastY);
}

// Desenhar enquanto se move
function draw(e) {
    if (!isDrawing) return;
    e.preventDefault();
    
    const [x, y] = getMousePos(e);
    
    // Configurar estilo do traço
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = scratchRadius;
    ctx.strokeStyle = 'black';
    
    // Desenhar linha
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Desenhar ponto adicional para melhor cobertura
    drawDot(x, y);
    
    // Atualizar posição
    [lastX, lastY] = [x, y];
    
    // Verificar progresso
    checkScratchProgress();
}

// Desenhar um ponto
function drawDot(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, scratchRadius / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Parar de desenhar
function stopDrawing() {
    isDrawing = false;
}

// Obter posição do mouse/touch
function getMousePos(e) {
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

// Handlers para touch
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
    
    // Atualizar barra de progresso
    progressFill.style.width = `${percentScratched}%`;
    progressText.textContent = `${percentScratched}% raspado`;
    
    // Verificar se deve revelar prêmio
    if (percentScratched >= revealThreshold && !revealed) {
        revealPrize();
    }
}

// Revelar prêmio
function revealPrize() {
    revealed = true;
    
    // Determinar prêmio (80% chance de ganhar algo)
    const winsPrize = Math.random() < 0.8;
    
    if (winsPrize) {
        // Escolher prêmio aleatório (prêmios menores são mais comuns)
        let prizeIndex;
        const random = Math.random();
        
        if (random < 0.05) { // 5% chance para jackpot
            prizeIndex = 0;
        } else if (random < 0.15) { // 10% chance para 500k
            prizeIndex = 1;
        } else if (random < 0.3) { // 15% chance para 100k
            prizeIndex = 2;
        } else if (random < 0.5) { // 20% chance para 50k
            prizeIndex = 3;
        } else if (random < 0.7) { // 20% chance para 10k
            prizeIndex = 4;
        } else if (random < 0.85) { // 15% chance para 5k
            prizeIndex = 5;
        } else if (random < 0.95) { // 10% chance para 1k
            prizeIndex = 6;
        } else { // 5% chance para 500
            prizeIndex = 7;
        }
        
        const prize = PRIZES[prizeIndex];
        
        // Atualizar exibição do prêmio
        prizeAmount.textContent = prize.name;
        prizeCode.textContent = prize.code;
        modalPrizeAmount.textContent = prize.name;
        modalPrizeCode.textContent = prize.code;
        
        // Atualizar estatísticas
        totalPrize += prize.value;
        prizeCount++;
        
        // Efeitos especiais para prêmios grandes
        if (prize.value >= 100000) {
            createMoneyRain();
        }
        
        // Criar animações
        createSparkleAnimation();
        
    } else {
        // Não ganhou
        prizeAmount.textContent = "TENTE NOVAMENTE!";
        prizeCode.textContent = "SEM-PRÊMIO";
        modalPrizeAmount.textContent = "Não foi desta vez!";
        modalPrizeCode.textContent = "SEM-PRÊMIO";
    }
    
    // Mostrar revelação
    prizeReveal.classList.add('active');
    
    // Atualizar estatísticas
    updateStats();
    
    // Lançar confetes
    launchConfetti();
    
    // Tocar som (simulado)
    playRevealSound();
}

// Criar animação de brilho
function createSparkleAnimation() {
    const sparkles = prizeReveal.querySelectorAll('.sparkle');
    
    sparkles.forEach((sparkle, index) => {
        const tx = Math.random() * 200 - 100;
        const ty = Math.random() * 200 - 100;
        
        sparkle.style.setProperty('--tx', `${tx}px`);
        sparkle.style.setProperty('--ty', `${ty}px`);
        
        // Delay aleatório para cada brilho
        sparkle.style.animationDelay = `${index * 0.3}s`;
    });
}

// Criar chuva de dinheiro
function createMoneyRain() {
    const symbols = ['💵', '💴', '💶', '💷', '💰', '💸', '💲'];
    
    for (let i = 0; i < 30; i++) {
        const money = document.createElement('div');
        money.className = 'confetti money-rain';
        money.textContent = symbols[Math.floor(Math.random() * symbols.length)];
        money.style.fontSize = `${Math.random() * 24 + 16}px`;
        money.style.color = '#ffd700';
        
        // Posição inicial
        const startX = Math.random() * 100;
        money.style.left = `${startX}vw`;
        money.style.top = '-50px';
        
        confettiContainer.appendChild(money);
        
        // Animar queda
        animateMoneyRain(money, startX);
    }
}

function animateMoneyRain(money, startX) {
    const duration = Math.random() * 3 + 2;
    const horizontalMove = (Math.random() - 0.5) * 200;
    
    money.style.transition = `all ${duration}s linear`;
    
    setTimeout(() => {
        money.style.top = '100vh';
        money.style.left = `calc(${startX}vw + ${horizontalMove}px)`;
        money.style.opacity = '0';
        money.style.transform = `rotate(${Math.random() * 720}deg)`;
    }, 10);
    
    // Remover após animação
    setTimeout(() => {
        if (money.parentNode) {
            money.parentNode.removeChild(money);
        }
    }, duration * 1000 + 100);
}

// Lançar confetes
function launchConfetti() {
    const colors = ['#ffd700', '#ff6b00', '#00b09b', '#96c93d', '#4d96ff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posição inicial
        const startX = Math.random() * 100;
        confetti.style.left = `${startX}vw`;
        confetti.style.top = '-20px';
        
        // Cor e tamanho
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;
        
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size * 1.5}px`;
        
        // Rotação
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        confettiContainer.appendChild(confetti);
        
        // Animar
        animateConfetti(confetti, startX);
    }
}

function animateConfetti(confetti, startX) {
    const duration = Math.random() * 4 + 3;
    const horizontalMove = (Math.random() - 0.5) * 100;
    
    confetti.style.transition = `all ${duration}s cubic-bezier(0.1, 0.7, 1.0, 0.1)`;
    
    setTimeout(() => {
        confetti.style.top = '100vh';
        confetti.style.left = `calc(${startX}vw + ${horizontalMove}px)`;
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${Math.random() * 1080}deg) scale(${Math.random() * 0.5 + 0.5})`;
    }, 10);
    
    // Remover após animação
    setTimeout(() => {
        if (confetti.parentNode) {
            confetti.parentNode.removeChild(confetti);
        }
    }, duration * 1000 + 100);
}

// Tocar som de revelação
function playRevealSound() {
    // Em produção, use arquivos de áudio reais
    console.log('🎵 Som de revelação tocado!');
    
    // Exemplo com Web Audio API (opcional)
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // Nota C5
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // Nota E5
        oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // Nota G5
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Áudio não suportado neste navegador');
    }
}

// Limpar área raspada
function resetScratchArea() {
    // Redesenhar superfície
    drawScratchSurface();
    
    // Resetar progresso
    progressFill.style.width = '0%';
    progressText.textContent = '0% raspado';
    
    // Esconder revelação se visível
    if (revealed) {
        prizeReveal.classList.remove('active');
        revealed = false;
        
        // Restaurar mensagem padrão
        prizeAmount.textContent = "1 MILHÃO DE REAIS";
        prizeCode.textContent = "MILHAO-001-2024";
    }
    
    // Feedback visual
    canvas.style.transform = 'scale(0.98)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 200);
}

// Gerar nova raspadinha
function generateNewCard() {
    // Resetar raspadinha atual
    resetScratchArea();
    
    // Incrementar contador
    scratchCount++;
    
    // Atualizar estatísticas
    updateStats();
    
    // Efeito visual
    canvas.style.opacity = '0.5';
    setTimeout(() => {
        canvas.style.opacity = '1';
    }, 300);
}

// Mostrar modal de resgate
function showClaimModal() {
    claimModal.classList.add('active');
}

// Compartilhar prêmio
function sharePrize() {
    const prizeText = `🎉 Acabei de ganhar ${prizeAmount.textContent} na Raspadinha do Milhão! Código: ${prizeCode.textContent} 🎰`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Ganhei na Raspadinha do Milhão!',
            text: prizeText,
            url: window.location.href
        })
        .then(() => console.log('Compartilhado com sucesso!'))
        .catch((error) => console.log('Erro ao compartilhar:', error));
    } else {
        // Fallback: copiar para área de transferência
        navigator.clipboard.writeText(prizeText)
            .then(() => {
                alert('Texto copiado para a área de transferência! Cole nas suas redes sociais.');
            })
            .catch(() => {
                prompt('Copie o texto abaixo para compartilhar:', prizeText);
            });
    }
}

// Copiar todas as informações
function copyAllInfo() {
    const claimInfo = `
🏆 PRÊMIO GANHO
Valor: ${modalPrizeAmount.textContent}
Código: ${modalPrizeCode.textContent}

📋 PASSOS PARA RESGATE:
1. Anote o código acima
2. Ligue para 0800 123 4567
3. Forneça o código e seus documentos
4. Receba em até 5 dias úteis

📍 Raspadinha do Milhão
${window.location.href}
    `.trim();
    
    navigator.clipboard.writeText(claimInfo)
        .then(() => {
            // Feedback visual
            const originalText = copyAllBtn.innerHTML;
            copyAllBtn.innerHTML = '<i class="fas fa-check"></i> COPIADO!';
            copyAllBtn.style.background = '#00b09b';
            
            setTimeout(() => {
                copyAllBtn.innerHTML = originalText;
                copyAllBtn.style.background = '';
            }, 2000);
        })
        .catch(() => {
            alert('Não foi possível copiar. Copie manualmente as informações.');
        });
}

// Atualizar estatísticas
function updateStats() {
    scratchCountEl.textContent = scratchCount;
    prizeCountEl.textContent = prizeCount;
    
    // Formatar valor total
    const formatter = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
    
    totalPrizeEl.textContent = formatter.format(totalPrize);
}

// Ajustar canvas para dispositivos móveis
function adjustCanvasForMobile() {
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 40;
    
    if (containerWidth < 600) {
        const scale = containerWidth / 600;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${350 * scale}px`;
        
        // Atualizar contexto para nova escala
        canvas.width = containerWidth;
        canvas.height = 350 * scale;
        
        // Redesenhar
        if (!revealed) {
            drawScratchSurface();
        }
    } else {
        canvas.style.width = '';
        canvas.style.height = '';
        canvas.width = 600;
        canvas.height = 350;
        
        if (!revealed) {
            drawScratchSurface();
        }
    }
}

// Inicializar quando a página carregar
window.addEventListener('DOMContentLoaded', init);

// Adicionar CSS para animação de partículas
const style = document.createElement('style');
style.textContent = `
@keyframes particleFloat {
    0% {
        transform: translate(0, 0);
    }
    100% {
        transform: translate(var(--tx), var(--ty));
    }
}

.money-rain {
    position: absolute;
    font-size: 24px;
    pointer-events: none;
    z-index: 1000;
}
`;
document.head.appendChild(style);
