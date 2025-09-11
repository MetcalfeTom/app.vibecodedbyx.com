// PIRATE ADVENTURE GAME - ARRR!
class PirateAdventure {
    constructor() {
        this.pirateName = '';
        this.goldCollected = 0;
        this.battlesWon = 0;
        this.shipsSunk = 0;
        this.totalScore = 0;
        this.health = 100;
        this.gameRunning = false;
        this.gameTime = 0;
        this.gameInterval = null;
        this.spawnInterval = null;
        this.gameElements = [];
        
        this.initializeEventListeners();
        this.loadLeaderboard();
        this.loadStats();
    }

    initializeEventListeners() {
        document.getElementById('startAdventure').addEventListener('click', () => this.startGame());
        document.getElementById('pauseBtn').addEventListener('click', () => this.pauseGame());
        document.getElementById('endAdventureBtn').addEventListener('click', () => this.endGame());
        document.getElementById('saveScoreBtn').addEventListener('click', () => this.saveScore());
        document.getElementById('playAgainBtn').addEventListener('click', () => this.resetGame());
        
        document.getElementById('pirateName').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.startGame();
        });

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame() {
        const nameInput = document.getElementById('pirateName');
        this.pirateName = nameInput.value.trim() || 'Anonymous Pirate';
        
        if (this.pirateName.length < 2) {
            alert('ARRR! Enter a proper pirate name, ye scurvy dog!');
            return;
        }

        document.getElementById('startScreen').classList.add('hidden');
        document.getElementById('gameArea').classList.remove('hidden');
        document.getElementById('gameOverScreen').classList.add('hidden');
        
        this.resetGameStats();
        this.gameRunning = true;
        this.startGameLoop();
        this.startSpawning();
    }

    resetGameStats() {
        this.goldCollected = 0;
        this.battlesWon = 0;
        this.shipsSunk = 0;
        this.totalScore = 0;
        this.health = 100;
        this.gameTime = 0;
        this.gameElements = [];
        this.updateDisplay();
        document.getElementById('gameElements').innerHTML = '';
    }

    startGameLoop() {
        this.gameInterval = setInterval(() => {
            if (this.gameRunning) {
                this.gameTime++;
                this.updateGameElements();
                this.checkCollisions();
                this.updateDisplay();
                
                if (this.health <= 0) {
                    this.endGame();
                }
            }
        }, 100);
    }

    startSpawning() {
        this.spawnInterval = setInterval(() => {
            if (this.gameRunning) {
                this.spawnRandomElement();
            }
        }, 2000);
    }

    spawnRandomElement() {
        const gameBoard = document.getElementById('gameElements');
        const elementType = Math.random();
        let element;
        
        if (elementType < 0.4) {
            // Gold coin
            element = this.createElement('💰', 'gold-coin', 50);
        } else if (elementType < 0.7) {
            // Enemy pirate
            element = this.createElement('💀', 'enemy-pirate', 30);
        } else if (elementType < 0.9) {
            // Enemy ship
            element = this.createElement('🚢', 'enemy-ship', 100);
        } else {
            // Health potion
            element = this.createElement('🧪', 'health-potion', 25);
        }
        
        gameBoard.appendChild(element);
        this.gameElements.push(element);
        
        // Remove element after some time if not clicked
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
                this.removeElementFromArray(element);
            }
        }, 5000);
    }

    createElement(emoji, className, points) {
        const element = document.createElement('div');
        element.className = `game-element ${className}`;
        element.textContent = emoji;
        element.dataset.points = points;
        element.style.left = Math.random() * 80 + '%';
        element.style.top = Math.random() * 60 + 20 + '%';
        
        element.addEventListener('click', () => this.handleElementClick(element));
        
        return element;
    }

    handleElementClick(element) {
        if (!this.gameRunning) return;
        
        const points = parseInt(element.dataset.points);
        const className = element.className;
        
        if (className.includes('gold-coin')) {
            this.goldCollected += points;
            this.totalScore += points;
            this.showFloatingText('+' + points + ' GOLD!', element, '#FFD700');
        } else if (className.includes('enemy-pirate')) {
            this.battlesWon++;
            this.totalScore += points;
            this.showFloatingText('BATTLE WON!', element, '#FF4500');
        } else if (className.includes('enemy-ship')) {
            this.shipsSunk++;
            this.totalScore += points * 2;
            this.showFloatingText('SHIP SUNK!', element, '#8B0000');
        } else if (className.includes('health-potion')) {
            this.health = Math.min(100, this.health + points);
            this.showFloatingText('+' + points + ' HEALTH!', element, '#32CD32');
        }
        
        element.parentNode.removeChild(element);
        this.removeElementFromArray(element);
        this.updateDisplay();
    }

    showFloatingText(text, element, color) {
        const floatingText = document.createElement('div');
        floatingText.className = 'floating-text';
        floatingText.textContent = text;
        floatingText.style.color = color;
        floatingText.style.left = element.style.left;
        floatingText.style.top = element.style.top;
        
        document.getElementById('gameElements').appendChild(floatingText);
        
        setTimeout(() => {
            if (floatingText.parentNode) {
                floatingText.parentNode.removeChild(floatingText);
            }
        }, 2000);
    }

    updateGameElements() {
        // Gradually reduce health over time (sea dangers!)
        if (Math.random() < 0.02) {
            this.health = Math.max(0, this.health - 1);
        }
    }

    checkCollisions() {
        // Additional game logic could go here
    }

    removeElementFromArray(element) {
        const index = this.gameElements.indexOf(element);
        if (index > -1) {
            this.gameElements.splice(index, 1);
        }
    }

    handleKeyPress(e) {
        if (!this.gameRunning) return;
        
        // Arrow key controls for future enhancements
        const player = document.getElementById('player');
        // Could add player movement here
    }

    pauseGame() {
        this.gameRunning = !this.gameRunning;
        document.getElementById('pauseBtn').textContent = this.gameRunning ? '⏸️ PAUSE' : '▶️ RESUME';
    }

    endGame() {
        this.gameRunning = false;
        clearInterval(this.gameInterval);
        clearInterval(this.spawnInterval);
        
        document.getElementById('gameArea').classList.add('hidden');
        document.getElementById('gameOverScreen').classList.remove('hidden');
        
        this.showFinalStats();
    }

    showFinalStats() {
        const finalStats = document.getElementById('finalStats');
        finalStats.innerHTML = `
            <div class="final-stat">🦜 PIRATE: ${this.pirateName}</div>
            <div class="final-stat">💰 GOLD COLLECTED: ${this.goldCollected}</div>
            <div class="final-stat">⚔️ BATTLES WON: ${this.battlesWon}</div>
            <div class="final-stat">🚢 SHIPS SUNK: ${this.shipsSunk}</div>
            <div class="final-stat">🏆 TOTAL SCORE: ${this.totalScore}</div>
            <div class="final-stat">⏰ ADVENTURE TIME: ${Math.floor(this.gameTime / 10)}s</div>
        `;
    }

    updateDisplay() {
        document.getElementById('goldDisplay').textContent = this.goldCollected;
        document.getElementById('battlesDisplay').textContent = this.battlesWon;
        document.getElementById('shipsDisplay').textContent = this.shipsSunk;
        document.getElementById('scoreDisplay').textContent = this.totalScore;
        document.getElementById('healthDisplay').textContent = this.health;
    }

    async saveScore() {
        try {
            const response = await fetch('/api/adventure-score', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pirate_name: this.pirateName,
                    gold_collected: this.goldCollected,
                    battles_won: this.battlesWon,
                    ships_sunk: this.shipsSunk,
                    total_score: this.totalScore,
                    adventure_time: Math.floor(this.gameTime / 10)
                })
            });

            const result = await response.json();
            if (result.success) {
                alert('🎉 YER LEGENDARY ADVENTURE HAS BEEN RECORDED! 🎉');
                this.loadLeaderboard();
                this.loadStats();
            } else {
                alert('Failed to save score: ' + result.error);
            }
        } catch (error) {
            console.error('Error saving score:', error);
            alert('ARRR! Failed to save to the ship\\'s log!');
        }
    }

    async loadLeaderboard() {
        try {
            const response = await fetch('/api/pirate-leaderboard?limit=10');
            const pirates = await response.json();
            
            const leaderboardList = document.getElementById('leaderboardList');
            if (pirates.length === 0) {
                leaderboardList.innerHTML = '<p>NO LEGENDARY PIRATES YET... BE THE FIRST!</p>';
                return;
            }
            
            leaderboardList.innerHTML = pirates.map((pirate, index) => 
                `<div class="leaderboard-entry">
                    <span class="rank">${index + 1}.</span>
                    <span class="pirate-name">${pirate.pirate_name}</span>
                    <span class="pirate-score">${pirate.total_score} pts</span>
                    <span class="pirate-details">💰${pirate.gold_collected} ⚔️${pirate.battles_won} 🚢${pirate.ships_sunk}</span>
                </div>`
            ).join('');
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            document.getElementById('leaderboardList').innerHTML = '<p>Failed to load the hall of fame!</p>';
        }
    }

    async loadStats() {
        try {
            const response = await fetch('/api/pirate-stats');
            const stats = await response.json();
            
            document.getElementById('adventureStats').innerHTML = `
                <div class="stat-box">
                    <div class="stat-number">${stats.total_adventures || 0}</div>
                    <div class="stat-label">TOTAL ADVENTURES</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${stats.highest_score || 0}</div>
                    <div class="stat-label">HIGHEST SCORE</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${Math.round(stats.average_score || 0)}</div>
                    <div class="stat-label">AVERAGE SCORE</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${stats.total_gold_collected || 0}</div>
                    <div class="stat-label">TOTAL GOLD COLLECTED</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${stats.total_battles_won || 0}</div>
                    <div class="stat-label">TOTAL BATTLES WON</div>
                </div>
                <div class="stat-box">
                    <div class="stat-number">${stats.total_ships_sunk || 0}</div>
                    <div class="stat-label">TOTAL SHIPS SUNK</div>
                </div>
            `;
        } catch (error) {
            console.error('Error loading stats:', error);
            document.getElementById('adventureStats').innerHTML = '<p>Failed to load fleet statistics!</p>';
        }
    }

    resetGame() {
        document.getElementById('gameOverScreen').classList.add('hidden');
        document.getElementById('startScreen').classList.remove('hidden');
        document.getElementById('pirateName').value = this.pirateName;
    }
}

// Initialize the pirate adventure when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PirateAdventure();
});