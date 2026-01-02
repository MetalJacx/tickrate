import { GAME_TICK_MS, AUTO_SAVE_EVERY_MS, MAX_OFFLINE_SECONDS} from "./defs.js";
import { state, loadGame, saveGame, clearSave, serializeState, updateCurrencyDisplay } from "./state.js";
import { addLog } from "./util.js";
import { createHero, spawnEnemy, gameTick, travelToNextZone, travelToPreviousZone, p99XpToNext } from "./combat.js";
import { getZoneDef } from "./zones/index.js";
import { initUI, renderAll, showOfflineModal } from "./ui.js";
import { CLASSES, getClassDef } from "./classes/index.js"
import { RACES, getRaceDef, DEFAULT_RACE_KEY } from "./races.js";
import { initSettings } from "./settings.js";
import { ITEMS } from "./items.js";

let tickTimer = null; // requestAnimationFrame id
let saveTimer = null;
let selectedClassKey = null;
let selectedRecruitClassKey = null;
let selectedRaceKey = DEFAULT_RACE_KEY;
let selectedRecruitRaceKey = DEFAULT_RACE_KEY;

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

function populateRaceSelect(selectEl, selectedKey = DEFAULT_RACE_KEY) {
  if (!selectEl) return;
  selectEl.innerHTML = "";
  for (const race of RACES) {
    const opt = document.createElement("option");
    opt.value = race.key;
    opt.textContent = race.name;
    selectEl.appendChild(opt);
  }
  selectEl.value = selectedKey || DEFAULT_RACE_KEY;
}

const STAT_KEYS = ["str", "con", "agi", "dex", "wis", "int", "cha", "ac"];

function computeStartingStats(cls, race) {
  const base = cls?.stats || {};
  const mods = race?.statMods || {};
  const combined = {};
  for (const key of STAT_KEYS) {
    const baseVal = base[key] || 0;
    const modVal = mods[key] || 0;
    combined[key] = baseVal + modVal;
  }
  return combined;
}

function renderStartingStatsGrid(container, stats) {
  if (!container) return;
  if (!stats) {
    container.innerHTML = "";
    return;
  }
  const order = ["str", "con", "agi", "dex", "wis", "int", "cha", "ac"];
  container.innerHTML = order
    .map(key => {
      const label = key.toUpperCase();
      const val = stats[key] ?? 0;
      return `<div class="stat-chip">${label} ${val}</div>`;
    })
    .join("");
}

function renderRaceButtons() {
  const container = document.getElementById("raceButtonContainer");
  if (!container) return;
  container.innerHTML = "";
  for (const race of RACES) {
    const btn = document.createElement("button");
    btn.className = "rail-item" + (selectedRaceKey === race.key ? " selected" : "");
    btn.textContent = race.name;
    btn.addEventListener("click", () => {
      selectedRaceKey = race.key;
      renderRaceButtons();
      renderClassDetails();
      updateClassConfirmState();
    });
    container.appendChild(btn);
  }
}

function simulateOfflineProgress(seconds) {
  if (!seconds || seconds <= 0) return null;
  const capped = Math.min(seconds, MAX_OFFLINE_SECONDS);
  const beforeGold = state.gold;
  const beforeXP = state.totalXP;

  for (let i = 0; i < capped; i++) gameTick();

  const summary = {
    secondsSimulated: capped,
    goldGained: state.gold - beforeGold,
    xpGained: state.totalXP - beforeXP
  };
  state.offlineSummary = summary;
  addLog(`SYSTEM: Offline progress: simulated ${capped} seconds.`);
  return summary;
}

