document.addEventListener("DOMContentLoaded", () => {
  // Game State Variables
  let currentFunds = 0.00;
  let incomePerSecond = 0.00;
  const targetWinGoal = 5000.00;
  let hasWon = false;

  // Obstacle Variables
  let isLeaking = false;
  const leakPenalty = 2.00; // Drains $2 a second

  // Upgrade Costs
  let filterCost = 50.00;
  let pumpCost = 200.00;
  let wellCost = 1000.00;

  // DOM Elements
  const fundsDisplay = document.getElementById("current-funds");
  const passiveDisplay = document.getElementById("passive-rate");
  const tickerDisplay = document.getElementById("game-ticker");
  const leakAlertBtn = document.getElementById("leak-alert");
  const resetBtn = document.getElementById("reset-game");

  const costFilterDisplay = document.getElementById("cost-filter");
  const costPumpDisplay = document.getElementById("cost-pump");
  const costWellDisplay = document.getElementById("cost-well");

  // --- Display & Win Logic ---
  function updateScreenDisplays() {
    fundsDisplay.innerText = currentFunds.toFixed(2);
    passiveDisplay.innerText = incomePerSecond.toFixed(2);
    costFilterDisplay.innerText = filterCost.toFixed(2);
    costPumpDisplay.innerText = pumpCost.toFixed(2);
    costWellDisplay.innerText = wellCost.toFixed(2);

    // LEVEL UP: Celebrate Wins Check
    if (currentFunds >= targetWinGoal && !hasWon) {
      hasWon = true;
      tickerDisplay.innerHTML = `<span class="text-success fw-bold"><i class="fa-solid fa-trophy me-2 text-warning"></i> Victory! You successfully funded clean water for the village!</span>`;
      
      // Trigger the external confetti script
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
    }
  }

  // --- Clicker Logic ---
  document.getElementById("jar-clicker").addEventListener("click", () => {
    currentFunds += 1.00; 
    updateScreenDisplays();
  });

  // --- Upgrade Shop Logic ---
  document.getElementById("buy-filter").addEventListener("click", () => {
    if (currentFunds >= filterCost) {
      currentFunds -= filterCost;
      incomePerSecond += 1.00;
      filterCost = filterCost * 1.15; // Scales price by 15%
    }
    updateScreenDisplays();
  });

  document.getElementById("buy-pump").addEventListener("click", () => {
    if (currentFunds >= pumpCost) {
      currentFunds -= pumpCost;
      incomePerSecond += 5.00;
      pumpCost = pumpCost * 1.15;
    }
    updateScreenDisplays();
  });

  document.getElementById("buy-well").addEventListener("click", () => {
    if (currentFunds >= wellCost) {
      currentFunds -= wellCost;
      incomePerSecond += 25.00;
      wellCost = wellCost * 1.15;
    }
    updateScreenDisplays();
  });

  // --- LEVEL UP: Fix the Leak Challenge ---
  leakAlertBtn.addEventListener("click", () => {
    isLeaking = false;
    leakAlertBtn.classList.add("d-none"); // Hide button again
  });

  // --- LEVEL UP: Game Reset Logic ---
  resetBtn.addEventListener("click", () => {
    currentFunds = 0;
    incomePerSecond = 0;
    filterCost = 50;
    pumpCost = 200;
    wellCost = 1000;
    hasWon = false;
    isLeaking = false;
    
    leakAlertBtn.classList.add("d-none");
    tickerDisplay.innerHTML = `<i class="fa-solid fa-circle-info me-2 text-warning"></i>Goal: Reach $5,000.00 to fully secure clean water for the entire village!`;
    
    updateScreenDisplays();
  });

  // --- The Master Automation Loop (Runs Every Second) ---
  setInterval(() => {
    // Add passive income
    currentFunds += incomePerSecond;

    // Handle Challenge (Leak)
    if (isLeaking) {
      currentFunds -= leakPenalty;
      if (currentFunds < 0) currentFunds = 0; // Don't let funds go negative
    } else if (!hasWon && currentFunds > 20) {
      // 10% chance to spring a leak each second if they have over $20
      if (Math.random() < 0.10) {
        isLeaking = true;
        leakAlertBtn.classList.remove("d-none"); // Show alert
      }
    }

    updateScreenDisplays();
  }, 1000);

  // Initialize
  updateScreenDisplays();
});