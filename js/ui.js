import { state } from "./state.js";
import { heroLevelUpCost, applyHeroLevelUp, canTravelForward, travelToNextZone, travelToPreviousZone, recalcPartyTotals, killsRequiredForZone, spawnEnemy, doubleAttackCap, doubleAttackProcChance, refreshHeroDerived, getMeditateCap, hasBuff, toggleTargetDummy, getTotalHastePct, getBaseDelayTenths, computeSwingTicks } from "./combat.js";
import { spawnEnemyToList } from "./combat.js";
import { CLASSES, getClassDef } from "./classes/index.js";
import { getZoneDef, listZones, ensureZoneDiscovery, getActiveSubArea } from "./zones/index.js";
import { addLog, isExpiredEffect } from "./util.js";
import { formatPGSC, saveGame, updateCurrencyDisplay } from "./state.js";
import { MAX_PARTY_SIZE, ACCOUNT_SLOT_UNLOCKS, CONSUMABLE_SLOT_UNLOCK_LEVELS } from "./defs.js";
import { getItemDef } from "./items.js";
import { canEquipWeapon, getEquippedWeaponType, getWeaponSkillCap, WEAPON_TYPE_NAMES, getUnlockedWeaponTypes } from "./weaponSkills.js";
import {
  getMagicSkillCap,
  getMagicSkillValue,
  getMagicSkillRatio,
  MAGIC_SKILLS,
  SPECIALIZATIONS,
  isMagicCategoryUnlocked,
  getSpecRatio,
  getFinalManaCost
} from "./magicSkills.js";
import { computeSellValue } from "./combatMath.js";
import { ACTIONS } from "./actions.js";
import { getRaceDef } from "./races.js";

// Specialization icons and labels (defined inline to avoid import issues)
const SPEC_LABEL = {
  destruction: "Destruction",
  restoration: "Restoration",
  control: "Control",
  enhancement: "Enhancement",
  summoning: "Summoning",
  utility: "Utility"
};

