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
const copyCodeBtn = document.getElementById('copyCodeBtn');
const confettiContainer = document.getElementById('confettiContainer');

// Estado do jogo
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let scratchCount = 1;
let prizeCount = 0;
let revealed = false;

// Configurações
const scratchRadius = 20;
const revealThreshold = 70; // Percentual necessário para revelar o prêmio

// Inicializar a raspadinha
function initScratchCard() {
    // Configurar canvas
    canvas.width = 500;
    canvas.height = 300;
    
    // Desenhar a superfície raspável (efeto metalizado)
    drawScratchSurface();
    
    // Adicionar event listeners
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Para dispositivos touch
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

// Desenhar a superfície raspável
function drawScratchSurface() {
    // Fundo gradiente prateado
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#b0b0b0');
    gradient.addColorStop(0.5, '#d0d0d0');
    gradient.addColorStop(1, '#b0b0b0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Adicionar textura de risco
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for(let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 30 + 10;
        const height = Math.random() * 3 + 1;
        
        ctx.fillRect(x, y, width, height);
    }
    
    // Adicionar logo ou texto sobre a raspadinha
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('RASPE AQUI PARA REVELAR', canvas.width/2, canvas.height/2);
    
    ctx.font = '16px Arial';
    ctx.fillText('Use o mouse ou dedo para raspar', canvas.width/2, canvas.height/2 + 40);
}

// Começar a desenhar (raspar)
function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = getMousePos(canvas, e);
    drawDot(lastX, lastY); // Raspa no ponto inicial
}

// Desenhar enquanto se move (raspar)
function draw(e) {
    if (!isDrawing) return;
    
    e.preventDefault();
    
    const [x, y] = getMousePos(canvas, e);
    
    // Desenhar linha entre a posição anterior e atual
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = scratchRadius;
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Desenhar um círculo no ponto atual para cobrir melhor
    drawDot(x, y);
    
    [lastX, lastY] = [x, y];
    
    // Verificar porcentagem raspada
    checkScratchProgress();
}

// Desenhar um ponto/círculo
function drawDot(x, y) {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, scratchRadius / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Parar de desenhar (raspar)
function stopDrawing() {
    isDrawing = false;
}

// Obter posição do mouse/touch no canvas
function getMousePos(canvas, e) {
    const rect = canvas.getBoundingClientRect();
    
    // Verificar se é evento de touch
    if (e.type.includes('touch')) {
        const touch = e.touches[0] || e.changedTouches[0];
        return [
            touch.clientX - rect.left,
            touch.clientY - rect.top
        ];
    } else {
        // Evento de mouse
        return [
            e.clientX - rect.left,
            e.clientY - rect.top
        ];
    }
}

// Handlers para touch events
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
    // Obter dados da imagem
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    
    // Contar pixels transparentes (raspados)
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) {
            transparentPixels++;
        }
    }
    
    // Calcular porcentagem
    const totalPixels = canvas.width * canvas.height;
    const percentScratched = Math.round((transparentPixels / totalPixels) * 100);
    
    // Atualizar barra de progresso
    progressBar.style.width = `${percentScratched}%`;
    progressText.textContent = `${percentScratched}% raspado`;
    
    // Verificar se deve revelar o prêmio
    if (percentScratched >= revealThreshold && !revealed) {
        revealPrize();
    }
}

// Revelar o prêmio
function revealPrize() {
    revealed = true;
    
    // Mostrar mensagem de prêmio
    prizeMessage.classList.add('revealed');
    
    // Atualizar contador de prêmios
    prizeCount++;
    updateCounters();
    
    // Lançar confetes
    launchConfetti();
    
    // Tocar som de vitória (simulado)
    playVictorySound();
}

// Criar efeito de confete
function launchConfetti() {
    const colors = ['#ffd93d', '#ff6b6b', '#6bcf7f', '#4d96ff', '#ff8e53'];
    
    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Posição inicial aleatória no topo
        const startX = Math.random() * 100;
        confetti.style.left = `${startX}vw`;
        
        // Cor aleatória
        const color = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.backgroundColor = color;
        
        // Tamanho aleatório
        const size = Math.random() * 10 + 5;
        confetti.style.width = `${size}px`;
        confetti.style.height = `${size * 1.5}px`;
        
        // Rotação aleatória
        const rotation = Math.random() * 360;
        confetti.style.transform = `rotate(${rotation}deg)`;
        
        // Adicionar ao container
        confettiContainer.appendChild(confetti);
        
        // Animar a queda
        animateConfetti(confetti, startX);
    }
    
    // Limpar confetes após 5 segundos
    setTimeout(() => {
        confettiContainer.innerHTML = '';
    }, 5000);
}

