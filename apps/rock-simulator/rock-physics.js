class RockSimulator {
    constructor() {
        try {
            this.canvas = document.getElementById('gameCanvas');
            if (!this.canvas) throw new Error('Canvas not found!');
            
            this.ctx = this.canvas.getContext('2d');
            if (!this.ctx) throw new Error('Canvas context not available!');
            
            this.rocks = [];
            this.gravity = 0.5;
            this.wind = 0;
            this.rockCount = 0;
            this.longestRoll = 0;
            this.biggestCrash = 0;
            this.playerScore = 0;
            this.rockSize = 20;
            this.achievements = new Set();
            this.productivity = {
                rocksPerMinute: 0,
                sessionStart: Date.now(),
                totalActions: 0
            };
            
            this.loadGameState();
            this.animate();
            this.updateStats();
            this.startProductivityTracking();
        } catch (error) {
            console.error('ARRR! SIMULATOR CRASHED:', error);
            this.showError('SIMULATOR FAILED TO START! CHECK CONSOLE!');
        }
    }
    
    dropRock() {
        try {
            const rock = {
                x: Math.random() * (this.canvas.width - 40) + 20,
                y: 0,
                vx: (Math.random() - 0.5) * 4,
                vy: 0,
                size: this.rockSize + Math.random() * 10,
                color: this.getRandomRockColor(),
                bounces: 0,
                trail: [],
                rollDistance: 0,
                startX: 0
            };
            rock.startX = rock.x;
            this.rocks.push(rock);
            this.rockCount++;
            this.productivity.totalActions++;
            this.updateStats();
            this.saveGameState();
            
            if (this.rocks.length > 20) {
                this.rocks.shift();
            }
        } catch (error) {
            console.error('ARRR! ROCK DROP FAILED:', error);
            this.showError('ROCK DROP FAILED! TRY AGAIN!');
        }
    }
    
    getRandomRockColor() {
        const colors = ['#8B4513', '#A0522D', '#696969', '#778899', '#2F4F4F', '#8B7D6B'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    addGravity() {
        this.gravity = Math.min(this.gravity + 0.2, 2.0);
    }
    
    addWind() {
        this.wind = (Math.random() - 0.5) * 3;
        setTimeout(() => {
            this.wind *= 0.5;
        }, 3000);
    }
    
    biggerRock() {
        this.rockSize = Math.min(this.rockSize + 5, 50);
    }
    
    resetSimulation() {
        this.rocks = [];
        this.gravity = 0.5;
        this.wind = 0;
        this.rockSize = 20;
    }
    
    updatePhysics(rock) {
        rock.trail.push({x: rock.x, y: rock.y});
        if (rock.trail.length > 15) {
            rock.trail.shift();
        }
        
        rock.vy += this.gravity;
        rock.vx += this.wind * 0.1;
        rock.vx *= 0.98; // Air resistance
        
        rock.x += rock.vx;
        rock.y += rock.vy;
        
        // Ground collision
        if (rock.y + rock.size > this.canvas.height) {
            rock.y = this.canvas.height - rock.size;
            rock.vy *= -0.6; // Bounce
            rock.vx *= 0.8; // Friction
            rock.bounces++;
            
            const crashForce = Math.abs(rock.vy) * rock.size;
            if (crashForce > this.biggestCrash) {
                this.biggestCrash = Math.floor(crashForce);
                this.playerScore += Math.floor(crashForce / 10);
            }
        }
        
        // Wall collisions
        if (rock.x <= 0 || rock.x + rock.size >= this.canvas.width) {
            rock.vx *= -0.7;
            rock.x = Math.max(0, Math.min(this.canvas.width - rock.size, rock.x));
            rock.bounces++;
        }
        
        // Calculate roll distance
        const rollDist = Math.abs(rock.x - rock.startX);
        if (rollDist > rock.rollDistance) {
            rock.rollDistance = rollDist;
            if (rollDist > this.longestRoll) {
                this.longestRoll = Math.floor(rollDist);
                this.playerScore += Math.floor(rollDist / 50);
            }
        }
        
        // Remove rocks that are too slow and on ground
        if (Math.abs(rock.vx) < 0.1 && Math.abs(rock.vy) < 0.1 && 
            rock.y + rock.size >= this.canvas.height - 5) {
            return false;
        }
        
        return true;
    }
    
    drawRock(rock) {
        // Draw trail
        this.ctx.strokeStyle = rock.color + '60';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        for (let i = 0; i < rock.trail.length - 1; i++) {
            const alpha = i / rock.trail.length;
            this.ctx.globalAlpha = alpha * 0.5;
            this.ctx.moveTo(rock.trail[i].x + rock.size/2, rock.trail[i].y + rock.size/2);
            this.ctx.lineTo(rock.trail[i+1].x + rock.size/2, rock.trail[i+1].y + rock.size/2);
        }
        this.ctx.stroke();
        this.ctx.globalAlpha = 1;
        
        // Draw rock
        this.ctx.fillStyle = rock.color;
        this.ctx.beginPath();
        this.ctx.arc(rock.x + rock.size/2, rock.y + rock.size/2, rock.size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add some texture
        this.ctx.fillStyle = '#000000';
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(rock.x + rock.size/3, rock.y + rock.size/3, rock.size/6, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
        
        // Highlight
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.globalAlpha = 0.4;
        this.ctx.beginPath();
        this.ctx.arc(rock.x + rock.size/4, rock.y + rock.size/4, rock.size/8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw wind indicator
        if (Math.abs(this.wind) > 0.1) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            this.ctx.font = '16px Arial';
            this.ctx.fillText(`WIND: ${this.wind.toFixed(1)}`, 10, 30);
        }
        
        // Update and draw rocks
        this.rocks = this.rocks.filter(rock => {
            const keepRock = this.updatePhysics(rock);
            if (keepRock) this.drawRock(rock);
            return keepRock;
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    updateStats() {
        try {
            document.getElementById('rockCount').textContent = this.rockCount;
            document.getElementById('longestRoll').textContent = this.longestRoll;
            document.getElementById('biggestCrash').textContent = this.biggestCrash;
            document.getElementById('playerScore').textContent = this.playerScore;
            
            this.checkAchievements();
        } catch (error) {
            console.error('ARRR! STATS UPDATE FAILED:', error);
        }
    }
    
    saveGameState() {
        try {
            const gameState = {
                rockCount: this.rockCount,
                longestRoll: this.longestRoll,
                biggestCrash: this.biggestCrash,
                playerScore: this.playerScore,
                achievements: Array.from(this.achievements),
                productivity: this.productivity
            };
            localStorage.setItem('rockSimGameState', JSON.stringify(gameState));
        } catch (error) {
            console.error('ARRR! SAVE FAILED:', error);
        }
    }
    
    loadGameState() {
        try {
            const saved = localStorage.getItem('rockSimGameState');
            if (saved) {
                const gameState = JSON.parse(saved);
                this.rockCount = gameState.rockCount || 0;
                this.longestRoll = gameState.longestRoll || 0;
                this.biggestCrash = gameState.biggestCrash || 0;
                this.playerScore = gameState.playerScore || 0;
                this.achievements = new Set(gameState.achievements || []);
                this.productivity = gameState.productivity || {
                    rocksPerMinute: 0,
                    sessionStart: Date.now(),
                    totalActions: 0
                };
            }
        } catch (error) {
            console.error('ARRR! LOAD FAILED:', error);
        }
    }
    
    checkAchievements() {
        const newAchievements = [];
        
        if (this.rockCount >= 10 && !this.achievements.has('ROCK_DROPPER')) {
            this.achievements.add('ROCK_DROPPER');
            newAchievements.push('🪨 ROCK DROPPER: DROPPED 10 ROCKS!');
        }
        
        if (this.rockCount >= 100 && !this.achievements.has('BOULDER_MASTER')) {
            this.achievements.add('BOULDER_MASTER');
            newAchievements.push('⛰️ BOULDER MASTER: DROPPED 100 ROCKS!');
        }
        
        if (this.longestRoll >= 300 && !this.achievements.has('LONG_ROLLER')) {
            this.achievements.add('LONG_ROLLER');
            newAchievements.push('🏃 LONG ROLLER: 300PX ROLL!');
        }
        
        if (this.biggestCrash >= 500 && !this.achievements.has('CRASH_KING')) {
            this.achievements.add('CRASH_KING');
            newAchievements.push('💥 CRASH KING: 500+ CRASH FORCE!');
        }
        
        if (this.playerScore >= 1000 && !this.achievements.has('HIGH_SCORER')) {
            this.achievements.add('HIGH_SCORER');
            newAchievements.push('🏆 HIGH SCORER: 1000+ POINTS!');
        }
        
        newAchievements.forEach(achievement => {
            this.showAchievement(achievement);
        });
        
        if (newAchievements.length > 0) {
            this.saveGameState();
        }
    }
    
    showAchievement(text) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px; background: gold; color: black;
            padding: 15px; border-radius: 10px; font-weight: bold; z-index: 1000;
            box-shadow: 0 0 20px gold; animation: slideIn 0.5s ease;
        `;
        notification.textContent = text;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: red; color: white; padding: 20px; border-radius: 10px;
            font-weight: bold; z-index: 1000; text-align: center;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
    }
    
    startProductivityTracking() {
        setInterval(() => {
            const minutes = (Date.now() - this.productivity.sessionStart) / 60000;
            this.productivity.rocksPerMinute = minutes > 0 ? this.rockCount / minutes : 0;
            this.updateProductivityLeaderboard();
        }, 5000);
    }
    
    updateProductivityLeaderboard() {
        try {
            const productivity = localStorage.getItem('rockSimProductivity') || '[]';
            const leaderboard = JSON.parse(productivity);
            
            const currentEntry = {
                name: 'YOU',
                rocksPerMinute: Math.round(this.productivity.rocksPerMinute * 10) / 10,
                totalActions: this.productivity.totalActions,
                timestamp: Date.now()
            };
            
            const existingIndex = leaderboard.findIndex(entry => entry.name === 'YOU');
            if (existingIndex >= 0) {
                leaderboard[existingIndex] = currentEntry;
            } else {
                leaderboard.push(currentEntry);
            }
            
            leaderboard.sort((a, b) => b.rocksPerMinute - a.rocksPerMinute);
            leaderboard.splice(5);
            
            localStorage.setItem('rockSimProductivity', JSON.stringify(leaderboard));
        } catch (error) {
            console.error('PRODUCTIVITY TRACKING ERROR:', error);
        }
    }
}

// Voting system
const votes = {
    explosive: 42,
    rainbow: 38,
    multiplier: 29,
    sounds: 67
};

function vote(feature) {
    votes[feature]++;
    document.getElementById(`vote-${feature}`).textContent = votes[feature];
    
    // Save to localStorage
    localStorage.setItem('rockSimVotes', JSON.stringify(votes));
}

// Load votes from localStorage
function loadVotes() {
    const saved = localStorage.getItem('rockSimVotes');
    if (saved) {
        const savedVotes = JSON.parse(saved);
        Object.assign(votes, savedVotes);
        Object.keys(votes).forEach(feature => {
            const element = document.getElementById(`vote-${feature}`);
            if (element) element.textContent = votes[feature];
        });
    }
}

// Global functions for buttons
function dropRock() {
    simulator.dropRock();
}

function addGravity() {
    simulator.addGravity();
}

function addWind() {
    simulator.addWind();
}

function resetSimulation() {
    simulator.resetSimulation();
}

function biggerRock() {
    simulator.biggerRock();
}

// Initialize
let simulator;
window.addEventListener('load', () => {
    simulator = new RockSimulator();
    loadVotes();
});