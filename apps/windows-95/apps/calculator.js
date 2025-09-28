// Calculator App for Windows 95 Simulator

class Calculator {
    constructor(container) {
        this.container = container;
        this.state = { display: '0', operation: null, operand: null, waitingForOperand: false };
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="calculator" style="font-family: 'MS Sans Serif', sans-serif; width: 250px; height: 320px; background: #c0c0c0; padding: 5px;">
                <div class="calc-display" id="calcDisplay" style="background: #000; color: lime; padding: 10px; text-align: right; font-size: 18px; margin: 5px; border: 1px inset #c0c0c0; font-family: 'Courier New', monospace;">0</div>
                <div class="calc-buttons" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; padding: 5px;">
                    ${this.createButton('C', 'calcClear()')}
                    ${this.createButton('±', 'calcOperation(\'±\')')}
                    ${this.createButton('÷', 'calcOperation(\'÷\')')}
                    ${this.createButton('×', 'calcOperation(\'×\')')}
                    ${this.createButton('7', 'calcNumber(\'7\')')}
                    ${this.createButton('8', 'calcNumber(\'8\')')}
                    ${this.createButton('9', 'calcNumber(\'9\')')}
                    ${this.createButton('-', 'calcOperation(\'-\')')}
                    ${this.createButton('4', 'calcNumber(\'4\')')}
                    ${this.createButton('5', 'calcNumber(\'5\')')}
                    ${this.createButton('6', 'calcNumber(\'6\')')}
                    ${this.createButton('+', 'calcOperation(\'+\')')}
                    ${this.createButton('1', 'calcNumber(\'1\')')}
                    ${this.createButton('2', 'calcNumber(\'2\')')}
                    ${this.createButton('3', 'calcNumber(\'3\')')}
                    ${this.createButton('=', 'calcEquals()', 'grid-row: span 2;')}
                    ${this.createButton('0', 'calcNumber(\'0\')', 'grid-column: span 2;')}
                    ${this.createButton('.', 'calcDecimal()')}
                </div>
            </div>
        `;
    }

    createButton(text, onclick, style = '') {
        return `<div class="calc-button" onclick="${onclick}" style="height: 40px; background: #c0c0c0; border: 2px outset #c0c0c0; cursor: pointer; font-size: 12px; font-weight: bold; display: flex; align-items: center; justify-content: center; user-select: none; ${style}" onmousedown="this.style.border='2px inset #c0c0c0'" onmouseup="this.style.border='2px outset #c0c0c0'" onmouseleave="this.style.border='2px outset #c0c0c0'">${text}</div>`;
    }

    number(num) {
        const display = document.getElementById('calcDisplay');
        if (this.state.waitingForOperand) {
            this.state.display = num;
            this.state.waitingForOperand = false;
        } else {
            this.state.display = this.state.display === '0' ? num : this.state.display + num;
        }
        display.textContent = this.state.display;
    }

    decimal() {
        if (this.state.waitingForOperand) {
            this.state.display = '0.';
            this.state.waitingForOperand = false;
        } else if (this.state.display.indexOf('.') === -1) {
            this.state.display += '.';
        }
        document.getElementById('calcDisplay').textContent = this.state.display;
    }

    clear() {
        this.state = { display: '0', operation: null, operand: null, waitingForOperand: false };
        document.getElementById('calcDisplay').textContent = '0';
    }

    operation(nextOperation) {
        const inputValue = parseFloat(this.state.display);

        if (this.state.operand === null) {
            this.state.operand = inputValue;
        } else if (this.state.operation) {
            const currentValue = this.state.operand || 0;
            const newValue = this.calculate(currentValue, inputValue, this.state.operation);

            this.state.display = String(newValue);
            this.state.operand = newValue;
            document.getElementById('calcDisplay').textContent = this.state.display;
        }

        this.state.waitingForOperand = true;
        this.state.operation = nextOperation;
    }

    equals() {
        const inputValue = parseFloat(this.state.display);

        if (this.state.operand !== null && this.state.operation) {
            const newValue = this.calculate(this.state.operand, inputValue, this.state.operation);
            this.state.display = String(newValue);
            this.state.operand = null;
            this.state.operation = null;
            this.state.waitingForOperand = true;
            document.getElementById('calcDisplay').textContent = this.state.display;
        }
    }

    calculate(firstOperand, secondOperand, operation) {
        switch (operation) {
            case '+': return firstOperand + secondOperand;
            case '-': return firstOperand - secondOperand;
            case '×': return firstOperand * secondOperand;
            case '÷': return firstOperand / secondOperand;
            case '±': return -firstOperand;
            default: return secondOperand;
        }
    }
}

// Global calculator instance
let calculator;

// Global functions for button clicks
function calcNumber(num) {
    if (calculator) calculator.number(num);
}

function calcDecimal() {
    if (calculator) calculator.decimal();
}

function calcClear() {
    if (calculator) calculator.clear();
}

function calcOperation(op) {
    if (calculator) calculator.operation(op);
}

function calcEquals() {
    if (calculator) calculator.equals();
}