let playerName = '';
let gameStats = { wins: 0, losses: 0, ties: 0 };
let gameActive = false;

const choices = ['rock', 'paper', 'scissors'];
const choiceEmojis = { rock: '🪨', paper: '📄', scissors: '✂️' };

// DOM elements
const playerNameInput = document.getElementById('playerName');
const startGameBtn = document.getElementById('startGame');
const gameArea = document.getElementById('gameArea');
const choiceButtons = document.querySelectorAll('.choice');
const winsSpan = document.getElementById('wins');
const lossesSpan = document.getElementById('losses');
const tiesSpan = document.getElementById('ties');
const playerChoiceSpan = document.getElementById('playerChoice');
const computerChoiceSpan = document.getElementById('computerChoice');
const resultText = document.getElementById('resultText');
const saveResultsBtn = document.getElementById('saveResults');
const highscoresList = document.getElementById('highscoresList');

// Handle choice clicks
choiceButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!gameActive) return;
        
        const playerChoice = button.dataset.choice;
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        
        playRound(playerChoice, computerChoice);
    });
});

// Play a round
function playRound(playerChoice, computerChoice) {
    playerChoiceSpan.textContent = choiceEmojis[playerChoice];
    computerChoiceSpan.textContent = choiceEmojis[computerChoice];
    
    const result = getResult(playerChoice, computerChoice);
    
    // Update stats
    if (result === 'win') {
        gameStats.wins++;
        resultText.textContent = 'You Win! 🎉';
        resultText.className = 'result-text win';
    } else if (result === 'lose') {
        gameStats.losses++;
        resultText.textContent = 'You Lose! 😢';
        resultText.className = 'result-text lose';
    } else {
        gameStats.ties++;
        resultText.textContent = "It's a Tie! 🤝";
        resultText.className = 'result-text tie';
    }
    
    updateScoreDisplay();
}

// Determine winner
function getResult(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) return 'tie';
    
    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };
    
    return winConditions[playerChoice] === computerChoice ? 'win' : 'lose';
}

// Update score display
function updateScoreDisplay() {
    winsSpan.textContent = gameStats.wins;
    lossesSpan.textContent = gameStats.losses;
    tiesSpan.textContent = gameStats.ties;
}

// Save results
saveResultsBtn.addEventListener('click', async () => {
    if (!gameActive || !playerName) {
        alert('Please start a game first!');
        return;
    }
    
    if (gameStats.wins + gameStats.losses + gameStats.ties === 0) {
        alert('Play at least one round before saving!');
        return;
    }
    
    try {
        const response = await fetch('api/result', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                player_name: playerName,
                wins: gameStats.wins,
                losses: gameStats.losses,
                ties: gameStats.ties
            })
        });
        
        if (response.ok) {
            alert('Results saved!');
            loadHighscores();
        }
    } catch (error) {
        console.error('Error saving results:', error);
        alert('Failed to save results');
    }
});

// Load highscores
async function loadHighscores() {
    try {
        const response = await fetch('api/highscores');
        const scores = await response.json();
        
        if (scores.length === 0) {
            highscoresList.innerHTML = '<p>No scores yet! Be the first to play!</p>';
            return;
        }
        
        highscoresList.innerHTML = scores.map((score, index) => `
            <div class="highscore-item">
                <div class="highscore-rank">#${index + 1}</div>
                <div class="highscore-name">${score.player_name}</div>
                <div class="highscore-stats">
                    Score: ${score.score} | 
                    W:${score.wins} L:${score.losses} T:${score.ties}
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading highscores:', error);
        highscoresList.innerHTML = '<p>Error loading highscores</p>';
    }
}

// Start game button handler
startGameBtn.addEventListener('click', () => {
    playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('Please enter your name!');
        return;
    }
    
    gameActive = true;
    gameStats = { wins: 0, losses: 0, ties: 0 };
    updateScoreDisplay();
    
    gameArea.style.display = 'block';
    startGameBtn.textContent = 'Restart Game';
});

// Load highscores on page load
loadHighscores();