class Calculator {
    constructor(previousOperandDisplay, currentOperandDisplay) {
        this.previousOperandDisplay = previousOperandDisplay;
        this.currentOperandDisplay = currentOperandDisplay;
        this.allClear();
    }

    allClear() {
        this.currentOperand = "";
        this.previousOperand = "";
        this.operation = undefined;
        this.readyForNewNumber = false;
    }

    delete() {
        if (this.currentOperand === "") return;
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    percentage() {
        if (this.currentOperand === "" || isNaN(parseFloat(this.currentOperand))) return;

        const percentageValue = parseFloat(this.currentOperand) / 100;
        this.currentOperand = percentageValue.toPrecision(12).toString();
    }

    sign() {
        if (this.currentOperand === "" || isNaN(parseFloat(this.currentOperand))) return;
        
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }

    appendNumber(number) {
        if (this.readyForNewNumber) {
            this.currentOperand = "";
            this.readyForNewNumber = false;
        }

        if (number === "." && this.currentOperand.includes(".")) return;

        this.currentOperand = this.currentOperand.toString() + number.toString();
    }

    chooseOperation(operator) {
        if (this.currentOperand === "") return;

        if (this.previousOperand !== "") {
            this.compute();
        }

        this.operation = operator;
        this.previousOperand = this.currentOperand;
        this.currentOperand = "";
        this.readyForNewNumber = false;
    }

    compute() {
        let computation;
        const previous = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);

        if (isNaN(previous) || isNaN(current)) return;

        switch (this.operation) {
            case "+":
                computation = previous + current;
                break;
            case "-":
                computation = previous - current;
                break;
            case "x":
                computation = previous * current;
                break;
            case "÷":
                if (current === 0) {
                    this.currentOperand = "Error";
                    this.operation = undefined;
                    this.previousOperand = "";
                    return;
                }

                computation = previous / current;
                break;
            default:
                return;
        }

        this.currentOperand = parseFloat(computation.toPrecision(12)).toString();
        this.operation = undefined;
        this.previousOperand = "";
        this.readyForNewNumber = true;
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integer = parseFloat(stringNumber.split(".")[0]);
        const decimal = stringNumber.split(".")[1];
        
        let integerDisplay;
        if (isNaN(integer)) {
            integerDisplay = "";
        } else {
            integerDisplay = integer.toLocaleString("en", {maximumFractionDigits: 0});
        }

        return decimal ? `${integerDisplay}.${decimal}` : integerDisplay;
    }

    updateDisplay() {
        this.currentOperandDisplay.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null) {
            this.previousOperandDisplay.innerText = 
            `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandDisplay.innerText = "";
        }
    }
}

// Global variables
const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll("[data-operator]");
const equalsButton = document.querySelector("[data-equals]");
const percentageButton = document.querySelector("[data-percentage]");
const deleteButton = document.querySelector("[data-delete]");
const acButton = document.querySelector("[data-all-clear]");
const signButton = document.querySelector("[data-sign]");
const previousOperandDisplay = document.querySelector("[data-previous-operand]");
const currentOperandDisplay = document.querySelector("[data-current-operand]");

const calculator = new Calculator(previousOperandDisplay, currentOperandDisplay);

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        calculator.chooseOperation(button.innerText);
        calculator.updateDisplay();
    });
});

equalsButton.addEventListener("click", button => {
    calculator.compute();
    calculator.updateDisplay();
});

acButton.addEventListener("click", button => {
    calculator.allClear();
    calculator.updateDisplay();
});

deleteButton.addEventListener("click", button => {
    calculator.delete();
    calculator.updateDisplay();
});

percentageButton.addEventListener("click", button => {
    calculator.percentage();
    calculator.updateDisplay();
});

signButton.addEventListener("click", button => {
    calculator.sign();
    calculator.updateDisplay();
});