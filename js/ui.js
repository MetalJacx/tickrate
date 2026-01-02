import { state } from "./state.js";
import { heroLevelUpCost, applyHeroLevelUp, canTravelForward, travelToNextZone, travelToPreviousZone, recalcPartyTotals, killsRequiredForZone, spawnEnemy, doubleAttackCap, doubleAttackProcChance, refreshHeroDerived } from "./combat.js";
import { spawnEnemyToList } from "./combat.js";
import { CLASSES, getClassDef } from "./classes/index.js";
import { getZoneDef, listZones, ensureZoneDiscovery, getActiveSubArea } from "./zones/index.js";
import { addLog } from "./util.js";
import { formatPGSC, saveGame, updateCurrencyDisplay } from "./state.js";
import { MAX_PARTY_SIZE, ACCOUNT_SLOT_UNLOCKS } from "./defs.js";
import { getItemDef } from "./items.js";
import { computeSellValue } from "./combatMath.js";

export function initUI({ onRecruit, onReset, onOpenRecruitModal }) {
  const travelBtn = document.getElementById("travelBtn");
  if (travelBtn) {
    travelBtn.addEventListener("click", () => {
      travelToNextZone();
      renderAll();
    });
  }
  const travelBackBtn = document.getElementById("travelBackBtn");
  if (travelBackBtn) {
    travelBackBtn.addEventListener("click", () => {
      travelToPreviousZone();
      renderAll();
    });
  }

  // Store the callback for opening recruit modal
  if (onOpenRecruitModal) {
    window.__openRecruitModal = onOpenRecruitModal;
  }

  if (onReset && document.getElementById("resetBtn")) {
    document.getElementById("resetBtn").addEventListener("click", onReset);
  }

  // Test button to spawn another mob
  const spawnAddBtn = document.getElementById("spawnAddBtn");
  if (spawnAddBtn) {
    spawnAddBtn.addEventListener("click", () => {
      spawnEnemyToList();
      renderAll();
    });
  }

  // Character modal close buttons and backdrop clicks
  const statsModal = document.getElementById("statsModal");
  const statsModalCloseBtn = document.getElementById("statsModalCloseBtn");
  if (statsModalCloseBtn) {
    statsModalCloseBtn.addEventListener("click", () => {
      statsModal.style.display = "none";
    });
  }
  if (statsModal) {
    statsModal.addEventListener("click", (e) => {
      if (e.target === statsModal) {
        statsModal.style.display = "none";
      }
    });
  }

  const inventoryModal = document.getElementById("inventoryModal");
  const inventoryModalCloseBtn = document.getElementById("inventoryModalCloseBtn");
  if (inventoryModalCloseBtn) {
    inventoryModalCloseBtn.addEventListener("click", () => {
      inventoryModal.style.display = "none";
    });
  }
  if (inventoryModal) {
    inventoryModal.addEventListener("click", (e) => {
      if (e.target === inventoryModal) {
        inventoryModal.style.display = "none";
      }
    });
  }

  const abilitiesModal = document.getElementById("abilitiesModal");
  const abilitiesModalCloseBtn = document.getElementById("abilitiesModalCloseBtn");
  if (abilitiesModalCloseBtn) {
    abilitiesModalCloseBtn.addEventListener("click", () => {
      abilitiesModal.style.display = "none";
    });
  }
  if (abilitiesModal) {
    abilitiesModal.addEventListener("click", (e) => {
      if (e.target === abilitiesModal) {
        abilitiesModal.style.display = "none";
      }
    });
  }

  // Camp thresholds modal
  const campThresholdsModal = document.getElementById("campThresholdsModal");
  if (campThresholdsModal) {
    campThresholdsModal.addEventListener("click", (e) => {
      if (e.target === campThresholdsModal) {
        campThresholdsModal.style.display = "none";
      }
    });
  }

  // Offline modal close button
  const offlineModal = document.getElementById("offlineModal");
  const offlineCloseBtn = document.getElementById("offlineModalCloseBtn");
  if (offlineCloseBtn) {
    offlineCloseBtn.addEventListener("click", () => {
      if (offlineModal) offlineModal.style.display = "none";
      state.offlineSummary = null;
    });
  }
  if (offlineModal) {
    offlineModal.addEventListener("click", (e) => {
      if (e.target === offlineModal) {
        offlineModal.style.display = "none";
        state.offlineSummary = null;
      }
    });
  }

  // Travel to area button
  const travelToAreaBtn = document.getElementById("travelToAreaBtn");
  if (travelToAreaBtn) {
    travelToAreaBtn.addEventListener("click", () => {
      const zones = listZones() || [];
      const selectedZone = zones.find(z => z.zoneNumber === selectedZoneForTravel);
      if (!selectedZone) return;

      // Check if zone changed
      if (selectedZoneForTravel !== state.zone) {
        state.zone = selectedZoneForTravel;
        state.activeZoneId = selectedZone.id;
        state.killsThisZone = 0;
        state.currentEnemies = [];
        state.waitingToRespawn = false;
        spawnEnemy();
      } else if (selectedSubAreaForTravel) {
        // Just switching sub-area in same zone
        state.activeZoneId = selectedZone.id;
      }
      renderAll();
    });
  }

  // Camp thresholds modal handlers
  const partyHeaderBtn = document.getElementById("partyHeaderBtn");
  if (partyHeaderBtn) {
    partyHeaderBtn.addEventListener("click", openCampThresholdsModal);
  }

  const campThresholdsCloseBtn = document.getElementById("campThresholdsCloseBtn");
  if (campThresholdsCloseBtn) {
    campThresholdsCloseBtn.addEventListener("click", closeCampThresholdsModal);
  }


  // Update threshold inputs when changed
  const campHealthInput = document.getElementById("campHealthInput");
  if (campHealthInput) {
    campHealthInput.addEventListener("input", (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = 80;
      val = Math.max(0, Math.min(100, val));
      state.campThresholds.health = val;
      e.target.value = val;
    });
  }

  const campManaInput = document.getElementById("campManaInput");
  if (campManaInput) {
    campManaInput.addEventListener("input", (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = 50;
      val = Math.max(0, Math.min(100, val));
      state.campThresholds.mana = val;
      e.target.value = val;
    });
  }

  const campEnduranceInput = document.getElementById("campEnduranceInput");
  if (campEnduranceInput) {
    campEnduranceInput.addEventListener("input", (e) => {
      let val = parseInt(e.target.value);
      if (isNaN(val)) val = 30;
      val = Math.max(0, Math.min(100, val));
      state.campThresholds.endurance = val;
      e.target.value = val;
    });
  }
}

function closeCampThresholdsModal() {
  const modal = document.getElementById("campThresholdsModal");
  if (modal) modal.style.display = "none";
}

function openCampThresholdsModal() {
  const modal = document.getElementById("campThresholdsModal");
  if (modal) {
    modal.style.display = "flex";
    // Sync input values with current state
    const healthInput = document.getElementById("campHealthInput");
    const manaInput = document.getElementById("campManaInput");
    const enduranceInput = document.getElementById("campEnduranceInput");
    if (healthInput) healthInput.value = state.campThresholds.health;
    if (manaInput) manaInput.value = state.campThresholds.mana;
    if (enduranceInput) enduranceInput.value = state.campThresholds.endurance;
  }
}
export function renderAll() {
  renderEnemy();
  renderParty();
  renderMeta();
  renderBattleFooter();
  renderZones();
}

