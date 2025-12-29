import Warrior from "./warrior.js";
import Wizard from "./wizard.js";
import Cleric from "./cleric.js";
import Ranger from "./ranger.js";
import Enchanter from "./enchanter.js";

export const CLASSES = [Warrior, Wizard, Cleric, Ranger, Enchanter];

export function getClassDef(key) {
  return CLASSES.find(c => c.key === key);
}

// For backward compatibility with old code that may reference CLASS_DEFS
export const CLASS_DEFS = CLASSES;

