import { GAME_TICK_MS, AUTO_SAVE_EVERY_MS, MAX_OFFLINE_SECONDS, CLASS_DEFS } from "./defs.js";
import { state, loadGame, saveGame, clearSave } from "./state.js";
import { addLog } from "./util.js";
import { createHero, spawnEnemy, gameTick } from "./combat.js";
import { initUI, renderAll } from "./ui.js";

let tickTimer = null;
let saveTimer = null;

function showStartScreen() {
  document.getElementById("startScreen").style.display = "flex";
  document.getElementById("gameScreen").style.display = "none";
}

function showGameScreen() {
  document.getElementById("startScreen").style.display = "none";
  document.getElementById("gameScreen").style.display = "block";
}

function setStartError(msg) {
  const el = document.getElementById("startError");
  el.textContent = msg;
  el.style.display = msg ? "block" : "none";
}

function populateClassSelect() {
  const sel = document.getElementById("startingClassSelect");
  sel.innerHTML = "";
  for (const cls of CLASS_DEFS) {
    const opt = document.createElement("option");
    opt.value = cls.key;
    opt.textContent = `${cls.name} (${cls.role})`;
    sel.appendChild(opt);
  }
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

function wireStartScreen(onCreated) {
  populateClassSelect();

  document.getElementById("createCharacterBtn").addEventListener("click", () => {
    const account = document.getElementById("accountNameInput").value.trim();
    const charName = document.getElementById("characterNameInput").value.trim();
    const classKey = document.getElementById("startingClassSelect").value;

    if (!account) return setStartError("Please enter an account name.");
    if (!charName) return setStartError("Please enter a character name.");
    if (!classKey) return setStartError("Please choose a class.");

    setStartError("");

    state.accountName = account;
    state.characterName = charName;
    state.playerClassKey = classKey;

    // Fresh party for a new character
    state.party = [];
    state.partyHP = 0;
    state.partyMaxHP = 0;

    saveGame();
    onCreated();
  });
}

function start() {
  // Init UI handlers for the game screen buttons (recruit/travel etc.)
  initUI({
    onRecruit: () => {
      const select = document.getElementById("recruitSelect");
      const clsKey = select.value;
      const cls = CLASS_DEFS.find(c => c.key === clsKey);
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

  // Wire start screen
  wireStartScreen(() => {
    showGameScreen();
    startLoops({ lastSavedAt: null });
  });

  // If we already have a created character, skip start screen
  const hasCharacter = !!state.accountName && !!state.characterName && !!state.playerClassKey;

  if (loaded && hasCharacter) {
    showGameScreen();
    startLoops({ lastSavedAt });
  } else {
    showStartScreen();
  }
}

start();