export function updateStatsModalSkills(hero) {
  // If stats modal is visible, update just the skills section
  const modal = document.getElementById("statsModal");
  if (!modal || modal.style.display === "none") return;
  
  const statsBox = document.getElementById("characterStatsContainer");
  if (!statsBox) return;
  
  // Find and update the right column (Skills/Passives) if it exists
  const columns = statsBox.querySelectorAll("div[style*='flex: 1 1 auto']");
  if (columns.length < 2) return;
  
  const rightColumn = columns[columns.length - 1];
  if (!rightColumn) return;
  
  // Rebuild just the skills section
  rightColumn.innerHTML = "";
  
  const skillTitle = document.createElement("div");
  skillTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#fbbf24;";
  skillTitle.textContent = "Skills / Passives";
  rightColumn.appendChild(skillTitle);

  const cap = doubleAttackCap(hero.level);
  const skillVal = Math.min(hero.doubleAttackSkill || 0, cap || 0);
  const locked = hero.level < 5 || cap === 0;
  const procPct = doubleAttackProcChance(skillVal) * 100;

  if (locked) {
    rightColumn.appendChild(statLine("Double Attack", "Locked until level 5"));
  } else {
    const skillLine = document.createElement("div");
    skillLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:4px 0;font-size:12px;color:#ccc;";
    skillLine.innerHTML = `<span>Double Attack</span> <span style='color:#fff;'>${skillVal.toFixed(0)} / ${cap}</span>`;
    rightColumn.appendChild(skillLine);

    const procLine = document.createElement("div");
    procLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:2px 0 8px;font-size:11px;color:#aaa;";
    procLine.innerHTML = `<span>Proc Chance</span> <span style='color:#fbbf24;'>${procPct.toFixed(1)}%</span>`;
    rightColumn.appendChild(procLine);

    const barBg = document.createElement("div");
    barBg.style.cssText = "width:100%;height:10px;background:#252525;border-radius:5px;overflow:hidden;border:1px solid #333;margin:0;position:relative;";
    const percent = cap > 0 ? Math.min(100, (skillVal / cap) * 100) : 0;
    const nextPercent = cap > 0 && skillVal < cap ? Math.min(100, ((skillVal + 1) / cap) * 100) : 100;
    
    const barFill = document.createElement("div");
    barFill.style.cssText = `height:100%;width:${percent}%;background:linear-gradient(90deg,#fbbf24,#f59e0b);transition:width 0.2s;`;
    barBg.appendChild(barFill);
    
    rightColumn.appendChild(barBg);
  }
}

function formatDuration(seconds) {
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const parts = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(" ");
}

export function showOfflineModal(summary) {
  const modal = document.getElementById("offlineModal");
  if (!modal || !summary) return;
  const timeSpan = document.getElementById("offlineTimeSpan");
  const goldSpan = document.getElementById("offlineGoldSpan");
  const xpSpan = document.getElementById("offlineXpSpan");
  if (timeSpan) timeSpan.textContent = formatDuration(summary.secondsSimulated || 0);
  if (goldSpan) goldSpan.textContent = formatPGSC(Math.floor(summary.goldGained || 0));
  if (xpSpan) xpSpan.textContent = Math.floor(summary.xpGained || 0);
  modal.style.display = "flex";
}

export function renderLog() {
  const logEl = document.getElementById("log");
  if (!logEl) return;
  logEl.style.display = "block";
  logEl.innerHTML = "";
  for (const entry of state.log) {
    const div = document.createElement("div");
    let color = "#eee"; // default white
    
    if (typeof entry === "string") {
      // backward compatibility with old string logs: infer color by keywords
      color = inferLogColor(entry);
      div.textContent = entry;
      div.style.color = color;
    } else {
      // new object format with type
      div.textContent = entry.text;
      
      switch (entry.type) {
        case "damage_dealt":
          color = "#eee"; // white
          break;
        case "damage_taken":
          color = "#ff6b6b"; // red
          break;
        case "gold":
        case "xp":
          color = "#ffd700"; // yellow/gold
          break;
        case "healing":
          color = "#51cf66"; // green
          break;
        case "regen":
          color = "#8ef5a2"; // lighter green for passive regen
          break;
        case "skill":
          color = "#d8b3ff"; // light purple
          break;
        default:
          color = "#eee"; // white
      }
      
      div.style.color = color;
    }
    
    logEl.appendChild(div);
  }
}

function inferLogColor(text) {
  const t = text.toLowerCase();
  if (t.includes("regenerates")) return "#8ef5a2"; // passive regen
  if (t.includes("heals") || t.includes("healing")) return "#51cf66"; // active healing
  if (t.includes("+xp") || t.includes("+ gold") || t.includes("+gold")) return "#ffd700"; // rewards
  if (t.includes("deals") && t.includes("damage") && !t.includes("attacks")) return "#ff6b6b"; // enemy damage
  return "#eee"; // default
}

export function renderEnemy() {
  const enemies = state.currentEnemies || [];
  const enemyBox = document.getElementById("enemyBox");

  if (!enemyBox) return;

  // Clear and populate enemy box directly
  enemyBox.innerHTML = "";

  if (!enemies || enemies.length === 0) {
    const noEnemyDiv = document.createElement("div");
    noEnemyDiv.style.cssText = "color:#777;font-size:12px;padding:8px;";
    noEnemyDiv.textContent = "No enemies";
    enemyBox.appendChild(noEnemyDiv);
    return;
  }

  // Create flex container for dynamic width cards
  const lineupContainer = document.createElement("div");
  lineupContainer.style.cssText = `
    display: flex;
    gap: 8px;
    width: 100%;
  `;

  // Create enemy cards with dynamic width
  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const isMainTarget = i === 0;
    
    const card = document.createElement("div");
    card.style.cssText = `
      flex: 1;
      padding: 8px;
      background: ${isMainTarget ? "#2a2a2a" : "#1f1f1f"};
      border: ${isMainTarget ? "2px solid #4ade80" : "1px solid #444"};
      border-radius: 6px;
      font-size: 12px;
    `;
    
    // Label (MT or XT#)
    const label = document.createElement("div");
    label.style.cssText = "font-weight:bold;color:#aaa;margin-bottom:4px;";
    label.textContent = isMainTarget ? `MT: ${e.name}` : `XT${i}: ${e.name}`;
    
    // Level
    const levelDiv = document.createElement("div");
    levelDiv.style.cssText = "font-size:10px;color:#777;margin-bottom:4px;";
    levelDiv.textContent = `Lv ${e.level}`;
    
    // Health bar
    const barBg = document.createElement("div");
    barBg.style.cssText = `
      background: #0a0a0a;
      border-radius: 4px;
      height: 8px;
      overflow: hidden;
      border: 1px solid #333;
      margin-bottom: 3px;
    `;
    
    const ePct = e.hp <= 0 ? 0 : Math.max(0, Math.min(100, (e.hp / e.maxHP) * 100));
    const barFill = document.createElement("div");
    barFill.style.cssText = `
      width: ${ePct}%;
      height: 100%;
      background: ${isMainTarget ? "#4ade80" : "#ef4444"};
      transition: width 0.1s;
    `;
    barBg.appendChild(barFill);
    
    // HP label
    const hpLabel = document.createElement("div");
    hpLabel.style.cssText = "font-size:9px;color:#aaa;text-align:center;";
    hpLabel.textContent = `${Math.max(0, e.hp.toFixed(0))}/${e.maxHP}`;
    
    card.appendChild(label);
    card.appendChild(levelDiv);
    card.appendChild(barBg);
    card.appendChild(hpLabel);
    lineupContainer.appendChild(card);
  }

  enemyBox.appendChild(lineupContainer);
}

