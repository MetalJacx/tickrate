import { GAME_TICK_MS, AUTO_SAVE_EVERY_MS, MAX_OFFLINE_SECONDS} from "./defs.js";
import { state, loadGame, saveGame, clearSave, serializeState } from "./state.js";
import { addLog } from "./util.js";
import { createHero, spawnEnemy, gameTick, travelToNextZone, travelToPreviousZone } from "./combat.js";
import { initUI, renderAll } from "./ui.js";
import { CLASSES, getClassDef } from "./classes/index.js"
import { initSettings } from "./settings.js";

let tickTimer = null; // requestAnimationFrame id
let saveTimer = null;
let selectedClassKey = null;

function showToast(message, isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.className = isError ? "error" : "";
  toast.style.display = "block";
  toast.style.animation = "slideIn 0.3s ease-out";
  
  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => {
      toast.style.display = "none";
    }, 300);
  }, 3000);
}

function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("classScreen").style.display = "none";
  setStartError("");
}

function showGameScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
  document.getElementById("classScreen").style.display = "none";
}

function showClassScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("classScreen").style.display = "flex";
}

function setStartError(msg) {
  const el = document.getElementById("startError");
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

function setClassError(msg) {
  const el = document.getElementById("classError");
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

function simulateOfflineProgress(seconds) {
  if (!seconds || seconds <= 0) return;
  const capped = Math.min(seconds, MAX_OFFLINE_SECONDS);
  for (let i = 0; i < capped; i++) gameTick();
  addLog(`Offline progress: simulated ${capped} seconds.`);
}

function startLoops({ lastSavedAt }) {
  if (tickTimer) return; // already running

  // Ensure player has at least their main character hero
  if (state.party.length === 0) {
    const starter = createHero(state.playerClassKey);
    state.party = [starter];
    state.partyHP = starter.maxHP;
    state.partyMaxHP = starter.maxHP;
    addLog(`${state.characterName} the ${starter.name} begins the grind.`);
  }

  spawnEnemy();

  if (lastSavedAt) {
    const secondsOffline = Math.floor((Date.now() - lastSavedAt) / 1000);
    simulateOfflineProgress(secondsOffline);
  }

  renderAll();

  // Delta-based fixed-step loop using requestAnimationFrame
  let lastTime = performance.now();
  function loop(now) {
    const deltaMs = now - lastTime;
    let ticks = Math.floor(deltaMs / GAME_TICK_MS);
    
    // Cap catch-up to prevent extreme spikes after long pauses
    const MAX_CATCH_UP_TICKS = 60;
    if (ticks > MAX_CATCH_UP_TICKS) {
      console.warn(`Capping catch-up from ${ticks} to ${MAX_CATCH_UP_TICKS} ticks`);
      ticks = MAX_CATCH_UP_TICKS;
    }
    
    if (ticks > 0) {
      // Advance lastTime by the ticks processed to avoid drift
      lastTime += ticks * GAME_TICK_MS;
      for (let i = 0; i < ticks; i++) {
        gameTick();
      }
      renderAll();
    }
    tickTimer = requestAnimationFrame(loop);
  }
  tickTimer = requestAnimationFrame(loop);

  saveTimer = setInterval(saveGame, AUTO_SAVE_EVERY_MS);
  window.addEventListener("beforeunload", saveGame);
}

function renderClassCards() {
  const buttonContainer = document.getElementById("classButtonContainer");
  buttonContainer.innerHTML = "";

  for (const cls of CLASSES) {
    const btn = document.createElement("button");
    btn.textContent = cls.name;
    btn.style.cssText = `
      padding: 12px;
      border-radius: 6px;
      border: 2px solid ${selectedClassKey === cls.key ? "#4a9eff" : "#555"};
      background: ${selectedClassKey === cls.key ? "#1a1a2e" : "#222"};
      color: ${selectedClassKey === cls.key ? "#4a9eff" : "#eee"};
      cursor: pointer;
      font-size: 14px;
      font-weight: ${selectedClassKey === cls.key ? "bold" : "normal"};
      transition: all 0.2s;
    `;
    btn.addEventListener("mouseover", function () {
      if (selectedClassKey !== cls.key) {
        this.style.background = "#333";
        this.style.borderColor = "#666";
      }
    });
    btn.addEventListener("mouseout", function () {
      if (selectedClassKey !== cls.key) {
        this.style.background = "#222";
        this.style.borderColor = "#555";
      }
    });
    btn.addEventListener("click", () => {
      selectedClassKey = cls.key;
      setClassError("");
      renderClassCards();
      renderClassDetails();
      document.getElementById("classConfirmBtn").disabled = !selectedClassKey;
    });

    buttonContainer.appendChild(btn);
  }
}

function renderClassDetails() {
  const detailContainer = document.getElementById("classDetailContainer");
  const promptContainer = document.getElementById("classSelectPrompt");

  if (!selectedClassKey) {
    detailContainer.style.display = "none";
    promptContainer.style.display = "flex";
    return;
  }

  const cls = getClassDef(selectedClassKey);
  if (!cls) return;

  detailContainer.style.display = "flex";
  promptContainer.style.display = "none";

  document.getElementById("selectedClassName").textContent = cls.name;

  const statsHtml = `
    HP: ${cls.baseHP}<br>
    Damage: ${cls.baseDPS}<br>
    Healing: ${cls.baseHealing}<br>
    Cost: ${cls.cost}g<br>
    Role: ${cls.role}
  `;
  document.getElementById("classStats").innerHTML = statsHtml;

  const skillsContainer = document.getElementById("classSkills");
  skillsContainer.innerHTML = "";
  for (const sk of cls.skills) {
    const skillDiv = document.createElement("div");
    const typeLabel = sk.type === "damage" ? "DMG" : "HEAL";
    skillDiv.style.cssText = `
      background: #111;
      padding: 8px;
      border-radius: 4px;
      border: 1px solid #333;
      font-size: 11px;
      line-height: 1.4;
    `;
    skillDiv.innerHTML = `
      <div style="font-weight:bold;margin-bottom:2px;">${sk.name} (Lv${sk.level})</div>
      <div style="color:#aaa;">${typeLabel} +${sk.amount} | CD ${sk.cooldownSeconds}s</div>
    `;
    skillsContainer.appendChild(skillDiv);
  }
}

function updateStartButtonState() {
  const account = document.getElementById("accountNameInput").value.trim();
  const btn = document.getElementById("createCharacterBtn");
  btn.disabled = !account;
}

function wireStartScreen(onContinue) {
  // Clear and re-initialize inputs
  const accountInput = document.getElementById("accountNameInput");
  const btn = document.getElementById("createCharacterBtn");

  // Clear input
  accountInput.value = "";
  
  // Remove old listeners by cloning elements
  const newAccountInput = accountInput.cloneNode(true);
  const newBtn = btn.cloneNode(true);
  
  accountInput.parentNode.replaceChild(newAccountInput, accountInput);
  btn.parentNode.replaceChild(newBtn, btn);

  const accountInputFinal = document.getElementById("accountNameInput");
  const btnFinal = document.getElementById("createCharacterBtn");

  // Update button state on input change
  accountInputFinal.addEventListener("input", updateStartButtonState);
  // Allow pressing Enter to proceed when valid
  accountInputFinal.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const account = accountInputFinal.value.trim();
      if (!account) {
        setStartError("Please enter an account name.");
        return;
      }
      setStartError("");
      state.accountName = account;
      selectedClassKey = null;
      onContinue();
    }
  });

  // Initialize button state
  updateStartButtonState();

  btnFinal.addEventListener("click", () => {
    const account = accountInputFinal.value.trim();

    if (!account) return setStartError("Please enter an account name.");

    setStartError("");

    state.accountName = account;
    // reset selection and proceed to class choice
    selectedClassKey = null;
    console.log("Calling onContinue callback");
    onContinue();
  });
}

