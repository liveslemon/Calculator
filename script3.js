const firstButton = document.getElementById("button-1");
const radDiv = document.getElementById("rad-div");
const degDiv = document.getElementById("deg-div");

function factorial(n) {
  if (n < 0) return NaN;
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

function toRadians(deg) {
  return (deg * Math.PI) / 180;
}
function toDegrees(rad) {
  return (rad * 180) / Math.PI;
}

// ===================== Expression converter ===================== //
// This function converts the user input, replaces trigonometric functions and exponent notation with their JavaScript equivalents.
function parseExpression(input, inRadians) {
  // replace arithmetic operators
  let expr = input
    .replace(/x/g, "*")
    .replace(/X/g, "*")
    .replace(/÷/g, "/")
    .replace(/--/g, "+")
    .replace(/\s+/g, "");

  if (inRadians) {
    // ==================handle trigonometry in radians=================

    expr = expr
      .replace(/sin\(([^)]+)\)/g, (_, val) => `Math.sin(toRadians(${val}))`)
      .replace(/cos\(([^)]+)\)/g, (_, val) => `Math.cos(toRadians(${val}))`)
      .replace(/tan\(([^)]+)\)/g, (_, val) => `Math.tan(toRadians(${val}))`);
  } else {
    // ==================handle trigonometry in degrees=================
    expr = expr
      .replace(/sin\(([^)]+)\)/g, (_, val) => `Math.sin(${val})`)
      .replace(/cos\(([^)]+)\)/g, (_, val) => `Math.cos(${val})`)
      .replace(/tan\(([^)]+)\)/g, (_, val) => `Math.tan(${val})`);
  }

  // Handle inverse trigonometric functions
  if (inRadians) {
    expr = expr
      .replace(/sin⁻¹\(([^)]+)\)/g, (_, val) => `toDegrees(Math.asin(${val}))`)
      .replace(/cos⁻¹\(([^)]+)\)/g, (_, val) => `toDegrees(Math.acos(${val}))`)
      .replace(/tan⁻¹\(([^)]+)\)/g, (_, val) => `toDegrees(Math.atan(${val}))`);
  } else {
    expr = expr
      .replace(/sin⁻¹\(([^)]+)\)/g, (_, val) => `Math.asin(${val})`)
      .replace(/cos⁻¹\(([^)]+)\)/g, (_, val) => `Math.acos(${val})`)
      .replace(/tan⁻¹\(([^)]+)\)/g, (_, val) => `Math.atan(${val})`);
  }
  // Handle 10ˣ(x) and eˣ(x)
  expr = expr
    .replace(/10ˣ\(([^)]+)\)/g, (_, val) => `Math.pow(10, ${val})`)
    .replace(/eˣ\(([^)]+)\)/g, (_, val) => `Math.exp(${val})`);

  // Handle x² and ²√x
  expr = expr
    .replace(/([0-9.]+)²/g, (_, val) => `Math.pow(${val}, 2)`)
    .replace(/²√([0-9.]+|\([^()]+\))/g, (_, val) => `Math.sqrt(${val})`);

  // Handle 10^x and e^x
  expr = expr
    .replace(/10\^([^)]+)/g, (_, val) => `Math.pow(10, ${val})`)
    .replace(/e\^([^)]+)/g, (_, val) => `Math.exp(${val})`);

  // ====================Handle Exponents=========================

  // ====================Handle Square Roots======================
  expr = expr.replace(/√\(([^)]+)\)/g, function (_, val) {
    return `Math.sqrt(${val})`;
  });
  // =====================Handle Logarithms============================
  expr = expr.replace(/log\(([^)]+)\)/g, function (_, val) {
    return `Math.log10(${val})`;
  });
  // =====================Handle Natural Logarithms=======================
  expr = expr.replace(/ln\(([^)]+)\)/g, function (_, val) {
    return `Math.log(${val})`;
  });

  // Handle EXP (exponential function)
  expr = expr.replace(/EXP\(([^)]+)\)/g, function (_, val) {
    return `${val}*Math.pow(10, ${val})`;
  });

  // ======================Handle constant Euler's number(e)================
  expr = expr.replace(/\be\b/g, "Math.E");

  // =======================Handle π and pi===========================
  expr = expr.replace(/\bpi\b/gi, "Math.PI").replace(/π/g, "Math.PI");

  // ========================Handle factorial (n!)=======================
  expr = expr.replace(/(\d+)!/g, function (_, n) {
    return `factorial(${n})`;
  });

  return expr;
}

let turnRed = function () {
  if (radDiv.classList.contains("turn-red")) {
    radDiv.classList.remove("turn-red");
    degDiv.classList.add("turn-red");
  } else if (degDiv.classList.contains("turn-red")) {
    degDiv.classList.remove("turn-red");
    radDiv.classList.add("turn-red");
  }
};
// swap between rad and deg when the button is clicked
firstButton.addEventListener("click", turnRed);