export function renderParty() {
  const container = document.getElementById("partyContainer");
  container.innerHTML = "";

  // Render all slots up to MAX_PARTY_SIZE
  for (let i = 0; i < MAX_PARTY_SIZE; i++) {
    const hero = state.party[i];
    
    if (hero) {
      // Render filled slot with hero
      const div = document.createElement("div");
      div.className = "hero";
      div.style.position = "relative";
      
      // Greyed out if dead
      if (hero.isDead) {
        div.style.opacity = "0.6";
      }

      const header = document.createElement("div");
      header.className = "hero-header";
      const left = document.createElement("div");
      const cls = getClassDef(hero.classKey);
      const symbol = cls?.symbol || "";
      
      // For the starter hero (first in party), use characterName if hero.name is still the class name
      let displayName = hero.name;
      if (i === 0 && hero.name === cls?.name) {
        displayName = state.characterName || hero.name;
      }
      
      // Add death indicator
      const statusText = hero.isDead ? " 💀 DEAD" : "";
      left.textContent = `${symbol} ${displayName} (Lv ${hero.level})${statusText}`;
      const right = document.createElement("div");
      right.textContent = hero.role;
      header.appendChild(left);
      header.appendChild(right);

      // Individual health bar
      const healthBar = document.createElement("div");
      healthBar.style.cssText = `
        background: #222;
        border-radius: 4px;
        height: 12px;
        margin: 6px 0;
        overflow: hidden;
        border: 1px solid #444;
      `;
      
      const healthFill = document.createElement("div");
      const healthPercent = hero.maxHP > 0 ? (hero.health / hero.maxHP) * 100 : 0;
      healthFill.style.cssText = `
        width: ${healthPercent}%;
        height: 100%;
        background: ${hero.isDead ? "#666" : "#4ade80"};
        transition: width 0.1s;
      `;
      healthBar.appendChild(healthFill);
      
      const healthLabel = document.createElement("div");
      healthLabel.style.cssText = "font-size:10px;color:#4ade80;text-align:left;margin-top:2px;";
      healthLabel.textContent = `HP: ${Math.floor(hero.health)} / ${Math.floor(hero.maxHP)}`;

      // Resource bars (mana/endurance)
      let resourceBars = [];
      if (hero.maxMana > 0) {
        const manaBar = document.createElement("div");
        manaBar.style.cssText = `
          background: #222;
          border-radius: 4px;
          height: 8px;
          margin: 4px 0;
          overflow: hidden;
          border: 1px solid #444;
        `;
        
        const manaFill = document.createElement("div");
        const manaPercent = (hero.mana / hero.maxMana) * 100;
        manaFill.style.cssText = `
          width: ${manaPercent}%;
          height: 100%;
          background: #60a5fa;
          transition: width 0.1s;
        `;
        manaBar.appendChild(manaFill);
        
        const manaLabel = document.createElement("div");
        manaLabel.style.cssText = "font-size:9px;color:#60a5fa;";
        manaLabel.textContent = `Mana: ${hero.mana.toFixed(0)} / ${hero.maxMana}`;
        
        resourceBars.push({ bar: manaBar, label: manaLabel });
      }
      
      if (hero.maxEndurance > 0) {
        const endBar = document.createElement("div");
        endBar.style.cssText = `
          background: #222;
          border-radius: 4px;
          height: 8px;
          margin: 4px 0;
          overflow: hidden;
          border: 1px solid #444;
        `;
        
        const endFill = document.createElement("div");
        const endPercent = (hero.endurance / hero.maxEndurance) * 100;
        endFill.style.cssText = `
          width: ${endPercent}%;
          height: 100%;
          background: #fbbf24;
          transition: width 0.1s;
        `;
        endBar.appendChild(endFill);
        
        const endLabel = document.createElement("div");
        endLabel.style.cssText = "font-size:9px;color:#fbbf24;";
        endLabel.textContent = `Endurance: ${hero.endurance.toFixed(0)} / ${hero.maxEndurance}`;
        
        resourceBars.push({ bar: endBar, label: endLabel });
      }

      const statsRow = document.createElement("div");
      statsRow.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-top:4px;";

      const stats = document.createElement("div");
      stats.className = "hero-stats";
      stats.style.marginBottom = "0";
      stats.textContent = `DPS: ${hero.dps.toFixed(1)} | Healing: ${hero.healing.toFixed(1)}`;

      const xpDiv = document.createElement("div");
      xpDiv.style.cssText = "font-size:11px;color:#aaa;margin-top:4px;";
      xpDiv.textContent = `XP: ${(hero.xp || 0).toFixed(0)}`;

      // Cooldown display for assigned skills that are currently cooling down
      const cdRow = document.createElement("div");
      cdRow.style.cssText = "display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;";
      const clsSkills = cls?.skills || [];
      const assignedKeys = Object.values(hero.abilityBar || {}).filter(Boolean);
      const cooling = [];
      for (const key of assignedKeys) {
        const skill = clsSkills.find(s => s.key === key);
        if (!skill) continue;
        const remaining = hero.skillTimers?.[key] ?? 0;
        if (remaining > 0) {
          cooling.push({ skill, remaining });
        }
      }

      if (cooling.length > 0) {
        for (const c of cooling) {
          const pill = document.createElement("div");
          pill.style.cssText = `
            display:flex;
            align-items:center;
            gap:4px;
            padding:4px 6px;
            border-radius:4px;
            background:#2a1a1a;
            color:#fca5a5;
            border:1px solid #7f1d1d;
            font-size:10px;
          `;
          const name = document.createElement("span");
          name.textContent = c.skill.name;
          const timer = document.createElement("span");
          timer.style.cssText = "font-weight:bold;color:#fecdd3;";
          timer.textContent = `${c.remaining.toFixed(0)}t`;
          pill.appendChild(name);
          pill.appendChild(timer);
          cdRow.appendChild(pill);
        }
      }

      const btnRow = document.createElement("div");
      btnRow.style.cssText = "display:flex;gap:6px;flex-wrap:wrap;margin-top:6px;";

      const btn = document.createElement("button");
      const cost = heroLevelUpCost(hero);
      const heroXP = hero.xp || 0;
      btn.textContent = `Level Up (${cost.toFixed(0)} XP)`;
      btn.disabled = heroXP < cost || hero.isDead;
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (heroXP >= cost && !hero.isDead) {
          applyHeroLevelUp(hero);
          addLog(`${hero.name} trains hard and reaches level ${hero.level}.`, "gold");
          renderAll();
        }
      });
      btnRow.appendChild(btn);

      const statsBtn = document.createElement("button");
      statsBtn.textContent = "Stats";
      statsBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openStatsModal(hero);
      });
      btnRow.appendChild(statsBtn);

      const invBtn = document.createElement("button");
      invBtn.textContent = "Inventory";
      invBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openInventoryModal(hero);
      });
      btnRow.appendChild(invBtn);

      const abilBtn = document.createElement("button");
      abilBtn.textContent = "Abilities";
      abilBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openAbilitiesModal(hero);
      });
      btnRow.appendChild(abilBtn);

      div.appendChild(header);
      div.appendChild(healthBar);
      div.appendChild(healthLabel);
      
      // Append resource bars
      resourceBars.forEach(res => {
        div.appendChild(res.bar);
        div.appendChild(res.label);
      });
      
      statsRow.appendChild(stats);
      if (cdRow.childNodes.length > 0) {
        statsRow.appendChild(cdRow);
      }

      div.appendChild(statsRow);
      div.appendChild(xpDiv);

      div.appendChild(btnRow);

      // Check for unassigned ability slots
      const hasUnassignedSlots = checkHasUnassignedSlots(hero);

      // Debuff indicator (e.g., weakening debuff)
      const hasWeak = hero.tempDamageDebuffTicks && hero.tempDamageDebuffTicks > 0;
      if (hasWeak) {
        const debuff = document.createElement("div");
        debuff.style.cssText = `
          position: absolute;
          right: 6px;
          bottom: 6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #b91c1c;
          color: #fff;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          box-shadow: 0 0 6px rgba(0,0,0,0.5);
        `;
        debuff.textContent = "-";
        debuff.title = `Weakened: -${hero.tempDamageDebuffAmount || 1} damage for ${hero.tempDamageDebuffTicks} ticks`;
        div.appendChild(debuff);
      }

      // Unassigned ability slots warning
      if (hasUnassignedSlots) {
        const warning = document.createElement("div");
        warning.style.cssText = `
          position: absolute;
          top: 6px;
          right: 6px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #fbbf24;
          color: #000;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          box-shadow: 0 0 6px rgba(0,0,0,0.5);
          font-weight: bold;
        `;
        warning.textContent = "!";
        warning.title = "Unassigned ability slots available - Open character window to assign skills";
        div.appendChild(warning);

        // Highlight the Abilities button instead of the whole card
        abilBtn.classList.add("abilities-attn");
        abilBtn.title = "Assign abilities to fill empty slots";
      }

      container.appendChild(div);
    } else {
      // Render empty or locked slot
      const isUnlocked = i < state.partySlotsUnlocked;
      
      const div = document.createElement("div");
      div.className = "hero";
      
      if (isUnlocked) {
        // Unlocked empty slot - clickable
        div.style.cssText = `
          cursor: pointer;
          border: 2px dashed #555;
          background: #0f0f0f;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          transition: all 0.2s;
        `;
        
        div.innerHTML = `
          <div style="text-align:center;color:#888;">
            <div style="font-size:24px;margin-bottom:4px;">+</div>
            <div style="font-size:12px;">Click to recruit</div>
          </div>
        `;
        
        div.addEventListener("mouseenter", () => {
          div.style.borderColor = "#888";
          div.style.background = "#151515";
        });
        
        div.addEventListener("mouseleave", () => {
          div.style.borderColor = "#555";
          div.style.background = "#0f0f0f";
        });
        
        div.addEventListener("click", () => {
          if (window.__openRecruitModal) {
            window.__openRecruitModal();
          }
        });
      } else {
        // Locked slot
        div.style.cssText = `
          border: 2px solid #333;
          background: #0a0a0a;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 80px;
          opacity: 0.5;
        `;

        const unlockRule = ACCOUNT_SLOT_UNLOCKS.find(r => r.slots === i + 1);
        const unlockText = unlockRule ? `Unlocks at Account Lv ${unlockRule.level}` : "Locked";

        div.innerHTML = `
          <div style="text-align:center;color:#555;">
            <div style="font-size:20px;margin-bottom:4px;">🔒</div>
            <div style="font-size:11px;">${unlockText}</div>
          </div>
        `;
      }
      
      container.appendChild(div);
    }
  }

  // Party total HP bar (aggregate percentage)
  recalcPartyTotals();
  const hpPct = state.partyMaxHP > 0 ? Math.max(0, Math.min(100, (state.partyHP / state.partyMaxHP) * 100)) : 0;
  document.getElementById("partyHPFill").style.width = hpPct + "%";
  document.getElementById("partyHPLabel").textContent =
    `${Math.floor(state.partyHP)} / ${Math.floor(state.partyMaxHP)}`;

  // Calculate and display party total mana
  let totalMana = 0;
  let maxMana = 0;
  for (const hero of state.party) {
    if (!hero.isDead) {
      totalMana += hero.mana || 0;
      maxMana += hero.maxMana || 0;
    }
  }
  const manaPct = maxMana > 0 ? Math.max(0, Math.min(100, (totalMana / maxMana) * 100)) : 0;
  document.getElementById("partyManaFill").style.width = manaPct + "%";
  document.getElementById("partyManaLabel").textContent =
    `${Math.floor(totalMana)} / ${Math.floor(maxMana)}`;

  // Calculate and display party total endurance
  let totalEndurance = 0;
  let maxEndurance = 0;
  for (const hero of state.party) {
    if (!hero.isDead) {
      totalEndurance += hero.endurance || 0;
      maxEndurance += hero.maxEndurance || 0;
    }
  }
  const endurancePct = maxEndurance > 0 ? Math.max(0, Math.min(100, (totalEndurance / maxEndurance) * 100)) : 0;
  document.getElementById("partyEnduranceFill").style.width = endurancePct + "%";
  document.getElementById("partyEnduranceLabel").textContent =
    `${Math.floor(totalEndurance)} / ${Math.floor(maxEndurance)}`;
}

