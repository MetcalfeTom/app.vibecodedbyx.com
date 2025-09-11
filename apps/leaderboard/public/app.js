// Global Leaderboard App
let currentTab = 'global';

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadAllData();
    setupTabs();
});

// Tab switching
function setupTabs() {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    
    currentTab = tabName;
}

// Load stats
async function loadStats() {
    try {
        const res = await fetch('api/stats');
        const stats = await res.json();
        
        document.getElementById('total-players').textContent = stats.total_players || 0;
        document.getElementById('total-scores').textContent = stats.total_scores || 0;
        document.getElementById('total-games').textContent = stats.total_games || 0;
    } catch (error) {
        console.error('Failed to load stats:', error);
    }
}

// Load all data
async function loadAllData() {
    loadGlobalScores();
    loadGameScores();
    loadRecentScores();
}

// Load global top scores
async function loadGlobalScores() {
    try {
        const res = await fetch('api/global-top');
        const scores = await res.json();
        
        const container = document.getElementById('global-scores');
        if (scores.length === 0) {
            container.innerHTML = '<div class="loading">No scores yet!</div>';
            return;
        }
        
        container.innerHTML = scores.map((score, index) => {
            const rankClass = index === 0 ? 'gold' : index === 1 ? 'silver' : index === 2 ? 'bronze' : '';
            return `
                <div class="score-row">
                    <span class="rank ${rankClass}">#${index + 1}</span>
                    <span class="player-name">${escapeHtml(score.player_name)}</span>
                    <span class="game-badge">${formatGameName(score.game)}</span>
                    <span class="score">${score.score.toLocaleString()}</span>
                    <span class="time-ago">${timeAgo(score.created_at)}</span>
                </div>
            `;
        }).join('');
    } catch (error) {
        console.error('Failed to load global scores:', error);
        document.getElementById('global-scores').innerHTML = '<div class="loading">Failed to load scores</div>';
    }
}

// Load scores by game
async function loadGameScores() {
    try {
        const res = await fetch('api/by-game');
        const games = await res.json();
        
        const container = document.getElementById('game-scores');
        if (Object.keys(games).length === 0) {
            container.innerHTML = '<div class="loading">No scores yet!</div>';
            return;
        }
        
        container.innerHTML = Object.entries(games).map(([game, scores]) => `
            <div class="game-section">
                <div class="game-title">${formatGameName(game)}</div>
                ${scores.map((score, index) => `
                    <div class="mini-score">
                        <span>${index + 1}. ${escapeHtml(score.player_name)}</span>
                        <strong>${score.score.toLocaleString()}</strong>
                    </div>
                `).join('')}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load game scores:', error);
        document.getElementById('game-scores').innerHTML = '<div class="loading">Failed to load scores</div>';
    }
}

// Load recent scores
async function loadRecentScores() {
    try {
        const res = await fetch('api/recent');
        const scores = await res.json();
        
        const container = document.getElementById('recent-scores');
        if (scores.length === 0) {
            container.innerHTML = '<div class="loading">No recent scores!</div>';
            return;
        }
        
        container.innerHTML = scores.map((score, index) => `
            <div class="score-row">
                <span class="rank">${index + 1}</span>
                <span class="player-name">${escapeHtml(score.player_name)}</span>
                <span class="game-badge">${formatGameName(score.game)}</span>
                <span class="score">${score.score.toLocaleString()}</span>
                <span class="time-ago">${timeAgo(score.created_at)}</span>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load recent scores:', error);
        document.getElementById('recent-scores').innerHTML = '<div class="loading">Failed to load scores</div>';
    }
}

// Helper functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatGameName(game) {
    return game.charAt(0).toUpperCase() + game.slice(1).replace(/-/g, ' ');
}

function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
}

// Auto-refresh every 30 seconds
setInterval(() => {
    loadStats();
    loadAllData();
}, 30000);