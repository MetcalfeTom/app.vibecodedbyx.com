// Solitaire Game - Windows 95 Style
class Solitaire {
    constructor(container) {
        this.container = container;
        this.deck = [];
        this.stock = [];
        this.waste = [];
        this.foundations = [[], [], [], []]; // Hearts, Diamonds, Clubs, Spades
        this.tableau = [[], [], [], [], [], [], []];
        this.selectedCard = null;
        this.selectedPile = null;
        this.score = 0;
        this.moves = 0;
        this.initGame();
    }

    initGame() {
        this.createDeck();
        this.shuffleDeck();
        this.dealCards();
        this.render();
    }

    createDeck() {
        const suits = ['♥', '♦', '♣', '♠'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const suitColors = {'♥': 'red', '♦': 'red', '♣': 'black', '♠': 'black'};

        this.deck = [];
        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({
                    suit: suit,
                    value: value,
                    color: suitColors[suit],
                    numValue: values.indexOf(value) + 1,
                    faceUp: false
                });
            }
        }
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCards() {
        // Deal to tableau
        for (let i = 0; i < 7; i++) {
            for (let j = i; j < 7; j++) {
                const card = this.deck.pop();
                if (i === j) card.faceUp = true;
                this.tableau[j].push(card);
            }
        }
        // Remaining cards to stock
        this.stock = [...this.deck];
        this.deck = [];
    }

    render() {
        this.container.innerHTML = `
            <div style="background: #008080; padding: 8px; font-family: 'MS Sans Serif', sans-serif; height: 100%; overflow: auto;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px; padding: 4px; background: #c0c0c0; border: 2px inset #808080;">
                    <div style="font-size: 11px;">
                        <span style="font-weight: bold;">Score:</span> <span id="sol-score">0</span> &nbsp;
                        <span style="font-weight: bold;">Moves:</span> <span id="sol-moves">0</span>
                    </div>
                    <button onclick="solitaire.newGame()" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 2px 8px; cursor: pointer; font-size: 11px;">New Game</button>
                </div>

                <!-- Top row: Stock, Waste, and Foundations -->
                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <div id="stock" onclick="solitaire.drawCard()" style="width: 70px; height: 96px; background: ${this.stock.length > 0 ? '#0000aa' : '#006060'}; border: 2px solid #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff;">
                        ${this.stock.length > 0 ? '🂠' : ''}
                    </div>
                    <div id="waste" onclick="solitaire.selectFromWaste()" style="width: 70px; height: 96px; background: #006060; border: 2px solid #fff; cursor: pointer; position: relative;">
                        ${this.renderWaste()}
                    </div>
                    <div style="flex: 1;"></div>
                    ${this.foundations.map((f, i) => `
                        <div id="foundation-${i}" onclick="solitaire.selectFoundation(${i})" style="width: 70px; height: 96px; background: #006060; border: 2px solid #fff; cursor: pointer; position: relative;">
                            ${this.renderFoundation(i)}
                        </div>
                    `).join('')}
                </div>

                <!-- Tableau (7 columns) -->
                <div style="display: flex; gap: 8px;">
                    ${this.tableau.map((pile, i) => `
                        <div id="tableau-${i}" onclick="solitaire.selectTableau(${i})" style="width: 70px; min-height: 96px; cursor: pointer; position: relative;">
                            ${this.renderTableau(i)}
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        this.updateScore();
    }

    renderCard(card, top = 0, selected = false) {
        if (!card.faceUp) {
            return `<div style="position: absolute; top: ${top}px; width: 70px; height: 96px; background: #0000aa; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; ${selected ? 'box-shadow: 0 0 0 3px yellow;' : ''}">🂠</div>`;
        }
        return `<div style="position: absolute; top: ${top}px; width: 70px; height: 96px; background: #fff; border: 2px solid #000; font-family: Arial; ${selected ? 'box-shadow: 0 0 0 3px yellow;' : ''}">
            <div style="color: ${card.color}; padding: 4px; font-size: 14px; font-weight: bold;">${card.value}</div>
            <div style="text-align: center; margin-top: 12px; font-size: 24px;">${card.suit}</div>
        </div>`;
    }

    renderWaste() {
        if (this.waste.length === 0) return '';
        const card = this.waste[this.waste.length - 1];
        const selected = this.selectedPile === 'waste';
        return this.renderCard(card, 0, selected);
    }

    renderFoundation(index) {
        if (this.foundations[index].length === 0) {
            const symbols = ['♥', '♦', '♣', '♠'];
            return `<div style="position: absolute; top: 0; width: 70px; height: 96px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #004040; opacity: 0.5;">${symbols[index]}</div>`;
        }
        const card = this.foundations[index][this.foundations[index].length - 1];
        return this.renderCard(card, 0, false);
    }

    renderTableau(index) {
        if (this.tableau[index].length === 0) {
            return `<div style="position: absolute; top: 0; width: 70px; height: 96px; border: 2px dashed #004040;"></div>`;
        }
        return this.tableau[index].map((card, cardIndex) => {
            const selected = this.selectedPile === `tableau-${index}` && cardIndex === this.selectedCard;
            return this.renderCard(card, cardIndex * 20, selected);
        }).join('');
    }