export function renderMeta() {
  document.getElementById("goldSpan").textContent = formatPGSC(state.currencyCopper);
  document.getElementById("xpSpan").textContent = state.totalXP;
  document.getElementById("accountLevelSpan").textContent = state.accountLevel;
  document.getElementById("zoneSpan").textContent = state.zone;
  
  // Show current zone name
  const currentZone = getZoneDef(state.zone);
  const zoneNameEl = document.getElementById("currentZoneName");
  if (currentZone && zoneNameEl) {
    zoneNameEl.textContent = currentZone.name;
  }

  // Travel controls removed from UI; guard for legacy DOM
  const travelBtn = document.getElementById("travelBtn");
  const travelBackBtn = document.getElementById("travelBackBtn");
  if (travelBtn) travelBtn.disabled = !canTravelForward();
  if (travelBackBtn) travelBackBtn.disabled = state.zone <= 1;
}

// Track zone/sub-area selection for travel
let selectedZoneForTravel = null;
let selectedSubAreaForTravel = null;

function zoneKey(zone) {
  return zone?.id || `zone_${zone?.zoneNumber ?? ""}`;
}

function renderZones() {
  const zoneList = document.getElementById("zoneList");
  const subAreaList = document.getElementById("subAreaList");
  const subAreaHeader = document.getElementById("subAreaHeader");
  if (!zoneList || !subAreaList) return;
  
  zoneList.innerHTML = "";
  subAreaList.innerHTML = "";

  const zones = listZones() || [];
  if (!zones.length) {
    const empty = document.createElement("div");
    empty.style.cssText = "font-size:11px;color:#666;";
    empty.textContent = "No zones available";
    zoneList.appendChild(empty);
    return;
  }

  const highest = state.highestUnlockedZone || 1;
  
  // Initialize selected zone if not set
  if (selectedZoneForTravel === null || selectedZoneForTravel === undefined) {
    selectedZoneForTravel = state.zone;
  }

  // Render zone list
  for (const z of zones) {
    const unlocked = z.zoneNumber <= highest;
    const isSelected = selectedZoneForTravel === z.zoneNumber;
    
    const btn = document.createElement("button");
    btn.textContent = `${z.name} (${z.levelRange?.[0] ?? "?"}-${z.levelRange?.[1] ?? "?"})`;
    btn.style.cssText = `
      width: 100%;
      text-align: left;
      background: ${isSelected ? "#1f2937" : "#222"};
      border: 1px solid ${isSelected ? "#60a5fa" : "#444"};
      color: ${unlocked ? "#eee" : "#555"};
      padding: 8px;
      border-radius: 6px;
      cursor: ${unlocked ? "pointer" : "not-allowed"};
      transition: all 0.2s;
    `;
    btn.disabled = !unlocked;
    btn.addEventListener("click", () => {
      if (!unlocked) return;
      selectedZoneForTravel = z.zoneNumber;
      // Reset sub-area selection when changing zones
      const zoneDef = zones.find(zz => zz.zoneNumber === z.zoneNumber);
      if (zoneDef) {
        const disc = ensureZoneDiscovery(zoneDef, state.zoneDiscoveries[zoneKey(zoneDef)]);
        const activeSub = getActiveSubArea(zoneDef, disc);
        selectedSubAreaForTravel = activeSub?.id;
      }
      renderZones();
    });
    
    zoneList.appendChild(btn);
  }

  // Render sub-areas for selected zone
  const selectedZone = zones.find(z => z.zoneNumber === selectedZoneForTravel);
  if (selectedZone) {
    subAreaHeader.textContent = selectedZone.name;
    const disc = ensureZoneDiscovery(selectedZone, state.zoneDiscoveries[zoneKey(selectedZone)]);
    state.zoneDiscoveries[zoneKey(selectedZone)] = disc;

    if (!selectedZone.subAreas || selectedZone.subAreas.length === 0) {
      const none = document.createElement("div");
      none.style.cssText = "font-size:11px;color:#666;";
      none.textContent = "No sub-areas";
      subAreaList.appendChild(none);
      return;
    }

    // Initialize selected sub-area if not set
    if (!selectedSubAreaForTravel) {
      const activeSub = getActiveSubArea(selectedZone, disc);
      selectedSubAreaForTravel = activeSub?.id;
    }

    for (const sub of selectedZone.subAreas) {
      const discovered = disc[sub.id] ?? sub.discovered;
      const isSelected = selectedSubAreaForTravel === sub.id;
      
      const row = document.createElement("div");
      row.style.cssText = `
        padding: 8px;
        border-radius: 6px;
        border: 1px solid ${isSelected ? "#4ade80" : "#333"};
        background: ${isSelected ? "#1a3a1a" : discovered ? "#111" : "#0d0d0d"};
        color: ${discovered ? "#eee" : "#666"};
        display: flex;
        justify-content: space-between;
        align-items: center;
        ${discovered ? "cursor: pointer;" : "cursor: not-allowed;"}
        transition: all 0.2s;
      `;
      
      if (discovered) {
        row.addEventListener("mouseenter", () => {
          if (!isSelected) {
            row.style.background = "#1a1a1a";
            row.style.borderColor = "#555";
          }
        });
        row.addEventListener("mouseleave", () => {
          row.style.background = isSelected ? "#1a3a1a" : "#111";
          row.style.borderColor = isSelected ? "#4ade80" : "#333";
        });
        row.addEventListener("click", () => {
          selectedSubAreaForTravel = sub.id;
          renderZones();
        });
      }
      
      const name = document.createElement("div");
      name.textContent = discovered ? sub.name : "???";
      const badge = document.createElement("div");
      badge.style.cssText = "font-size:10px;color:#9ca3af;";
      badge.textContent = isSelected ? "Selected" : (discovered ? "Discovered" : "Undiscovered");
      if (isSelected) badge.style.color = "#4ade80";
      
      row.appendChild(name);
      row.appendChild(badge);
      subAreaList.appendChild(row);
    }
  }
}
// Character Modal Functions
function openStatsModal(hero) {
  const modal = document.getElementById("statsModal");
  const title = document.getElementById("statsModalTitle");
  const cls = getClassDef(hero.classKey);
  
  title.textContent = `${hero.name} (${cls?.name || 'Unknown'}) - Lv ${hero.level}`;
  populateStatsSection(hero);
  
  modal.style.display = "flex";
}