function wireClassScreen(onConfirmed) {
  // Clear class selection and character name input
  selectedClassKey = null;
  const charNameInput = document.getElementById("classCharacterNameInput");
  charNameInput.value = "";

  // Remove old listeners by cloning elements
  const backBtn = document.getElementById("classBackBtn");
  const confirmBtn = document.getElementById("classConfirmBtn");
  const newBackBtn = backBtn.cloneNode(true);
  const newConfirmBtn = confirmBtn.cloneNode(true);
  
  backBtn.parentNode.replaceChild(newBackBtn, backBtn);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

  const backBtnFinal = document.getElementById("classBackBtn");
  const confirmBtnFinal = document.getElementById("classConfirmBtn");

  backBtnFinal.addEventListener("click", () => {
    selectedClassKey = null;
    showStartScreen();
  });

  confirmBtnFinal.addEventListener("click", () => {
    if (!selectedClassKey) return setClassError("Please select a class to continue.");
    
    const charName = document.getElementById("classCharacterNameInput").value.trim();
    if (!charName) return setClassError("Please enter a character name.");

    state.playerClassKey = selectedClassKey;
    state.characterName = charName;
    state.party = [];
    state.partyHP = 0;
    state.partyMaxHP = 0;

    setClassError("");
    saveGame();
    onConfirmed();
  });
}

