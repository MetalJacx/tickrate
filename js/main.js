import { GAME_TICK_MS, AUTO_SAVE_EVERY_MS, MAX_OFFLINE_SECONDS} from "./defs.js";
import { state, loadGame, saveGame, clearSave } from "./state.js";
import { addLog } from "./util.js";
import { createHero, spawnEnemy, gameTick } from "./combat.js";
import { initUI, renderAll } from "./ui.js";
import { CLASSES, getClassDef } from "./classes/index.js"

let tickTimer = null;
let saveTimer = null;
let selectedClassKey = null;

function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("gameScreen").style.display = "none";
  document.getElementById("classScreen").style.display = "none";
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

  tickTimer = setInterval(() => {
    gameTick();
    renderAll();
  }, GAME_TICK_MS);

  saveTimer = setInterval(saveGame, AUTO_SAVE_EVERY_MS);
  window.addEventListener("beforeunload", saveGame);
}

function renderClassCards() {
  const container = document.getElementById("classCardContainer");
  container.innerHTML = "";

  for (const cls of CLASSES) {
    const card = document.createElement("div");
    card.className = "class-card" + (selectedClassKey === cls.key ? " selected" : "");

    const skillsHtml = cls.skills.map(sk => {
      const typeLabel = sk.type === "damage" ? "Damage" : "Heal";
      return `<div class="class-skill">
        <div><strong>${sk.name}</strong> (Lv ${sk.level})</div>
        <div>${typeLabel} +${sk.amount}, cooldown ${sk.cooldownSeconds}s</div>
      </div>`;
    }).join("");

    card.innerHTML = `
      <div class="class-header">
        <div>${cls.name}</div>
        <div class="class-role">${cls.role}</div>
      </div>
      <div class="class-base">HP ${cls.baseHP} | DPS ${cls.baseDPS} | Healing ${cls.baseHealing}</div>
      <div class="class-cost">Cost: ${cls.cost} gold</div>
      <div class="class-skills">${skillsHtml}</div>
    `;

    card.addEventListener("click", () => {
      selectedClassKey = cls.key;
      setClassError("");
      renderClassCards();
      document.getElementById("classConfirmBtn").disabled = !selectedClassKey;
    });

    container.appendChild(card);
  }
}

function updateStartButtonState() {
  const account = document.getElementById("accountNameInput").value.trim();
  const charName = document.getElementById("characterNameInput").value.trim();
  const btn = document.getElementById("createCharacterBtn");
  btn.disabled = !account || !charName;
}

function wireStartScreen(onContinue) {
  const accountInput = document.getElementById("accountNameInput");
  const charInput = document.getElementById("characterNameInput");
  const btn = document.getElementById("createCharacterBtn");

  // Update button state on input change
  accountInput.addEventListener("input", updateStartButtonState);
  charInput.addEventListener("input", updateStartButtonState);

  // Initialize button state
  updateStartButtonState();

  btn.addEventListener("click", () => {
    const account = accountInput.value.trim();
    const charName = charInput.value.trim();

    if (!account) return setStartError("Please enter an account name.");
    if (!charName) return setStartError("Please enter a character name.");

    setStartError("");

    state.accountName = account;
    state.characterName = charName;
    // reset selection and proceed to class choice
    selectedClassKey = null;
    console.log("Calling onContinue callback");
    onContinue();
  });
}

function wireClassScreen(onConfirmed) {
  document.getElementById("classBackBtn").addEventListener("click", () => {
    showStartScreen();
  });

  document.getElementById("classConfirmBtn").addEventListener("click", () => {
    if (!selectedClassKey) return setClassError("Please select a class to continue.");

    state.playerClassKey = selectedClassKey;
    state.party = [];
    state.partyHP = 0;
    state.partyMaxHP = 0;

    setClassError("");
    saveGame();
    onConfirmed();
  });
}

function start() {
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
      document.getElementById("classConfirmBtn").disabled = true;
      renderClassCards();
    });

    wireClassScreen(() => {
      showGameScreen();
      startLoops({ lastSavedAt: null });
    });

    showStartScreen();
  }
}

start();