function openInventoryModal(hero) {
  const modal = document.getElementById("inventoryModal");
  const title = document.getElementById("inventoryModalTitle");
  const cls = getClassDef(hero.classKey);
  
  title.textContent = `${hero.name} (${cls?.name || 'Unknown'}) - Lv ${hero.level}`;
  populateInventoryGrid(hero);
  populateEquipmentSection(hero);
  populateInventoryStats(hero);
  
  modal.style.display = "flex";
}

function showItemTooltip(itemDef, event) {
  // Remove any existing tooltip
  const existing = document.getElementById("itemTooltip");
  if (existing) existing.remove();

  if (!itemDef) return;

  const tooltip = document.createElement("div");
  tooltip.id = "itemTooltip";
  tooltip.style.cssText = `
    position: fixed;
    background: #1a1a1a;
    border: 2px solid #4ade80;
    border-radius: 8px;
    padding: 12px;
    max-width: 250px;
    z-index: 10000;
    pointer-events: none;
    font-size: 11px;
    color: #ddd;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  `;

  let html = `<div style="font-weight:bold;color:#4ade80;margin-bottom:8px;">${itemDef.name}</div>`;
  html += `<div style="color:#aaa;margin-bottom:6px;">${itemDef.rarity || "common"}</div>`;
  
  if (itemDef.maxStack > 1) {
    html += `<div style="color:#888;font-size:10px;margin-bottom:6px;">Stackable (Max: ${itemDef.maxStack})</div>`;
  } else {
    html += `<div style="color:#888;font-size:10px;margin-bottom:6px;">Unique</div>`;
  }

  if (itemDef.baseValue) {
    html += `<div style="color:#ffd700;margin-bottom:6px;">Value: ${formatPGSC(itemDef.baseValue)}</div>`;
  }

  if (itemDef.stats && Object.keys(itemDef.stats).length > 0) {
    html += `<div style="border-top:1px solid #333;padding-top:8px;margin-top:6px;">`;
    for (const [stat, value] of Object.entries(itemDef.stats)) {
      const displayStat = stat.toUpperCase();
      const color = value > 0 ? "#4ade80" : "#ff6b6b";
      html += `<div style="display:flex;justify-content:space-between;margin:4px 0;">`;
      html += `<span>${displayStat}</span>`;
      html += `<span style="color:${color};font-weight:bold;">${value > 0 ? "+" : ""}${value}</span>`;
      html += `</div>`;
    }
    html += `</div>`;
  }

  tooltip.innerHTML = html;
  document.body.appendChild(tooltip);

  // Position near cursor
  const x = event.clientX + 10;
  const y = event.clientY + 10;
  tooltip.style.left = x + "px";
  tooltip.style.top = y + "px";

  // Keep tooltip in viewport
  setTimeout(() => {
    const rect = tooltip.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      tooltip.style.left = (window.innerWidth - rect.width - 10) + "px";
    }
    if (rect.bottom > window.innerHeight) {
      tooltip.style.top = (window.innerHeight - rect.height - 10) + "px";
    }
  }, 0);
}

function hideItemTooltip() {
  const tooltip = document.getElementById("itemTooltip");
  if (tooltip) tooltip.remove();
}

function populateInventoryGrid(hero) {
  const container = document.getElementById("inventoryGridContainer");
  container.innerHTML = "";
  
  if (!hero.inventory || hero.inventory.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "color:#777;grid-column:1/-1;text-align:center;padding:20px;";
    empty.textContent = "No items";
    container.appendChild(empty);
    return;
  }
  
  for (let i = 0; i < 100; i++) {
    const slot = document.createElement("div");
    const isLocked = i >= 30;
    
    slot.style.cssText = `
      width: 77px;
      height: 77px;
      background: #1a1a1a;
      border: 1px solid #444;
      border-radius: 4px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      font-size: 10px;
      color: #ddd;
      opacity: ${isLocked ? 0.4 : 1};
      cursor: ${isLocked ? "default" : "pointer"};
      flex-shrink: 0;
    `;
    
    const item = hero.inventory[i];
    
    if (item && !isLocked) {
      const itemDef = getItemDef(item.id);
      if (itemDef) {
        // Icon
        const icon = document.createElement("div");
        icon.style.cssText = "font-size: 20px;";
        icon.textContent = itemDef.icon || "?";
        slot.appendChild(icon);
        
        // Name
        const name = document.createElement("div");
        name.style.cssText = "font-size: 9px; text-align: center; word-break: break-word;";
        name.textContent = itemDef.name;
        slot.appendChild(name);
        
        // Quantity (only if maxStack > 1)
        if (itemDef.maxStack > 1 && item.quantity) {
          const qty = document.createElement("div");
          qty.style.cssText = "font-size: 10px; color: #4ade80; font-weight: bold;";
          qty.textContent = `x${item.quantity}`;
          slot.appendChild(qty);
        }
        
        // Add tooltip on hover
        slot.addEventListener("mouseenter", (e) => {
          showItemTooltip(itemDef, e);
        });
        slot.addEventListener("mouseleave", () => {
          hideItemTooltip();
        });

        // Make it draggable if it has stat bonuses
        if (itemDef.stats) {
          slot.draggable = true;
          slot.style.cursor = "grab";
          slot.addEventListener("dragstart", (e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("application/json", JSON.stringify({
              slotIndex: i,
              itemId: item.id
            }));
            slot.style.opacity = "0.6";
            hideItemTooltip();
          });
          slot.addEventListener("dragend", (e) => {
            slot.style.opacity = item ? "1" : "0.4";
          });
        }
      }
    } else if (!isLocked) {
      // Empty slot - accept drops from equipment
      slot.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = e.dataTransfer.getData("application/json");
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.fromEquipment) {
            slot.style.borderColor = "#f57f17";
            slot.style.backgroundColor = "#2a2a2a";
          }
        }
      });
      
      slot.addEventListener("dragleave", (e) => {
        e.preventDefault();
        e.stopPropagation();
        slot.style.borderColor = "#444";
        slot.style.backgroundColor = "#1a1a1a";
      });
      
      slot.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        slot.style.borderColor = "#444";
        slot.style.backgroundColor = "#1a1a1a";
        
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;
        
        const parsed = JSON.parse(data);
        if (!parsed.fromEquipment) return;
        
        const { slotKey, itemId } = parsed;
        
        // Move item from equipment to inventory
        hero.equipment[slotKey] = null;
        hero.inventory[i] = { id: itemId, quantity: 1 };
        
        // Recalculate hero stats
        refreshHeroDerived(hero);
        
        // Update display
        populateEquipmentSection(hero);
        populateInventoryGrid(hero);
        populateInventoryStats(hero);
        saveGame();
      });
    }
    
    container.appendChild(slot);
  }
}

