import { state } from "./state.js";
import { heroLevelUpCost, applyHeroLevelUp, canTravelForward, travelToNextZone, travelToPreviousZone, recalcPartyTotals, killsRequiredForZone, spawnEnemy } from "./combat.js";
import { spawnEnemyToList } from "./combat.js";
import { CLASSES, getClassDef } from "./classes/index.js";
import { getZoneDef, listZones, ensureZoneDiscovery, getActiveSubArea } from "./zones/index.js";
import { addLog } from "./util.js";
import { MAX_PARTY_SIZE, ACCOUNT_SLOT_UNLOCKS } from "./defs.js";

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

  // Character modal close buttons
  const statsModalCloseBtn = document.getElementById("statsModalCloseBtn");
  if (statsModalCloseBtn) {
    statsModalCloseBtn.addEventListener("click", () => {
      document.getElementById("statsModal").style.display = "none";
    });
  }

  const inventoryModalCloseBtn = document.getElementById("inventoryModalCloseBtn");
  if (inventoryModalCloseBtn) {
    inventoryModalCloseBtn.addEventListener("click", () => {
      document.getElementById("inventoryModal").style.display = "none";
    });
  }

  const abilitiesModalCloseBtn = document.getElementById("abilitiesModalCloseBtn");
  if (abilitiesModalCloseBtn) {
    abilitiesModalCloseBtn.addEventListener("click", () => {
      document.getElementById("abilitiesModal").style.display = "none";
    });
  }

  // Offline modal close button
  const offlineCloseBtn = document.getElementById("offlineModalCloseBtn");
  if (offlineCloseBtn) {
    offlineCloseBtn.addEventListener("click", () => {
      const modal = document.getElementById("offlineModal");
      if (modal) modal.style.display = "none";
      state.offlineSummary = null;
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

  const campThresholdsModal = document.getElementById("campThresholdsModal");
  if (campThresholdsModal) {
    campThresholdsModal.addEventListener("click", (e) => {
      if (e.target === campThresholdsModal) {
        closeCampThresholdsModal();
      }
    });
  }

  // Update threshold inputs when changed
  const campHealthInput = document.getElementById("campHealthInput");
  if (campHealthInput) {
    campHealthInput.addEventListener("change", (e) => {
      const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 80));
      state.campThresholds.health = val;
      e.target.value = val;
    });
  }

  const campManaInput = document.getElementById("campManaInput");
  if (campManaInput) {
    campManaInput.addEventListener("change", (e) => {
      const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 50));
      state.campThresholds.mana = val;
      e.target.value = val;
    });
  }

  const campEnduranceInput = document.getElementById("campEnduranceInput");
  if (campEnduranceInput) {
    campEnduranceInput.addEventListener("change", (e) => {
      const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 30));
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
  renderLog();
  renderZones();
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
  if (goldSpan) goldSpan.textContent = Math.floor(summary.goldGained || 0);
  if (xpSpan) xpSpan.textContent = Math.floor(summary.xpGained || 0);
  modal.style.display = "flex";
}

export function renderLog() {
  const logEl = document.getElementById("log");
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
        
        // Add yellow highlight to the card
        div.style.background = "rgba(251, 191, 36, 0.1)";
        div.style.borderColor = "#fbbf24";
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
  document.getElementById("goldSpan").textContent = state.gold;
  document.getElementById("xpSpan").textContent = state.totalXP;
  document.getElementById("accountLevelSpan").textContent = state.accountLevel;
  document.getElementById("zoneSpan").textContent = state.zone;
  
  // Show current zone name
  const currentZone = getZoneDef(state.zone);
  const zoneNameEl = document.getElementById("currentZoneName");
  if (currentZone && zoneNameEl) {
    zoneNameEl.textContent = currentZone.name;
  }
  
  document.getElementById("killsSpan").textContent = state.killsThisZone;
  document.getElementById("killsNeedSpan").textContent = killsRequiredForZone(state.zone);
  document.getElementById("nextZoneSpan").textContent = state.zone + 1;

  let dps = 0, heal = 0;
  for (const h of state.party) { dps += h.dps; heal += h.healing; }

  document.getElementById("partyDpsSpan").textContent = dps.toFixed(1);
  document.getElementById("partyHealSpan").textContent = heal.toFixed(1);

  document.getElementById("slotsUsedSpan").textContent = state.party.length;
  document.getElementById("slotsMaxSpan").textContent = state.partySlotsUnlocked;

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
  if (!selectedZoneForTravel) {
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
  populateEquipmentSection(hero);
  populateInventoryStats(hero);
  
  modal.style.display = "flex";
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
  
  const slots = ["Head", "Chest", "Legs", "Feet", "Main", "Off"];
  
  for (const slot of slots) {
    const slotDiv = document.createElement("div");
    slotDiv.style.cssText = `
      padding: 8px;
      background: #1a1a1a;
      border: 1px solid #444;
      border-radius: 4px;
      font-size: 11px;
      color: #aaa;
      text-align: center;
      min-height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    slotDiv.textContent = `${slot}\n(Empty)`;
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
    { label: "STR", value: hero.str || 0 },
    { label: "CON", value: hero.con || 0 },
    { label: "DEX", value: hero.dex || 0 },
    { label: "AGI", value: hero.agi || 0 },
    { label: "AC", value: hero.ac || 0 },
    { label: "WIS", value: hero.wis || 0 },
    { label: "INT", value: hero.int || 0 },
    { label: "CHA", value: hero.cha || 0 }
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
  const stats = hero.stats || {};
  const derived = {
    hp: `${Math.floor(hero.health)} / ${Math.floor(hero.maxHP)}`,
    mana: hero.maxMana > 0 ? `${Math.floor(hero.mana)} / ${Math.floor(hero.maxMana)}` : "-",
    endurance: hero.maxEndurance > 0 ? `${Math.floor(hero.endurance)} / ${Math.floor(hero.maxEndurance)}` : "-",
    dps: hero.dps?.toFixed ? hero.dps.toFixed(1) : hero.dps || 0,
    healing: hero.healing?.toFixed ? hero.healing.toFixed(1) : hero.healing || 0
  };

  const primary = hero.primaryStat ? hero.primaryStat.toUpperCase() : "-";

  statsBox.appendChild(statLine("Primary", primary));
  statsBox.appendChild(statLine("HP", derived.hp));
  statsBox.appendChild(statLine("Mana", derived.mana));
  statsBox.appendChild(statLine("Endurance", derived.endurance));
  statsBox.appendChild(statLine("DPS", derived.dps));
  statsBox.appendChild(statLine("Healing", derived.healing));

  statsBox.appendChild(document.createElement("hr"));
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
    statsBox.appendChild(statLine(label, val));
  }
}