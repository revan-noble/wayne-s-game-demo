// 获取画布和上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 设置画布尺寸
canvas.width = 800;
canvas.height = 600;

// 游戏状态
let score = 0;
let gameOver = false;
let isPaused = false;
let isGameStarted = false;
let gunX = canvas.width / 2;
const gunY = canvas.height - 50;
let bullets = [];
let mushrooms = [];
let lastMushroomSpawn = 0;
const mushroomSpawnInterval = 1500; // 每1.5秒生成一个蘑菇

// 获取控制按钮
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const endBtn = document.getElementById('endBtn');

// 加载图片资源
const gunImage = new Image();
gunImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDI1aDI1djVIMTB6IiBmaWxsPSIjZDRkNGQ0Ii8+PHBhdGggZD0iTTM1IDIwaDEwdjE1SDM1eiIgZmlsbD0iI2Q0ZDRkNCIvPjxwYXRoIGQ9Ik0xMCAyMGg1djE1aC01eiIgZmlsbD0iIzk5OSIvPjxwYXRoIGQ9Ik0xMCAzMGgzNXYySDEweiIgZmlsbD0iIzY2NiIvPjxwYXRoIGQ9Ik00MiAyMmg0djRoLTR6IiBmaWxsPSIjOTk5Ii8+PC9zdmc+';

// 监听鼠标移动
canvas.addEventListener('mousemove', (e) => {
    if (!isGameStarted || gameOver || isPaused) return;
    const rect = canvas.getBoundingClientRect();
    gunX = e.clientX - rect.left;
    // 确保手枪不会移出画布
    gunX = Math.max(25, Math.min(canvas.width - 25, gunX));
});

// 监听鼠标点击（射击）
canvas.addEventListener('click', () => {
    if (!isGameStarted || gameOver || isPaused) return;
    bullets.push({
        x: gunX,
        y: gunY,
        speed: 10
    });
    playShootSound();
});

// 射击音效
function playShootSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU');
    audio.volume = 0.2;
    audio.play().catch(() => {});
}

// 绘制手枪
function drawGun() {
    ctx.save();
    ctx.translate(gunX, gunY);
    ctx.drawImage(gunImage, -25, -25, 50, 50);
    ctx.restore();
}

// 绘制子弹
function drawBullets() {
    ctx.fillStyle = '#fff';
    bullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
}

// 绘制蘑菇怪物
function drawMushrooms() {
    mushrooms.forEach(mushroom => {
        // 随机生成蘑菇颜色和样式
        const mushroomType = mushroom.type || Math.floor(Math.random() * 4);
        mushroom.type = mushroomType;

        switch(mushroomType) {
            case 0: // 红色经典蘑菇
                ctx.fillStyle = '#ff6b6b';
                drawClassicMushroom(mushroom);
                break;
            case 1: // 紫色毒蘑菇
                ctx.fillStyle = '#9775fa';
                drawPoisonMushroom(mushroom);
                break;
            case 2: // 棕色蘑菇
                ctx.fillStyle = '#c0a080';
                drawBrownMushroom(mushroom);
                break;
            case 3: // 斑点蘑菇
                ctx.fillStyle = '#ffd43b';
                drawSpottedMushroom(mushroom);
                break;
        }
    });
}

