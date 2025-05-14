const firstButton = document.getElementById("button-1");
const radDiv = document.getElementById("rad-div");
const degDiv = document.getElementById("deg-div");

function toRadians(deg) {
  return (deg * Math.PI) / 180;
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

firstButton.addEventListener("click", turnRed);

const display = document.querySelector(".display-box");
function updateDisplay(result) {
  display.textContent = result;
}
const buttons = document.querySelectorAll(".buttons-grid button");
let currentInput = "";

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    let value = button.dataset.value;
    if (value === "--") {
      value = "+";
    }
    // if (value === "÷") value = "/";
    if (value === "mode") {
      return;
    }
    if (value === "Ans") {
      return;
    }
    if (value === "AC") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    } else if (value === "=") {
      try {
        if (degDiv.classList.contains("turn-red")) {
          currentInput = currentInput
            // for sin in radians
            .replace(
              /sin\(([^)]+)\)/g,
              (_, val) => `Math.sin(toRadians(${val}))`
            )
            //for cos in radians
            .replace(
              /cos\(([^)]+)\)/g,
              (_, val) => `Math.cos(toRadians(${val}))`
            )
            // for tan in radians
            .replace(
              /tan\(([^)]+)\)/g,
              (_, val) => `Math.tan(toRadians(${val}))`
            );
          // for exponents
          currentInput = currentInput.replace(
            /(\d+)\s*xʸ\s*(\d+)/g,
            (_, base, exponent) => `Math.pow(${base}, ${exponent})`
          );
        } else {
          currentInput = currentInput
            // for sin in degrees
            .replace(/sin\(([^)]+)\)/g, (_, val) => `Math.sin(${val})`)
            // for cos in degrees
            .replace(/cos\(([^)]+)\)/g, (_, val) => `Math.cos(${val})`)
            // for tan in degrees
            .replace(/tan\(([^)]+)\)/g, (_, val) => `Math.tan(${val})`);
          // for exponents
          currentInput = currentInput.replace(
            /(\d+)\s*xʸ\s*(\d+)/g,
            (_, base, exponent) => `Math.pow(${base}, ${exponent})`
          );
        }
        let originalExpression = currentInput;
        let result = eval(currentInput);
        updateDisplay(result);
        currentInput = result.toString();

        storeCalculation(originalExpression, result.toString());
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

// ======================typing in the calculations=========================
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", function (e) {
    const allowedKeys = "0123456789+-*/.()xX%";

    if (allowedKeys.includes(e.key)) {
      currentInput += e.key === "x" || e.key === "X" ? "*" : e.key;
      updateDisplay(currentInput);
    } else if (e.key === "Enter") {
      try {
        let expression = currentInput
          .replace(/x/g, "*")
          .replace(/X/g, "*")
          .replace(/÷/g, "/")
          .replace(/--/g, "+")
          .replace(/\s+/g, "");

        if (degDiv.classList.contains("turn-red")) {
          expression = expression
            .replace(/sin\(([^)]+)\)/g, function (_, val) {
              return `Math.sin(toRadians(${val}))`;
            })
            .replace(/cos\(([^)]+)\)/g, function (_, val) {
              return `Math.cos(toRadians(${val}))`;
            })
            .replace(/tan\(([^)]+)\)/g, function (_, val) {
              return `Math.tan(toRadians(${val}))`;
            });
          expression = expression.replace(
            /(\d+)\s*xʸ\s*(\d+)/g,
            function (_, base, _1, _2, exponent) {
              return `Math.pow(${base}, ${exponent})`;
            }
          );
        } else {
          expression = expression
            .replace(/sin\(([^)]+)\)/g, function (_, val) {
              return `Math.sin(${val})`;
            })
            .replace(/cos\(([^)]+)\)/g, function (_, val) {
              return `Math.cos(${val})`;
            })
            .replace(/tan\(([^)]+)\)/g, function (_, val) {
              return `Math.tan(${val})`;
            });
          // Handle exponent notation
          expression = expression.replace(
            /(\d+)\s*xʸ\s*(\d+)/g,
            function (_, base, _1, _2, exponent) {
              return `Math.pow(${base}, ${exponent})`;
            }
          );
        }
        let result = eval(expression);
        updateDisplay(result);
        currentInput = result.toString();

        storeCalculation(currentInput, result.toString());
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
}
document.getElementById("history-btn").addEventListener("click", function () {
  const dropdown = document.getElementById("history-dropdown");
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