    updateScore() {
        document.getElementById('sol-score').textContent = this.score;
        document.getElementById('sol-moves').textContent = this.moves;
    }

    drawCard() {
        if (window.playSound) window.playSound('click');
        if (this.stock.length > 0) {
            const card = this.stock.pop();
            card.faceUp = true;
            this.waste.push(card);
            this.moves++;
        } else if (this.waste.length > 0) {
            // Return waste to stock
            while (this.waste.length > 0) {
                const card = this.waste.pop();
                card.faceUp = false;
                this.stock.push(card);
            }
        }
        this.render();
    }

    selectFromWaste() {
        if (window.playSound) window.playSound('click');
        if (this.waste.length === 0) return;

        if (this.selectedPile === 'waste') {
            this.selectedPile = null;
            this.selectedCard = null;
        } else if (this.selectedPile) {
            // Try to move selected card to waste (invalid)
            this.selectedPile = null;
            this.selectedCard = null;
        } else {
            this.selectedPile = 'waste';
            this.selectedCard = this.waste.length - 1;
        }
        this.render();
    }

    selectFoundation(index) {
        if (window.playSound) window.playSound('click');

        if (this.selectedPile === 'waste' && this.waste.length > 0) {
            const card = this.waste[this.waste.length - 1];
            if (this.canMoveToFoundation(card, index)) {
                this.waste.pop();
                this.foundations[index].push(card);
                this.score += 10;
                this.moves++;
                this.selectedPile = null;
                this.selectedCard = null;
                this.checkWin();
            }
        } else if (this.selectedPile && this.selectedPile.startsWith('tableau-')) {
            const tableauIndex = parseInt(this.selectedPile.split('-')[1]);
            const pile = this.tableau[tableauIndex];
            if (this.selectedCard === pile.length - 1) {
                const card = pile[pile.length - 1];
                if (this.canMoveToFoundation(card, index)) {
                    pile.pop();
                    this.foundations[index].push(card);
                    this.score += 10;
                    this.moves++;
                    if (pile.length > 0) {
                        pile[pile.length - 1].faceUp = true;
                    }
                    this.selectedPile = null;
                    this.selectedCard = null;
                    this.checkWin();
                }
            }
        }
        this.render();
    }

    selectTableau(index) {
        if (window.playSound) window.playSound('click');

        if (this.selectedPile === 'waste' && this.waste.length > 0) {
            const card = this.waste[this.waste.length - 1];
            if (this.canMoveToTableau(card, index)) {
                this.waste.pop();
                this.tableau[index].push(card);
                this.score += 5;
                this.moves++;
                this.selectedPile = null;
                this.selectedCard = null;
            }
        } else if (this.selectedPile && this.selectedPile.startsWith('tableau-')) {
            const fromIndex = parseInt(this.selectedPile.split('-')[1]);
            const fromPile = this.tableau[fromIndex];
            const cards = fromPile.slice(this.selectedCard);

            if (this.canMoveToTableau(cards[0], index)) {
                fromPile.splice(this.selectedCard);
                this.tableau[index].push(...cards);
                this.moves++;
                if (fromPile.length > 0) {
                    fromPile[fromPile.length - 1].faceUp = true;
                }
                this.selectedPile = null;
                this.selectedCard = null;
            }
        } else if (this.tableau[index].length > 0) {
            // Select card from this tableau
            const faceUpIndex = this.tableau[index].findIndex(c => c.faceUp);
            if (faceUpIndex >= 0) {
                this.selectedPile = `tableau-${index}`;
                this.selectedCard = faceUpIndex;
            }
        }
        this.render();
    }

    canMoveToFoundation(card, foundationIndex) {
        const foundation = this.foundations[foundationIndex];
        const suits = ['♥', '♦', '♣', '♠'];

        if (card.suit !== suits[foundationIndex]) return false;

        if (foundation.length === 0) {
            return card.value === 'A';
        }

        const topCard = foundation[foundation.length - 1];
        return card.numValue === topCard.numValue + 1;
    }

    canMoveToTableau(card, tableauIndex) {
        const pile = this.tableau[tableauIndex];

        if (pile.length === 0) {
            return card.value === 'K';
        }

        const topCard = pile[pile.length - 1];
        if (!topCard.faceUp) return false;

        return card.color !== topCard.color && card.numValue === topCard.numValue - 1;
    }

    checkWin() {
        const totalCards = this.foundations.reduce((sum, f) => sum + f.length, 0);
        if (totalCards === 52) {
            setTimeout(() => {
                if (window.showWindowsDialog) {
                    window.showWindowsDialog(
                        'Solitaire',
                        `Congratulations! You won!\n\nScore: ${this.score}\nMoves: ${this.moves}`,
                        '🎉'
                    );
                } else {
                    alert(`You won! Score: ${this.score}, Moves: ${this.moves}`);
                }
            }, 300);
        }
    }

    newGame() {
        this.deck = [];
        this.stock = [];
        this.waste = [];
        this.foundations = [[], [], [], []];
        this.tableau = [[], [], [], [], [], [], []];
        this.selectedCard = null;
        this.selectedPile = null;
        this.score = 0;
        this.moves = 0;
        this.initGame();
    }
}

// Global instance
let solitaire = null;