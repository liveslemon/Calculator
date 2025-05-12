let firstButton = document.getElementById("button-1");
let radDiv = document.getElementById("rad-div");
let degDiv = document.getElementById("deg-div");

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

let display = document.querySelector(".display-box");
function updateDisplay(result) {
  display.textContent = result;
}
let buttons = document.querySelectorAll(".buttons-grid button");
let currentInput = "";
let history = [];
let historyDisplay = document.querySelector(".history-box");

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    let value = button.dataset.value;
    // if (value === "x") value = "*";
    // if (value === "÷") value = "/";
    if (value === "mode") {
      return;
    }
    if (value === "Ans") {
      if (history.length > 0) {
        currentInput += history[history.length - 1];
        updateDisplay(currentInput);
      }
      return;
    }
    if (value === "AC") {
      currentInput = currentInput.slice(0, -1);
      updateDisplay(currentInput || "0");
    } else if (value === "=") {
      try {
        currentInput = currentInput.replace(
          /sin\(([^)]+)\)/g,
          function (_, match) {
            return `Math.sin(${match})`;
          }
        );
        currentInput = currentInput.replace(
          /cos\(([^)]+)\)/g,
          function (_, match) {
            return `Math.cos(${match})`;
          }
        );
        currentInput = currentInput.replace(
          /tan\(([^)]+)\)/g,
          function (_, match) {
            return `Math.tan(${match})`;
          }
        );
        let result = eval(currentInput);
        updateDisplay(result);
        currentInput = result.toString();
        history.push(result);
        if (historyDisplay) {
          historyDisplay.innerHTML = history
            .map(function (item) {
              return "&bull; " + item;
            })
            .join(" ");
        }
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
document.addEventListener("DOMContentLoaded", function () {
  document.addEventListener("keydown", function (e) {
    const allowedKeys = "0123456789+-*/.()xX%";

    if (allowedKeys.includes(e.key)) {
      display.textContent += e.key === "x" ? "*" : e.key;
    } else if (e.key === "Enter") {
      try {
        let expression = display.textContent
          .replace(/x/g, "*")
          .replace(/X/g, "*")
          .replace(/÷/g, "/")
          .replace(/--/g, "+")
          .replace(/\s+/g, "");
        let result = eval(expression);
        updateDisplay(result);
      } catch {
        updateDisplay("Error");
      }
    } else if (e.key === "Backspace") {
      display.textContent = display.textContent.slice(0, -1);
    } else if (e.key === "Escape") {
      display.textContent = "0";
    }
  });
});
