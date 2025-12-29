(function () {
  const GAME_TICK_MS = 1000;

  const CLASS_DEFS = [
    {
      key: "warrior",
      name: "Warrior",
      role: "Tank",
      baseHP: 120,
      baseDPS: 8,
      baseHealing: 0,
      cost: 30,
      desc: "Front-line bruiser. High HP, steady DPS."
    },
    {
      key: "cleric",
      name: "Cleric",
      role: "Healer",
      baseHP: 90,
      baseDPS: 4,
      baseHealing: 8,
      cost: 35,
      desc: "Primarily healing to keep the party standing."
    },
    {
      key: "wizard",
      name: "Wizard",
      role: "Nuker",
      baseHP: 70,
      baseDPS: 14,
      baseHealing: 0,
      cost: 40,
      desc: "Glass cannon. High DPS, low HP."
    },
    {
      key: "ranger",
      name: "Ranger",
      role: "DPS",
      baseHP: 85,
      baseDPS: 10,
      baseHealing: 2,
      cost: 35,
      desc: "Ranged damage with a bit of self-sustain."
    },
    {
      key: "enchanter",
      name: "Enchanter",
      role: "Support",
      baseHP: 75,
      baseDPS: 6,
      baseHealing: 4,
      cost: 38,
      desc: "Crowd-control flavor. Moderate DPS and healing."
    }
  ];

  const SLOT_UNLOCKS = [
    { zone: 1, slots: 1 },
    { zone: 2, slots: 2 },
    { zone: 4, slots: 3 },
    { zone: 6, slots: 4 }
  ];

  let heroIdCounter = 1;

  const state = {
    gold: 0,
    totalXP: 0,
    zone: 1,
    killsThisZone: 0,
    killsForNextZone: 10,
    partySlotsUnlocked: 1,
    party: [],
    partyMaxHP: 0,
    partyHP: 0,
    currentEnemy: null,
    log: []
  };

  // --- Utility functions ---
  function log(msg) {
    const time = new Date().toLocaleTimeString();
    state.log.unshift(`[${time}] ${msg}`);
    if (state.log.length > 50) state.log.pop();
    renderLog();
  }

  function pickEnemyNameForZone(zone) {
    if (zone <= 2) {
      const names = ["Decaying Skeleton", "Gnoll Scout", "Young Orc", "Rabid Wolf"];
      return names[Math.floor(Math.random() * names.length)];
    } else if (zone <= 4) {
      const names = ["Skeletal Knight", "Orc Centurion", "Dark Wolf", "Bloodsaber Acolyte"];
      return names[Math.floor(Math.random() * names.length)];
    } else if (zone <= 6) {
      const names = ["Plague Knight", "Shadow Assassin", "Ghoul", "Corrupted Treant"];
      return names[Math.floor(Math.random() * names.length)];
    } else {
      const names = ["Ancient Lich", "Avatar of Rot", "Eternal Horror", "Doomcaller"];
      return names[Math.floor(Math.random() * names.length)];
    }
  }

  function spawnEnemy() {
    const z = state.zone;
    const level = z + Math.floor(Math.random() * 3);
    const baseHP = 60 + z * 15 + level * 10;
    const dps = 4 + z * 2 + level;
    const name = pickEnemyNameForZone(z);
    state.currentEnemy = {
      name,
      level,
      maxHP: baseHP,
      hp: baseHP,
      dps
    };
    log(`A level ${level} ${name} appears in Zone ${z}.`);
    renderEnemy();
  }

  function getClassDef(key) {
    return CLASS_DEFS.find(c => c.key === key);
  }

  function createHero(classKey) {
    const cls = getClassDef(classKey);
    if (!cls) return null;
    const hero = {
      id: heroIdCounter++,
      classKey: cls.key,
      name: cls.name,
      role: cls.role,
      level: 1,
      maxHP: cls.baseHP,
      dps: cls.baseDPS,
      healing: cls.baseHealing
    };
    return hero;
  }

  function heroLevelUpCost(hero) {
    // Scales with hero level and current zone
    return Math.floor(20 * hero.level * (1 + state.zone * 0.4));
  }

  function applyHeroLevelUp(hero) {
    const oldMax = hero.maxHP;
    hero.level += 1;
    hero.maxHP = Math.floor(hero.maxHP * 1.25);
    hero.dps = parseFloat((hero.dps * 1.25).toFixed(1));
    hero.healing = parseFloat((hero.healing * 1.25).toFixed(1));

    const delta = hero.maxHP - oldMax;
    state.partyMaxHP += delta;
    state.partyHP += delta; // treat as topping off from extra training
  }

  function recalcPartyTotals() {
    let maxHP = 0;
    let totalDPS = 0;
    let totalHealing = 0;
    for (const h of state.party) {
      maxHP += h.maxHP;
      totalDPS += h.dps;
      totalHealing += h.healing;
    }
    state.partyMaxHP = maxHP;
    if (state.partyHP > maxHP) {
      state.partyHP = maxHP;
    }
    if (state.partyHP === 0 && maxHP > 0) {
      state.partyHP = maxHP; // first recruit gets full HP
    }
    return {
      maxHP,
      totalDPS: parseFloat(totalDPS.toFixed(1)),
      totalHealing: parseFloat(totalHealing.toFixed(1))
    };
  }

  function onEnemyKilled(enemy, totalDPS) {
    const xp = 5 + state.zone * 3 + enemy.level * 2;
    const gold = 5 + state.zone * 4 + enemy.level;
    state.totalXP += xp;
    state.gold += gold;
    state.killsThisZone += 1;

    log(`Your party defeats the ${enemy.name}, dealing ${totalDPS.toFixed(1)} damage. +${xp} XP, +${gold} gold.`);

    if (state.killsThisZone >= state.killsForNextZone) {
      log(`You have cleared enough mobs in this zone. You can travel to Zone ${state.zone + 1}.`);
      document.getElementById("travelBtn").disabled = false;
    }

    spawnEnemy();
  }

  function onPartyWipe() {
    log("Your party is overwhelmed and wiped out. You drag your corpses back to the campfire...");
    // Soft penalty: lose 15% gold, reset zone kills, heal to half
    const lostGold = Math.floor(state.gold * 0.15);
    state.gold -= lostGold;
    if (state.gold < 0) state.gold = 0;
    state.killsThisZone = 0;
    state.partyHP = Math.floor(state.partyMaxHP * 0.5);
    spawnEnemy();
    log(`You lost ${lostGold} gold and must rebuild your momentum in this zone.`);
  }

  function checkSlotUnlocks() {
    for (const rule of SLOT_UNLOCKS) {
      if (state.zone >= rule.zone && state.partySlotsUnlocked < rule.slots) {
        state.partySlotsUnlocked = rule.slots;
        log(`Your reputation grows. You can now have up to ${rule.slots} party members.`);
      }
    }
  }

  // --- Game tick ---
  function gameTick() {
    if (!state.currentEnemy || state.party.length === 0) {
      if (!state.currentEnemy) spawnEnemy();
      return;
    }

    const totals = recalcPartyTotals();
    const enemy = state.currentEnemy;

    // Enemy takes damage
    enemy.hp -= totals.totalDPS;
    if (enemy.hp < 0) enemy.hp = 0;

    // Party takes damage minus healing
    const rawDamage = enemy.dps;
    const mitigated = Math.max(rawDamage - totals.totalHealing, 0);
    if (mitigated > 0) {
      state.partyHP -= mitigated;
      if (state.partyHP < 0) state.partyHP = 0;
    } else if (totals.totalHealing > rawDamage) {
      // surplus healing slowly tops off the party
      state.partyHP += (totals.totalHealing - rawDamage) * 0.3;
      if (state.partyHP > state.partyMaxHP) {
        state.partyHP = state.partyMaxHP;
      }
    }

    if (enemy.hp <= 0) {
      onEnemyKilled(enemy, totals.totalDPS);
    } else if (state.partyHP <= 0 && state.partyMaxHP > 0) {
      onPartyWipe();
    }

    checkSlotUnlocks();
    renderAll();
  }

  // --- Rendering ---
  function renderLog() {
    const logEl = document.getElementById("log");
    logEl.innerHTML = "";
    for (const line of state.log) {
      const div = document.createElement("div");
      div.textContent = line;
      logEl.appendChild(div);
    }
  }

  function renderEnemy() {
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

  function renderParty() {
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
          log(`${hero.name} trains hard and reaches level ${hero.level}.`);
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
    const hpPct = state.partyMaxHP > 0 ? Math.max(0, Math.min(100, (state.partyHP / state.partyMaxHP) * 100)) : 0;
    document.getElementById("partyHPFill").style.width = hpPct + "%";
    document.getElementById("partyHPLabel").textContent =
      `${Math.floor(state.partyHP)} / ${Math.floor(state.partyMaxHP)}`;
  }

  function renderMeta() {
    document.getElementById("goldSpan").textContent = state.gold;
    document.getElementById("xpSpan").textContent = state.totalXP;
    document.getElementById("zoneSpan").textContent = state.zone;
    document.getElementById("killsSpan").textContent = state.killsThisZone;
    document.getElementById("killsNeedSpan").textContent = state.killsForNextZone;
    document.getElementById("nextZoneSpan").textContent = state.zone + 1;

    const { totalDPS, totalHealing } = (function () {
      let dps = 0, heal = 0;
      for (const h of state.party) {
        dps += h.dps;
        heal += h.healing;
      }
      return {
        totalDPS: parseFloat(dps.toFixed(1)),
        totalHealing: parseFloat(heal.toFixed(1))
      };
    })();

    document.getElementById("partyDpsSpan").textContent = totalDPS.toFixed(1);
    document.getElementById("partyHealSpan").textContent = totalHealing.toFixed(1);

    document.getElementById("slotsUsedSpan").textContent = state.party.length;
    document.getElementById("slotsMaxSpan").textContent = state.partySlotsUnlocked;
  }

  function renderRecruitBox() {
    const select = document.getElementById("recruitSelect");
    const btn = document.getElementById("recruitBtn");
    const info = document.getElementById("recruitCostInfo");

    // The base cost shown is for level 1 recruit of selected class
    const selectedKey = select.value;
    const cls = getClassDef(selectedKey);
    let text = "";
    if (cls) {
      text = `${cls.name}: ${cls.desc} (Cost: ${cls.cost} gold)`;
    }
    info.textContent = text;

    // Enable/disable based on slots & gold
    const canRecruitMore = state.party.length < state.partySlotsUnlocked;
    let costOk = cls && state.gold >= cls.cost;
    btn.disabled = !(canRecruitMore && costOk);
  }

  function renderAll() {
    renderEnemy();
    renderParty();
    renderMeta();
    renderRecruitBox();
  }

  // --- Event handlers ---
  function handleRecruit() {
    const select = document.getElementById("recruitSelect");
    const cls = getClassDef(select.value);
    if (!cls) return;

    if (state.party.length >= state.partySlotsUnlocked) {
      log("You don't have any open party slots.");
      return;
    }
    if (state.gold < cls.cost) {
      log("You don't have enough gold to recruit that class.");
      return;
    }
    state.gold -= cls.cost;
    const hero = createHero(cls.key);
    state.party.push(hero);
    state.partyHP += hero.maxHP;
    state.partyMaxHP += hero.maxHP;
    log(`A ${cls.name} joins your party at the campfire.`);
    renderAll();
  }

  function handleTravel() {
    if (state.killsThisZone < state.killsForNextZone) return;

    state.zone += 1;
    state.killsThisZone = 0;
    document.getElementById("travelBtn").disabled = true;
    log(`You travel deeper into the wilds to Zone ${state.zone}. Enemies grow stronger, but rewards improve.`);
    spawnEnemy();
    checkSlotUnlocks();
    renderAll();
  }

  // --- Initialization ---
  function initRecruitSelect() {
    const select = document.getElementById("recruitSelect");
    select.innerHTML = "";
    for (const cls of CLASS_DEFS) {
      const opt = document.createElement("option");
      opt.value = cls.key;
      opt.textContent = `${cls.name} (${cls.role})`;
      select.appendChild(opt);
    }
  }

  function init() {
    initRecruitSelect();
    spawnEnemy();
    document.getElementById("recruitBtn").addEventListener("click", handleRecruit);
    document.getElementById("travelBtn").addEventListener("click", handleTravel);
    document.getElementById("recruitSelect").addEventListener("change", renderRecruitBox);

    // Give player a starting Warrior for free
    const starter = createHero("warrior");
    state.party.push(starter);
    state.partyHP = starter.maxHP;
    state.partyMaxHP = starter.maxHP;
    log("A lone Warrior stands at the campfire, ready to grind out a living in these lands.");

    renderAll();
    setInterval(gameTick, GAME_TICK_MS);
  }

  document.addEventListener("DOMContentLoaded", init);
})();

