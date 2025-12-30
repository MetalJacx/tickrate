import { state } from "./state.js";
import { heroLevelUpCost, applyHeroLevelUp, canTravelForward, travelToNextZone, travelToPreviousZone, recalcPartyTotals, killsRequiredForZone } from "./combat.js";
import { spawnEnemyToList } from "./combat.js";
import { CLASSES, getClassDef } from "./classes/index.js";
import { getZoneDef } from "./zones/index.js";
import { addLog } from "./util.js";
import { MAX_PARTY_SIZE } from "./defs.js";

export function initUI({ onRecruit, onReset, onOpenRecruitModal }) {
  document.getElementById("travelBtn").addEventListener("click", () => {
    travelToNextZone();
    renderAll();
  });
  document.getElementById("travelBackBtn").addEventListener("click", () => {
    travelToPreviousZone();
    renderAll();
  });

  // Store the callback for opening recruit modal
  if (onOpenRecruitModal) {
    window.__openRecruitModal = onOpenRecruitModal;
  }

  // Health threshold slider
  const healthSlider = document.getElementById("healthThresholdInput");
  if (healthSlider) {
    healthSlider.addEventListener("input", (e) => {
      state.autoRestartHealthPercent = parseInt(e.target.value);
      renderHealthThreshold();
    });
    renderHealthThreshold();
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
}

function renderHealthThreshold() {
  const slider = document.getElementById("healthThresholdInput");
  const label = document.getElementById("healthThresholdLabel");
  if (slider && label) {
    slider.value = state.autoRestartHealthPercent;
    label.textContent = state.autoRestartHealthPercent + "%";
  }
}

export function renderAll() {
  renderEnemy();
  renderParty();
  renderMeta();
  renderLog();
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
      healthLabel.textContent = `HP: ${hero.health.toFixed(0)} / ${hero.maxHP}`;

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

      const stats = document.createElement("div");
      stats.className = "hero-stats";
      stats.textContent = `DPS: ${hero.dps.toFixed(1)} | Healing: ${hero.healing.toFixed(1)}`;

      const xpDiv = document.createElement("div");
      xpDiv.style.cssText = "font-size:11px;color:#aaa;margin-top:4px;";
      xpDiv.textContent = `XP: ${(hero.xp || 0).toFixed(0)}`;

      const btnRow = document.createElement("div");
      const btn = document.createElement("button");
      const cost = heroLevelUpCost(hero);
      btn.textContent = `Level Up (${cost} gold)`;
      btn.disabled = state.gold < cost || hero.isDead;
      btn.addEventListener("click", function () {
        if (state.gold >= cost && !hero.isDead) {
          state.gold -= cost;
          applyHeroLevelUp(hero);
          addLog(`${hero.name} trains hard and reaches level ${hero.level}.`, "gold");
          renderAll();
        }
      });
      btnRow.appendChild(btn);

      div.appendChild(header);
      div.appendChild(healthBar);
      div.appendChild(healthLabel);
      
      // Append resource bars
      resourceBars.forEach(res => {
        div.appendChild(res.bar);
        div.appendChild(res.label);
      });
      
      div.appendChild(stats);
      div.appendChild(xpDiv);
      div.appendChild(btnRow);

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
        
        div.innerHTML = `
          <div style="text-align:center;color:#555;">
            <div style="font-size:20px;margin-bottom:4px;">🔒</div>
            <div style="font-size:11px;">Unlock in higher zones</div>
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
}

export function renderMeta() {
  document.getElementById("goldSpan").textContent = state.gold;
  document.getElementById("xpSpan").textContent = state.totalXP;
  document.getElementById("accountLevelSpan").textContent = state.accountLevel;
  document.getElementById("zoneSpan").textContent = state.zone;
  
  // Show current zone name
  const currentZone = getZoneDef(state.zone);
  if (currentZone) {
    document.getElementById("currentZoneName").textContent = currentZone.name;
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

  // Travel button: forward if zone unlocked or kills requirement met
  document.getElementById("travelBtn").disabled = !canTravelForward();
  
  // Back button: can always go back except at zone 1
  document.getElementById("travelBackBtn").disabled = state.zone <= 1;
}