// Animar confete caindo
function animateConfetti(confetti, startX) {
    // Duração aleatória entre 3 e 6 segundos
    const duration = Math.random() * 3 + 3;
    
    // Movimento horizontal aleatório
    const horizontalMove = (Math.random() - 0.5) * 100;
    
    // Aplicar animação
    confetti.style.transition = `all ${duration}s linear`;
    
    // Após um pequeno delay para animação começar
    setTimeout(() => {
        confetti.style.top = '100vh';
        confetti.style.left = `calc(${startX}vw + ${horizontalMove}px)`;
        confetti.style.opacity = '0';
        confetti.style.transform = `rotate(${Math.random() * 720}deg)`;
    }, 10);
}

// Simular som de vitória
function playVictorySound() {
    // Em um cenário real, você usaria um arquivo de áudio
    // Para este exemplo, apenas simulamos
    console.log("🎉 Som de vitória tocado! Parabéns!");
    
    // Se quiser implementar som real, descomente o código abaixo
    /*
    const audio = new Audio('victory-sound.mp3');
    audio.volume = 0.3;
    audio.play();
    */
}

// Limpar área raspada
function resetScratchArea() {
    // Redesenhar a superfície
    drawScratchSurface();
    
    // Resetar progresso
    progressBar.style.width = '0%';
    progressText.textContent = '0% raspado';
    
    // Esconder mensagem de prêmio se estiver visível
    if (revealed) {
        prizeMessage.classList.remove('revealed');
        revealed = false;
    }
}

// Gerar nova raspadinha
function generateNewCard() {
    // Resetar canvas
    resetScratchArea();
    
    // Incrementar contador
    scratchCount++;
    updateCounters();
    
    // Gerar um efeito visual de "nova carta"
    canvas.style.transform = 'scale(0.95)';
    setTimeout(() => {
        canvas.style.transform = 'scale(1)';
    }, 300);
    
    // Em alguns casos, a nova carta não terá prêmio (para simular)
    // 70% de chance de ter prêmio, 30% de não ter
    const hasPrize = Math.random() < 0.7;
    
    if (!hasPrize) {
        // Alterar a mensagem de prêmio para "Tente novamente"
        setTimeout(() => {
            prizeMessage.querySelector('h2').textContent = "QUE PENA!";
            prizeMessage.querySelector('h1').innerHTML = 'Tente na próxima <span class="highlight">raspadinha</span>!';
            prizeMessage.querySelector('.prize-description').textContent = "Continue tentando para ganhar o Celin Safado!";
            prizeMessage.querySelector('.prize-code').style.display = 'none';
        }, 50);
    } else {
        // Restaurar mensagem original
        setTimeout(() => {
            prizeMessage.querySelector('h2').textContent = "PARABÉNS!";
            prizeMessage.querySelector('h1').innerHTML = 'Você ganhou o <span class="highlight">CELIN SAFADO</span>!';
            prizeMessage.querySelector('.prize-description').textContent = "Um smartphone lendário com poderes especiais!";
            prizeMessage.querySelector('.prize-code').style.display = 'flex';
        }, 50);
    }
}

// Copiar código do prêmio
function copyPrizeCode() {
    const code = "CELIN-2023-SAFADO";
    
    // Usar API Clipboard se disponível
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code)
            .then(() => {
                // Feedback visual
                const originalText = copyCodeBtn.innerHTML;
                copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Código Copiado!';
                copyCodeBtn.style.background = '#6bcf7f';
                
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

// Método alternativo para copiar texto
function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        
        // Feedback visual
        const originalText = copyCodeBtn.innerHTML;
        copyCodeBtn.innerHTML = '<i class="fas fa-check"></i> Código Copiado!';
        copyCodeBtn.style.background = '#6bcf7f';
        
        setTimeout(() => {
            copyCodeBtn.innerHTML = originalText;
            copyCodeBtn.style.background = '';
        }, 2000);
    } catch (err) {
        console.error('Erro ao copiar: ', err);
        alert('Não foi possível copiar o código. Copie manualmente: ' + text);
    }
    
    document.body.removeChild(textArea);
}

// Atualizar contadores na interface
function updateCounters() {
    scratchCountEl.textContent = scratchCount;
    prizeCountEl.textContent = prizeCount;
}

// Inicializar quando a página carregar
window.addEventListener('load', initScratchCard);

// Para garantir que o canvas se ajuste em dispositivos móveis
window.addEventListener('resize', function() {
    // Manter proporção do canvas
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 40; // Considerando padding
    
    if (containerWidth < canvas.width) {
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `${containerWidth * 0.6}px`;
    } else {
        canvas.style.width = '';
        canvas.style.height = '';
    }
});