function startLoops({ lastSavedAt }) {
  if (tickTimer) return; // already running

  // Ensure player has at least their main character hero
  if (state.party.length === 0) {
    const starter = createHero(state.playerClassKey, state.characterName, state.playerRaceKey);
    state.party = [starter];
    state.partyHP = starter.maxHP;
    state.partyMaxHP = starter.maxHP;
    const cls = getClassDef(state.playerClassKey);
    const symbol = cls?.symbol || "";
    addLog(`SYSTEM: ${state.characterName} ${symbol} ${cls?.name} begins the grind.`);
  }

  // Sync activeZoneId with current numeric zone if missing
  const zoneDef = getZoneDef(state.zone);
  if (zoneDef && !state.activeZoneId) {
    state.activeZoneId = zoneDef.id;
  }

  // Only spawn enemy if no party members are dead
  const anyDead = state.party.some(h => h.isDead);
  if (!anyDead) {
    spawnEnemy();
  } else {
    state.waitingToRespawn = true;
    addLog("Party members are recovering. Combat will resume after revival.", "normal");
  }

  let offlineSummary = null;
  if (lastSavedAt) {
    const secondsOffline = Math.floor((Date.now() - lastSavedAt) / 1000);
    offlineSummary = simulateOfflineProgress(secondsOffline);
  }

  renderAll();

  if (offlineSummary && offlineSummary.secondsSimulated > 0) {
    showOfflineModal(offlineSummary);
    state.offlineSummary = null;
  }

  // Delta-based fixed-step loop using requestAnimationFrame
  let lastTime = performance.now();
  function loop(now) {
    const deltaMs = now - lastTime;
    let ticks = Math.floor(deltaMs / GAME_TICK_MS);

    // Allow background catch-up up to the offline cap (3 hours)
    const MAX_CATCH_UP_TICKS = Math.floor((MAX_OFFLINE_SECONDS * 1000) / GAME_TICK_MS);
    if (ticks > MAX_CATCH_UP_TICKS) {
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
    btn.className = "rail-item" + (selectedClassKey === cls.key ? " selected" : "");
    btn.textContent = cls.name;
    btn.addEventListener("click", () => {
      selectedClassKey = cls.key;
      setClassError("");
      renderClassCards();
      renderRaceButtons();
      renderClassDetails();
      updateClassConfirmState();
    });

    buttonContainer.appendChild(btn);
  }
}

function renderClassDetails() {
  const detailContainer = document.getElementById("classDetailContainer");
  const promptContainer = document.getElementById("classSelectPrompt");
  const classNameEl = document.getElementById("selectedClassName");
  const topLineEl = document.getElementById("classTopLine");
  const raceSummaryEl = document.getElementById("raceSummary");
  const skillsContainer = document.getElementById("classSkills");
  const startingGrid = document.getElementById("startingStatsGrid");

  if (!selectedClassKey || !selectedRaceKey) {
    if (detailContainer) detailContainer.style.display = "none";
    if (promptContainer) promptContainer.style.display = "flex";
    if (skillsContainer) skillsContainer.innerHTML = "";
    if (startingGrid) startingGrid.innerHTML = "";
    return;
  }

  const cls = getClassDef(selectedClassKey);
  const race = getRaceDef(selectedRaceKey);
  if (!cls || !race) return;

  if (detailContainer) detailContainer.style.display = "flex";
  if (promptContainer) promptContainer.style.display = "none";

  if (classNameEl) classNameEl.textContent = cls.name;
  if (topLineEl) {
    topLineEl.textContent = `HP ${cls.baseHP}   DMG ${cls.baseDPS}   Heal ${cls.baseHealing}   Role ${cls.role}   Cost ${cls.cost}g`;
  }
  if (raceSummaryEl) {
    raceSummaryEl.textContent = `Race: ${race.name} (${formatRaceMods(race)})`;
  }

  const combinedStats = computeStartingStats(cls, race);
  renderStartingStatsGrid(startingGrid, combinedStats);

  if (skillsContainer) {
    skillsContainer.innerHTML = "";
    for (const sk of cls.skills) {
      const card = document.createElement("div");
      card.className = "skill-card";
      const typeLabel = sk.type === "damage" ? "DMG" : "HEAL";
      const dmgType = sk.damageType ? ` (${sk.damageType})` : "";
      const amountLabel = sk.amount != null ? `+${sk.amount}` : (sk.minDamage != null ? `${sk.minDamage}-${sk.maxDamage}` : "");
      card.innerHTML = `
        <div class="skill-name">${sk.name} (Lv${sk.level})</div>
        <div class="skill-meta">${typeLabel}${dmgType} ${amountLabel} | CD ${sk.cooldownSeconds}s</div>
      `;
      skillsContainer.appendChild(card);
    }
  }
}

function formatRaceMods(race) {
  const mods = race?.statMods || {};
  const order = ["str", "con", "dex", "agi", "wis", "int", "cha"];
  return order
    .map(stat => {
      const val = mods[stat] || 0;
      const sign = val > 0 ? "+" : "";
      return `${stat.toUpperCase()} ${sign}${val}`;
    })
    .join(", ");
}

function updateStartButtonState() {
  const account = document.getElementById("accountNameInput").value.trim();
  const btn = document.getElementById("createCharacterBtn");
  btn.disabled = !account;
}

function updateClassConfirmState() {
  const nameVal = document.getElementById("classCharacterNameInput")?.value.trim();
  const btn = document.getElementById("classConfirmBtn");
  if (!btn) return;
  btn.disabled = !(selectedClassKey && selectedRaceKey && nameVal);
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
  selectedRaceKey = state.playerRaceKey || DEFAULT_RACE_KEY;
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

  charNameInput.addEventListener("input", updateClassConfirmState);

  confirmBtnFinal.addEventListener("click", () => {
    if (!selectedClassKey) return setClassError("Please select a class to continue.");
    if (!selectedRaceKey) return setClassError("Please select a race.");
    
    const charName = document.getElementById("classCharacterNameInput").value.trim();
    if (!charName) return setClassError("Please enter a character name.");

    state.playerClassKey = selectedClassKey;
    state.characterName = charName;
    state.playerRaceKey = selectedRaceKey || DEFAULT_RACE_KEY;
    state.party = [];
    state.partyHP = 0;
    state.partyMaxHP = 0;

    setClassError("");
    saveGame();
    onConfirmed();
  });

  updateClassConfirmState();
  renderRaceButtons();
  renderClassCards();
  renderClassDetails();
}

function wireRecruitModal() {
  const modal = document.getElementById("recruitModal");
  const closeBtn = document.getElementById("recruitCloseBtn");
  const confirmBtn = document.getElementById("recruitConfirmBtn");
  const buttonContainer = document.getElementById("recruitClassButtonContainer");
  const nameInput = document.getElementById("recruitHeroNameInput");
  const raceSelect = document.getElementById("recruitRaceSelect");
  const raceSummary = document.getElementById("recruitRaceSummary");
  
  function openRecruitModal() {
    selectedRecruitClassKey = null;
    selectedRecruitRaceKey = state.playerRaceKey || DEFAULT_RACE_KEY;
    nameInput.value = "";
    modal.style.display = "block";
    populateRaceSelect(raceSelect, selectedRecruitRaceKey);
    if (raceSummary) {
      const race = getRaceDef(selectedRecruitRaceKey);
      raceSummary.textContent = `${race?.name || "Race"}: ${formatRaceMods(race)}`;
    }
    renderRecruitClassCards();
    renderRecruitDetails();
  }
  
  function closeRecruitModal() {
    modal.style.display = "none";
    selectedRecruitClassKey = null;
    nameInput.value = "";
  }
  
  function renderRecruitClassCards() {
    buttonContainer.innerHTML = "";
    
    for (const cls of CLASSES) {
      const btn = document.createElement("button");
      btn.textContent = cls.name;
      btn.style.cssText = `
        padding: 10px;
        border-radius: 6px;
        border: 1px solid #555;
        background: #222;
        color: #eee;
        cursor: pointer;
        text-align: left;
        font-size: 13px;
        transition: all 0.2s;
      `;
      
      btn.addEventListener("mouseenter", () => {
        btn.style.background = "#333";
        btn.style.borderColor = "#777";
      });
      
      btn.addEventListener("mouseleave", () => {
        if (selectedRecruitClassKey !== cls.key) {
          btn.style.background = "#222";
          btn.style.borderColor = "#555";
        }
      });
      
      btn.addEventListener("click", () => {
        selectedRecruitClassKey = cls.key;
        renderRecruitClassCards();
        renderRecruitDetails();
      });
      
      if (selectedRecruitClassKey === cls.key) {
        btn.style.background = "#444";
        btn.style.borderColor = "#888";
      }
      
      buttonContainer.appendChild(btn);
    }
  }
  
  function renderRecruitDetails() {
    const detailContainer = document.getElementById("recruitDetailContainer");
    const promptContainer = document.getElementById("recruitSelectPrompt");
    const errorDiv = document.getElementById("recruitError");
    const recruitStatsGrid = document.getElementById("recruitStartingStatsGrid");
    
    errorDiv.style.display = "none";
    
    if (!selectedRecruitClassKey) {
      detailContainer.style.display = "none";
      promptContainer.style.display = "flex";
      if (recruitStatsGrid) recruitStatsGrid.innerHTML = "";
      confirmBtn.disabled = true;
      return;
    }
    
    const cls = getClassDef(selectedRecruitClassKey);
    if (!cls) return;
    
    detailContainer.style.display = "flex";
    promptContainer.style.display = "none";
    
    document.getElementById("recruitSelectedClassName").textContent = cls.name;
    if (raceSummary) {
      const race = getRaceDef(selectedRecruitRaceKey);
      raceSummary.textContent = `${race?.name || "Race"}: ${formatRaceMods(race)}`;
    }
    
    const statsHtml = `
      HP: ${cls.baseHP}<br>
      Damage: ${cls.baseDPS}<br>
      Healing: ${cls.baseHealing}<br>
      Cost: ${cls.cost}g<br>
      Role: ${cls.role}
    `;
    document.getElementById("recruitClassStats").innerHTML = statsHtml;
    
    const skillsContainer = document.getElementById("recruitClassSkills");
    skillsContainer.innerHTML = "";
    for (const sk of cls.skills) {
      const skillDiv = document.createElement("div");
      let typeLabel = sk.type === "damage" ? "DMG" : "HEAL";
      if (sk.damageType) {
        typeLabel += ` (${sk.damageType})`;
      }
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

    // Starting stats preview
    if (recruitStatsGrid) {
      const race = getRaceDef(selectedRecruitRaceKey);
      const combined = computeStartingStats(cls, race);
      renderStartingStatsGrid(recruitStatsGrid, combined);
    }
    
    // Update confirm button
    const canAfford = state.currencyCopper >= cls.cost;
    const hasSpace = state.party.length < state.partySlotsUnlocked;
    
    confirmBtn.textContent = `Recruit for ${cls.cost} gold`;
    
    // Enable button only if has space, can afford, AND has a name entered
    const hasName = nameInput.value.trim().length > 0;
    confirmBtn.disabled = !canAfford || !hasSpace || !hasName || !selectedRecruitRaceKey;
    
    if (!hasSpace) {
      errorDiv.textContent = "No party slots available";
      errorDiv.style.display = "block";
    } else if (!canAfford) {
      errorDiv.textContent = `Need ${cls.cost - state.currencyCopper} more copper`;
      errorDiv.style.display = "block";
    } else if (!hasName) {
      errorDiv.textContent = "Enter a hero name";
      errorDiv.style.display = "block";
    }
  }
  
  // Update button state when name input changes
  nameInput.addEventListener("input", () => {
    if (selectedRecruitClassKey) {
      renderRecruitDetails();
    }
  });

  if (raceSelect) {
    raceSelect.addEventListener("change", (e) => {
      selectedRecruitRaceKey = e.target.value || DEFAULT_RACE_KEY;
      renderRecruitDetails();
    });
  }
  
  closeBtn.addEventListener("click", closeRecruitModal);
  
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeRecruitModal();
    }
  });
  
  confirmBtn.addEventListener("click", () => {
    if (!selectedRecruitClassKey) return;
    
    const cls = getClassDef(selectedRecruitClassKey);
    if (!cls) return;
    if (!selectedRecruitRaceKey) {
      showToast("Please select a race!", true);
      return;
    }
    
    const heroName = nameInput.value.trim();
    if (!heroName) {
      showToast("Please enter a hero name!", true);
      return;
    }
    
    if (state.party.length >= state.partySlotsUnlocked) {
      showToast("No party slots available!", true);
      return;
    }
    
    if (state.currencyCopper < cls.cost) {
      showToast("Not enough currency!", true);
      return;
    }
    
    state.currencyCopper -= cls.cost;
    updateCurrencyDisplay();
    const hero = createHero(selectedRecruitClassKey, heroName, selectedRecruitRaceKey);
    
    // Add test items to shared inventory for UI testing
    if (state.party.length === 0) {
      state.sharedInventory[0] = { id: "health_potion", quantity: 5 };
      state.sharedInventory[1] = { id: "mana_potion", quantity: 3 };
      state.sharedInventory[2] = { id: "copper_ore", quantity: 12 };
      state.sharedInventory[3] = { id: "iron_sword", quantity: 1 };
      state.sharedInventory[10] = { id: "wooden_shield", quantity: 1 };
    }
    
    // Give warriors a starting stick in shared inventory
    if (hero.classKey === "warrior") {
      state.sharedInventory[20] = { id: "stick", quantity: 1 };
    }
    
    state.party.push(hero);
    state.partyHP += hero.maxHP;
    state.partyMaxHP += hero.maxHP;
    addLog(`${heroName} the ${cls.name} joins your party at the campfire.`);
    showToast(`${heroName} recruited!`);
    saveGame();
    renderAll();
    closeRecruitModal();
  });
  
  return { openRecruitModal };
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

  // Wire recruitment modal
  const { openRecruitModal } = wireRecruitModal();

  // Init UI handlers for the game screen buttons (travel etc.)
  initUI({
    onOpenRecruitModal: openRecruitModal,
    onReset: () => {
      if (!confirm("Reset all progress?")) return;
      clearSave();
      // Reset state object
      state.accountName = "";
      state.characterName = "";
      state.playerClassKey = "";
      state.playerRaceKey = DEFAULT_RACE_KEY;
      state.gold = 0;
      state.totalXP = 0;
      state.accountLevel = 1;
      state.accountLevelXP = 0;
      state.accountLevelUpCost = p99XpToNext(1); // Use P99 curve
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
      selectedRaceKey = DEFAULT_RACE_KEY;
      selectedRecruitRaceKey = DEFAULT_RACE_KEY;
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

  // Initialize account XP cost if missing (migration to P99 curve)
  if (!state.accountLevelUpCost) {
    state.accountLevelUpCost = p99XpToNext(state.accountLevel || 1);
  }

  // Debug logging
  console.log("Game Load State:", {
    loaded,
    accountName: state.accountName,
    characterName: state.characterName,
    playerClassKey: state.playerClassKey
  });

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
      updateClassConfirmState();
      renderRaceButtons();
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
