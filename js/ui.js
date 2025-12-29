import { state } from "./state.js";
import { getClassDef, heroLevelUpCost, applyHeroLevelUp, createHero, canTravel, travelToNextZone, recalcPartyTotals } from "./combat.js";
import { CLASS_DEFS } from "./defs.js";
import { addLog } from "./util.js";

export function initUI({ onRecruit, onReset }) {
  // Populate recruit dropdown
  const select = document.getElementById("recruitSelect");
  select.innerHTML = "";
  for (const cls of CLASS_DEFS) {
    const opt = document.createElement("option");
    opt.value = cls.key;
    opt.textContent = `${cls.name} (${cls.role})`;
    select.appendChild(opt);
  }

  document.getElementById("recruitBtn").addEventListener("click", onRecruit);
  document.getElementById("travelBtn").addEventListener("click", () => {
    travelToNextZone();
    renderAll();
  });

  select.addEventListener("change", renderRecruitBox);

  if (onReset && document.getElementById("resetBtn")) {
    document.getElementById("resetBtn").addEventListener("click", onReset);
  }
}

export function renderAll() {
  renderEnemy();
  renderParty();
  renderMeta();
  renderRecruitBox();
  renderLog();
}

export function renderLog() {
  const logEl = document.getElementById("log");
  logEl.innerHTML = "";
  for (const line of state.log) {
    const div = document.createElement("div");
    div.textContent = line;
    logEl.appendChild(div);
  }
}

export function renderEnemy() {
  const e = state.currentEnemy;
  const nameEl = document.getElementById("enemyName");
  const hpFill = document.getElementById("enemyHPFill");
  const hpLabel = document.getElementById("enemyHPLabel");
  const dpsSpan = document.getElementById("enemyDpsSpan");

  if (!e) {
    nameEl.textContent = "No enemy";
    hpFill.style.width = "0%";
    hpLabel.textContent = "0 / 0";
    dpsSpan.textContent = "0";
    return;
  }

  nameEl.textContent = `${e.name} (Lv ${e.level})`;
  const pct = e.hp <= 0 ? 0 : Math.max(0, Math.min(100, (e.hp / e.maxHP) * 100));
  hpFill.style.width = pct + "%";
  hpLabel.textContent = `${Math.max(0, e.hp.toFixed(1))} / ${e.maxHP.toFixed(1)}`;
  dpsSpan.textContent = e.dps.toFixed(1);
}

export function renderParty() {
  const container = document.getElementById("partyContainer");
  container.innerHTML = "";

  for (const hero of state.party) {
    const div = document.createElement("div");
    div.className = "hero";

    const header = document.createElement("div");
    header.className = "hero-header";
    const left = document.createElement("div");
    left.textContent = `${hero.name} (Lv ${hero.level})`;
    const right = document.createElement("div");
    right.textContent = hero.role;
    header.appendChild(left);
    header.appendChild(right);

    const stats = document.createElement("div");
    stats.className = "hero-stats";
    stats.textContent = `HP: ${hero.maxHP} | DPS: ${hero.dps.toFixed(1)} | Healing: ${hero.healing.toFixed(1)}`;

    const btnRow = document.createElement("div");
    const btn = document.createElement("button");
    const cost = heroLevelUpCost(hero);
    btn.textContent = `Level Up (${cost} gold)`;
    btn.disabled = state.gold < cost;
    btn.addEventListener("click", function () {
      if (state.gold >= cost) {
        state.gold -= cost;
        applyHeroLevelUp(hero);
        addLog(`${hero.name} trains hard and reaches level ${hero.level}.`);
        renderAll();
      }
    });
    btnRow.appendChild(btn);

    div.appendChild(header);
    div.appendChild(stats);
    div.appendChild(btnRow);
    container.appendChild(div);
  }

  // Party HP bar
  recalcPartyTotals();
  const hpPct = state.partyMaxHP > 0 ? Math.max(0, Math.min(100, (state.partyHP / state.partyMaxHP) * 100)) : 0;
  document.getElementById("partyHPFill").style.width = hpPct + "%";
  document.getElementById("partyHPLabel").textContent =
    `${Math.floor(state.partyHP)} / ${Math.floor(state.partyMaxHP)}`;
}

export function renderMeta() {
  document.getElementById("goldSpan").textContent = state.gold;
  document.getElementById("xpSpan").textContent = state.totalXP;
  document.getElementById("zoneSpan").textContent = state.zone;
  document.getElementById("killsSpan").textContent = state.killsThisZone;
  document.getElementById("killsNeedSpan").textContent = state.killsForNextZone;
  document.getElementById("nextZoneSpan").textContent = state.zone + 1;

  let dps = 0, heal = 0;
  for (const h of state.party) { dps += h.dps; heal += h.healing; }

  document.getElementById("partyDpsSpan").textContent = dps.toFixed(1);
  document.getElementById("partyHealSpan").textContent = heal.toFixed(1);

  document.getElementById("slotsUsedSpan").textContent = state.party.length;
  document.getElementById("slotsMaxSpan").textContent = state.partySlotsUnlocked;

  document.getElementById("travelBtn").disabled = !canTravel();
}

export function renderRecruitBox() {
  const select = document.getElementById("recruitSelect");
  const btn = document.getElementById("recruitBtn");
  const info = document.getElementById("recruitCostInfo");

  const cls = getClassDef(select.value);
  info.textContent = cls ? `${cls.name}: ${cls.desc} (Cost: ${cls.cost} gold)` : "";

  const canRecruitMore = state.party.length < state.partySlotsUnlocked;
  const costOk = cls && state.gold >= cls.cost;
  btn.disabled = !(canRecruitMore && costOk);
}
