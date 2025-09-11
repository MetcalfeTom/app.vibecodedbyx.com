// PIRATE BATTLE GAME ENGINE
let playerHull = 100;
let enemyHull = 100;
let playerGold = 0;
let playerCannons = 10;
let enemyCannons = 8;
let gameActive = true;
let dodging = false;

// DOM Elements
const playerHullEl = document.getElementById('player-hull');
const enemyHullEl = document.getElementById('enemy-hull');
const playerGoldEl = document.getElementById('player-gold');
const logEl = document.getElementById('log');
const gameOverEl = document.getElementById('game-over');
const gameResultEl = document.getElementById('game-result');

// Buttons
const fireBtn = document.getElementById('fire-btn');
const repairBtn = document.getElementById('repair-btn');
const dodgeBtn = document.getElementById('dodge-btn');
const restartBtn = document.getElementById('restart-btn');

// Add log entry
function addLog(message, className = '') {
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + className;
    entry.innerHTML = message;
    logEl.insertBefore(entry, logEl.firstChild);
    
    // Keep only last 10 entries
    while (logEl.children.length > 10) {
        logEl.removeChild(logEl.lastChild);
    }
}

// Update display
function updateDisplay() {
    playerHullEl.textContent = Math.max(0, playerHull);
    enemyHullEl.textContent = Math.max(0, enemyHull);
    playerGoldEl.textContent = playerGold;
    
    // Update repair button
    repairBtn.disabled = playerGold < 50 || playerHull >= 100 || !gameActive;
}

// Fire cannons
function fireCannons() {
    if (!gameActive) return;
    
    const damage = Math.floor(Math.random() * playerCannons) + 5;
    enemyHull -= damage;
    
    document.querySelector('.enemy-ship').classList.add('explosion');
    setTimeout(() => {
        document.querySelector('.enemy-ship').classList.remove('explosion');
    }, 500);
    
    addLog(`YE FIRED YER CANNONS! <span class="damage">${damage} DAMAGE!</span>`);
    
    if (enemyHull <= 0) {
        victory();
    } else {
        setTimeout(enemyTurn, 1000);
    }
    
    updateDisplay();
}

// Repair ship
function repairShip() {
    if (!gameActive || playerGold < 50 || playerHull >= 100) return;
    
    playerGold -= 50;
    const repair = Math.floor(Math.random() * 20) + 15;
    playerHull = Math.min(100, playerHull + repair);
    
    addLog(`YE REPAIRED YER SHIP! <span class="heal">+${repair} HULL!</span>`);
    
    setTimeout(enemyTurn, 1000);
    updateDisplay();
}

// Dodge
function dodge() {
    if (!gameActive || dodging) return;
    
    dodging = true;
    dodgeBtn.disabled = true;
    
    document.querySelector('.player-ship').classList.add('shake');
    setTimeout(() => {
        document.querySelector('.player-ship').classList.remove('shake');
    }, 500);
    
    addLog(`YE BE DODGIN' THE NEXT ATTACK!`);
    
    setTimeout(() => {
        dodging = false;
        dodgeBtn.disabled = false;
    }, 3000);
    
    setTimeout(enemyTurn, 1000);
}

// Enemy turn
function enemyTurn() {
    if (!gameActive) return;
    
    const action = Math.random();
    
    if (action < 0.7) {
        // Enemy fires
        let damage = Math.floor(Math.random() * enemyCannons) + 3;
        
        if (dodging) {
            damage = Math.floor(damage * 0.3);
            addLog(`THE ENEMY FIRED BUT YE DODGED! <span class="damage">${damage} DAMAGE!</span>`);
        } else {
            addLog(`THE ENEMY FIRED! <span class="damage">${damage} DAMAGE!</span>`);
        }
        
        playerHull -= damage;
        
        document.querySelector('.player-ship').classList.add('explosion');
        setTimeout(() => {
            document.querySelector('.player-ship').classList.remove('explosion');
        }, 500);
        
        if (playerHull <= 0) {
            defeat();
        }
    } else if (action < 0.9 && enemyHull < 50) {
        // Enemy repairs
        const repair = Math.floor(Math.random() * 15) + 10;
        enemyHull = Math.min(100, enemyHull + repair);
        addLog(`THE ENEMY REPAIRED! <span class="heal">+${repair} HULL!</span>`);
    } else {
        // Enemy waits
        addLog(`THE ENEMY BE RELOADIN'!`);
    }
    
    updateDisplay();
}

// Victory
function victory() {
    gameActive = false;
    const goldEarned = Math.floor(Math.random() * 100) + 150;
    playerGold += goldEarned;
    
    addLog(`<span class="gold">VICTORY! YE EARNED ${goldEarned} GOLD!</span>`);
    
    // Submit score to leaderboard
    submitScore(goldEarned);
    
    gameResultEl.textContent = `VICTORY! YE PLUNDERED ${goldEarned} GOLD!`;
    gameResultEl.style.color = '#228B22';
    gameOverEl.classList.add('show');
    
    updateDisplay();
}

// Defeat
function defeat() {
    gameActive = false;
    
    addLog(`<span class="damage">YER SHIP BE SINKIN'!</span>`);
    
    gameResultEl.textContent = `DEFEAT! YE WALKED THE PLANK!`;
    gameResultEl.style.color = '#DC143C';
    gameOverEl.classList.add('show');
    
    updateDisplay();
}

// Submit score to leaderboard
async function submitScore(score) {
    try {
        await fetch('/003/api/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                player_name: 'PIRATE CAPTAIN',
                game: 'Pirate Battle',
                score: score
            })
        });
    } catch (error) {
        console.error('Failed to submit score:', error);
    }
}

// Restart game
function restartGame() {
    playerHull = 100;
    enemyHull = 100;
    playerGold = 0;
    gameActive = true;
    dodging = false;
    
    gameOverEl.classList.remove('show');
    logEl.innerHTML = '';
    
    addLog(`A NEW BATTLE BEGINS!`);
    updateDisplay();
}

// Event listeners
fireBtn.addEventListener('click', fireCannons);
repairBtn.addEventListener('click', repairShip);
dodgeBtn.addEventListener('click', dodge);
restartBtn.addEventListener('click', restartGame);

// Initialize
addLog(`AHOY! PREPARE FOR BATTLE!`);
updateDisplay();