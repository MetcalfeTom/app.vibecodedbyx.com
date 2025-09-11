class AdvancedPoemGenerator {
    constructor() {
        this.currentPoem = null;
        this.poemHistory = JSON.parse(localStorage.getItem('poemHistory')) || [];
        this.settings = JSON.parse(localStorage.getItem('poemSettings')) || this.getDefaultSettings();
        this.syllableCounter = new SyllableCounter();
        this.rhymeEngine = new RhymeEngine();
        this.initializeEventListeners();
        this.loadSettings();
        this.updateUI();
    }

    getDefaultSettings() {
        return {
            autoSave: true,
            animations: true,
            soundEffects: false,
            darkMode: false,
            pirateAccent: 3
        };
    }

    initializeEventListeners() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generatePoem());
        document.getElementById('regenerateBtn').addEventListener('click', () => this.regenerateLastVerse());
        document.getElementById('clearBtn').addEventListener('click', () => this.clearPoem());
        document.getElementById('saveBtn').addEventListener('click', () => this.savePoem());
        document.getElementById('shareBtn').addEventListener('click', () => this.sharePoem());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportPoem());
        document.getElementById('rateBtn').addEventListener('click', () => this.ratePoem());
        document.getElementById('analyzeBtn').addEventListener('click', () => this.analyzePoem());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());
        document.getElementById('exportHistoryBtn').addEventListener('click', () => this.exportHistory());
        document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());

        document.getElementById('complexity').addEventListener('input', (e) => {
            const labels = ['SIMPLE', 'EASY', 'MODERATE', 'ADVANCED', 'LEGENDARY'];
            document.getElementById('complexityLabel').textContent = labels[e.target.value - 1];
        });

        document.getElementById('length').addEventListener('input', (e) => {
            const labels = ['TINY', 'SHORT', 'MEDIUM', 'LONG', 'EPIC', 'SAGA', 'LEGENDARY', 'MYTHICAL', 'ETERNAL', 'INFINITE'];
            document.getElementById('lengthLabel').textContent = labels[e.target.value - 1];
        });

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        document.getElementById('searchHistory').addEventListener('input', (e) => this.searchHistory(e.target.value));
        
        Object.keys(this.settings).forEach(setting => {
            const element = document.getElementById(setting);
            if (element) {
                element.addEventListener('change', () => this.updateSettings());
            }
        });
    }

    generatePoem() {
        const config = this.getGenerationConfig();
        const generator = new PoemStructureGenerator();
        
        this.currentPoem = generator.generate(config);
        this.displayPoem(this.currentPoem);
        this.updateStats(this.currentPoem);
        
        if (this.settings.autoSave) {
            this.saveToHistory(this.currentPoem);
        }
        
        if (this.settings.animations) {
            this.animatePoem();
        }
    }

    getGenerationConfig() {
        return {
            type: document.getElementById('poemType').value,
            structure: document.getElementById('poemStructure').value,
            rhymeScheme: document.getElementById('rhymeScheme').value,
            complexity: parseInt(document.getElementById('complexity').value),
            length: parseInt(document.getElementById('length').value),
            mood: document.getElementById('mood').value,
            pirateAccent: this.settings.pirateAccent
        };
    }

    displayPoem(poem) {
        const output = document.getElementById('poemOutput');
        output.innerHTML = this.formatPoem(poem);
        document.getElementById('poemTitle').textContent = poem.title;
    }

    formatPoem(poem) {
        let html = '<div class="poem-verse">';
        poem.lines.forEach((line, index) => {
            html += `<p class="poem-line" data-line="${index}">${line}</p>`;
        });
        html += '</div>';
        
        if (poem.author) {
            html += `<div class="poem-signature"><p>~ ${poem.author} ~</p></div>`;
        }
        
        return html;
    }

    updateStats(poem) {
        const wordCount = poem.lines.join(' ').split(' ').length;
        const syllableCount = this.syllableCounter.countTotal(poem.lines.join(' '));
        const readingTime = Math.ceil(wordCount / 200 * 60);
        const difficulty = this.calculateDifficulty(poem);

        document.getElementById('wordCount').textContent = `WORDS: ${wordCount}`;
        document.getElementById('syllableCount').textContent = `SYLLABLES: ${syllableCount}`;
        document.getElementById('readingTime').textContent = `READING TIME: ${readingTime}s`;
        document.getElementById('difficulty').textContent = `DIFFICULTY: ${difficulty}`;
    }

    calculateDifficulty(poem) {
        const complexWords = poem.lines.join(' ').split(' ').filter(word => word.length > 6).length;
        const totalWords = poem.lines.join(' ').split(' ').length;
        const complexity = (complexWords / totalWords) * 100;
        
        if (complexity < 20) return 'EASY';
        if (complexity < 40) return 'MODERATE';
        if (complexity < 60) return 'CHALLENGING';
        if (complexity < 80) return 'DIFFICULT';
        return 'LEGENDARY';
    }

    savePoem() {
        if (!this.currentPoem) return;
        
        const rating = prompt('RATE THIS POEM (1-5 STARS):');
        if (rating) {
            this.currentPoem.rating = parseInt(rating);
        }
        
        this.saveToHistory(this.currentPoem);
        this.showNotification('POEM SAVED TO YER TREASURE CHEST!');
    }

    saveToHistory(poem) {
        const historyItem = {
            ...poem,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        this.poemHistory.unshift(historyItem);
        if (this.poemHistory.length > 100) {
            this.poemHistory = this.poemHistory.slice(0, 100);
        }
        
        localStorage.setItem('poemHistory', JSON.stringify(this.poemHistory));
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        const historyList = document.getElementById('historyList');
        if (this.poemHistory.length === 0) {
            historyList.innerHTML = '<p>NO POEMS IN YER HISTORY YET, MATEY!</p>';
            return;
        }

        let html = '';
        this.poemHistory.forEach(poem => {
            const date = new Date(poem.timestamp).toLocaleDateString();
            const stars = '⭐'.repeat(poem.rating || 0);
            html += `
                <div class="history-item" data-id="${poem.id}">
                    <div class="history-header">
                        <h4>${poem.title}</h4>
                        <span class="history-date">${date}</span>
                        <span class="history-rating">${stars}</span>
                    </div>
                    <div class="history-preview">${poem.lines[0]}</div>
                    <div class="history-actions">
                        <button onclick="poemGen.loadPoem(${poem.id})" class="btn-small">LOAD</button>
                        <button onclick="poemGen.deletePoem(${poem.id})" class="btn-small">DELETE</button>
                    </div>
                </div>
            `;
        });
        
        historyList.innerHTML = html;
    }

    loadPoem(id) {
        const poem = this.poemHistory.find(p => p.id === id);
        if (poem) {
            this.currentPoem = poem;
            this.displayPoem(poem);
            this.updateStats(poem);
            this.switchTab('generator');
        }
    }

    deletePoem(id) {
        this.poemHistory = this.poemHistory.filter(p => p.id !== id);
        localStorage.setItem('poemHistory', JSON.stringify(this.poemHistory));
        this.updateHistoryDisplay();
    }

    analyzePoem() {
        const text = document.getElementById('analyzeInput').value;
        if (!text.trim()) return;

        const analysis = this.performAnalysis(text);
        this.displayAnalysis(analysis);
    }

    performAnalysis(text) {
        const lines = text.split('\n').filter(line => line.trim());
        const words = text.split(/\s+/);
        const syllables = this.syllableCounter.countTotal(text);
        
        return {
            lineCount: lines.length,
            wordCount: words.length,
            syllableCount: syllables,
            averageWordsPerLine: (words.length / lines.length).toFixed(1),
            rhymeScheme: this.detectRhymeScheme(lines),
            mood: this.detectMood(text),
            complexity: this.calculateComplexity(words),
            readingTime: Math.ceil(words.length / 200 * 60)
        };
    }

    displayAnalysis(analysis) {
        const results = document.getElementById('analysisResults');
        results.innerHTML = `
            <div class="analysis-grid">
                <div class="analysis-stat">
                    <h4>STRUCTURE</h4>
                    <p>Lines: ${analysis.lineCount}</p>
                    <p>Words: ${analysis.wordCount}</p>
                    <p>Syllables: ${analysis.syllableCount}</p>
                    <p>Avg Words/Line: ${analysis.averageWordsPerLine}</p>
                </div>
                <div class="analysis-stat">
                    <h4>STYLE</h4>
                    <p>Rhyme Scheme: ${analysis.rhymeScheme}</p>
                    <p>Mood: ${analysis.mood}</p>
                    <p>Complexity: ${analysis.complexity}</p>
                    <p>Reading Time: ${analysis.readingTime}s</p>
                </div>
            </div>
        `;
    }

    exportPoem() {
        if (!this.currentPoem) return;
        
        const format = prompt('EXPORT FORMAT:\n1. PDF\n2. TEXT\n3. IMAGE\nENTER YER CHOICE (1-3):');
        
        switch(format) {
            case '1':
                this.exportToPDF();
                break;
            case '2':
                this.exportToText();
                break;
            case '3':
                this.exportToImage();
                break;
        }
    }

    exportToPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text(this.currentPoem.title, 20, 30);
        
        let y = 50;
        this.currentPoem.lines.forEach(line => {
            doc.setFontSize(12);
            doc.text(line, 20, y);
            y += 10;
        });
        
        doc.save(`${this.currentPoem.title.replace(/\s+/g, '_')}.pdf`);
    }

    exportToText() {
        const content = `${this.currentPoem.title}\n\n${this.currentPoem.lines.join('\n')}\n\n~ Generated by Advanced Pirate Poem Generator ~`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentPoem.title.replace(/\s+/g, '_')}.txt`;
        a.click();
    }

    exportToImage() {
        const poemElement = document.getElementById('poemOutput');
        html2canvas(poemElement).then(canvas => {
            const link = document.createElement('a');
            link.download = `${this.currentPoem.title.replace(/\s+/g, '_')}.png`;
            link.href = canvas.toDataURL();
            link.click();
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    animatePoem() {
        if (!this.settings.animations) return;
        
        const lines = document.querySelectorAll('.poem-line');
        lines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '0';
                line.style.transform = 'translateY(20px)';
                line.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateY(0)';
                }, 100);
            }, index * 200);
        });
    }

    updateSettings() {
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                this.settings[key] = element.type === 'checkbox' ? element.checked : element.value;
            }
        });
        
        localStorage.setItem('poemSettings', JSON.stringify(this.settings));
        this.applySettings();
    }

    loadSettings() {
        Object.keys(this.settings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.settings[key];
                } else {
                    element.value = this.settings[key];
                }
            }
        });
        
        this.applySettings();
    }

    applySettings() {
        if (this.settings.darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    clearHistory() {
        if (confirm('ARE YE SURE YE WANT TO CLEAR ALL YER POEM HISTORY?')) {
            this.poemHistory = [];
            localStorage.removeItem('poemHistory');
            this.updateHistoryDisplay();
        }
    }

    clearPoem() {
        document.getElementById('poemOutput').innerHTML = '<p>CONFIGURE YER SETTINGS ABOVE AND CLICK GENERATE TO CRAFT YER FIRST LEGENDARY POEM, MATEY!</p>';
        document.getElementById('poemTitle').textContent = 'YER LEGENDARY POEM';
        this.currentPoem = null;
        this.updateStats({lines: []});
    }

    detectRhymeScheme(lines) {
        return 'UNKNOWN';
    }

    detectMood(text) {
        const moodWords = {
            fierce: ['battle', 'fight', 'war', 'fierce', 'bold', 'strong'],
            melancholy: ['sad', 'lonely', 'lost', 'dark', 'sorrow'],
            triumphant: ['victory', 'win', 'triumph', 'glory', 'success'],
            mysterious: ['mystery', 'unknown', 'secret', 'hidden', 'shadow'],
            humorous: ['laugh', 'funny', 'jest', 'merry', 'joke']
        };
        
        const words = text.toLowerCase().split(/\s+/);
        let maxScore = 0;
        let detectedMood = 'NEUTRAL';
        
        Object.entries(moodWords).forEach(([mood, keywords]) => {
            const score = keywords.filter(keyword => words.includes(keyword)).length;
            if (score > maxScore) {
                maxScore = score;
                detectedMood = mood.toUpperCase();
            }
        });
        
        return detectedMood;
    }

    calculateComplexity(words) {
        const complexWords = words.filter(word => word.length > 6).length;
        const ratio = complexWords / words.length;
        
        if (ratio < 0.2) return 'SIMPLE';
        if (ratio < 0.4) return 'MODERATE';
        if (ratio < 0.6) return 'COMPLEX';
        return 'VERY COMPLEX';
    }
}

class PoemStructureGenerator {
    constructor() {
        this.templates = this.initializeTemplates();
    }

    initializeTemplates() {
        return {
            adventure: {
                starters: [
                    "ACROSS THE ROLLING WAVES WE SAIL",
                    "BENEATH THE STARLIT PIRATE FLAG",
                    "THROUGH MISTS OF LEGEND AND OF TALE",
                    "WITH CUTLASS GLEAMING IN THE GALE",
                    "BEYOND THE EDGE OF CHARTED SEAS",
                    "WHERE ANCIENT MAPS DO LEAD THE WAY",
                    "THROUGH WATERS WILD AND UNEXPLORED",
                    "BENEATH THE CARIBBEAN SUN"
                ],
                middles: [
                    "WHERE KRAKEN DWELL AND SIRENS SING",
                    "THROUGH STORMS THAT RAGE AND TEMPESTS ROAR",
                    "PAST ISLANDS WILD AND UNEXPLORED",
                    "WHERE CANNONS BOOM AND SABERS RING",
                    "THROUGH WATERS DARK AND MYSTERIES DEEP",
                    "WHERE LEGENDS COME TO LIFE EACH DAY",
                    "AND ANCIENT SPIRITS GUARD THEIR GOLD",
                    "WHERE BRAVE SOULS DARE TO VENTURE FORTH"
                ],
                endings: [
                    "WE FIND OUR FORTUNE OR OUR DOOM!",
                    "ADVENTURE CALLS FROM EVERY SHORE!",
                    "THE PIRATE'S LIFE FOREVER MORE!",
                    "OUR LEGEND ECHOES THROUGH THE GLOOM!",
                    "WHERE BRAVE HEARTS SAIL AND SPIRITS SOAR!",
                    "AND TALES ARE BORN THAT NEVER DIE!",
                    "THE TREASURE WAITS FOR THOSE WHO DARE!",
                    "ARRR, THE ADVENTURE NEVER ENDS!"
                ]
            },
            treasure: {
                starters: [
                    "BURIED DEEP BENEATH THE SAND",
                    "MARKED BY X UPON THE MAP",
                    "HIDDEN IN A PIRATE'S HAND",
                    "LOCKED AWAY IN DAVY'S TRAP",
                    "GLEAMING GOLD AND SILVER BRIGHT",
                    "IN CHESTS OF OAK AND IRON BOUND",
                    "WHERE RUBIES RED LIKE BLOOD DO SHINE",
                    "BENEATH THE CAPTAIN'S QUARTERS FLOOR"
                ],
                middles: [
                    "LIES A CHEST OF PRECIOUS STONES",
                    "DIAMONDS, RUBIES, EMERALDS GREEN",
                    "DOUBLOONS AND ANCIENT BONES",
                    "THE GREATEST TREASURE EVER SEEN",
                    "PEARLS FROM DEPTHS UNKNOWN TO MAN",
                    "AND COINS FROM REALMS ACROSS THE SEA",
                    "JEWELS THAT SPARKLE IN THE NIGHT",
                    "RICHES BEYOND A KING'S DESIRE"
                ],
                endings: [
                    "AWAITING THOSE WHO DARE TO SEEK!",
                    "FOR PIRATES BOLD AND BRAVE AND TRUE!",
                    "THE RICHES OF THE CARIBBEAN!",
                    "WORTH MORE THAN KINGDOMS OLD AND GRAND!",
                    "ARRR, THE TREASURE CALLS TO YOU!",
                    "BUT CURSED BE THOSE WHO STEAL IN GREED!",
                    "THE GREATEST PRIZE FOR HEARTS SO BRAVE!",
                    "A FORTUNE FIT FOR PIRATE KINGS!"
                ]
            },
            mystery: {
                starters: [
                    "IN SHADOWS DEEP WHERE SECRETS HIDE",
                    "BENEATH THE MOON'S MYSTERIOUS GLOW",
                    "WHERE ANCIENT CURSES STILL ABIDE",
                    "AND GHOSTLY WHISPERS SOFTLY FLOW",
                    "IN CAVERNS DARK WHERE SPIRITS DWELL",
                    "WHERE TIME ITSELF SEEMS TO STAND STILL",
                    "BEYOND THE VEIL OF MORTAL SIGHT",
                    "IN REALMS WHERE MAGIC RULES THE NIGHT"
                ],
                middles: [
                    "THE MYSTERIES OF AGES PAST",
                    "REVEAL THEIR SECRETS TO THE BRAVE",
                    "WHERE PHANTOM SHIPS SAIL UNSEEN",
                    "AND LOST SOULS WANDER THROUGH THE MIST",
                    "THE ANCIENT GODS OF SEA AND STORM",
                    "GUARD TREASURES BEYOND MORTAL DREAMS",
                    "WHERE LEGENDS WHISPER THROUGH THE WIND",
                    "AND FATE ITSELF HANGS IN THE BALANCE"
                ],
                endings: [
                    "ONLY THE WORTHY SHALL DISCOVER!",
                    "THE TRUTH THAT LIES BEYOND THE VEIL!",
                    "MYSTERIES THAT SPAN THE SEVEN SEAS!",
                    "SECRETS OLDER THAN TIME ITSELF!",
                    "ARRR, THE UNKNOWN CALLS TO THEE!",
                    "WHERE ANSWERS WAIT FOR SEEKING MINDS!",
                    "THE GREATEST MYSTERY OF THEM ALL!",
                    "TRUTH STRANGER THAN ANY TALE!"
                ]
            }
        };
    }

    generate(config) {
        const template = this.templates[config.type] || this.templates.adventure;
        const structure = this.getStructure(config.structure, config.length);
        
        const poem = {
            title: this.generateTitle(config),
            lines: this.generateLines(template, structure, config),
            type: config.type,
            structure: config.structure,
            timestamp: new Date().toISOString(),
            author: this.generateAuthor()
        };
        
        return poem;
    }

    generateTitle(config) {
        const titles = {
            adventure: ["THE QUEST FOR GLORY", "VOYAGE OF THE BRAVE", "LEGEND OF THE SEAS"],
            treasure: ["THE LOST TREASURE", "GOLD BEYOND MEASURE", "RICHES OF THE DEEP"],
            mystery: ["SECRETS OF THE DEEP", "THE PHANTOM'S CURSE", "WHISPERS IN THE MIST"],
            battle: ["CLASH OF THE TITANS", "BATTLE FOR THE SEAS", "WARRIORS OF THE WAVES"],
            love: ["HEART OF THE OCEAN", "LOVE ON THE HIGH SEAS", "THE CAPTAIN'S LOVE"],
            storm: ["FURY OF THE STORM", "TEMPEST'S RAGE", "WHEN THE SEAS ROAR"],
            crew: ["BROTHERHOOD OF PIRATES", "THE LOYAL CREW", "BONDS OF THE SEA"],
            island: ["ISLE OF MYSTERIES", "PARADISE FOUND", "THE HIDDEN ISLAND"]
        };
        
        const typesTitles = titles[config.type] || titles.adventure;
        return typesTitles[Math.floor(Math.random() * typesTitles.length)];
    }

    generateAuthor() {
        const authors = [
            "CAPTAIN BLACKBEARD THE VERSE-MAKER",
            "THE LEGENDARY POET OF THE SEAS",
            "SCRIBE OF THE SEVEN SEAS",
            "THE RHYMING BUCCANEER",
            "POET LAUREATE OF THE CARIBBEAN",
            "THE VERSED PRIVATEER",
            "BARD OF THE BRINY DEEP"
        ];
        
        return authors[Math.floor(Math.random() * authors.length)];
    }

    getStructure(type, length) {
        const structures = {
            triplet: { lines: 3, pattern: ['start', 'middle', 'end'] },
            quatrain: { lines: 4, pattern: ['start', 'middle', 'middle', 'end'] },
            sonnet: { lines: 14, pattern: Array(14).fill().map((_, i) => i < 8 ? (i % 2 ? 'middle' : 'start') : 'end') },
            ballad: { lines: 8, pattern: ['start', 'middle', 'start', 'middle', 'start', 'middle', 'end', 'end'] },
            limerick: { lines: 5, pattern: ['start', 'middle', 'middle', 'middle', 'end'] },
            haiku: { lines: 3, pattern: ['start', 'middle', 'end'] }
        };
        
        let structure = structures[type] || structures.triplet;
        
        if (length > 3) {
            const multiplier = Math.min(length, 5);
            structure = {
                lines: structure.lines * multiplier,
                pattern: Array(multiplier).fill(structure.pattern).flat()
            };
        }
        
        return structure;
    }

    generateLines(template, structure, config) {
        const lines = [];
        
        structure.pattern.forEach(part => {
            let source;
            switch(part) {
                case 'start':
                    source = template.starters;
                    break;
                case 'middle':
                    source = template.middles;
                    break;
                case 'end':
                    source = template.endings;
                    break;
            }
            
            let line = source[Math.floor(Math.random() * source.length)];
            
            if (config.complexity > 3) {
                line = this.enhanceComplexity(line);
            }
            
            if (config.pirateAccent > 3) {
                line = this.enhancePirateAccent(line);
            }
            
            lines.push(line);
        });
        
        return lines;
    }

    enhanceComplexity(line) {
        const complexWords = {
            'SAIL': 'NAVIGATE',
            'FIGHT': 'ENGAGE IN COMBAT',
            'GOLD': 'PRECIOUS AURUM',
            'SHIP': 'MAJESTIC VESSEL',
            'SEA': 'BOUNDLESS OCEAN',
            'BRAVE': 'VALOROUS',
            'STRONG': 'FORMIDABLE'
        };
        
        Object.entries(complexWords).forEach(([simple, complex]) => {
            line = line.replace(new RegExp(simple, 'g'), complex);
        });
        
        return line;
    }

    enhancePirateAccent(line) {
        const pirateReplacements = {
            'THE': "TH'",
            'OVER': "O'ER",
            'BEFORE': "AFORE",
            'AND': "AN'",
            'TO': "T'",
            'THEM': "'EM",
            'YOU': "YE",
            'YOUR': "YER"
        };
        
        Object.entries(pirateReplacements).forEach(([normal, pirate]) => {
            line = line.replace(new RegExp(`\\b${normal}\\b`, 'g'), pirate);
        });
        
        return line;
    }
}

class SyllableCounter {
    countSyllables(word) {
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
        word = word.replace(/^y/, '');
        const matches = word.match(/[aeiouy]{1,2}/g);
        return matches ? matches.length : 1;
    }
    
    countTotal(text) {
        return text.split(/\s+/).reduce((total, word) => {
            return total + this.countSyllables(word.replace(/[^\w]/g, ''));
        }, 0);
    }
}

class RhymeEngine {
    getLastSyllable(word) {
        return word.slice(-2).toLowerCase();
    }
    
    findRhymes(word, wordList) {
        const targetSyllable = this.getLastSyllable(word);
        return wordList.filter(w => this.getLastSyllable(w) === targetSyllable);
    }
}

let poemGen;

document.addEventListener('DOMContentLoaded', function() {
    poemGen = new AdvancedPoemGenerator();
});

window.poemGen = poemGen;