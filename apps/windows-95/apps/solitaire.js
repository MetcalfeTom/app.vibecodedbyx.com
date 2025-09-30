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
            <div onclick="solitaire.clearSelection(event)" style="background: #008080; padding: 8px; font-family: 'MS Sans Serif', sans-serif; height: 100%; overflow: auto;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; padding: 6px; background: #c0c0c0; border: 2px inset #808080;">
                    <div style="font-size: 11px;">
                        <span style="font-weight: bold;">Score:</span> <span id="sol-score">0</span> &nbsp;
                        <span style="font-weight: bold;">Moves:</span> <span id="sol-moves">0</span>
                    </div>
                    <button onclick="solitaire.confirmNewGame(event);" style="border: 2px outset #c0c0c0; background: #c0c0c0; padding: 2px 8px; cursor: pointer; font-size: 11px;">New Game</button>
                </div>

                <!-- Top row: Stock, Waste, and Foundations -->
                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <div id="stock" onclick="solitaire.drawCard(); event.stopPropagation();" style="width: 70px; height: 96px; background: ${this.stock.length > 0 ? '#0000aa' : '#006060'}; border: 2px solid #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; transition: transform 0.1s; user-select: none;" onmousedown="this.style.transform='scale(0.95)'" onmouseup="this.style.transform='scale(1)'">
                        ${this.stock.length > 0 ? '🂠' : '♻️'}
                    </div>
                    <div id="waste" onclick="solitaire.selectFromWaste(); event.stopPropagation();" style="width: 70px; height: 96px; background: #006060; border: 2px solid #fff; cursor: pointer; position: relative; user-select: none;">
                        ${this.renderWaste()}
                    </div>
                    <div style="flex: 1;"></div>
                    ${this.foundations.map((f, i) => `
                        <div id="foundation-${i}" onclick="solitaire.selectFoundation(${i}); event.stopPropagation();" style="width: 70px; height: 96px; background: #006060; border: 2px solid #fff; cursor: pointer; position: relative; user-select: none;">
                            ${this.renderFoundation(i)}
                        </div>
                    `).join('')}
                </div>

                <!-- Tableau (7 columns) -->
                <div style="display: flex; gap: 8px; justify-content: center;">
                    ${this.tableau.map((pile, i) => `
                        <div id="tableau-${i}" ${pile.length === 0 ? `onclick="solitaire.selectTableau(${i}); event.stopPropagation();"` : ''} style="width: 70px; min-height: 96px; ${pile.length === 0 ? 'cursor: pointer;' : ''} position: relative; user-select: none;">
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
            return `<div style="position: absolute; top: ${top}px; width: 70px; height: 96px; background: #0000aa; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; border-radius: 4px; ${selected ? 'box-shadow: 0 0 0 4px #ffff00, 0 4px 8px rgba(0,0,0,0.3);' : 'box-shadow: 0 2px 4px rgba(0,0,0,0.2);'}">🂠</div>`;
        }
        return `<div style="position: absolute; top: ${top}px; width: 70px; height: 96px; background: #fff; border: 2px solid #000; font-family: Arial; border-radius: 4px; ${selected ? 'box-shadow: 0 0 0 4px #ffff00, 0 4px 8px rgba(0,0,0,0.3); transform: translateY(-2px);' : 'box-shadow: 0 2px 4px rgba(0,0,0,0.2);'} transition: all 0.15s;">
            <div style="color: ${card.color}; padding: 4px; font-size: 14px; font-weight: bold;">${card.value}</div>
            <div style="text-align: center; margin-top: 12px; font-size: 24px; color: ${card.color};">${card.suit}</div>
        </div>`;
    }

    renderCardClickable(card, top = 0, selected = false, clickHandler = '', zIndex = 1) {
        // Boost z-index when selected to appear above all other cards
        const actualZIndex = selected ? 100 : zIndex;
        if (!card.faceUp) {
            return `<div style="position: absolute; top: ${top}px; width: 70px; height: 96px; background: #0000aa; border: 2px solid #fff; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #fff; border-radius: 4px; z-index: ${actualZIndex}; ${selected ? 'box-shadow: 0 0 0 4px #ffff00, 0 4px 8px rgba(0,0,0,0.3);' : 'box-shadow: 0 2px 4px rgba(0,0,0,0.2);'}">🂠</div>`;
        }
        return `<div ${clickHandler} style="position: absolute; top: ${top}px; width: 70px; height: 96px; background: #fff; border: 2px solid #000; font-family: Arial; border-radius: 4px; z-index: ${actualZIndex}; ${selected ? 'box-shadow: 0 0 0 4px #ffff00, 0 4px 8px rgba(0,0,0,0.3); transform: translateY(-2px);' : 'box-shadow: 0 2px 4px rgba(0,0,0,0.2);'} transition: all 0.15s; ${clickHandler ? 'cursor: pointer;' : ''}">
            <div style="color: ${card.color}; padding: 4px; font-size: 14px; font-weight: bold;">${card.value}</div>
            <div style="text-align: center; margin-top: 12px; font-size: 24px; color: ${card.color};">${card.suit}</div>
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
        const totalCards = this.tableau[index].length;
        return this.tableau[index].map((card, cardIndex) => {
            const selected = this.selectedPile === `tableau-${index}` && cardIndex === this.selectedCard;
            const clickable = card.faceUp ? `onclick="solitaire.selectTableauCard(${index}, ${cardIndex}); event.stopPropagation();"` : '';
            const zIndex = totalCards - cardIndex; // Higher cards in stack get higher z-index
            return this.renderCardClickable(card, cardIndex * 20, selected, clickable, zIndex);
        }).join('');
    }

    updateScore() {
        document.getElementById('sol-score').textContent = this.score;
        document.getElementById('sol-moves').textContent = this.moves;
    }

    clearSelection(event) {
        if (event) event.stopPropagation();
        if (this.selectedPile) {
            if (window.playSound) window.playSound('click');
            this.selectedPile = null;
            this.selectedCard = null;
            this.render();
        }
    }

    drawCard() {
        if (window.playSound) window.playSound('click');
        // Clear any selection when drawing a card
        this.selectedPile = null;
        this.selectedCard = null;

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
            } else {
                // Invalid move - unselect
                this.selectedPile = null;
                this.selectedCard = null;
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
                } else {
                    // Invalid move - unselect
                    this.selectedPile = null;
                    this.selectedCard = null;
                }
            } else {
                // Can't move multiple cards to foundation - unselect
                this.selectedPile = null;
                this.selectedCard = null;
            }
        }
        this.render();
    }

    selectTableau(index) {
        if (window.playSound) window.playSound('click');

        // Only handle moves to empty tableau piles here
        if (this.selectedPile === 'waste' && this.waste.length > 0) {
            const card = this.waste[this.waste.length - 1];
            if (this.canMoveToTableau(card, index)) {
                this.waste.pop();
                this.tableau[index].push(card);
                this.score += 5;
                this.moves++;
                this.selectedPile = null;
                this.selectedCard = null;
            } else {
                // Invalid move - unselect
                this.selectedPile = null;
                this.selectedCard = null;
            }
        } else if (this.selectedPile && this.selectedPile.startsWith('tableau-')) {
            const fromIndex = parseInt(this.selectedPile.split('-')[1]);

            // Clicking on same tableau - unselect
            if (fromIndex === index) {
                this.selectedPile = null;
                this.selectedCard = null;
            } else {
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
                } else {
                    // Invalid move - unselect
                    this.selectedPile = null;
                    this.selectedCard = null;
                }
            }
        }
        this.render();
    }

    selectTableauCard(tableauIndex, cardIndex) {
        if (window.playSound) window.playSound('click');

        const card = this.tableau[tableauIndex][cardIndex];

        // Can only select face-up cards
        if (!card.faceUp) return;

        // If there's a selected card, try to move it here
        if (this.selectedPile === 'waste' && this.waste.length > 0) {
            const wasteCard = this.waste[this.waste.length - 1];
            if (this.canMoveToTableau(wasteCard, tableauIndex)) {
                this.waste.pop();
                this.tableau[tableauIndex].push(wasteCard);
                this.score += 5;
                this.moves++;
                this.selectedPile = null;
                this.selectedCard = null;
            } else {
                // Invalid move - unselect
                this.selectedPile = null;
                this.selectedCard = null;
            }
        } else if (this.selectedPile && this.selectedPile.startsWith('tableau-')) {
            const fromIndex = parseInt(this.selectedPile.split('-')[1]);

            // Clicking on same tableau - toggle selection or move within
            if (fromIndex === tableauIndex) {
                // If clicking the same card, unselect
                if (this.selectedCard === cardIndex) {
                    this.selectedPile = null;
                    this.selectedCard = null;
                } else {
                    // Select the clicked card instead
                    this.selectedCard = cardIndex;
                }
            } else {
                // Moving from one tableau to another
                const fromPile = this.tableau[fromIndex];
                const cards = fromPile.slice(this.selectedCard);

                if (this.canMoveToTableau(cards[0], tableauIndex)) {
                    fromPile.splice(this.selectedCard);
                    this.tableau[tableauIndex].push(...cards);
                    this.moves++;
                    if (fromPile.length > 0) {
                        fromPile[fromPile.length - 1].faceUp = true;
                    }
                    this.selectedPile = null;
                    this.selectedCard = null;
                } else {
                    // Invalid move - unselect
                    this.selectedPile = null;
                    this.selectedCard = null;
                }
            }
        } else {
            // No card selected - select this card
            this.selectedPile = `tableau-${tableauIndex}`;
            this.selectedCard = cardIndex;
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

    confirmNewGame(event) {
        if (event) event.stopPropagation();

        // If game hasn't started (no moves), just start new game
        if (this.moves === 0) {
            this.newGame();
            return;
        }

        // Show confirmation dialog
        if (window.showWindowsDialog) {
            const overlay = document.getElementById('dialogOverlay');
            const titleElement = document.getElementById('dialogTitle');
            const iconElement = document.getElementById('dialogIcon');
            const messageElement = document.getElementById('dialogMessage');
            const buttonsContainer = document.getElementById('dialogButtons');

            if (overlay && titleElement && iconElement && messageElement && buttonsContainer) {
                titleElement.textContent = 'Solitaire';
                iconElement.textContent = '❓';
                messageElement.textContent = 'Start a new game? Your current progress will be lost.';

                buttonsContainer.innerHTML = '';
                const yesBtn = document.createElement('button');
                yesBtn.className = 'dialog-button';
                yesBtn.textContent = 'Yes';
                yesBtn.onclick = () => {
                    window.closeDialog();
                    this.newGame();
                };

                const noBtn = document.createElement('button');
                noBtn.className = 'dialog-button';
                noBtn.textContent = 'No';
                noBtn.onclick = () => window.closeDialog();

                buttonsContainer.appendChild(yesBtn);
                buttonsContainer.appendChild(noBtn);

                overlay.style.display = 'flex';
                setTimeout(() => noBtn.focus(), 100);
            } else {
                // Fallback to confirm dialog
                if (confirm('Start a new game? Your current progress will be lost.')) {
                    this.newGame();
                }
            }
        } else {
            // Fallback to confirm dialog
            if (confirm('Start a new game? Your current progress will be lost.')) {
                this.newGame();
            }
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