function drawClassicMushroom(mushroom) {
    // 蘑菇帽
    ctx.beginPath();
    ctx.arc(mushroom.x, mushroom.y - 10, 15, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // 蘑菇柄
    ctx.fillStyle = '#fff';
    ctx.fillRect(mushroom.x - 8, mushroom.y - 10, 16, 20);
    
    // 白色斑点
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(mushroom.x - 5, mushroom.y - 15, 3, 0, Math.PI * 2);
    ctx.arc(mushroom.x + 5, mushroom.y - 20, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawPoisonMushroom(mushroom) {
    // 蘑菇帽
    ctx.beginPath();
    ctx.arc(mushroom.x, mushroom.y - 12, 18, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // 蘑菇柄
    ctx.fillStyle = '#8c69f5';
    ctx.fillRect(mushroom.x - 6, mushroom.y - 12, 12, 25);
    
    // 斑纹
    ctx.fillStyle = '#fff';
    for(let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(mushroom.x - 8 + i * 4, mushroom.y - 18, 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawBrownMushroom(mushroom) {
    // 蘑菇帽
    ctx.beginPath();
    ctx.arc(mushroom.x, mushroom.y - 8, 12, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // 蘑菇柄
    ctx.fillStyle = '#a08060';
    ctx.fillRect(mushroom.x - 5, mushroom.y - 8, 10, 18);
    
    // 纹理
    ctx.strokeStyle = '#906040';
    ctx.beginPath();
    ctx.moveTo(mushroom.x - 8, mushroom.y - 12);
    ctx.lineTo(mushroom.x + 8, mushroom.y - 12);
    ctx.stroke();
}

function drawSpottedMushroom(mushroom) {
    // 蘑菇帽
    ctx.beginPath();
    ctx.arc(mushroom.x, mushroom.y - 10, 16, Math.PI, Math.PI * 2);
    ctx.fill();
    
    // 蘑菇柄
    ctx.fillStyle = '#fcc419';
    ctx.fillRect(mushroom.x - 7, mushroom.y - 10, 14, 22);
    
    // 斑点图案
    ctx.fillStyle = '#ff922b';
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 2; j++) {
            ctx.beginPath();
            ctx.arc(mushroom.x - 8 + i * 8, mushroom.y - 18 + j * 6, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// 更新游戏状态
function update() {
    if (gameOver || !isGameStarted || isPaused) return;

    // 更新子弹位置
    bullets = bullets.filter(bullet => {
        bullet.y -= bullet.speed;
        return bullet.y > 0;
    });

    // 生成新的蘑菇
    const now = Date.now();
    if (now - lastMushroomSpawn > mushroomSpawnInterval) {
        mushrooms.push({
            x: Math.random() * (canvas.width - 30) + 15,
            y: -20,
            speed: 2 + Math.random() * 2
        });
        lastMushroomSpawn = now;
    }

    // 更新蘑菇位置
    mushrooms = mushrooms.filter(mushroom => {
        mushroom.y += mushroom.speed;
        
        // 检查是否到达底部
        if (mushroom.y > canvas.height) {
            gameOver = true;
            document.getElementById('gameOver').style.display = 'block';
            updateControlButtons();
            return false;
        }
        
        // 检查子弹碰撞
        for (let bullet of bullets) {
            const dx = bullet.x - mushroom.x;
            const dy = bullet.y - mushroom.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) {
                score++;
                document.getElementById('score').textContent = score;
                return false;
            }
        }
        
        return true;
    });
}

// 游戏主循环
function gameLoop() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 更新游戏状态
    update();
    
    // 绘制游戏元素
    drawBullets();
    drawMushrooms();
    drawGun();
    
    // 继续循环
    requestAnimationFrame(gameLoop);
}

// 更新控制按钮状态
function updateControlButtons() {
    startBtn.disabled = isGameStarted && !gameOver;
    pauseBtn.disabled = !isGameStarted || gameOver;
    endBtn.disabled = !isGameStarted || gameOver;
}

// 开始游戏
function startGame() {
    isGameStarted = true;
    gameOver = false;
    isPaused = false;
    score = 0;
    bullets = [];
    mushrooms = [];
    document.getElementById('score').textContent = '0';
    document.getElementById('gameOver').style.display = 'none';
    updateControlButtons();
}

// 暂停游戏
function togglePause() {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续游戏' : '暂停游戏';
}

// 结束游戏
function endGame() {
    gameOver = true;
    isGameStarted = false;
    document.getElementById('gameOver').style.display = 'block';
    updateControlButtons();
}

// 重新开始游戏
function restartGame() {
    startGame();
}

// 添加按钮事件监听
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);
endBtn.addEventListener('click', endGame);

// 开始游戏循环
gameLoop();