function openAbilitiesModal(hero) {
  const modal = document.getElementById("abilitiesModal");
  const title = document.getElementById("abilitiesModalTitle");
  const cls = getClassDef(hero.classKey);
  
  title.textContent = `${hero.name} (${cls?.name || 'Unknown'}) - Lv ${hero.level}`;
  populateSkillsSection(hero);
  populateAbilityBar(hero);
  
  modal.style.display = "flex";
}

function populateEquipmentSection(hero) {
  const equipmentGrid = document.getElementById("characterEquipmentGrid");
  equipmentGrid.innerHTML = "";
  
  const slotKeys = ["head", "chest", "legs", "feet", "main", "off"];
  const slotLabels = ["Head", "Chest", "Legs", "Feet", "Main", "Off"];
  
  for (let i = 0; i < slotKeys.length; i++) {
    const slotKey = slotKeys[i];
    const slotLabel = slotLabels[i];
    const slotDiv = document.createElement("div");
    slotDiv.style.cssText = `
      padding: 8px;
      background: #1a1a1a;
      border: 1px solid #444;
      border-radius: 4px;
      font-size: 11px;
      color: #aaa;
      text-align: center;
      min-height: 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      cursor: pointer;
      transition: border-color 0.2s;
    `;
    
    const equippedItem = hero.equipment[slotKey];
    const itemDef = equippedItem ? getItemDef(equippedItem.id) : null;
    
    if (itemDef) {
      slotDiv.innerHTML = `
        <div style="font-size:18px;">${itemDef.icon}</div>
        <div style="font-size:10px;color:#4ade80;">${itemDef.name}</div>
      `;
      // Add tooltip on hover
      slotDiv.addEventListener("mouseenter", (e) => {
        showItemTooltip(itemDef, e);
      });
      slotDiv.addEventListener("mouseleave", () => {
        hideItemTooltip();
      });
      // Make equipped items draggable so they can be removed
      slotDiv.draggable = true;
      slotDiv.style.cursor = "grab";
      slotDiv.addEventListener("dragstart", (e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("application/json", JSON.stringify({
          fromEquipment: true,
          slotKey: slotKey,
          itemId: equippedItem.id
        }));
        slotDiv.style.opacity = "0.6";
        hideItemTooltip();
      });
      slotDiv.addEventListener("dragend", (e) => {
        slotDiv.style.opacity = "1";
      });
    } else {
      slotDiv.textContent = `${slotLabel}\n(Empty)`;
    }
    
    // Drag over effect
    slotDiv.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.stopPropagation();
      slotDiv.style.borderColor = "#f57f17";
      slotDiv.style.backgroundColor = "#2a2a2a";
    });
    
    slotDiv.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.stopPropagation();
      slotDiv.style.borderColor = "#444";
      slotDiv.style.backgroundColor = "#1a1a1a";
    });
    
    slotDiv.addEventListener("drop", (e) => {
      e.preventDefault();
      e.stopPropagation();
      slotDiv.style.borderColor = "#444";
      slotDiv.style.backgroundColor = "#1a1a1a";
      
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      
      const parsed = JSON.parse(data);
      
      // If dragging from equipment, don't allow re-equipping to same slot
      if (parsed.fromEquipment) return;
      
      const { slotIndex, itemId } = parsed;
      const itemDef = getItemDef(itemId);
      
      if (!itemDef) return;
      
      // Equip the item
      const oldEquipped = hero.equipment[slotKey];
      hero.equipment[slotKey] = { id: itemId, quantity: 1 };
      
      // Remove from inventory
      if (hero.inventory[slotIndex]) {
        hero.inventory[slotIndex].quantity--;
        if (hero.inventory[slotIndex].quantity <= 0) {
          hero.inventory[slotIndex] = null;
        }
      }
      
      // If there was an old equipped item, return it to inventory
      if (oldEquipped) {
        const oldItemDef = getItemDef(oldEquipped.id);
        if (oldItemDef) {
          // Try to find an empty slot in the unlocked inventory
          let placed = false;
          for (let j = 0; j < 30; j++) {
            if (!hero.inventory[j]) {
              hero.inventory[j] = { id: oldEquipped.id, quantity: 1 };
              placed = true;
              break;
            }
          }
          // If no empty slot, try stacking with existing items
          if (!placed && oldItemDef.maxStack > 1) {
            for (let j = 0; j < 30; j++) {
              if (hero.inventory[j] && hero.inventory[j].id === oldEquipped.id) {
                const room = oldItemDef.maxStack - (hero.inventory[j].quantity || 0);
                if (room > 0) {
                  hero.inventory[j].quantity++;
                  placed = true;
                  break;
                }
              }
            }
          }
        }
      }
      
      // Recalculate hero stats
      refreshHeroDerived(hero);
      
      // Update display
      populateEquipmentSection(hero);
      populateInventoryGrid(hero);
      populateInventoryStats(hero);
      saveGame();
    });
    
    equipmentGrid.appendChild(slotDiv);
  }
}

function populateInventoryStats(hero) {
  const statsContainer = document.getElementById("inventoryStatsContainer");
  statsContainer.innerHTML = "";
  
  const stats = [
    { label: "HP", value: hero.maxHP },
    { label: "Mana", value: hero.maxMana },
    { label: "Endurance", value: hero.maxEndurance },
    { label: "DPS", value: hero.dps.toFixed(1) },
    { label: "Healing", value: hero.healing.toFixed(1) },
    { label: "STR", value: hero.stats?.str || 0 },
    { label: "CON", value: hero.stats?.con || 0 },
    { label: "DEX", value: hero.stats?.dex || 0 },
    { label: "AGI", value: hero.stats?.agi || 0 },
    { label: "AC", value: hero.stats?.ac || 0 },
    { label: "WIS", value: hero.stats?.wis || 0 },
    { label: "INT", value: hero.stats?.int || 0 },
    { label: "CHA", value: hero.stats?.cha || 0 }
  ];
  
  for (const stat of stats) {
    const line = document.createElement("div");
    line.style.cssText = "display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px solid #222;";
    const label = document.createElement("span");
    label.style.cssText = "color:#aaa;";
    label.textContent = stat.label;
    const value = document.createElement("span");
    value.style.cssText = "color:#4ade80;font-weight:bold;";
    value.textContent = stat.value;
    line.appendChild(label);
    line.appendChild(value);
    statsContainer.appendChild(line);
  }
}