function start() {
  // Wire Export/Import buttons via Settings module
  initSettings({
    onShowSettings: () => {
      // Pause game loop when settings open (optional)
    },
    onHideSettings: () => {
      // Resume game loop when settings close (optional)
    }
  });

  // Init UI handlers for the game screen buttons (recruit/travel etc.)
  initUI({
    onRecruit: () => {
      const select = document.getElementById("recruitSelect");
      const clsKey = select.value;
      const cls = getClassDef(clsKey);
      if (!cls) return;

      if (state.party.length >= state.partySlotsUnlocked) {
        addLog("You don't have any open party slots.");
        renderAll();
        return;
      }
      if (state.gold < cls.cost) {
        addLog("You don't have enough gold to recruit that class.");
        renderAll();
        return;
      }

      state.gold -= cls.cost;
      const hero = createHero(clsKey);
      state.party.push(hero);
      state.partyHP += hero.maxHP;
      state.partyMaxHP += hero.maxHP;
      addLog(`A ${cls.name} joins your party at the campfire.`);
      renderAll();
    },
    onReset: () => {
      if (!confirm("Reset all progress?")) return;
      clearSave();
      // Reset state object
      state.accountName = "";
      state.characterName = "";
      state.playerClassKey = "";
      state.gold = 0;
      state.totalXP = 0;
      state.accountLevel = 1;
      state.accountLevelXP = 0;
      state.accountLevelUpCost = 100;
      state.zone = 1;
      state.killsThisZone = 0;
      state.killsForNextZone = 10;
      state.partySlotsUnlocked = 1;
      state.party = [];
      state.partyMaxHP = 0;
      state.partyHP = 0;
      state.currentEnemy = null;
      state.log = [];
      selectedClassKey = null;
      // Clear timers
      if (tickTimer) {
        try { cancelAnimationFrame(tickTimer); } catch {}
        try { clearInterval(tickTimer); } catch {}
      }
      if (saveTimer) clearInterval(saveTimer);
      tickTimer = null;
      saveTimer = null;
      location.reload();
    }
  });

  // Load saved data (if any)
  const { loaded, lastSavedAt } = loadGame();

  // If we already have a created character, skip start screen
  const hasCharacter = !!state.accountName && !!state.characterName && !!state.playerClassKey;

  if (loaded && hasCharacter) {
    showGameScreen();
    startLoops({ lastSavedAt });
  } else {
    // New player flow: start -> class select -> game
    wireStartScreen(() => {
      showClassScreen();
      selectedClassKey = null;
      document.getElementById("classConfirmBtn").disabled = true;
      renderClassCards();
      renderClassDetails();
    });

    wireClassScreen(() => {
      showGameScreen();
      startLoops({ lastSavedAt: null });
    });

    showStartScreen();
  }
}

start();
