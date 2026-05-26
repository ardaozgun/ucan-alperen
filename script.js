const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start-btn');

const alperenImg = new Image(); alperenImg.src = 'alperen.png';
const jumpSound = new Audio('jump.mp3');
const bgMusic = new Audio('music.mp3'); bgMusic.loop = true;

let frames = 0, score = 0, gameStarted = false, gameOver = false, reqAnim;

const alperen = {
    x: 50, y: 150, w: 40, h: 40, velocity: 0, gravity: 0.25, jump: -5,
    draw: () => ctx.drawImage(alperenImg, alperen.x, alperen.y, alperen.w, alperen.h),
    update: () => {
        alperen.velocity += alperen.gravity; alperen.y += alperen.velocity;
        if (alperen.y + alperen.h >= canvas.height) { alperen.y = canvas.height - alperen.h; gameOver = true; }
    }
};

const pipes = {
    arr: [], w: 50, gap: 120, dx: 2,
    draw: () => {
        ctx.fillStyle = '#2ecc71';
        pipes.arr.forEach(p => {
            ctx.fillRect(p.x, 0, pipes.w, p.top);
            ctx.fillRect(p.x, canvas.height - p.bottom, pipes.w, p.bottom);
        });
    },
    update: () => {
        if (frames % 100 === 0) {
            let topH = Math.random() * (canvas.height / 2);
            pipes.arr.push({ x: canvas.width, top: topH, bottom: canvas.height - topH - pipes.gap });
        }
        pipes.arr.forEach((p, i) => {
            p.x -= pipes.dx;
            if (alperen.x + alperen.w > p.x && alperen.x < p.x + pipes.w &&
                (alperen.y < p.top || alperen.y + alperen.h > canvas.height - p.bottom)) gameOver = true;
            if (p.x === 50) scoreEl.innerText = "Puan: " + (++score);
            if (p.x + pipes.w <= 0) pipes.arr.splice(i, 1);
        });
    }
};

function loop() {
    if (!gameStarted) return;
    ctx.fillStyle = '#70c5ce'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    alperen.draw(); pipes.draw(); alperen.update(); pipes.update(); frames++;

    if (gameOver) {
        ctx.fillStyle = 'red'; ctx.font = '30px Arial'; ctx.fillText('OYUN BİTTİ', 70, canvas.height/2);
        startBtn.style.display = 'block'; startBtn.innerText = "Tekrar Oyna";
        bgMusic.pause(); return;
    }
    reqAnim = requestAnimationFrame(loop);
}

startBtn.addEventListener('click', () => {
    alperen.y = 150; alperen.velocity = 0; pipes.arr = []; score = 0; frames = 0;
    scoreEl.innerText = "Puan: 0"; gameOver = false; startBtn.style.display = 'none';
    gameStarted = true; bgMusic.currentTime = 0; bgMusic.play(); loop();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && gameStarted && !gameOver) {
        alperen.velocity = alperen.jump; jumpSound.currentTime = 0; jumpSound.play();
    }
});
