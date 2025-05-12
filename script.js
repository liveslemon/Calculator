let firstButton = document.getElementById("button-1");
let radDiv = document.getElementById("rad-div");
let degDiv = document.getElementById("deg-div");

let turnBlue = function () {
  if (radDiv.classList.contains("turn-red")) {
    radDiv.classList.remove("turn-red");
    degDiv.classList.add("turn-red");
  } else if (degDiv.classList.contains("turn-red")) {
    degDiv.classList.remove("turn-red");
    radDiv.classList.add("turn-red");
  }
};

firstButton.addEventListener("click", turnBlue);

let display = document.querySelector(".display-box");
function updateDisplay(result) {
  display.textContent = result;
}

let buttons = document.querySelectorAll(".buttons-grid button");

let acTimeout;

buttons.forEach(function (button) {
  button.addEventListener("mousedown", function () {
    if (button.textContent.trim() === "AC") {
      acTimeout = setTimeout(function () {
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
// buttons.forEach(function (button) {
//   button.addEventListener("click", function () {
//     const value = button.textContent.trim();

//     if (display.textContent === "0") {
//       updateDisplay("");
//     }

//     if (value === "Ans" || value.includes("Rad") || value.includes("Deg")) {
//       return; // ignore Ans Rad and Deg
//     }

//     if (value === "AC") {
//       if (display.textContent.length > 1) {
//         updateDisplay(display.textContent.slice(0, -1));
//       } else {
//         updateDisplay("0");
//       }
//       return;
//     }

//     updateDisplay(display.textContent + value);
//   });
// });
let expression = "";

buttons.forEach(function (button) {
  button.addEventListener("click", function () {
    const value = button.textContent.trim();

    if (value === "=") {
      try {
        const result = Function(`'use strict'; return (${expression})`)();
        updateDisplay(result);
        expression = result.toString(); // allow chaining calculations
      } catch {
        updateDisplay("Error");
        expression = "";
      }
    } else if (value === "AC") {
      expression = expression.slice(0, -1);
      updateDisplay(expression || "0");
    } else if (
      value === "Ans" ||
      value.includes("Rad") ||
      value.includes("Deg")
    ) {
      return;
    } else {
      const safeValue = value === "x" ? "*" : value === "÷" ? "/" : value;
      expression += safeValue;
      updateDisplay(expression);
    }
  });
});
document
  .querySelector("[data-value='=']")
  .addEventListener("click", function () {
    try {
      let expression = display.textContent
        .replace(/x/g, "*")
        .replace(/÷/g, "/")
        .replace(/--/g, "+")
        .replace(/\s+/g, "");

      if (!expression) {
        updateDisplay("0");
        return;
      }

      if (!expression) {
        updateDisplay("0");
        return;
      }
    } catch {
      updateDisplay("Error");
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  const display = document.querySelector(".display-box");

  document.addEventListener("keydown", function (e) {
    const allowedKeys = "0123456789+-*/.()";

    if (allowedKeys.includes(e.key)) {
      display.textContent += e.key === "x" ? "*" : e.key;
    } else if (e.key === "Enter") {
      try {
        let expression = display.textContent
          .replace(/x/g, "*")
          .replace(/÷/g, "/")
          .replace(/--/g, "+")
          .replace(/\s+/g, "");
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