function populateSkillsSection(hero) {
  const skillsContainer = document.getElementById("characterSkillsContainer");
  skillsContainer.innerHTML = "";
  
  const cls = getClassDef(hero.classKey);
  if (!cls?.skills || cls.skills.length === 0) {
    const noSkills = document.createElement("div");
    noSkills.style.cssText = "color:#777;font-size:12px;";
    noSkills.textContent = "No skills available";
    skillsContainer.appendChild(noSkills);
    return;
  }
  
  // Filter skills available at this level
  const availableSkills = cls.skills.filter(s => hero.level >= s.level);
  
  for (const skill of availableSkills) {
    const skillDiv = document.createElement("div");
    skillDiv.draggable = true;
    skillDiv.dataset.skillKey = skill.key;
    skillDiv.dataset.skillName = skill.name;
    skillDiv.style.cssText = `
      padding: 8px;
      background: #1a1a1a;
      border: 1px solid #555;
      border-radius: 4px;
      cursor: move;
      user-select: none;
      transition: background 0.1s;
    `;
    
    const skillTitle = document.createElement("div");
    skillTitle.style.cssText = "font-weight:bold;font-size:11px;color:#fff;";
    skillTitle.textContent = skill.name;
    
    const skillInfo = document.createElement("div");
    skillInfo.style.cssText = "font-size:9px;color:#aaa;margin-top:2px;";
    const costStr = skill.cost ? `Cost: ${skill.cost}` : "No cost";
    const cooldown = skill.cooldownSeconds ? ` | CD: ${skill.cooldownSeconds}s` : "";
    skillInfo.textContent = costStr + cooldown;
    
    skillDiv.appendChild(skillTitle);
    skillDiv.appendChild(skillInfo);
    
    // Drag events
    skillDiv.addEventListener("dragstart", (e) => {
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("skillKey", skill.key);
      e.dataTransfer.setData("skillName", skill.name);
      skillDiv.style.opacity = "0.5";
    });
    
    skillDiv.addEventListener("dragend", (e) => {
      skillDiv.style.opacity = "1";
    });
    
    skillDiv.addEventListener("mouseenter", () => {
      skillDiv.style.background = "#222";
    });
    
    skillDiv.addEventListener("mouseleave", () => {
      skillDiv.style.background = "#1a1a1a";
    });
    
    skillsContainer.appendChild(skillDiv);
  }
}

function getAbilitySlotUnlockLevel(slotIndex) {
  // Slot 0 unlocked at level 1
  // Slots 1-11 unlock every 5 levels (level 5, 10, 15, ..., 60)
  if (slotIndex === 0) return 1;
  return slotIndex * 5;
}

function populateAbilityBar(hero) {
  const abilityBar = document.getElementById("characterAbilityBar");
  abilityBar.innerHTML = "";
  
  for (let i = 0; i < 12; i++) {
    const slotDiv = document.createElement("div");
    const unlockLevel = getAbilitySlotUnlockLevel(i);
    const isUnlocked = hero.level >= unlockLevel;
    
    slotDiv.style.cssText = `
      flex: 1;
      min-width: 50px;
      min-height: 50px;
      background: ${isUnlocked ? "#1a1a1a" : "#111"};
      border: ${isUnlocked ? "1px solid #555" : "1px solid #333"};
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: ${isUnlocked ? "pointer" : "not-allowed"};
      transition: background 0.1s;
      position: relative;
    `;
    
    if (!isUnlocked) {
      slotDiv.style.opacity = "0.5";
      const lockLabel = document.createElement("div");
      lockLabel.style.cssText = "font-size:8px;color:#666;text-align:center;";
      lockLabel.textContent = `Lv ${unlockLevel}`;
      slotDiv.appendChild(lockLabel);
    } else {
      // Get current skill in this slot
      if (!hero.abilityBar) hero.abilityBar = {};
      const skillKey = hero.abilityBar[i];
      
      if (skillKey) {
        const cls = getClassDef(hero.classKey);
        const skill = cls?.skills?.find(s => s.key === skillKey);
        if (skill) {
          const skillLabel = document.createElement("div");
          skillLabel.style.cssText = "font-size:10px;color:#fff;font-weight:bold;text-align:center;line-height:1.2;word-break:break-word;";
          skillLabel.textContent = skill.name;
          slotDiv.appendChild(skillLabel);
          
          const clearBtn = document.createElement("button");
          clearBtn.textContent = "✕";
          clearBtn.style.cssText = `
            position: absolute;
            top: 2px;
            right: 2px;
            width: 16px;
            height: 16px;
            padding: 0;
            border: none;
            background: #b91c1c;
            color: #fff;
            border-radius: 50%;
            font-size: 10px;
            cursor: pointer;
            display: none;
          `;
          clearBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            hero.abilityBar[i] = null;
            populateAbilityBar(hero);
          });
          slotDiv.appendChild(clearBtn);
          
          slotDiv.addEventListener("mouseenter", () => {
            clearBtn.style.display = "block";
          });
          
          slotDiv.addEventListener("mouseleave", () => {
            clearBtn.style.display = "none";
          });
        }
      } else {
        const emptyLabel = document.createElement("div");
        emptyLabel.style.cssText = "font-size:9px;color:#777;";
        emptyLabel.textContent = `Slot ${i + 1}`;
        slotDiv.appendChild(emptyLabel);
      }
      
      // Drag and drop
      slotDiv.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
        slotDiv.style.background = "#2a2a2a";
      });
      
      slotDiv.addEventListener("dragleave", () => {
        slotDiv.style.background = "#1a1a1a";
      });
      
      slotDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        slotDiv.style.background = "#1a1a1a";
        
        const skillKey = e.dataTransfer.getData("skillKey");
        if (skillKey) {
          if (!hero.abilityBar) hero.abilityBar = {};
          hero.abilityBar[i] = skillKey;
          populateAbilityBar(hero);
        }
      });
    }
    
    abilityBar.appendChild(slotDiv);
  }
}

// Helper function to check if hero has unassigned unlocked ability slots
function checkHasUnassignedSlots(hero) {
  for (let i = 0; i < 12; i++) {
    const unlockLevel = getAbilitySlotUnlockLevel(i);
    const isUnlocked = hero.level >= unlockLevel;
    
    if (isUnlocked) {
      const skillKey = hero.abilityBar?.[i];
      if (!skillKey) {
        // Found an unlocked slot with no skill assigned
        return true;
      }
    }
  }
  return false;
}

function statLine(label, value) {
  const row = document.createElement("div");
  row.style.cssText = "display:flex;justify-content:space-between;gap:6px;margin-bottom:4px;";
  const left = document.createElement("span");
  left.textContent = label;
  const right = document.createElement("span");
  right.style.color = "#9ae6b4";
  right.textContent = value;
  row.appendChild(left);
  row.appendChild(right);
  return row;
}

function populateStatsSection(hero) {
  const statsBox = document.getElementById("characterStatsContainer");
  if (!statsBox) return;
  statsBox.innerHTML = "";
  
  // Create a wrapper with flex layout for side-by-side
  statsBox.style.display = "flex";
  statsBox.style.gap = "20px";
  statsBox.style.flexWrap = "nowrap";
  
  const stats = hero.stats || {};
  const derived = {
    hp: `${Math.floor(hero.health)} / ${Math.floor(hero.maxHP)}`,
    mana: hero.maxMana > 0 ? `${Math.floor(hero.mana)} / ${Math.floor(hero.maxMana)}` : "-",
    endurance: hero.maxEndurance > 0 ? `${Math.floor(hero.endurance)} / ${Math.floor(hero.maxEndurance)}` : "-",
    dps: hero.dps?.toFixed ? hero.dps.toFixed(1) : hero.dps || 0,
    healing: hero.healing?.toFixed ? hero.healing.toFixed(1) : hero.healing || 0
  };

  const primary = hero.primaryStat ? hero.primaryStat.toUpperCase() : "-";

  // Left column: core stats
  const leftColumn = document.createElement("div");
  leftColumn.style.flex = "1 1 auto";
  leftColumn.style.minWidth = "140px";
  
  leftColumn.appendChild(statLine("Primary", primary));
  leftColumn.appendChild(statLine("HP", derived.hp));
  leftColumn.appendChild(statLine("Mana", derived.mana));
  leftColumn.appendChild(statLine("Endurance", derived.endurance));
  leftColumn.appendChild(statLine("DPS", derived.dps));
  leftColumn.appendChild(statLine("Healing", derived.healing));

  leftColumn.appendChild(document.createElement("hr"));
  const coreStats = [
    ["STR", stats.str ?? 0],
    ["CON", stats.con ?? 0],
    ["DEX", stats.dex ?? 0],
    ["AGI", stats.agi ?? 0],
    ["AC", stats.ac ?? 0],
    ["WIS", stats.wis ?? 0],
    ["INT", stats.int ?? 0],
    ["CHA", stats.cha ?? 0]
  ];
  for (const [label, val] of coreStats) {
    leftColumn.appendChild(statLine(label, val));
  }
  
  statsBox.appendChild(leftColumn);

  // Right column: Skills / Passives (warrior Double Attack)
  if (hero.classKey === "warrior") {
    const rightColumn = document.createElement("div");
    rightColumn.style.flex = "1 1 auto";
    rightColumn.style.minWidth = "140px";

    const skillTitle = document.createElement("div");
    skillTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#fbbf24;";
    skillTitle.textContent = "Skills / Passives";
    rightColumn.appendChild(skillTitle);

    const cap = doubleAttackCap(hero.level);
    const skillVal = Math.min(hero.doubleAttackSkill || 0, cap || 0);
    const locked = hero.level < 5 || cap === 0;
    const procPct = doubleAttackProcChance(skillVal) * 100;

    if (locked) {
      rightColumn.appendChild(statLine("Double Attack", "Locked until level 5"));
    } else {
      const skillLine = document.createElement("div");
      skillLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:4px 0;font-size:12px;color:#ccc;";
      skillLine.innerHTML = `<span>Double Attack</span> <span style='color:#fff;'>${skillVal.toFixed(0)} / ${cap}</span>`;
      rightColumn.appendChild(skillLine);

      const procLine = document.createElement("div");
      procLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:2px 0 8px;font-size:11px;color:#aaa;";
      procLine.innerHTML = `<span>Proc Chance</span> <span style='color:#fbbf24;'>${procPct.toFixed(1)}%</span>`;
      rightColumn.appendChild(procLine);

      const barBg = document.createElement("div");
      barBg.style.cssText = "width:100%;height:10px;background:#252525;border-radius:5px;overflow:hidden;border:1px solid #333;margin:0;position:relative;";
      const percent = cap > 0 ? Math.min(100, (skillVal / cap) * 100) : 0;
      const nextPercent = cap > 0 && skillVal < cap ? Math.min(100, ((skillVal + 1) / cap) * 100) : 100;
      
      const barFill = document.createElement("div");
      barFill.style.cssText = `height:100%;width:${percent}%;background:linear-gradient(90deg,#fbbf24,#f59e0b);transition:width 0.2s;`;
      barBg.appendChild(barFill);
      
      rightColumn.appendChild(barBg);
    }
    
    statsBox.appendChild(rightColumn);
  }
}