const display = document.querySelector(".display-box");
/*
===================================================================
===================== Calculator Logic Engine =====================
===================================================================
*/
// This function updates the display with the result or "0" if no result is provided.
function updateDisplay(result) {
  display.textContent = result || "0";
}
const buttons = document.querySelectorAll(".buttons-grid button");
let currentInput = "";
let calculationHistory = [];
buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    let value = button.dataset.value;
    if (value === "--") {
      value = "+";
    }
    if (value === "÷") {
      value = "/";
    }
    if (value === "mode") {
      return;
    }
    if (value === "Inv") {
      const invToggle = button.classList.toggle("active-inv");
      const inverseButtons = document.querySelectorAll(
        "[data-normal][data-inverse]"
      );

      inverseButtons.forEach(function (btn) {
        const normalVal = btn.getAttribute("data-normal");
        const inverseVal = btn.getAttribute("data-inverse");

        if (invToggle) {
          btn.textContent = inverseVal.replace("(", "").replace(")", "");
          btn.setAttribute("data-value", inverseVal);
        } else {
          btn.textContent = normalVal.replace("(", "").replace(")", "");
          btn.setAttribute("data-value", normalVal);
        }
        if (inverseVal === "x²") {
          btn.setAttribute("data-value", "^2");
        } else if (inverseVal === "eˣ") {
          btn.setAttribute("data-value", "e^");
        } else if (inverseVal === "10ˣ") {
          btn.setAttribute("data-value", "10^");
        } else {
          btn.setAttribute("data-value", inverseVal);
        }
      });
      return;
    }
    if (value === "Ans") {
      const lastCalc = calculationHistory[calculationHistory.length - 1];
      if (lastCalc) {
        currentInput += lastCalc.result;
        updateDisplay(currentInput);
      }
      return;
    }
    if (value === "AC") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    } else if (value === "=") {
      try {
        let inRadians = degDiv.classList.contains("turn-red");
        let originalInput = currentInput;
        let expression = parseExpression(currentInput, inRadians);
        let result = eval(expression);
        updateDisplay(result);
        currentInput = result.toString();

        storeCalculation(originalInput, result.toString());
      } catch (e) {
        updateDisplay("Error");
        currentInput = "";
      }
    } else {
      currentInput += value;
      updateDisplay(currentInput);
    }
  });
});
let acTimeout;

buttons.forEach(function (button) {
  button.addEventListener("mousedown", function () {
    if (button.textContent.trim() === "AC") {
      acTimeout = setTimeout(function () {
        currentInput = "";
        updateDisplay("0");
      }, 500);
    }
  });

  button.addEventListener("mouseup", function () {
    if (button.textContent.trim() === "AC") {
      clearTimeout(acTimeout);
    }
  });
});

// =====================  Keyboard Listener ===================== //

document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", function (e) {
    const allowedKeys = "0123456789+-*/.()xX%√logn^e!π";

    // ======================typing in the calculations=========================

    if (allowedKeys.includes(e.key)) {
      currentInput += e.key === "x" || e.key === "X" ? "*" : e.key;
      updateDisplay(currentInput);
    } else if (e.key === "Enter") {
      try {
        let inRadians = degDiv.classList.contains("turn-red");
        let originalInput = currentInput;
        let expression = parseExpression(currentInput, inRadians);
        let result = eval(expression);
        updateDisplay(result);
        currentInput = result.toString();

        storeCalculation(originalInput, result.toString());
      } catch {
        updateDisplay("Error");
      }
    } else if (e.key === "Backspace") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    } else if (e.key === "Escape") {
      currentInput = "";
      updateDisplay("0");
    }
  });
});

// =====================  History Storage ===================== //
//testing after this point

// Function to store calculation in history
function storeCalculation(expressionText, resultText) {
  const storageDiv = document.createElement("div");
  storageDiv.classList.add("storage");

  const expressionDiv = document.createElement("div");
  expressionDiv.textContent = expressionText;
  expressionDiv.classList.add("expression");

  const equalsDiv = document.createElement("div");
  equalsDiv.textContent = "=";
  equalsDiv.classList.add("equals");

  const resultDiv = document.createElement("div");
  resultDiv.textContent = resultText;
  resultDiv.classList.add("result");

  // Append all parts in the correct order
  storageDiv.appendChild(expressionDiv);
  storageDiv.appendChild(equalsDiv);
  storageDiv.appendChild(resultDiv);

  const dropdownItem = document.createElement("div");
  dropdownItem.classList.add("dropdown-item");
  dropdownItem.appendChild(storageDiv);

  const historyDropdown = document.getElementById("history-dropdown");
  if (historyDropdown) {
    historyDropdown.appendChild(dropdownItem);
  }
  calculationHistory.push({ expression: expressionText, result: resultText });
  //logging the last calculation
  console.log("Calculation stored:", {
    expression: expressionText,
    result: resultText,
  });
  // Display the full calculation history in the console
  console.log("Full calculation history:", calculationHistory);
}
document.getElementById("history-btn").addEventListener("click", function () {
  const dropdown = document.getElementById("history-dropdown");
  const historyDropdownContent = dropdown.querySelector(".dropdown-item");

  dropdown.classList.toggle("hidden");
});
document.addEventListener("click", function (event) {
  const dropdown = document.getElementById("history-dropdown");
  const historyBtn = document.getElementById("history-btn");

  // If the dropdown is open and the click was outside both the dropdown and the button
  if (
    dropdown &&
    !dropdown.classList.contains("hidden") &&
    !dropdown.contains(event.target) &&
    !historyBtn.contains(event.target)
  ) {
    dropdown.classList.add("hidden");
  }
});

const toggle = document.querySelector(".toggle");
const text = document.querySelector(".text");
function animatedToggle() {
  toggle.classList.toggle("active");

  const isActive = toggle.classList.contains("active");
  text.innerHTML = isActive ? "FX" : "123";

  const buttonsGrid = document.querySelector(".buttons-grid");
  if (isActive) {
    buttonsGrid.classList.remove("basic-btn");
    buttonsGrid.classList.add("sci-btn");
  } else {
    buttonsGrid.classList.remove("sci-btn");
    buttonsGrid.classList.add("basic-btn");
  }
}

// Attach the click event
toggle.addEventListener("click", animatedToggle);
