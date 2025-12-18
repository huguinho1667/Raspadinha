const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Preenche o canvas com a cor da raspadinha
ctx.fillStyle = '#C0C0C0';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let raspou = false;

// Evento de raspagem com o mouse
canvas.addEventListener('mousemove', function(e) {
    if(e.buttons !== 1) return; // só quando botão do mouse pressionado

    const x = e.offsetX;
    const y = e.offsetY;

    ctx.clearRect(x-10, y-10, 20, 20); // "raspa" a área
    raspou = true;
});

// Para toque em dispositivos móveis
canvas.addEventListener('touchmove', function(e){
    e.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    ctx.clearRect(x-15, y-15, 30, 30);
    raspou = true;
}, {passive: false});

// Quando solta o mouse, podemos verificar se raspou algo
canvas.addEventListener('mouseup', function(){
    if(raspou){
        console.log('Frase visível agora!');
        // A frase já aparece, pois o canvas raspado deixa ela visível
    }
});


