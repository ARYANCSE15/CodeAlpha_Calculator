const currentDisplay = document.getElementById("current-display");
const previousDisplay = document.getElementById("previous-display");

let currentNumber = "";
let previousNumber = "";
let operator = null;
let shouldResetDisplay = false;


// Update display
function updateDisplay() {

    currentDisplay.textContent =
        currentNumber === "" ? "0" : currentNumber;

    if (previousNumber !== "" && operator !== null) {

        previousDisplay.textContent =
            `${previousNumber} ${getOperatorSymbol(operator)}`;

    } else {

        previousDisplay.textContent = "";
    }
}


// Convert operator into calculator symbol
function getOperatorSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷",
        "%": "%"
    };

    return symbols[operator];
}


// Add number
function appendNumber(number) {

    if (shouldResetDisplay) {

        currentNumber = "";
        shouldResetDisplay = false;
    }

    if (currentNumber === "0") {
        currentNumber = number;
    } else {
        currentNumber += number;
    }

    updateDisplay();
}


// Add decimal
function appendDecimal() {

    if (shouldResetDisplay) {

        currentNumber = "";
        shouldResetDisplay = false;
    }

    if (!currentNumber.includes(".")) {

        if (currentNumber === "") {
            currentNumber = "0.";
        } else {
            currentNumber += ".";
        }
    }

    updateDisplay();
}


// Choose operator
function chooseOperator(selectedOperator) {

    if (currentNumber === "" && previousNumber === "") {
        return;
    }

    if (operator !== null && !shouldResetDisplay) {

        calculate();
    }

    previousNumber = currentNumber;
    operator = selectedOperator;

    currentNumber = "";

    updateDisplay();
}


// Calculate result
function calculate() {

    if (
        operator === null ||
        previousNumber === "" ||
        currentNumber === ""
    ) {
        return;
    }

    const firstNumber = parseFloat(previousNumber);
    const secondNumber = parseFloat(currentNumber);

    let result;

    switch (operator) {

        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":

            if (secondNumber === 0) {

                currentNumber = "Error";
                previousNumber = "";
                operator = null;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;
            break;

        case "%":
            result = firstNumber % secondNumber;
            break;

        default:
            return;
    }

    // Prevent extremely long decimal values
    result = Math.round((result + Number.EPSILON) * 100000000) / 100000000;

    currentNumber = result.toString();

    previousNumber = "";
    operator = null;

    shouldResetDisplay = true;

    updateDisplay();
}


// Clear calculator
function clearCalculator() {

    currentNumber = "";
    previousNumber = "";
    operator = null;

    shouldResetDisplay = false;

    updateDisplay();
}


// Delete last character
function deleteNumber() {

    if (shouldResetDisplay) {

        currentNumber = "";
        shouldResetDisplay = false;

    } else {

        currentNumber = currentNumber.slice(0, -1);
    }

    updateDisplay();
}


// Button clicks
document.querySelectorAll("[data-number]").forEach(button => {

    button.addEventListener("click", () => {

        appendNumber(button.dataset.number);

    });

});


document.querySelectorAll("[data-operator]").forEach(button => {

    button.addEventListener("click", () => {

        chooseOperator(button.dataset.operator);

    });

});


document.querySelector('[data-action="decimal"]')
    .addEventListener("click", appendDecimal);


document.querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);


document.querySelector('[data-action="delete"]')
    .addEventListener("click", deleteNumber);


document.querySelector('[data-action="calculate"]')
    .addEventListener("click", calculate);


// Keyboard support
document.addEventListener("keydown", event => {

    const key = event.key;

    if (!isNaN(key)) {

        appendNumber(key);

    } else if (key === ".") {

        appendDecimal();

    } else if (
        key === "+" ||
        key === "-" ||
        key === "*" ||
        key === "/" ||
        key === "%"
    ) {

        chooseOperator(key);

    } else if (key === "Enter" || key === "=") {

        event.preventDefault();

        calculate();

    } else if (key === "Backspace") {

        deleteNumber();

    } else if (key === "Escape" || key.toLowerCase() === "c") {

        clearCalculator();
    }

});