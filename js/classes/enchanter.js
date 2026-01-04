export default {
  key: "enchanter",
  name: "Enchanter",
  symbol: "🌀",
  role: "Support",
  cost: 65,
  primaryStat: "int",
  baseMana: 0,
  
  resourceType: "mana",
  maxMana: 110,
  manaRegenPerTick: 6,

  baseHP: 50,
  baseDamage: 10,
  baseDPS: 10,
  baseHealing: 8,

  stats: {
    str: 7,
    con: 8,
    dex: 11,
    agi: 11,
    ac: 11,
    wis: 9,
    int: 11,
    cha: 12
  },

  passives: [
    {
      key: "meditate",
      name: "Meditate",
      level: 5,
      description: "Unlocks at level 5 and increases mana regeneration out of combat. Skill grows from 0-252 as you meditate while recovering mana."
    }
  ],

  skills: [
    { key: "feedback", name: "Feedback", level: 1, type: "damage", damageType: "magic", minDamage: 3, maxDamage: 8, cost: 7, cooldownTicks: 3, description: "Deal magic damage to a target with a 25% chance to stun for 1 tick." },
    { key: "mesmerize", name: "Mesmerize", level: 3, type: "debuff", debuffType: "mesmerize", cost: 20, cooldownTicks: 6, description: "Put an XT target to sleep for 4 ticks; breaks on any damage and only one target at a time." },
    { key: "suffocate", name: "Suffocate", level: 8, type: "damage", damageType: "magic", minDamage: 13, maxDamage: 13, cost: 15, cooldownTicks: 6, description: "Deal magic damage and reduce target's STR and AGI by 2 for 6 ticks." },
    { key: "lesserRune", name: "Lesser Rune", level: 10, type: "buff", buffType: "lesser_rune", cost: 25, cooldownTicks: 8, description: "Apply a single-hit damage absorption shield that absorbs 20 damage and breaks on any hit." }
  ],

  feedback(target, level) {
    const manaCost = 7;
    const cooldown = 3;
    const damage = Math.min(3 + (level - 1) * 5, 8);
    const stunChance = 0.25;
    const stunDuration = 1;
    const maxMobLevel = 30;

    if (target.level > maxMobLevel) return;

    // Deal damage
    target.hp -= damage;
    addLog(`Enchanter deals ${damage} magic damage to ${target.name}.`, "damage_dealt");

    // Check for stun
    if (Math.random() < stunChance && !hasBuff(target, "stun")) {
        applyBuff(target, "stun", stunDuration, {});
        addLog(`${target.name} is stunned!`, "normal");
    }
  },

  // Mesmerize ability
  mesmerize(target) {
    const manaCost = 20;
    const cooldown = 6;
    const duration = 4;

    if (target.type !== "XT" || hasBuff(target, "mesmerize")) return;

    applyBuff(target, "mesmerize", duration, {});
    addLog(`${target.name} is mesmerized!`, "normal");
  },

  // Meditate ability
  meditate(hero) {
    // Passive ability, no implementation needed in combat
    hero.meditateActive = true;
  },

  // Suffocate ability
  suffocate(target) {
    const manaCost = 15;
    const cooldown = 6;
    const duration = 6;
    const damage = 13;

    // Deal damage
    target.hp -= damage;
    addLog(`Enchanter deals ${damage} magic damage to ${target.name}.`, "damage_dealt");

    // Apply stat debuff
    applyBuff(target, "suffocate", duration, { strDebuff: -2, agiDebuff: -2 });
    addLog(`${target.name} is suffocated, losing -2 STR and -2 AGI!`, "normal");
  },

  // Lesser Rune ability
  lesserRune(hero, target) {
    const manaCost = 25;
    const cooldown = 8;
    const absorptionAmount = 20;

    applyBuff(target, "lesser_rune", Infinity, { absorptionAmount });
    addLog(`${hero.name} applies a Lesser Rune to ${target.name}, absorbing up to ${absorptionAmount} damage!`, "normal");

    // Listen for damage events on the target
    target.on('damage', (damage) => {
      // Remove the Lesser Rune buff when damage is taken
      removeBuff(target, "lesser_rune");
      addLog(`${target.name} has taken damage and the Lesser Rune is removed!`, "normal");
    });
  }
};