const SPEC_ICON_SVG = {
  destruction: `<svg viewBox="0 0 16 16" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;color:#ff6b6b;" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M 8 2 L 10 6 L 14 7 L 11 10 L 11.5 14 L 8 11.5 L 4.5 14 L 5 10 L 2 7 L 6 6 Z"/></g></svg>`,
  restoration: `<svg viewBox="0 0 16 16" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;color:#69db7c;" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M 8 2 L 8 14 M 3 9 L 13 9"/><circle cx="8" cy="9" r="5.5"/></g></svg>`,
  control: `<svg viewBox="0 0 16 16" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;color:#74c0fc;" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M 4 6 L 4 10 C 4 12 5.5 13 8 13 C 10.5 13 12 12 12 10 L 12 6"/><path d="M 4 6 C 4 4.5 5.5 3 8 3 C 10.5 3 12 4.5 12 6"/></g></svg>`,
  enhancement: `<svg viewBox="0 0 16 16" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;color:#ffd43b;" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M 8 2 L 10 7 L 15 7.5 L 11 11 L 12 15.5 L 8 12.5 L 4 15.5 L 5 11 L 1 7.5 L 6 7 Z"/></g></svg>`,
  summoning: `<svg viewBox="0 0 16 16" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;color:#b197fc;" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><circle cx="8" cy="8" r="5.5"/><path d="M 3.5 3.5 L 12.5 12.5 M 12.5 3.5 L 3.5 12.5"/></g></svg>`,
  utility: `<svg viewBox="0 0 16 16" style="width:14px;height:14px;vertical-align:middle;margin-right:6px;color:#ffa94d;" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.2"><path d="M 5 4 L 3.5 5.5 C 2.5 6.5 2.5 8 3.5 9 L 5 10.5"/><path d="M 11 4 L 12.5 5.5 C 13.5 6.5 13.5 8 12.5 9 L 11 10.5"/><path d="M 8 2 L 8 14"/></g></svg>`
};

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

  // Test button to toggle target dummy
  const targetDummyBtn = document.getElementById("targetDummyBtn");
  if (targetDummyBtn) {
    targetDummyBtn.addEventListener("click", () => {
      toggleTargetDummy();
      renderAll();
    });
  }

  // Character modal close buttons and backdrop clicks
  const statsModal = document.getElementById("statsModal");
  const statsModalCloseBtn = document.getElementById("statsModalCloseBtn");
  if (statsModalCloseBtn) {
    statsModalCloseBtn.addEventListener("click", () => {
      statsModal.style.display = "none";
      currentStatsHeroId = null;
    });
  }
  if (statsModal) {
    statsModal.addEventListener("click", (e) => {
      if (e.target === statsModal) {
        statsModal.style.display = "none";
        currentStatsHeroId = null;
      }
    });
  }

  const inventoryModal = document.getElementById("inventoryModal");
  const inventoryModalCloseBtn = document.getElementById("inventoryModalCloseBtn");
  if (inventoryModalCloseBtn) {
    inventoryModalCloseBtn.addEventListener("click", () => {
      inventoryModal.style.display = "none";
      currentInventoryHeroId = null;
    });
  }
  if (inventoryModal) {
    inventoryModal.addEventListener("click", (e) => {
      if (e.target === inventoryModal) {
        inventoryModal.style.display = "none";
        currentInventoryHeroId = null;
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
        // Check if we can travel to this zone (meets its requirement)
        const canTravel = selectedZone.zoneNumber <= state.highestUnlockedZone;
        const zoneReq = selectedZone.requirements;
        const meetsReq = !zoneReq?.killsIn?.zoneId || 
          (state.zoneKillCounts?.[zoneReq.killsIn.zoneId] ?? 0) >= (zoneReq.killsIn.count ?? 0);
        
        if (!canTravel && !meetsReq) {
          addLog("SYSTEM: You haven't met the requirements to travel to this zone.", "damage_taken");
          return;
        }
        
        state.zone = selectedZoneForTravel;
        state.activeZoneId = selectedZone.id;
        state.killsThisZone = 0;
        state.currentEnemies = [];
        state.waitingToRespawn = false;
        // Mark as unlocked when traveling so UI doesn't grey out
        state.highestUnlockedZone = Math.max(state.highestUnlockedZone || 1, state.zone);
        
        // Persist selected subArea when traveling
        if (selectedZone && selectedSubAreaForTravel) {
          state.activeSubAreaIdByZone ??= {};
          state.activeSubAreaIdByZone[selectedZone.id] = selectedSubAreaForTravel;
        }
        
        spawnEnemy();
      } else if (selectedSubAreaForTravel) {
        // Just switching sub-area in same zone
        state.activeZoneId = selectedZone.id;
        
        // Persist selected subArea
        if (selectedZone && selectedSubAreaForTravel) {
          state.activeSubAreaIdByZone ??= {};
          state.activeSubAreaIdByZone[selectedZone.id] = selectedSubAreaForTravel;
        }
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

  // Live-refresh equipment UI if inventory modal is open (for equip cooldown badge)
  const inventoryModal = document.getElementById("inventoryModal");
  if (inventoryModal && inventoryModal.style.display !== "none" && currentInventoryHeroId != null) {
    const hero = state.party.find(h => h.id === currentInventoryHeroId);
    if (hero) {
      populateEquipmentSection(hero);
    }
  }

  // FIX 14: Throttle stats modal skills refresh to once per tick
  // Only refresh if modal is open and flag is set
  if (state.needsSkillsUiRefresh) {
    const statsModal = document.getElementById("statsModal");
    if (statsModal && statsModal.style.display !== "none" && currentStatsHeroId != null) {
      const hero = state.party.find(h => h.id === currentStatsHeroId);
      if (hero) {
        updateStatsModalSkills(hero);
      }
    }
    state.needsSkillsUiRefresh = false;
  }
}

export function updateStatsModalSkills(hero) {
  // If stats modal is visible, update just the skills section
  const modal = document.getElementById("statsModal");
  if (!modal || modal.style.display === "none") return;
  
  // Use stable ID selector instead of brittle style-based selector
  let rightColumn = document.getElementById("statsSkillsColumn");
  if (!rightColumn) return; // Skills column doesn't exist or modal not initialized
  
  // Clear existing content and rebuild
  rightColumn.innerHTML = "";
  
  // Rebuild just the skills section
  // Right column: Skills / Passives (warrior Double Attack or caster Meditate)
  if (hero.classKey === "warrior") {
    // Double Attack for Warriors

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

    // Weapon Mastery section (all classes)
    const equippedWeaponType = getEquippedWeaponType(hero) || "hand_to_hand";
    const unlockedWeaponTypes = getUnlockedWeaponTypes(hero);

    const hr = document.createElement("hr");
    hr.style.cssText = "border:0;border-top:1px solid #333;margin:12px 0;";
    rightColumn.appendChild(hr);

    const weaponMasteryTitle = document.createElement("div");
    weaponMasteryTitle.style.cssText = "font-weight:600;font-size:12px;margin:8px 0 8px;color:#10b981;";
    weaponMasteryTitle.textContent = "Weapon Mastery";
    rightColumn.appendChild(weaponMasteryTitle);

    for (const weaponType of unlockedWeaponTypes) {
      const weaponSkillValue = hero.weaponSkills?.[weaponType]?.value ?? 1;
      const weaponSkillCap = getWeaponSkillCap(hero, weaponType);
      const weaponPct = Math.floor((weaponSkillValue / Math.max(1, weaponSkillCap)) * 100);
      const weaponTypeName = WEAPON_TYPE_NAMES[weaponType] || weaponType;
      const isEquipped = weaponType === equippedWeaponType;

      const weaponTypeLabel = document.createElement("div");
      weaponTypeLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:6px 0 2px;font-size:11px;color:#aaa;";
      weaponTypeLabel.innerHTML = `<span>${weaponTypeName}${isEquipped ? ' <span style="color:#10b981;">★</span>' : ''}</span> <span style='color:#ccc;'>${weaponSkillValue} / ${weaponSkillCap} (${weaponPct}%)</span>`;
      rightColumn.appendChild(weaponTypeLabel);

      const weaponBarBg = document.createElement("div");
      weaponBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:2px 0 4px;position:relative;";
      const weaponBarPercent = Math.min(100, weaponPct);
      
      const weaponBarFill = document.createElement("div");
      weaponBarFill.style.cssText = `height:100%;width:${weaponBarPercent}%;background:${isEquipped ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#4b5563,#374151)'};transition:width 0.2s;`;
      weaponBarBg.appendChild(weaponBarFill);
      
      rightColumn.appendChild(weaponBarBg);
    }
  } else if (hero.maxMana > 0) {
    // Meditate for Casters (any hero with mana)

    const skillTitle = document.createElement("div");
    skillTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#fbbf24;";
    skillTitle.textContent = "Skills / Passives";
    rightColumn.appendChild(skillTitle);

    const cap = getMeditateCap(hero.level);
    const skillVal = Math.min(hero.meditateSkill || 0, cap || 0);
    const locked = hero.level < 5 || cap === 0;

    if (locked) {
      rightColumn.appendChild(statLine("Meditate", "Locked until level 5"));
    } else {
      const skillLine = document.createElement("div");
      skillLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:4px 0;font-size:12px;color:#ccc;";
      skillLine.innerHTML = `<span>Meditate</span> <span style='color:#fff;'>${skillVal.toFixed(0)} / ${cap}</span>`;
      rightColumn.appendChild(skillLine);

      const barBg = document.createElement("div");
      barBg.style.cssText = "width:100%;height:10px;background:#252525;border-radius:5px;overflow:hidden;border:1px solid #333;margin:4px 0;position:relative;";
      const percent = cap > 0 ? Math.min(100, (skillVal / cap) * 100) : 0;
      
      const barFill = document.createElement("div");
      barFill.style.cssText = `height:100%;width:${percent}%;background:linear-gradient(90deg,#60a5fa,#3b82f6);transition:width 0.2s;`;
      barBg.appendChild(barFill);
      
      rightColumn.appendChild(barBg);
    }

    // Weapon Mastery section (all classes)
    const equippedWeaponType = getEquippedWeaponType(hero) || "hand_to_hand";
    const unlockedWeaponTypes = getUnlockedWeaponTypes(hero);

    const hr = document.createElement("hr");
    hr.style.cssText = "border:0;border-top:1px solid #333;margin:12px 0;";
    rightColumn.appendChild(hr);

    const weaponMasteryTitle = document.createElement("div");
    weaponMasteryTitle.style.cssText = "font-weight:600;font-size:12px;margin:8px 0 8px;color:#10b981;";
    weaponMasteryTitle.textContent = "Weapon Mastery";
    rightColumn.appendChild(weaponMasteryTitle);


  // Note: rightColumn already exists in the DOM from populateStatsSection,
  // we only need to clear and rebuild its content
  for (const weaponType of unlockedWeaponTypes) {
      const weaponSkillValue = hero.weaponSkills?.[weaponType]?.value ?? 1;
      const weaponSkillCap = getWeaponSkillCap(hero, weaponType);
      const weaponPct = Math.floor((weaponSkillValue / Math.max(1, weaponSkillCap)) * 100);
      const weaponTypeName = WEAPON_TYPE_NAMES[weaponType] || weaponType;
      const isEquipped = weaponType === equippedWeaponType;

      const weaponTypeLabel = document.createElement("div");
      weaponTypeLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:6px 0 2px;font-size:11px;color:#aaa;";
      weaponTypeLabel.innerHTML = `<span>${weaponTypeName}${isEquipped ? ' <span style="color:#10b981;">★</span>' : ''}</span> <span style='color:#ccc;'>${weaponSkillValue} / ${weaponSkillCap} (${weaponPct}%)</span>`;
      rightColumn.appendChild(weaponTypeLabel);

      const weaponBarBg = document.createElement("div");
      weaponBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:2px 0 4px;position:relative;";
      const weaponBarPercent = Math.min(100, weaponPct);
      
      const weaponBarFill = document.createElement("div");
      weaponBarFill.style.cssText = `height:100%;width:${weaponBarPercent}%;background:${isEquipped ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#4b5563,#374151)'};transition:width 0.2s;`;
      weaponBarBg.appendChild(weaponBarFill);
      
      rightColumn.appendChild(weaponBarBg);
    }
    
    // Magic Skills section (for casters: channeling + specializations)
    // Show Magic Skills for any hero with mana (scales to new classes automatically)
    if (hero.maxMana > 0) {
      const hr2 = document.createElement("hr");
      hr2.style.cssText = "border:0;border-top:1px solid #333;margin:12px 0;";
      rightColumn.appendChild(hr2);

      const magicTitle = document.createElement("div");
      magicTitle.style.cssText = "font-weight:600;font-size:12px;margin:8px 0 8px;color:#a78bfa;";
      magicTitle.textContent = "Magic Skills";
      rightColumn.appendChild(magicTitle);

      // Channeling skill
      const channelingSkillId = MAGIC_SKILLS.channeling;
      const chanValue = getMagicSkillValue(hero, channelingSkillId);
      const chanCap = getMagicSkillCap(hero, channelingSkillId);
      const chanPct = Math.floor((chanValue / Math.max(1, chanCap)) * 100);

      const chanLabel = document.createElement("div");
      chanLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:6px 0 2px;font-size:11px;color:#aaa;";
      chanLabel.innerHTML = `<span>Channeling</span> <span style='color:#ccc;'>${chanValue} / ${chanCap} (${chanPct}%)</span>`;
      rightColumn.appendChild(chanLabel);

      const chanBarBg = document.createElement("div");
      chanBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:2px 0 6px;position:relative;";
      const chanBarPercent = Math.min(100, chanPct);
      const chanBarFill = document.createElement("div");
      chanBarFill.style.cssText = `height:100%;width:${chanBarPercent}%;background:linear-gradient(90deg,#a78bfa,#9333ea);transition:width 0.2s;`;
      chanBarBg.appendChild(chanBarFill);
      rightColumn.appendChild(chanBarBg);

      // Specialization skills
      for (const spec of SPECIALIZATIONS) {
        if (!isMagicCategoryUnlocked(hero, spec)) continue;

        const specSkillId = MAGIC_SKILLS.spec[spec];
        const specValue = getMagicSkillValue(hero, specSkillId);
        const specCap = getMagicSkillCap(hero, specSkillId);
        const specPct = Math.floor((specValue / Math.max(1, specCap)) * 100);
        const specRatio = getSpecRatio(hero, spec);
        const manaSavingsPct = Math.floor(specRatio * 10); // 10% at cap

        const specLabel = document.createElement("div");
        specLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:6px 0 2px;font-size:11px;color:#aaa;";
        
        // Use SVG icons and proper labels
        const specName = SPEC_LABEL[spec] ?? spec;
        const specIcon = SPEC_ICON_SVG[spec] ?? "";
        
        specLabel.innerHTML = `<span style="display:flex;align-items:center;gap:6px;">${specIcon}<span>${specName}</span></span> <span style='color:#ccc;'>${specValue} / ${specCap} (${specPct}%)</span>`;
        rightColumn.appendChild(specLabel);

        const specBarBg = document.createElement("div");
        specBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:2px 0 3px;position:relative;";
        const specBarPercent = Math.min(100, specPct);
        const specBarFill = document.createElement("div");
        specBarFill.style.cssText = `height:100%;width:${specBarPercent}%;background:linear-gradient(90deg,#818cf8,#6366f1);transition:width 0.2s;`;
        specBarBg.appendChild(specBarFill);
        rightColumn.appendChild(specBarBg);

        const manaSavingsLabel = document.createElement("div");
        manaSavingsLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:0 0 6px;font-size:10px;color:#888;";
        manaSavingsLabel.innerHTML = `<span>Mana Savings</span> <span style='color:#a78bfa;'>${manaSavingsPct}%</span>`;
        rightColumn.appendChild(manaSavingsLabel);
      }
    }
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
        case "dot_fire":
          color = "#ff9f43"; // orange for Flame Lick DOT ticks
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
    
    // Debuff indicators
    const debuffRow = document.createElement("div");
    debuffRow.style.cssText = "display:flex;gap:3px;flex-wrap:wrap;margin-top:3px;";
    if (e.activeBuffs) {
      const now = state.nowMs ?? 0;
      for (const [buffKey, buffData] of Object.entries(e.activeBuffs)) {
        if (!isExpiredEffect(buffData, now)) {
          const debuffPill = document.createElement("div");
          const timeLeft = ((buffData.expiresAt - now) / 1000).toFixed(0);
          debuffPill.style.cssText = `
            padding:2px 4px;
            border-radius:2px;
            background:#d32f2f;
            color:#fff;
            font-size:8px;
            white-space:nowrap;
            border:1px solid #c62828;
          `;
          // Map buff keys to display names
          const buffDisplayNames = {
            fear: "Fear",
            mesmerize: "Mesmerize",
            stun: "Stun",
            suffocate: "Suffocate",
            taunt: "Taunt",
            flame_lick: "Flame Lick"
          };
          const debuffName = buffDisplayNames[buffKey] || buffKey;
          debuffPill.textContent = `${debuffName} (${timeLeft}s)`;
          debuffRow.appendChild(debuffPill);
        }
      }
    }
    
    card.appendChild(label);
    card.appendChild(levelDiv);
    card.appendChild(barBg);
    card.appendChild(hpLabel);
    if (debuffRow.childNodes.length > 0) {
      card.appendChild(debuffRow);
    }
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
      div.style.paddingRight = "80px";

      hero.consumableSlots = hero.consumableSlots || Array(4).fill(null);
      
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

      const consumableWrap = document.createElement("div");
      consumableWrap.style.cssText = `
        position: absolute;
        top: 8px;
        right: 12px;
        display: flex;
        flex-direction: column;
        gap: 6px;
      `;

      for (let c = 0; c < 4; c++) {
        const slotDiv = document.createElement("div");
        const isUnlocked = isConsumableSlotUnlocked(hero, c);
        const unlockLevel = getConsumableSlotUnlockLevel(c);
        const assigned = hero.consumableSlots[c];
        const itemDef = assigned ? getItemDef(assigned) : null;
        const qty = assigned ? getSharedItemQuantity(assigned) : 0;

        slotDiv.style.cssText = `
          width: 38px;
          height: 38px;
          border-radius: 6px;
          border: 1px solid ${isUnlocked ? "#444" : "#222"};
          background: ${isUnlocked ? "#0f0f0f" : "#090909"};
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: ${isUnlocked ? "pointer" : "not-allowed"};
          opacity: ${isUnlocked ? 1 : 0.4};
        `;

        if (!isUnlocked) {
          const lock = document.createElement("div");
          lock.style.cssText = "font-size:9px;color:#666;text-align:center;padding:2px;";
          lock.textContent = `Lv ${unlockLevel}`;
          slotDiv.appendChild(lock);
        } else {
          if (itemDef) {
            const icon = document.createElement("div");
            icon.style.cssText = "font-size:16px;";
            icon.textContent = itemDef.icon || "?";
            slotDiv.appendChild(icon);

            const qtyBadge = document.createElement("div");
            qtyBadge.style.cssText = `
              position: absolute;
              bottom: -6px;
              right: -6px;
              background: #111827;
              border: 1px solid #1f2937;
              border-radius: 10px;
              padding: 2px 6px;
              font-size: 10px;
              color: #a5b4fc;
              box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            `;
            qtyBadge.textContent = `x${qty}`;
            slotDiv.appendChild(qtyBadge);
            slotDiv.title = `${itemDef.name} (${qty} in stash)`;
          } else {
            slotDiv.title = "Assign a consumable";
          }

          slotDiv.addEventListener("click", (e) => {
            e.stopPropagation();
            useConsumableSlot(hero, c);
          });
          slotDiv.addEventListener("contextmenu", (e) => {
            e.preventDefault();
            e.stopPropagation();
            openConsumableMenu(hero, c, e);
          });

          slotDiv.addEventListener("dragover", (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData("application/json");
            if (data) {
              const parsed = JSON.parse(data);
              if (parsed.fromInventory) {
                slotDiv.style.borderColor = "#22c55e";
                slotDiv.style.backgroundColor = "#1a2b1a";
              }
            }
          });

          slotDiv.addEventListener("dragleave", (e) => {
            e.preventDefault();
            slotDiv.style.borderColor = "#444";
            slotDiv.style.backgroundColor = "#0f0f0f";
          });

          slotDiv.addEventListener("drop", (e) => {
            e.preventDefault();
            e.stopPropagation();
            slotDiv.style.borderColor = "#444";
            slotDiv.style.backgroundColor = "#0f0f0f";
            const data = e.dataTransfer.getData("application/json");
            if (!data) return;
            const parsed = JSON.parse(data);
            if (!parsed.fromInventory || !parsed.itemId) return;
            hero.consumableSlots = hero.consumableSlots || Array(4).fill(null);
            hero.consumableSlots[c] = parsed.itemId;
            saveGame();
            renderParty();
          });
        }

        consumableWrap.appendChild(slotDiv);
      }

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

      // Buff indicators
      const buffRow = document.createElement("div");
      buffRow.style.cssText = "display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;";
      if (hero.activeBuffs) {
        const now = state.nowMs ?? 0;
        for (const [buffKey, buffData] of Object.entries(hero.activeBuffs)) {
          if (!isExpiredEffect(buffData, now)) {
            const buffPill = document.createElement("div");
            const timeLeft = ((buffData.expiresAt - now) / 1000).toFixed(0);
            buffPill.style.cssText = `
              display:inline-block;
              padding:2px 6px;
              border-radius:3px;
              background:#1a3a1a;
              color:#86efac;
              border:1px solid #22c55e;
              font-size:9px;
            `;
            const buffName = buffKey === "courage" ? "Courage" : buffKey;
            buffPill.textContent = `${buffName} (${timeLeft}s)`;
            buffRow.appendChild(buffPill);
          }
        }
      }

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
      div.appendChild(consumableWrap);
      div.appendChild(healthBar);
      div.appendChild(healthLabel);
      
      // Append resource bars
      resourceBars.forEach(res => {
        div.appendChild(res.bar);
        div.appendChild(res.label);
      });
      
      // Append buff row
      if (buffRow.childNodes.length > 0) {
        div.appendChild(buffRow);
      }
      
      statsRow.appendChild(stats);
      if (cdRow.childNodes.length > 0) {
        statsRow.appendChild(cdRow);
      }

      div.appendChild(statsRow);
      div.appendChild(xpDiv);

      div.appendChild(btnRow);

      // Check for unassigned ability slots
      const hasUnassignedSlots = checkHasUnassignedSlots(hero);

      // Buff and debuff indicators in bottom-right corner
      const hasBuff = hero.tempACBuffTicks && hero.tempACBuffTicks > 0;
      const hasWeak = hero.tempDamageDebuffTicks && hero.tempDamageDebuffTicks > 0;
      
      if (hasBuff || hasWeak) {
        const statusContainer = document.createElement("div");
        statusContainer.style.cssText = `
          position: absolute;
          right: 6px;
          bottom: 6px;
          display: flex;
          gap: 4px;
          align-items: center;
        `;

        if (hasBuff) {
          const buff = document.createElement("div");
          buff.style.cssText = `
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: #4f46e5;
            color: #fff;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: default;
            box-shadow: 0 0 6px rgba(0,0,0,0.5);
            font-weight: bold;
          `;
          buff.textContent = hero.tempACBuffTicks.toString();
          buff.title = `Fortified: +${hero.tempACBuffAmount || 0} AC for ${hero.tempACBuffTicks} ticks`;
          statusContainer.appendChild(buff);
        }

        if (hasWeak) {
          const debuff = document.createElement("div");
          debuff.style.cssText = `
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
          statusContainer.appendChild(debuff);
        }

        div.appendChild(statusContainer);
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

// Track which hero's inventory modal is open (for live refresh)
let currentInventoryHeroId = null;

// Track which hero's stats modal is open (for live refresh)
let currentStatsHeroId = null;

function zoneKey(zone) {
  return zone?.id || `zone_${zone?.zoneNumber ?? ""}`;
}

function clamp01(x) {
  return Math.max(0, Math.min(1, x));
}

function getZoneKillProgress(req) {
  if (!req?.killsIn?.zoneId || typeof req.killsIn.count !== "number") return null;

  const zoneId = req.killsIn.zoneId;
  const need = req.killsIn.count;
  const have = state.zoneKillCounts?.[zoneId] ?? 0;
  const pct = clamp01(need > 0 ? have / need : 1);

  const zoneName = listZones()?.find(zz => zz.id === zoneId)?.name || zoneId;
  return { zoneId, zoneName, have, need, pct };
}

function getMomentumProgress() {
  // momentum toward travel forward from current zone (optional gate)
  const need = killsRequiredForZone(state.zone);
  const have = state.killsThisZone ?? 0;
  const pct = clamp01(need > 0 ? have / need : 1);
  return { have, need, pct };
}

function zoneRequirementMet(zoneDef) {
  const req = zoneDef?.requirements;
  if (!req) return true;
  if (req.killsIn?.zoneId && typeof req.killsIn.count === "number") {
    const have = state.zoneKillCounts?.[req.killsIn.zoneId] ?? 0;
    return have >= req.killsIn.count;
  }
  return true;
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

  // Ensure current zone counts as unlocked even if highestUnlockedZone is stale
  const highest = Math.max(state.highestUnlockedZone || 1, state.zone || 1);
  
  // Initialize selected zone if not set
  if (selectedZoneForTravel === null || selectedZoneForTravel === undefined) {
    selectedZoneForTravel = state.zone;
  }

  // Render zone list
  for (const z of zones) {
    const isCurrentZone = z.zoneNumber === state.zone;
    const isNextZone = z.zoneNumber === state.zone + 1;

    // Zone is unlocked if:
    // 1. Already visited
    // 2. Current zone
    // 3. Meets its direct requirement (killsIn) OR next zone and has momentum
    let unlocked = z.zoneNumber <= highest;
    if (!unlocked && isCurrentZone) unlocked = true;
    if (!unlocked && zoneRequirementMet(z)) {
      // Has met the zone's direct requirement, show as unlocked
      unlocked = true;
    } else if (!unlocked && isNextZone && canTravelForward()) {
      // Next zone and has momentum
      unlocked = true;
    }

    const isSelected = selectedZoneForTravel === z.zoneNumber;

    // Compute requirement progress (kills in specific zone)
    const reqProg = getZoneKillProgress(z.requirements);

    // If this is the next zone and it is locked, travel may also be blocked by momentum.
    // Show momentum in tooltip (and optionally as a second bar).
    const momentum = isNextZone ? getMomentumProgress() : null;

    // Locked reason text + bar percent
    const locked = !unlocked;

    // Choose what percent to show in the bar:
    // - If zone has a killsIn requirement AND it's NOT met, show that
    // - Else if next zone and locked, show momentum
    // - Else no bar
    let barPct = null;
    let barText = "";
    if (locked && reqProg && reqProg.pct < 1) {
      // Requirement not met
      barPct = reqProg.pct;
      barText = `${reqProg.have}/${reqProg.need} kills in ${reqProg.zoneName}`;
    } else if (locked && isNextZone && momentum) {
      // Requirement met (or no requirement), but momentum is missing
      barPct = momentum.pct;
      barText = `${momentum.have}/${momentum.need} kills in current zone`;
    }

    // Tooltip: explain exactly what's missing
    let tooltip = `${z.name} (${z.levelRange?.[0] ?? "?"}-${z.levelRange?.[1] ?? "?"})`;
    if (locked) {
      const parts = [];
      if (reqProg) parts.push(`Unlock: ${reqProg.have}/${reqProg.need} kills in ${reqProg.zoneName}`);
      if (isNextZone && momentum) parts.push(`Momentum: ${momentum.have}/${momentum.need} kills in current zone`);
      if (parts.length) tooltip += `\n\n${parts.join("\n")}`;
      else tooltip += `\n\nLocked. Progress required.`;
    }

    const btn = document.createElement("button");
    btn.title = tooltip;

    // Use HTML so we can show a progress bar on locked zones
    const label = `${z.name} (${z.levelRange?.[0] ?? "?"}-${z.levelRange?.[1] ?? "?"})`;

    btn.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
        <div style="font-weight:600;">${label}</div>
        ${locked ? `<div style="font-size:11px;color:#9ca3af;">Locked</div>` : ``}
      </div>
      ${
        barPct !== null
          ? `
        <div style="margin-top:6px;">
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div style="font-size:11px;color:#9ca3af;">${barText}</div>
            <div style="font-size:11px;color:#9ca3af;">${Math.floor(barPct * 100)}%</div>
          </div>
          <div style="height:6px;background:#111;border:1px solid #333;border-radius:999px;overflow:hidden;margin-top:4px;">
            <div style="height:100%;width:${Math.floor(barPct * 100)}%;background:#22c55e;"></div>
          </div>
        </div>
        `
          : ``
      }
    `;

    btn.style.cssText = `
      width: 100%;
      text-align: left;
      background: ${isSelected ? "#1f2937" : "#222"};
      border: 1px solid ${isSelected ? "#60a5fa" : "#444"};
      color: ${unlocked ? "#eee" : "#555"};
      padding: 10px;
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

    // Initialize selected sub-area if not set:
    // Prefer state-stored selection; otherwise fallback to first discovered.
    if (!selectedSubAreaForTravel) {
      const zoneId = selectedZone.id;

      const fromState = state.activeSubAreaIdByZone?.[zoneId];
      if (fromState) {
        selectedSubAreaForTravel = fromState;
      } else {
        const activeSub = getActiveSubArea(selectedZone, disc);
        selectedSubAreaForTravel = activeSub?.id;
        if (selectedSubAreaForTravel) {
          state.activeSubAreaIdByZone ??= {};
          state.activeSubAreaIdByZone[zoneId] = selectedSubAreaForTravel;
        }
      }
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

          const zoneId = selectedZone.id;
          state.activeSubAreaIdByZone ??= {};
          state.activeSubAreaIdByZone[zoneId] = sub.id;

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
  
  // FIX 14: Track which hero's stats modal is open
  currentStatsHeroId = hero.id;
  
  modal.style.display = "flex";
}

function openInventoryModal(hero) {
  const modal = document.getElementById("inventoryModal");
  const title = document.getElementById("inventoryModalTitle");
  const cls = getClassDef(hero.classKey);
  currentInventoryHeroId = hero.id;
  
  title.textContent = `${hero.name} (${cls?.name || 'Unknown'}) - Lv ${hero.level}`;
  renderConsumableStrip(hero);
  populateInventoryGrid(hero);
  populateEquipmentSection(hero);
  populateInventoryStats(hero);
  
  modal.style.display = "flex";
}

function addItemToInventory(hero, itemId, quantity) {
  const itemDef = getItemDef(itemId);
  if (!itemDef || quantity <= 0) return 0;
  const maxStack = itemDef.maxStack || 1;
  let remaining = quantity;

  // Stack first in unlocked slots (0-29)
  if (maxStack > 1) {
    for (let i = 0; i < 30 && remaining > 0; i++) {
      const slot = state.sharedInventory[i];
      if (slot && slot.id === itemId) {
        const room = maxStack - (slot.quantity || 0);
        const add = Math.min(room, remaining);
        slot.quantity = (slot.quantity || 0) + add;
        remaining -= add;
      }
    }
  }

  // Fill empty slots
  for (let i = 0; i < 30 && remaining > 0; i++) {
    if (!state.sharedInventory[i]) {
      const add = Math.min(maxStack, remaining);
      state.sharedInventory[i] = { id: itemId, quantity: add };
      remaining -= add;
    }
  }

  return quantity - remaining;
}

function addItemToStash(itemId, quantity) {
  const itemDef = getItemDef(itemId);
  if (!itemDef || quantity <= 0) return 0;
  const maxStack = itemDef.maxStack || 1;
  let remaining = quantity;

  // Stack first
  if (maxStack > 1) {
    for (let i = 0; i < state.sharedInventory.length && remaining > 0; i++) {
      const slot = state.sharedInventory[i];
      if (slot && slot.id === itemId) {
        const room = maxStack - (slot.quantity || 0);
        const add = Math.min(room, remaining);
        slot.quantity = (slot.quantity || 0) + add;
        remaining -= add;
      }
    }
  }

  // Empty slots
  for (let i = 0; i < state.sharedInventory.length && remaining > 0; i++) {
    if (!state.sharedInventory[i]) {
      const add = Math.min(maxStack, remaining);
      state.sharedInventory[i] = { id: itemId, quantity: add };
      remaining -= add;
    }
  }

  return quantity - remaining;
}

function showItemTooltip(itemDef, event) {
  // Remove any existing tooltip and context menu
  const existing = document.getElementById("itemTooltip");
  if (existing) existing.remove();
  hideItemContextMenu();

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

function showItemContextMenu(x, y, slotIndex, item, itemDef) {
  // Remove any existing context menu
  hideItemContextMenu();
  
  const menu = document.createElement("div");
  menu.id = "itemContextMenu";
  menu.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    background: #1a1a1a;
    border: 2px solid #4ade80;
    border-radius: 6px;
    padding: 4px;
    z-index: 10001;
    box-shadow: 0 4px 12px rgba(0,0,0,0.5);
    min-width: 120px;
  `;
  
  const itemName = itemDef ? itemDef.name : `[${item.id}]`;
  const itemQty = item.quantity || 1;
  
  const destroyOption = document.createElement("div");
  destroyOption.style.cssText = `
    padding: 8px 12px;
    cursor: pointer;
    color: #ef4444;
    font-size: 12px;
    border-radius: 4px;
    transition: background 0.2s;
  `;
  destroyOption.textContent = `Destroy ${itemName}${itemQty > 1 ? ` (x${itemQty})` : ''}`;
  destroyOption.addEventListener("mouseenter", () => {
    destroyOption.style.background = "#2a2a2a";
  });
  destroyOption.addEventListener("mouseleave", () => {
    destroyOption.style.background = "transparent";
  });
  destroyOption.addEventListener("click", () => {
    // Confirm destruction
    if (confirm(`Are you sure you want to destroy ${itemName}${itemQty > 1 ? ` (x${itemQty})` : ''}?`)) {
      state.sharedInventory[slotIndex] = null;
      addLog(`Destroyed ${itemName}${itemQty > 1 ? ` x${itemQty}` : ''}.`, "normal");
      
      // Refresh UI
      const hero = state.party[0];
      if (hero) {
        populateInventoryGrid(hero);
        populateInventoryStats(hero);
      }
      saveGame();
    }
    hideItemContextMenu();
  });
  
  menu.appendChild(destroyOption);
  document.body.appendChild(menu);
  
  // Keep menu in viewport
  setTimeout(() => {
    const rect = menu.getBoundingClientRect();
    if (rect.right > window.innerWidth) {
      menu.style.left = (window.innerWidth - rect.width - 10) + "px";
    }
    if (rect.bottom > window.innerHeight) {
      menu.style.top = (window.innerHeight - rect.height - 10) + "px";
    }
  }, 0);
  
  // Close menu on any click outside
  setTimeout(() => {
    document.addEventListener("click", hideItemContextMenu, { once: true });
  }, 0);
}

function hideItemContextMenu() {
  const menu = document.getElementById("itemContextMenu");
  if (menu) menu.remove();
}

function renderConsumableStrip(hero) {
  const strip = document.getElementById("inventoryConsumableStrip");
  if (!strip) return;
  strip.innerHTML = "";

  const label = document.createElement("div");
  label.style.cssText = "font-size:12px;font-weight:700;color:#e2e8f0;margin-bottom:6px;";
  label.textContent = "Quick Consumables";
  strip.appendChild(label);

  const row = document.createElement("div");
  row.style.cssText = "display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;";
  strip.appendChild(row);

  hero.consumableSlots = hero.consumableSlots || Array(4).fill(null);

  for (let c = 0; c < 4; c++) {
    const isUnlocked = isConsumableSlotUnlocked(hero, c);
    const unlockLevel = getConsumableSlotUnlockLevel(c);
    const assigned = hero.consumableSlots[c];
    const itemDef = assigned ? getItemDef(assigned) : null;
    const qty = assigned ? getSharedItemQuantity(assigned) : 0;

    const slotDiv = document.createElement("div");
    slotDiv.style.cssText = `
      width: 48px;
      height: 48px;
      border-radius: 8px;
      border: 1px solid ${isUnlocked ? "#475569" : "#1f2937"};
      background: ${isUnlocked ? "#0f172a" : "#0b1020"};
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: ${isUnlocked ? "pointer" : "not-allowed"};
      opacity: ${isUnlocked ? 1 : 0.5};
      box-shadow: 0 4px 12px rgba(0,0,0,0.35);
    `;

    if (!isUnlocked) {
      const lock = document.createElement("div");
      lock.style.cssText = "font-size:10px;color:#64748b;text-align:center;padding:2px;";
      lock.textContent = `Lv ${unlockLevel}`;
      slotDiv.appendChild(lock);
    } else {
      if (itemDef) {
        const icon = document.createElement("div");
        icon.style.cssText = "font-size:18px;";
        icon.textContent = itemDef.icon || "?";
        slotDiv.appendChild(icon);

        const qtyBadge = document.createElement("div");
        qtyBadge.style.cssText = `
          position: absolute;
          bottom: -6px;
          right: -6px;
          background: #111827;
          border: 1px solid #1f2937;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
          color: #a5b4fc;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
        `;
        qtyBadge.textContent = `x${qty}`;
        slotDiv.appendChild(qtyBadge);
        slotDiv.title = `${itemDef.name} (${qty} in stash)`;
      } else {
        slotDiv.title = "Assign a consumable";
      }

      slotDiv.addEventListener("click", (e) => {
        e.stopPropagation();
        useConsumableSlot(hero, c);
        renderConsumableStrip(hero);
        populateInventoryGrid(hero);
      });

      slotDiv.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        openConsumableMenu(hero, c, e);
      });

      slotDiv.addEventListener("dragover", (e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("application/json");
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.fromInventory) {
            slotDiv.style.borderColor = "#22c55e";
            slotDiv.style.backgroundColor = "#1a2b1a";
          }
        }
      });

      slotDiv.addEventListener("dragleave", (e) => {
        e.preventDefault();
        slotDiv.style.borderColor = "#475569";
        slotDiv.style.backgroundColor = "#0f172a";
      });

      slotDiv.addEventListener("drop", (e) => {
        e.preventDefault();
        e.stopPropagation();
        slotDiv.style.borderColor = "#475569";
        slotDiv.style.backgroundColor = "#0f172a";
        const data = e.dataTransfer.getData("application/json");
        if (!data) return;
        const parsed = JSON.parse(data);
        if (!parsed.fromInventory || !parsed.itemId) return;
        hero.consumableSlots = hero.consumableSlots || Array(4).fill(null);
        hero.consumableSlots[c] = parsed.itemId;
        saveGame();
        renderConsumableStrip(hero);
        renderParty();
        populateInventoryGrid(hero);
      });
    }

    row.appendChild(slotDiv);
  }
}

function populateInventoryGrid(hero) {
  const container = document.getElementById("inventoryGridContainer");
  container.innerHTML = "";
  
  if (!state.sharedInventory || state.sharedInventory.length === 0) {
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
    
    const item = state.sharedInventory[i];
    
    if (item && !isLocked) {
      const itemDef = getItemDef(item.id);
      if (!itemDef) {
        // Missing item definition - show placeholder
        const icon = document.createElement("div");
        icon.style.cssText = "font-size: 20px; color: #ef4444;";
        icon.textContent = "⚠";
        slot.appendChild(icon);
        const name = document.createElement("div");
        name.style.cssText = "font-size: 9px; text-align: center; color: #ef4444;";
        name.textContent = `[${item.id}]`;
        slot.appendChild(name);
      } else {
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

        // Make it draggable
        slot.draggable = true;
        slot.style.cursor = "grab";
        slot.addEventListener("dragstart", (e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("application/json", JSON.stringify({
            fromInventory: true,
            slotIndex: i,
            itemId: item.id
          }));
          slot.style.opacity = "0.6";
          hideItemTooltip();
        });
        slot.addEventListener("dragend", () => {
          slot.style.opacity = item ? "1" : "0.4";
        });
      }
      
      // Add right-click context menu for destroying items
      slot.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        e.stopPropagation();
        showItemContextMenu(e.clientX, e.clientY, i, item, itemDef);
      });
    } else if (!isLocked) {
      // Empty slot - accept drops from equipment
      slot.addEventListener("dragover", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = e.dataTransfer.getData("application/json");
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.fromEquipment || parsed.fromInventory) {
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
        const { slotKey, itemId, fromEquipment, fromInventory, slotIndex } = parsed;
        const itemDef = getItemDef(itemId);
        if (!itemDef) return;

        let quantityToPlace = 0;

        if (fromEquipment) {
          hero.equipment[slotKey] = null;
          quantityToPlace = 1;
        } else if (fromInventory) {
          const source = state.sharedInventory[slotIndex];
          if (source && source.id === itemId) {
            state.sharedInventory[slotIndex] = null;
            quantityToPlace = source.quantity || 1;
          }
        } else {
          return;
        }

        if (quantityToPlace <= 0) return;

        const maxStack = itemDef.maxStack || 1;
        const placedHere = Math.min(maxStack, quantityToPlace);
        state.sharedInventory[i] = { id: itemId, quantity: placedHere };
        const remaining = quantityToPlace - placedHere;
        if (remaining > 0) {
          addItemToInventory(hero, itemId, remaining);
        }
        
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
    
    // Check if this weapon slot is on cooldown
    const isWeaponSlot = slotKey === "main" || slotKey === "off";
    const equipCd = hero.equipCd || 0;
    const hasCooldown = isWeaponSlot && equipCd > 0;
    
    if (equippedItem && !itemDef) {
      // Missing item definition - show placeholder
      slotDiv.innerHTML = `
        <div style="font-size:18px;color:#ef4444;">⚠</div>
        <div style="font-size:10px;color:#ef4444;">[${equippedItem.id}]</div>
      `;
      slotDiv.style.cursor = "not-allowed";
    } else if (itemDef) {
      // Check for cooldown overlay
      const cooldownBadge = hasCooldown 
        ? `<div style="position:absolute;top:4px;right:4px;background:#ef4444;color:#fff;border-radius:4px;padding:2px 6px;font-size:10px;font-weight:bold;line-height:1;">🔒 ${equipCd}</div>`
        : '';
      
      slotDiv.innerHTML = `
        <div style="position:relative;width:100%;">
          ${cooldownBadge}
          <div style="font-size:18px;${hasCooldown ? 'opacity:0.4;' : ''}">${itemDef.icon}</div>
          <div style="font-size:10px;color:${hasCooldown ? '#888' : '#4ade80'};">${itemDef.name}</div>
        </div>
      `;
      
      // Gray out the slot if on cooldown
      if (hasCooldown) {
        slotDiv.style.opacity = "0.6";
        slotDiv.style.cursor = "not-allowed";
        slotDiv.style.borderColor = "#ef4444";
      }
      
      // Add tooltip on hover
      slotDiv.addEventListener("mouseenter", (e) => {
        showItemTooltip(itemDef, e);
      });
      slotDiv.addEventListener("mouseleave", () => {
        hideItemTooltip();
      });
      // Make equipped items draggable so they can be removed (unless on cooldown)
      slotDiv.draggable = !hasCooldown;
      if (!hasCooldown) {
        slotDiv.style.cursor = "grab";
      }
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
      const { slotIndex, itemId, fromInventory } = parsed;
      if (!fromInventory) return;
      const itemDef = getItemDef(itemId);
      
      if (!itemDef) {
        addLog(`Cannot equip unknown item [${itemId}].`, "normal");
        return;
      }
      if (!itemDef.stats) return; // Only gear can be equipped
      
      // Check equip cooldown for weapon swaps during combat (BEFORE consuming item)
      const isWeaponSlot = slotKey === "main" || slotKey === "off";
      const inCombat = hero.inCombat && state.currentEnemies.length > 0;
      const equipCd = hero.equipCd || 0;
      
      if (isWeaponSlot && inCombat && equipCd > 0) {
        addLog(`Cannot swap weapons yet (${equipCd} tick${equipCd > 1 ? 's' : ''}).`, "error");
        return;
      }

      // Check weapon type unlocks (BEFORE consuming item)
      if (isWeaponSlot && itemDef.weaponType) {
        if (!canEquipWeapon(hero, itemDef)) {
          addLog(`${hero.name} cannot equip ${itemDef.name} (locked weapon type).`, "error");
          return;
        }
      }
      
      // Consume one from shared inventory
      const source = state.sharedInventory[slotIndex];
      if (!source || source.id !== itemId) return;
      source.quantity = (source.quantity || 1) - 1;
      if (source.quantity <= 0) {
        state.sharedInventory[slotIndex] = null;
      }
      
      // Equip the item
      const oldEquipped = hero.equipment[slotKey];
      hero.equipment[slotKey] = { id: itemId, quantity: 1 };
      
      // If there was an old equipped item, return it to inventory
      if (oldEquipped) {
        const qty = oldEquipped.quantity || 1;
        const added = addItemToInventory(hero, oldEquipped.id, qty);
        const leftover = qty - added;
        if (leftover > 0) {
          addItemToStash(oldEquipped.id, leftover);
        }
      }
      
      // Recalculate hero stats (applies item stats etc.)
      refreshHeroDerived(hero);

      // If weapon slot changed while in combat, hard reset swing timer immediately
      if (isWeaponSlot && inCombat) {
        const baseDelay = getBaseDelayTenths(hero);
        const hastePct = getTotalHastePct(hero);
        const newSwingTicks = computeSwingTicks(baseDelay, hastePct);
        hero.swingTicks = newSwingTicks;
        hero.swingCd = newSwingTicks; // Hard reset on swap
        
        // Set equip cooldown to prevent spam
        hero.equipCd = 2;

        const newItemDef = getItemDef(itemId);
        const newItemName = newItemDef ? newItemDef.name : itemId;
        addLog(`${hero.name} swaps to ${newItemName} and resets their swing timer!`, "normal");
      }
      
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

    const normalizedKey = (skill.key || "").replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase();
    const actionDef = ACTIONS[skill.key] || ACTIONS[normalizedKey];

    let costStr = "No cost";
    if (actionDef?.cost) {
      const parts = [];
      if (actionDef.cost.mana) parts.push(`Mana: ${actionDef.cost.mana}`);
      if (actionDef.cost.endurance) parts.push(`End: ${actionDef.cost.endurance}`);
      costStr = parts.length > 0 ? parts.join(" / ") : "No cost";
    }

    const cooldown = actionDef?.cooldownTicks != null ? ` | CD: ${actionDef.cooldownTicks}t` : "";
    skillInfo.textContent = costStr + cooldown;
    
    skillDiv.appendChild(skillTitle);
    skillDiv.appendChild(skillInfo);

    if (skill.description) {
      const skillDesc = document.createElement("div");
      skillDesc.style.cssText = "font-size:9px;color:#ccc;margin-top:4px;line-height:1.3;";
      skillDesc.textContent = skill.description;
      skillDiv.appendChild(skillDesc);
    }
    
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

function getConsumableSlotUnlockLevel(slotIndex) {
  return CONSUMABLE_SLOT_UNLOCK_LEVELS[slotIndex] ?? Infinity;
}

function isConsumableSlotUnlocked(hero, slotIndex) {
  return hero?.level >= getConsumableSlotUnlockLevel(slotIndex);
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

function getSharedItemQuantity(itemId) {
  if (!itemId || !state.sharedInventory) return 0;
  let total = 0;
  for (const slot of state.sharedInventory) {
    if (slot?.id === itemId) {
      total += slot.quantity ?? 1;
    }
  }
  return total;
}

function consumeSharedItem(itemId) {
  if (!itemId || !state.sharedInventory) return false;
  for (let i = 0; i < state.sharedInventory.length; i++) {
    const slot = state.sharedInventory[i];
    if (slot?.id === itemId && (slot.quantity ?? 1) > 0) {
      const newQty = (slot.quantity ?? 1) - 1;
      if (newQty > 0) {
        slot.quantity = newQty;
      } else {
        state.sharedInventory[i] = null;
      }
      return true;
    }
  }
  return false;
}

function listSharedConsumables() {
  const buckets = new Map();
  if (!state.sharedInventory) return [];
  for (const slot of state.sharedInventory) {
    if (!slot?.id) continue;
    const def = getItemDef(slot.id);
    if (!def || (def.maxStack || 1) <= 1) continue; // Only stackable consumables
    const qty = slot.quantity ?? 1;
    const bucket = buckets.get(def.id) || { itemDef: def, quantity: 0 };
    bucket.quantity += qty;
    buckets.set(def.id, bucket);
  }
  return Array.from(buckets.values());
}

function applyConsumableEffect(hero, itemId) {
  if (!hero || !itemId) return { consumed: false, reason: "Invalid target" };
  const defs = {
    health_potion_small: { type: "health", percent: 0.25, min: 8, logType: "healing" },
    health_potion: { type: "health", percent: 0.4, min: 15, logType: "healing" },
    mana_potion_small: { type: "mana", percent: 0.2, min: 8, logType: "mana_regen" },
    mana_potion: { type: "mana", percent: 0.35, min: 15, logType: "mana_regen" }
  };

  const cfg = defs[itemId];
  if (!cfg) return { consumed: false, reason: "No effect" };

  if (cfg.type === "health") {
    const missing = Math.max(0, (hero.maxHP || 0) - (hero.health || 0));
    if (missing <= 0) return { consumed: false, reason: "Already at full health" };
    const healAmount = Math.min(missing, Math.max(cfg.min, Math.floor((hero.maxHP || 0) * cfg.percent)));
    hero.health = Math.min(hero.maxHP || 0, (hero.health || 0) + healAmount);
    return {
      consumed: true,
      message: `${hero.name} drinks a potion and heals ${healAmount.toFixed(0)} HP!`,
      logType: cfg.logType
    };
  }

  if (cfg.type === "mana") {
    if ((hero.maxMana || 0) <= 0) {
      return { consumed: false, reason: "No mana pool" };
    }
    const missing = Math.max(0, (hero.maxMana || 0) - (hero.mana || 0));
    if (missing <= 0) return { consumed: false, reason: "Mana already full" };
    const restore = Math.min(missing, Math.max(cfg.min, Math.floor((hero.maxMana || 0) * cfg.percent)));
    hero.mana = Math.min(hero.maxMana || 0, (hero.mana || 0) + restore);
    return {
      consumed: true,
      message: `${hero.name} drinks a potion and restores ${restore.toFixed(0)} mana!`,
      logType: cfg.logType
    };
  }

  return { consumed: false, reason: "No effect" };
}

let activeConsumableMenu = null;

function closeConsumableMenu() {
  if (activeConsumableMenu) {
    activeConsumableMenu.remove();
    activeConsumableMenu = null;
    document.removeEventListener("click", closeConsumableMenu);
  }
}

function openConsumableMenu(hero, slotIndex, anchorEvent = null) {
  closeConsumableMenu();

  const menu = document.createElement("div");
  activeConsumableMenu = menu;
  menu.style.cssText = `
    position: fixed;
    z-index: 9999;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    padding: 8px;
    min-width: 180px;
    color: #e2e8f0;
  `;
  if (anchorEvent) {
    const offsetX = 8;
    const offsetY = 8;
    menu.style.left = (anchorEvent.clientX + offsetX) + "px";
    menu.style.top = (anchorEvent.clientY + offsetY) + "px";
  } else {
    menu.style.right = "24px";
    menu.style.top = "24px";
  }

  const header = document.createElement("div");
  header.style.cssText = "display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;font-size:12px;font-weight:700;";
  header.textContent = "Assign consumable";
  menu.appendChild(header);

  const list = document.createElement("div");
  list.style.cssText = "display:flex;flex-direction:column;gap:6px;max-height:240px;overflow:auto;";

  const buckets = listSharedConsumables();
  if (buckets.length === 0) {
    const empty = document.createElement("div");
    empty.style.cssText = "font-size:11px;color:#94a3b8;";
    empty.textContent = "No consumables in shared inventory.";
    list.appendChild(empty);
  } else {
    for (const bucket of buckets) {
      const row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:8px;padding:6px;border:1px solid #1e293b;border-radius:6px;background:#0b1221;cursor:pointer;";
      const icon = document.createElement("div");
      icon.style.cssText = "font-size:16px;";
      icon.textContent = bucket.itemDef.icon || "?";
      const name = document.createElement("div");
      name.style.cssText = "display:flex;flex-direction:column;gap:2px;";
      const line1 = document.createElement("div");
      line1.style.cssText = "font-size:12px;font-weight:700;color:#e2e8f0;";
      line1.textContent = bucket.itemDef.name;
      const line2 = document.createElement("div");
      line2.style.cssText = "font-size:11px;color:#94a3b8;";
      line2.textContent = `x${bucket.quantity}`;
      name.appendChild(line1);
      name.appendChild(line2);
      row.appendChild(icon);
      row.appendChild(name);
      row.addEventListener("click", (e) => {
        e.stopPropagation();
        hero.consumableSlots = hero.consumableSlots || Array(4).fill(null);
        hero.consumableSlots[slotIndex] = bucket.itemDef.id;
        saveGame();
        renderParty();
        closeConsumableMenu();
      });
      list.appendChild(row);
    }
  }

  menu.appendChild(list);

  const footer = document.createElement("div");
  footer.style.cssText = "display:flex;gap:8px;justify-content:flex-end;margin-top:8px;";
  const clearBtn = document.createElement("button");
  clearBtn.textContent = "Clear";
  clearBtn.style.cssText = "padding:6px 8px;font-size:11px;";
  clearBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    hero.consumableSlots = hero.consumableSlots || Array(4).fill(null);
    hero.consumableSlots[slotIndex] = null;
    saveGame();
    renderParty();
    closeConsumableMenu();
  });
  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Close";
  closeBtn.style.cssText = "padding:6px 8px;font-size:11px;";
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    closeConsumableMenu();
  });
  footer.appendChild(clearBtn);
  footer.appendChild(closeBtn);
  menu.appendChild(footer);

  menu.addEventListener("click", (e) => e.stopPropagation());
  document.body.appendChild(menu);
  setTimeout(() => {
    document.addEventListener("click", closeConsumableMenu, { once: true });
  }, 0);
}

function useConsumableSlot(hero, slotIndex) {
  if (!isConsumableSlotUnlocked(hero, slotIndex)) return;
  if (!hero.consumableSlots) hero.consumableSlots = Array(4).fill(null);
  const itemId = hero.consumableSlots[slotIndex];
  if (!itemId) {
    return openConsumableMenu(hero, slotIndex);
  }
  if (hero.isDead) {
    addLog(`${hero.name} cannot use a consumable while dead.`, "normal");
    return;
  }
  const itemDef = getItemDef(itemId);
  if (!itemDef) {
    hero.consumableSlots[slotIndex] = null;
    addLog("Unknown consumable removed from slot.", "normal");
    renderParty();
    return;
  }
  const available = getSharedItemQuantity(itemId);
  if (available <= 0) {
    addLog(`No ${itemDef.name} left in shared inventory.`, "normal");
    return;
  }

  const result = applyConsumableEffect(hero, itemId);
  if (!result.consumed) {
    addLog(result.reason || `Cannot use ${itemDef.name} now.`, "normal");
    return;
  }

  const took = consumeSharedItem(itemId);
  if (!took) {
    addLog(`No ${itemDef.name} left in shared inventory.`, "normal");
    return;
  }

  addLog(result.message, result.logType || "skill");
  recalcPartyTotals();
  renderParty();
  renderBattleFooter();
  saveGame();
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
  statsBox.style.gap = "30px";
  statsBox.style.flexWrap = "nowrap";
  statsBox.style.padding = "0 0 0 0";
  
  const stats = hero.stats || {};
  const derived = {
    hp: `${Math.floor(hero.health)} / ${Math.floor(hero.maxHP)}`,
    mana: hero.maxMana > 0 ? `${Math.floor(hero.mana)} / ${Math.floor(hero.maxMana)}` : "-",
    endurance: hero.maxEndurance > 0 ? `${Math.floor(hero.endurance)} / ${Math.floor(hero.maxEndurance)}` : "-",
    dps: hero.dps?.toFixed ? hero.dps.toFixed(1) : hero.dps || 0,
    healing: hero.healing?.toFixed ? hero.healing.toFixed(1) : hero.healing || 0
  };

  const primary = hero.primaryStat ? hero.primaryStat.toUpperCase() : "-";
  const raceDef = getRaceDef(hero.raceKey || hero.race || state.playerRaceKey);
  const raceName = hero.raceName || raceDef?.name || (hero.raceKey || "-");

  // Left column: core stats
  const leftColumn = document.createElement("div");
  leftColumn.style.flex = "1 1 auto";
  leftColumn.style.minWidth = "140px";
  
  const primaryStatLine = statLine("Primary", primary);
  primaryStatLine.style.marginBottom = "6px";
  leftColumn.appendChild(primaryStatLine);

  const raceLine = statLine("Race", raceName);
  raceLine.style.marginBottom = "6px";
  leftColumn.appendChild(raceLine);
  
  const hpLine = statLine("HP", derived.hp);
  hpLine.style.marginBottom = "6px";
  leftColumn.appendChild(hpLine);
  
  const manaLine = statLine("Mana", derived.mana);
  manaLine.style.marginBottom = "6px";
  leftColumn.appendChild(manaLine);
  
  const enduranceLine = statLine("Endurance", derived.endurance);
  enduranceLine.style.marginBottom = "6px";
  leftColumn.appendChild(enduranceLine);
  
  const dpsLine = statLine("DPS", derived.dps);
  dpsLine.style.marginBottom = "6px";
  leftColumn.appendChild(dpsLine);
  
  const healingLine = statLine("Healing", derived.healing);
  healingLine.style.marginBottom = "14px";
  leftColumn.appendChild(healingLine);

  leftColumn.appendChild(document.createElement("hr"));
  const coreStats = [
    ["AC", stats.ac ?? 0],
    ["STR", stats.str ?? 0],
    ["CON", stats.con ?? 0],
    ["DEX", stats.dex ?? 0],
    ["AGI", stats.agi ?? 0],
    ["WIS", stats.wis ?? 0],
    ["INT", stats.int ?? 0],
    ["CHA", stats.cha ?? 0]
  ];
  for (const [label, val] of coreStats) {
    const line = statLine(label, val);
    line.style.marginBottom = "5px";
    leftColumn.appendChild(line);
  }

  const resistHeader = document.createElement("div");
  resistHeader.style.cssText = "font-weight:600;font-size:12px;margin:10px 0 6px;color:#38bdf8;";
  resistHeader.textContent = "Resists";
  leftColumn.appendChild(resistHeader);

  const resists = hero.resists || {};
  const resistStats = [
    ["Magic", resists.magic ?? 0],
    ["Elemental", resists.elemental ?? 0],
    ["Contagion", resists.contagion ?? 0],
    ["Physical", resists.physical ?? 0]
  ];
  for (const [label, val] of resistStats) {
    const line = statLine(label, val);
    line.style.marginBottom = "5px";
    leftColumn.appendChild(line);
  }
  
  statsBox.appendChild(leftColumn);

  // Right column: Skills / Passives (warrior Double Attack or caster Meditate)
  if (hero.classKey === "warrior") {
    const rightColumn = document.createElement("div");
    rightColumn.id = "statsSkillsColumn";
    rightColumn.style.flex = "1 1 auto";
    rightColumn.style.minWidth = "140px";

    const skillTitle = document.createElement("div");
    skillTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#fbbf24;";
    skillTitle.textContent = "Skills / Passives";
    rightColumn.appendChild(skillTitle);

    const cap = doubleAttackCap(hero.level);
    const skillVal = Math.min(hero.doubleAttackSkill || 0, cap || 0);
    const locked = hero.level <= 4;
    const procPct = doubleAttackProcChance(skillVal) * 100;

    if (locked) {
      rightColumn.appendChild(statLine("Double Attack", "Locked until level 5"));
    } else {
      const skillLine = document.createElement("div");
      skillLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:0 0 5px;font-size:12px;color:#ccc;";
      skillLine.innerHTML = `<span>Double Attack</span> <span style='color:#fff;'>${skillVal.toFixed(0)} / ${cap}</span>`;
      rightColumn.appendChild(skillLine);

      const procLine = document.createElement("div");
      procLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:0 0 10px;padding-left:8px;font-size:10px;color:#999;opacity:0.9;";
      procLine.innerHTML = `<span>Proc Chance</span> <span style='color:#fbbf24;'>${procPct.toFixed(1)}%</span>`;
      rightColumn.appendChild(procLine);

      const barBg = document.createElement("div");
      barBg.style.cssText = "width:100%;height:10px;background:#252525;border-radius:5px;overflow:hidden;border:1px solid #333;margin:4px 0 12px;position:relative;";
      const percent = cap > 0 ? Math.min(100, (skillVal / cap) * 100) : 0;
      const nextPercent = cap > 0 && skillVal < cap ? Math.min(100, ((skillVal + 1) / cap) * 100) : 100;
      
      const barFill = document.createElement("div");
      barFill.style.cssText = `height:100%;width:${percent}%;background:linear-gradient(90deg,#fbbf24,#f59e0b);transition:width 0.2s;`;
      barBg.appendChild(barFill);
      
      rightColumn.appendChild(barBg);
    }

    // Weapon Mastery section (all classes)
    const equippedWeaponType = getEquippedWeaponType(hero) || "hand_to_hand";
    const unlockedWeaponTypes = getUnlockedWeaponTypes(hero);

    const hr = document.createElement("hr");
    hr.style.cssText = "border:0;border-top:1px solid #333;margin:16px 0;";
    rightColumn.appendChild(hr);

    const weaponMasteryTitle = document.createElement("div");
    weaponMasteryTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#10b981;";
    weaponMasteryTitle.textContent = "Weapon Mastery";
    rightColumn.appendChild(weaponMasteryTitle);

    for (const weaponType of unlockedWeaponTypes) {
      const weaponSkillValue = hero.weaponSkills?.[weaponType]?.value ?? 1;
      const weaponSkillCap = getWeaponSkillCap(hero, weaponType);
      const weaponPct = Math.floor((weaponSkillValue / Math.max(1, weaponSkillCap)) * 100);
      const weaponTypeName = WEAPON_TYPE_NAMES[weaponType] || weaponType;
      const isEquipped = weaponType === equippedWeaponType;

      const weaponTypeLabel = document.createElement("div");
      weaponTypeLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:10px 0 5px;font-size:11px;color:#aaa;";
      weaponTypeLabel.innerHTML = `<span>${weaponTypeName}${isEquipped ? ' <span style="color:#10b981;">★</span>' : ''}</span> <span style='color:#ccc;'>${weaponSkillValue} / ${weaponSkillCap} (${weaponPct}%)</span>`;
      rightColumn.appendChild(weaponTypeLabel);

      const weaponBarBg = document.createElement("div");
      weaponBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:4px 0 8px;position:relative;";
      const weaponBarPercent = Math.min(100, weaponPct);
      
      const weaponBarFill = document.createElement("div");
      weaponBarFill.style.cssText = `height:100%;width:${weaponBarPercent}%;background:${isEquipped ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#4b5563,#374151)'};transition:width 0.2s;`;
      weaponBarBg.appendChild(weaponBarFill);
      
      rightColumn.appendChild(weaponBarBg);
    }
    
    statsBox.appendChild(rightColumn);
  } else if (["cleric", "wizard", "enchanter"].includes(hero.classKey)) {
    const rightColumn = document.createElement("div");
    rightColumn.id = "statsSkillsColumn";
    rightColumn.style.flex = "1 1 auto";
    rightColumn.style.minWidth = "140px";

    const skillTitle = document.createElement("div");
    skillTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#fbbf24;";
    skillTitle.textContent = "Skills / Passives";
    rightColumn.appendChild(skillTitle);

    const cap = getMeditateCap(hero.level);
    const skillVal = Math.min(hero.meditateSkill || 0, cap || 0);
    const locked = hero.level <= 4;

    if (locked) {
      rightColumn.appendChild(statLine("Meditate", "Locked until level 5"));
    } else {
      const skillLine = document.createElement("div");
      skillLine.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:0 0 5px;font-size:12px;color:#ccc;";
      skillLine.innerHTML = `<span>Meditate</span> <span style='color:#fff;'>${skillVal.toFixed(0)} / ${cap}</span>`;
      rightColumn.appendChild(skillLine);

      const barBg = document.createElement("div");
      barBg.style.cssText = "width:100%;height:10px;background:#252525;border-radius:5px;overflow:hidden;border:1px solid #333;margin:4px 0 12px;position:relative;";
      const percent = cap > 0 ? Math.min(100, (skillVal / cap) * 100) : 0;
      
      const barFill = document.createElement("div");
      barFill.style.cssText = `height:100%;width:${percent}%;background:linear-gradient(90deg,#60a5fa,#3b82f6);transition:width 0.2s;`;
      barBg.appendChild(barFill);
      
      rightColumn.appendChild(barBg);
    }

    // Weapon Mastery section (all classes)
    const equippedWeaponType = getEquippedWeaponType(hero) || "hand_to_hand";
    const unlockedWeaponTypes = getUnlockedWeaponTypes(hero);

    const hr = document.createElement("hr");
    hr.style.cssText = "border:0;border-top:1px solid #333;margin:16px 0;";
    rightColumn.appendChild(hr);

    const weaponMasteryTitle = document.createElement("div");
    weaponMasteryTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#10b981;";
    weaponMasteryTitle.textContent = "Weapon Mastery";
    rightColumn.appendChild(weaponMasteryTitle);

    for (const weaponType of unlockedWeaponTypes) {
      const weaponSkillValue = hero.weaponSkills?.[weaponType]?.value ?? 1;
      const weaponSkillCap = getWeaponSkillCap(hero, weaponType);
      const weaponPct = Math.floor((weaponSkillValue / Math.max(1, weaponSkillCap)) * 100);
      const weaponTypeName = WEAPON_TYPE_NAMES[weaponType] || weaponType;
      const isEquipped = weaponType === equippedWeaponType;

      const weaponTypeLabel = document.createElement("div");
      weaponTypeLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:10px 0 5px;font-size:11px;color:#aaa;";
      weaponTypeLabel.innerHTML = `<span>${weaponTypeName}${isEquipped ? ' <span style="color:#10b981;">★</span>' : ''}</span> <span style='color:#ccc;'>${weaponSkillValue} / ${weaponSkillCap} (${weaponPct}%)</span>`;
      rightColumn.appendChild(weaponTypeLabel);

      const weaponBarBg = document.createElement("div");
      weaponBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:4px 0 8px;position:relative;";
      const weaponBarPercent = Math.min(100, weaponPct);
      
      const weaponBarFill = document.createElement("div");
      weaponBarFill.style.cssText = `height:100%;width:${weaponBarPercent}%;background:${isEquipped ? 'linear-gradient(90deg,#10b981,#059669)' : 'linear-gradient(90deg,#4b5563,#374151)'};transition:width 0.2s;`;
      weaponBarBg.appendChild(weaponBarFill);
      
      rightColumn.appendChild(weaponBarBg);
    }
    
    // Magic Skills section (for casters: channeling + specializations)
    const hr2 = document.createElement("hr");
    hr2.style.cssText = "border:0;border-top:1px solid #333;margin:16px 0;";
    rightColumn.appendChild(hr2);

    const magicTitle = document.createElement("div");
    magicTitle.style.cssText = "font-weight:600;font-size:12px;margin:0 0 12px;color:#a78bfa;";
    magicTitle.textContent = "Magic Skills";
    rightColumn.appendChild(magicTitle);

    // Channeling skill
    const channelingSkillId = MAGIC_SKILLS.channeling;
    const chanValue = getMagicSkillValue(hero, channelingSkillId);
    const chanCap = getMagicSkillCap(hero, channelingSkillId);
    const chanPct = Math.floor((chanValue / Math.max(1, chanCap)) * 100);

    const chanLabel = document.createElement("div");
    chanLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:0 0 5px;font-size:11px;color:#aaa;";
    chanLabel.innerHTML = `<span>Channeling</span> <span style='color:#ccc;'>${chanValue} / ${chanCap} (${chanPct}%)</span>`;
    rightColumn.appendChild(chanLabel);

    const chanBarBg = document.createElement("div");
    chanBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:4px 0 12px;position:relative;";
    const chanBarPercent = Math.min(100, chanPct);
    const chanBarFill = document.createElement("div");
    chanBarFill.style.cssText = `height:100%;width:${chanBarPercent}%;background:linear-gradient(90deg,#a78bfa,#9333ea);transition:width 0.2s;`;
    chanBarBg.appendChild(chanBarFill);
    rightColumn.appendChild(chanBarBg);

    // Specialization skills
    for (const spec of SPECIALIZATIONS) {
      if (!isMagicCategoryUnlocked(hero, spec)) continue;

      const specSkillId = MAGIC_SKILLS.spec[spec];
      const specValue = getMagicSkillValue(hero, specSkillId);
      const specCap = getMagicSkillCap(hero, specSkillId);
      const specPct = Math.floor((specValue / Math.max(1, specCap)) * 100);
      const specRatio = getSpecRatio(hero, spec);
      const manaSavingsPct = Math.floor(specRatio * 10); // 10% at cap

      const specLabel = document.createElement("div");
      specLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:10px 0 5px;font-size:11px;color:#aaa;";
      
      // Use SVG icons and proper labels
      const specName = SPEC_LABEL[spec] ?? spec;
      const specIcon = SPEC_ICON_SVG[spec] ?? "";
      
      specLabel.innerHTML = `<span style="display:flex;align-items:center;gap:6px;">${specIcon}<span>${specName}</span></span> <span style='color:#ccc;'>${specValue} / ${specCap} (${specPct}%)</span>`;
      rightColumn.appendChild(specLabel);

      const specBarBg = document.createElement("div");
      specBarBg.style.cssText = "width:100%;height:6px;background:#252525;border-radius:3px;overflow:hidden;border:1px solid #333;margin:4px 0 5px;position:relative;";
      const specBarPercent = Math.min(100, specPct);
      const specBarFill = document.createElement("div");
      specBarFill.style.cssText = `height:100%;width:${specBarPercent}%;background:linear-gradient(90deg,#818cf8,#6366f1);transition:width 0.2s;`;
      specBarBg.appendChild(specBarFill);
      rightColumn.appendChild(specBarBg);

      const manaSavingsLabel = document.createElement("div");
      manaSavingsLabel.style.cssText = "display:flex;justify-content:space-between;align-items:center;margin:0 0 10px;padding-left:8px;font-size:10px;color:#888;opacity:0.85;";
      manaSavingsLabel.innerHTML = `<span>Mana Savings</span> <span style='color:#a78bfa;'>${manaSavingsPct}%</span>`;
      rightColumn.appendChild(manaSavingsLabel);
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

function buildMerchantInventory() {
  const buckets = new Map();
  const cha = bestPartyCharisma();

  // Use shared inventory instead of per-hero inventory
  if (!state.sharedInventory) return [];
  
  for (let i = 0; i < 30; i++) {
    const item = state.sharedInventory[i];
    if (!item) continue;
    const itemDef = getItemDef(item.id);
    if (!itemDef) continue;
    const key = item.id;
    if (!buckets.has(key)) {
      buckets.set(key, {
        itemDef,
        totalQty: 0,
        holders: [],
        perItem: Math.max(1, Math.floor(computeSellValue(itemDef.baseValue ?? 1, cha)))
      });
    }
    const bucket = buckets.get(key);
    const qty = item.quantity ?? 1;
    bucket.totalQty += qty;
    bucket.holders.push({ slotIdx: i, qty });
  }

  return Array.from(buckets.values());
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

  const inventoryBuckets = buildMerchantInventory();
  let hasItems = inventoryBuckets.length > 0;

  for (const bucket of inventoryBuckets) {
    const { itemDef, totalQty, perItem, holders } = bucket;
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
    line1.textContent = `${itemDef.name}${totalQty > 1 ? ` x${totalQty}` : ""}`;
    const line2 = document.createElement("div");
    line2.style.cssText = "color:#888;font-size:11px;";
    line2.textContent = "In shared inventory";
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

    const sellOptions = totalQty > 1
      ? [
          { label: "Sell 1", qty: 1 },
          { label: "Sell 5", qty: 5 },
          { label: "Sell 10", qty: 10 },
          { label: `Sell x${totalQty}`, qty: totalQty }
        ]
      : [{ label: "Sell 1", qty: 1 }];

    const handleSell = (sellQty) => {
      let remaining = Math.min(sellQty, totalQty);
      let sold = 0;
      for (const holder of holders) {
        if (remaining <= 0) break;
        const slotItem = state.sharedInventory[holder.slotIdx];
        if (!slotItem) continue;
        const take = Math.min(remaining, slotItem.quantity ?? 1);
        slotItem.quantity = (slotItem.quantity ?? 1) - take;
        if (slotItem.quantity <= 0) state.sharedInventory[holder.slotIdx] = null;
        remaining -= take;
        sold += take;
      }

      if (sold > 0) {
        const saleValue = perItem * sold;
        state.currencyCopper += saleValue;
        updateCurrencyDisplay();
        addLog(`You sell ${sold > 1 ? sold + "x " : ""}${itemDef.name} for ${formatPGSC(saleValue)}.`, "gold");
        renderMeta();
        renderBattleFooter();
      }
    };

    for (const opt of sellOptions) {
      if (opt.qty !== totalQty && totalQty < opt.qty) continue;
      const btnQty = Math.min(opt.qty, totalQty);
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

