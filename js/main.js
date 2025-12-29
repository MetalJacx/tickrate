import { GAME_TICK_MS, AUTO_SAVE_EVERY_MS, MAX_OFFLINE_SECONDS } from "./defs.js";
import { state, loadGame, saveGame, clearSave } from "./state.js";
import { addLog } from "./util.js";
import { createHero, spawnEnemy, gameTick } from "./combat.js";
import { initUI, renderAll } from "./ui.js";

function simulateOfflineProgress(seconds) {
  if (!seconds || seconds <= 0) return;
  const capped = Math.min(seconds, MAX_OFFLINE_SECONDS);
  for (let i = 0; i < capped; i++) {
    gameTick();
  }
  addLog(`Offline progress: simulated ${capped} seconds.`);
}

function recruitSelected() {
  const select = document.getElementById("recruitSelect");
  const clsKey = select.value;

  if (state.party.length >= state.partySlotsUnlocked) {
    addLog("You don't have any open party slots.");
    renderAll();
    return;
  }

  // Find cost by reading option’s class def via DOM -> let UI validate button state
  // We’ll just recreate hero and check gold against class cost
  const hero = createHero(clsKey);
  if (!hero) return;

  // Cost comes from hero.classKey def
  // Simpler: pull it from the select’s data, but we kept defs in combat/ui
  // We'll compute cost by importing defs (or let ui handle button state)
  // For now, just import defs here:
}

async function start() {
  initUI({
    onRecruit: () => {
      // Recruit handler kept here for clarity:
      const select = document.getElementById("recruitSelect");
      const clsKey = select.value;

      // Lazy import to avoid circular imports
      const { CLASS_DEFS } = await import("./defs.js");
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

  const { loaded, lastSavedAt } = loadGame();

  if (!loaded || state.party.length === 0) {
    const starter = createHero("warrior");
    state.party = [starter];
    state.partyHP = starter.maxHP;
    state.partyMaxHP = starter.maxHP;
    addLog("A lone Warrior stands at the campfire, ready to grind out a living in these lands.");
  } else {
    addLog("Save loaded.");
  }

  spawnEnemy();

  if (lastSavedAt) {
    const secondsOffline = Math.floor((Date.now() - lastSavedAt) / 1000);
    simulateOfflineProgress(secondsOffline);
  }

  renderAll();

  setInterval(() => {
    gameTick();
    renderAll();
  }, GAME_TICK_MS);

  setInterval(saveGame, AUTO_SAVE_EVERY_MS);
  window.addEventListener("beforeunload", saveGame);
}

start();