function isTownZone() {
  const zone = getZoneDef(state.zone);
  return zone?.isTown;
}

function bestPartyCharisma() {
  let best = 0;
  for (const hero of state.party) {
    best = Math.max(best, hero?.stats?.cha || 0);
  }
  return best;
}

function renderTownMerchant() {
  const container = document.getElementById("merchantContainer");
  if (!container) return;
  container.innerHTML = "";

  if (!isTownZone()) {
    container.style.display = "none";
    return;
  }

  container.style.display = "block";

  const heading = document.createElement("div");
  heading.style.cssText = "font-weight:bold;color:#fbbf24;margin-bottom:8px;font-size:13px;";
  heading.textContent = "Town Merchant";
  container.appendChild(heading);

  const sub = document.createElement("div");
  sub.style.cssText = "color:#aaa;font-size:11px;margin-bottom:10px;";
  sub.textContent = "Sell items from unlocked inventory slots.";
  container.appendChild(sub);

  const list = document.createElement("div");
  list.style.cssText = "display:flex;flex-direction:column;gap:6px;";
  container.appendChild(list);

  const cha = bestPartyCharisma();
  let hasItems = false;

  state.party.forEach((hero, heroIdx) => {
    if (!hero?.inventory) return;
    for (let i = 0; i < 30; i++) {
      const item = hero.inventory[i];
      if (!item) continue;
      const itemDef = getItemDef(item.id);
      if (!itemDef) continue;
      hasItems = true;
      const qty = item.quantity ?? 1;
      const baseValue = itemDef.baseValue ?? 1;
      const perItem = Math.max(1, Math.floor(computeSellValue(baseValue, cha)));
      const total = perItem * qty;

      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;justify-content:space-between;padding:8px;border:1px solid #333;border-radius:6px;background:#111;";

      const left = document.createElement("div");
      left.style.cssText = "display:flex;align-items:center;gap:10px;";
      const icon = document.createElement("div");
      icon.style.cssText = "font-size:18px;";
      icon.textContent = itemDef.icon || "?";
      const name = document.createElement("div");
      name.style.cssText = "display:flex;flex-direction:column;gap:2px;";
      const line1 = document.createElement("div");
      line1.style.cssText = "color:#eee;font-size:12px;font-weight:600;";
      line1.textContent = `${itemDef.name}${qty > 1 ? ` x${qty}` : ""}`;
      const line2 = document.createElement("div");
      line2.style.cssText = "color:#888;font-size:11px;";
      line2.textContent = `Held by ${hero.name}`;
      name.appendChild(line1);
      name.appendChild(line2);
      left.appendChild(icon);
      left.appendChild(name);

      const right = document.createElement("div");
      right.style.cssText = "display:flex;flex-direction:column;gap:6px;align-items:flex-end;min-width:170px;";
      const valueTag = document.createElement("div");
      valueTag.style.cssText = "font-size:11px;color:#ffd700;";
      valueTag.textContent = `${formatPGSC(perItem)} each`;

      const buttonsWrap = document.createElement("div");
      buttonsWrap.style.cssText = "display:flex;flex-wrap:wrap;gap:6px;justify-content:flex-end;";

      const sellOptions = [
        { label: "Sell 1", qty: 1 },
        { label: "Sell 5", qty: 5 },
        { label: "Sell 10", qty: 10 },
        { label: `Sell x${qty}`, qty }
      ];

      const handleSell = (sellQty) => {
        const heroRef = state.party[heroIdx];
        if (!heroRef?.inventory?.[i]) return;
        const actualQty = Math.min(sellQty, heroRef.inventory[i].quantity ?? 1);
        const saleValue = perItem * actualQty;
        if (actualQty <= 0) return;

        if ((heroRef.inventory[i].quantity ?? 1) <= actualQty) {
          heroRef.inventory[i] = null;
        } else {
          heroRef.inventory[i].quantity -= actualQty;
        }

        state.currencyCopper += saleValue;
        updateCurrencyDisplay();
        addLog(`You sell ${actualQty > 1 ? actualQty + "x " : ""}${itemDef.name} for ${formatPGSC(saleValue)}.`, "gold");
        renderMeta();
        renderBattleFooter();
      };

      for (const opt of sellOptions) {
        const available = qty;
        // Only show partial buttons when enough quantity; the final option is the full stack
        if (opt.qty !== qty && available < opt.qty) continue;

        const btnQty = Math.min(opt.qty, available);
        const price = perItem * btnQty;
        const btn = document.createElement("button");
        btn.textContent = `${opt.label} (${formatPGSC(price)})`;
        btn.style.cssText = "padding:6px 10px;background:#4ade80;border:1px solid #22c55e;color:#000;border-radius:6px;font-weight:700;cursor:pointer;font-size:11px;";
        btn.addEventListener("click", () => handleSell(btnQty));
        buttonsWrap.appendChild(btn);
      }

      right.appendChild(valueTag);
      right.appendChild(buttonsWrap);
      row.appendChild(left);
      row.appendChild(right);
      list.appendChild(row);
    }
  });

  if (!hasItems) {
    const empty = document.createElement("div");
    empty.style.cssText = "color:#777;font-size:12px;padding:12px;border:1px dashed #333;border-radius:6px;";
    empty.textContent = "No items available in unlocked slots.";
    list.appendChild(empty);
  }
}

function renderBattleFooter() {
  const label = document.getElementById("battleFooterLabel");
  const logEl = document.getElementById("log");
  const merchantEl = document.getElementById("merchantContainer");

  if (isTownZone()) {
    if (label) label.textContent = "Town merchant";
    if (logEl) {
      logEl.innerHTML = "";
      logEl.style.display = "none";
    }
    if (merchantEl) {
      merchantEl.style.display = "block";
      renderTownMerchant();
    }
    return;
  }

  if (label) label.textContent = "Combat log";
  if (merchantEl) {
    merchantEl.style.display = "none";
    merchantEl.innerHTML = "";
  }
  renderLog();
}