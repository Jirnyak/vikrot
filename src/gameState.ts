import { CHARACTERS, AUDIENCE_GROUPS, SUBSTANCES, OPERAS, EVENTS, BAND_ROLES, type GameEvent, type EventCondition, type CharacterInteraction } from './gameData';

export interface BandMember {
  characterId: string;
  role: string;
}

export interface SubstanceDose {
  substanceId: string;
  doses: number;
  totalEver: number;
  addiction: number;
}

export interface PendingEvent {
  eventId: string;
  firesOnDay: number;
}

export interface GameState {
  day: number;
  actionsToday: number;
  overexertionDamage: number;

  // Viktor stats
  money: number;
  popularity: number;
  health: number;
  sanity: number;
  energy: number;
  focus: number;
  creativity: number;
  bladder: number;
  bowel: number;

  // Opera
  currentOperaIndex: number;
  operaProgress: number;
  completedOperas: string[];

  // Band
  bandMembers: BandMember[];

  // Relations
  relations: { [charId: string]: number };

  // Audience
  audience: { [groupId: string]: { size: number; opinion: number } };

  // Substances
  substanceLog: { [substanceId: string]: SubstanceDose };

  // FLAGS — universal persistent state for events
  flags: Set<string>;

  // Event queue — triggered events waiting to fire
  pendingEvents: PendingEvent[];

  // Fired unique events (so they don't repeat)
  firedUniqueEvents: Set<string>;

  // Log
  log: string[];

  // Game state
  gameOver: boolean;
  gameOverReason?: string;
  currentEvent: GameEvent | null;
  phase: 'morning' | 'action' | 'event' | 'night' | 'gameover';
  
  // Interaction target
  interactingWith: string | null;
}

export function createInitialState(): GameState {
  const relations: { [k: string]: number } = {};
  CHARACTERS.forEach(c => { relations[c.id] = c.baseRelation; });

  const audience: { [k: string]: { size: number; opinion: number } } = {};
  AUDIENCE_GROUPS.forEach(g => { audience[g.id] = { size: g.baseSize, opinion: 50 }; });

  return {
    day: 1,
    actionsToday: 0,
    overexertionDamage: 0,
    money: 5000,
    popularity: 10,
    health: 80,
    sanity: 70,
    energy: 70,
    focus: 50,
    creativity: 50,
    bladder: 80,
    bowel: 80,
    currentOperaIndex: 0,
    operaProgress: 0,
    completedOperas: [],
    bandMembers: [
      { characterId: 'ariel', role: 'solist' },
      { characterId: 'mitrofanov', role: 'back_vocal' },
    ],
    relations,
    audience,
    substanceLog: {},
    flags: new Set(),
    pendingEvents: [],
    firedUniqueEvents: new Set(),
    log: ['🌅 День 1. Виктор просыпается в своей квартире во Владивостоке.'],
    gameOver: false,
    currentEvent: null,
    phase: 'morning',
    interactingWith: null,
  };
}

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
function clampStat(v: number) { return clamp(v, 0, 100); }
function clampRelation(v: number) { return clamp(v, -128, 128); }

export function applyEffects(state: GameState, effects: { [key: string]: number | undefined }) {
  const s = { ...state };
  if (effects.money) s.money += effects.money;
  if (effects.popularity) s.popularity += effects.popularity;
  if (effects.health) s.health = clampStat(s.health + effects.health);
  if (effects.sanity) s.sanity = clampStat(s.sanity + effects.sanity);
  if (effects.energy) s.energy = clampStat(s.energy + effects.energy);
  if (effects.focus) s.focus = clampStat(s.focus + effects.focus);
  if (effects.creativity) s.creativity = clampStat(s.creativity + effects.creativity);
  if (effects.bladder) s.bladder = clampStat(s.bladder + effects.bladder);
  if (effects.bowel) s.bowel = clampStat(s.bowel + effects.bowel);
  if (effects.operaProgress) s.operaProgress = Math.max(0, s.operaProgress + effects.operaProgress);
  return s;
}

export function applyAudienceEffects(state: GameState, ae: { [groupId: string]: number }) {
  const s = { ...state, audience: { ...state.audience } };
  Object.entries(ae).forEach(([gid, val]) => {
    if (s.audience[gid]) {
      const a = { ...s.audience[gid] };
      a.opinion = clamp(a.opinion + val, 0, 100);
      a.size = Math.max(0, a.size + Math.round(val * (a.opinion / 50)));
      s.audience[gid] = a;
    }
  });
  return s;
}

export function applyRelationEffects(state: GameState, re: { [charId: string]: number }) {
  const s = { ...state, relations: { ...state.relations } };
  Object.entries(re).forEach(([cid, val]) => {
    if (s.relations[cid] !== undefined) {
      s.relations[cid] = clampRelation(s.relations[cid] + val);
    }
  });
  return s;
}

// ================================================================
// UNIVERSAL CONDITION CHECKER
// ================================================================
export function checkCondition(condition: EventCondition | undefined, state: GameState): boolean {
  if (!condition) return true;

  // Flags
  if (condition.flags && !condition.flags.every(f => state.flags.has(f))) return false;
  if (condition.noFlags && condition.noFlags.some(f => state.flags.has(f))) return false;

  // Relations
  if (condition.minRelation) {
    for (const [cid, min] of Object.entries(condition.minRelation)) {
      if ((state.relations[cid] ?? 0) < min) return false;
    }
  }
  if (condition.maxRelation) {
    for (const [cid, max] of Object.entries(condition.maxRelation)) {
      if ((state.relations[cid] ?? 0) > max) return false;
    }
  }

  // Band membership
  if (condition.inBand) {
    if (!condition.inBand.every(cid => state.bandMembers.some(m => m.characterId === cid))) return false;
  }
  if (condition.notInBand) {
    if (condition.notInBand.some(cid => state.bandMembers.some(m => m.characterId === cid))) return false;
  }

  // Day
  if (condition.minDay !== undefined && state.day < condition.minDay) return false;
  if (condition.maxDay !== undefined && state.day > condition.maxDay) return false;

  // Money
  if (condition.minMoney !== undefined && state.money < condition.minMoney) return false;
  if (condition.maxMoney !== undefined && state.money > condition.maxMoney) return false;

  // Popularity
  if (condition.minPopularity !== undefined && state.popularity < condition.minPopularity) return false;
  if (condition.maxPopularity !== undefined && state.popularity > condition.maxPopularity) return false;

  // Opera
  if (condition.operaIndex !== undefined && state.currentOperaIndex !== condition.operaIndex) return false;
  if (condition.minOperaProgress !== undefined && state.operaProgress < condition.minOperaProgress) return false;

  // Health/Sanity
  if (condition.minHealth !== undefined && state.health < condition.minHealth) return false;
  if (condition.maxHealth !== undefined && state.health > condition.maxHealth) return false;
  if (condition.minSanity !== undefined && state.sanity < condition.minSanity) return false;
  if (condition.maxSanity !== undefined && state.sanity > condition.maxSanity) return false;

  // Substance conditions
  if (condition.hasAddiction) {
    const hasAny = condition.hasAddiction.some(sid => {
      const dose = state.substanceLog[sid];
      return dose && dose.addiction > 30;
    });
    if (!hasAny) return false;
  }
  if (condition.totalDosesMin !== undefined) {
    const total = Object.values(state.substanceLog).reduce((sum, d) => sum + d.totalEver, 0);
    if (total < condition.totalDosesMin) return false;
  }

  return true;
}

// ================================================================
// EVENT SELECTION
// ================================================================
export function getRandomEvent(state: GameState): GameEvent | null {
  // 1. Check pending (chain) events first
  const pendingNow = state.pendingEvents.filter(pe => pe.firesOnDay <= state.day);
  if (pendingNow.length > 0) {
    const pe = pendingNow[0];
    const event = EVENTS.find(e => e.id === pe.eventId);
    if (event && checkCondition(event.condition, state) && !state.firedUniqueEvents.has(event.id)) {
      return event;
    }
  }

  // 2. Check chain events that have conditions met (even without pending trigger)
  const chainEvents = EVENTS.filter(e =>
    e.isChainEvent &&
    !state.firedUniqueEvents.has(e.id) &&
    checkCondition(e.condition, state)
  );
  if (chainEvents.length > 0 && Math.random() > 0.4) {
    return chainEvents[Math.floor(Math.random() * chainEvents.length)];
  }

  // 3. Random pool (60% chance)
  if (Math.random() > 0.5) return null;
  const available = EVENTS.filter(e =>
    !e.isChainEvent &&
    !state.firedUniqueEvents.has(e.id) &&
    checkCondition(e.condition, state)
  );
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

// Apply choice flags and triggers
export function applyChoiceMetaEffects(state: GameState, choice: { setsFlags?: string[]; removesFlags?: string[]; triggersEventId?: string; triggersDelay?: number }): GameState {
  const s = { ...state, flags: new Set(state.flags), pendingEvents: [...state.pendingEvents] };
  
  if (choice.setsFlags) {
    choice.setsFlags.forEach(f => s.flags.add(f));
  }
  if (choice.removesFlags) {
    choice.removesFlags.forEach(f => s.flags.delete(f));
  }
  if (choice.triggersEventId) {
    s.pendingEvents.push({
      eventId: choice.triggersEventId,
      firesOnDay: s.day + (choice.triggersDelay || 1),
    });
  }
  return s;
}

// Mark event as fired (for unique events)
export function markEventFired(state: GameState, event: GameEvent): GameState {
  const s = { ...state, firedUniqueEvents: new Set(state.firedUniqueEvents), pendingEvents: [...state.pendingEvents] };
  if (event.unique) {
    s.firedUniqueEvents.add(event.id);
  }
  // Remove from pending if it was there
  s.pendingEvents = s.pendingEvents.filter(pe => pe.eventId !== event.id);
  return s;
}

function getRoleFitMultiplier(charId: string, roleId: string): number {
  const char = CHARACTERS.find(c => c.id === charId);
  if (!char) return 0.7;
  if (char.naturalRoles.includes(roleId)) return 1.5;
  if (char.mismatchQuotes && char.mismatchQuotes[roleId]) return 0.3;
  return 0.7;
}

export function getBandBuffs(state: GameState): { focus: number; creativity: number; sanity: number; popularity: number } {
  let focus = 0, creativity = 0, sanity = 0, popularity = 0;
  state.bandMembers.forEach(m => {
    const rel = state.relations[m.characterId] || 0;
    const relFactor = Math.max(0, rel / 128);
    const fitMult = getRoleFitMultiplier(m.characterId, m.role);
    
    const roleDef = BAND_ROLES.find(r => r.id === m.role);
    if (roleDef) {
      const mult = relFactor * fitMult;
      if (roleDef.buffs.focus) focus += roleDef.buffs.focus * mult;
      if (roleDef.buffs.creativity) creativity += roleDef.buffs.creativity * mult;
      if (roleDef.buffs.sanity) sanity += roleDef.buffs.sanity * mult;
      if (roleDef.buffs.popularity) popularity += roleDef.buffs.popularity * mult;
    }
    
    creativity += 1 * relFactor;
    popularity += 0.5 * relFactor;
  });
  return { focus: Math.round(focus), creativity: Math.round(creativity), sanity: Math.round(sanity), popularity: Math.round(popularity) };
}

export function calculateDonations(state: GameState): number {
  let total = 0;
  AUDIENCE_GROUPS.forEach(g => {
    const a = state.audience[g.id];
    if (a) {
      total += a.size * g.donateRate * (a.opinion / 50);
    }
  });
  state.bandMembers.forEach(m => {
    const roleDef = BAND_ROLES.find(r => r.id === m.role);
    if (roleDef && roleDef.buffs.donateBonus) {
      const fitMult = getRoleFitMultiplier(m.characterId, m.role);
      const rel = state.relations[m.characterId] || 0;
      const relFactor = Math.max(0.1, rel / 128);
      total *= 1 + (roleDef.buffs.donateBonus / 100) * fitMult * relFactor;
    }
  });
  return Math.round(total);
}

export function checkBodyEmergency(state: GameState): string | null {
  if (state.bladder <= 5) return '🚨 СРОЧНО В ТУАЛЕТ! Мочевой на пределе!';
  if (state.bowel <= 5) return '🚨 СРОЧНО В ТУАЛЕТ! Кишечник бунтует!';
  if (state.bladder <= 15) return '⚠️ Мочевой напоминает...';
  if (state.bowel <= 15) return '⚠️ Живот крутит...';
  return null;
}

export function getOverexertionDamage(state: GameState): number {
  if (state.energy > 0) return 0;
  return (state.overexertionDamage + 1) * 5;
}

export function checkGameOver(state: GameState): string | null {
  if (state.health <= 0) return '💀 Здоровье на нуле. Больница. Конец.';
  if (state.sanity <= 0) return '🧠💥 Рассудок покинул Виктора. Он теперь экспонат.';
  if (state.money < -20000) return '💸 Долги неподъёмные. Коллекторы забрали синтезатор.';
  if (state.bladder <= 0) return '🚽💀 Не успел... Позор на весь Владивосток.';
  if (state.bowel <= 0) return '🚽💀 Катастрофа. Карьера окончена. Мемы на века.';
  return null;
}

export function processNight(state: GameState): GameState {
  let s = { ...state, flags: new Set(state.flags), pendingEvents: [...state.pendingEvents], firedUniqueEvents: new Set(state.firedUniqueEvents) };

  s.energy = clampStat(s.energy + 15);
  s.bladder = clampStat(s.bladder - 10);
  s.bowel = clampStat(s.bowel - 8);
  s.focus = clampStat(s.focus + 5);

  const buffs = getBandBuffs(s);
  s.focus = clampStat(s.focus + buffs.focus);
  s.creativity = clampStat(s.creativity + buffs.creativity);
  s.sanity = clampStat(s.sanity + buffs.sanity);
  s.popularity += buffs.popularity;

  const donations = calculateDonations(s);
  s.money += donations;

  // Addiction effects at night
  Object.values(s.substanceLog).forEach(dose => {
    if (dose.addiction > 30) {
      s.sanity = clampStat(s.sanity - Math.floor(dose.addiction / 20));
      s.health = clampStat(s.health - Math.floor(dose.addiction / 25));
    }
  });

  // Reset daily doses
  const newLog: { [k: string]: SubstanceDose } = {};
  Object.entries(s.substanceLog).forEach(([id, dose]) => {
    newLog[id] = { ...dose, doses: 0 };
  });
  s.substanceLog = newLog;

  // Check opera completion
  const currentOpera = OPERAS[s.currentOperaIndex];
  if (currentOpera && s.operaProgress >= currentOpera.requiredProgress) {
    s.completedOperas = [...s.completedOperas, currentOpera.id];
    s.money += currentOpera.rewards.money;
    s.popularity += currentOpera.rewards.popularity;
    s = applyAudienceEffects(s, currentOpera.audienceReaction);
    s.operaProgress = 0;
    s.currentOperaIndex = Math.min(s.currentOperaIndex + 1, OPERAS.length - 1);
    s.log = [...s.log, `🎉 ОПЕРА ЗАВЕРШЕНА: "${currentOpera.name}"! +${currentOpera.rewards.money}₽, +${currentOpera.rewards.popularity} популярности!`];
  }

  // Relation drift
  s.relations = { ...s.relations };
  CHARACTERS.forEach(c => {
    const drift = Math.floor(Math.random() * 5) - 2;
    s.relations[c.id] = clampRelation((s.relations[c.id] || 0) + drift);
  });

  // Sasha hates drugs
  const totalDoses = Object.values(s.substanceLog).reduce((sum, d) => sum + d.totalEver, 0);
  if (totalDoses > 0 && s.relations['sasha'] !== undefined) {
    s.relations['sasha'] = clampRelation(s.relations['sasha'] - 1);
  }

  s.popularity = Math.max(0, s.popularity - 1);

  s.day += 1;
  s.actionsToday = 0;
  s.overexertionDamage = 0;
  s.phase = 'morning';
  s.interactingWith = null;

  s.log = [...s.log, `💰 Донаты: ${donations}₽ | Действий: ${state.actionsToday}`, `🌙 Ночь. День ${s.day}.`];

  return s;
}

export function takeSubstance(state: GameState, substanceId: string): GameState {
  const sub = SUBSTANCES.find(s => s.id === substanceId);
  if (!sub) return state;
  if (state.money < sub.cost) return { ...state, log: [...state.log, `❌ Не хватает на ${sub.name}!`] };

  let s = { ...state, flags: new Set(state.flags) };
  s.money -= sub.cost;

  const currentDose = s.substanceLog[substanceId] || { substanceId, doses: 0, totalEver: 0, addiction: 0 };
  const newDose = {
    ...currentDose,
    doses: currentDose.doses + 1,
    totalEver: currentDose.totalEver + 1,
    addiction: Math.min(100, currentDose.addiction + sub.addictiveness * 10),
  };

  s = applyEffects(s, sub.effects as Record<string, number | undefined>);

  // Audience reaction to drug use
  if (sub.audienceReaction) {
    s = applyAudienceEffects(s, sub.audienceReaction);
  }

  if (newDose.doses > sub.overdoseThreshold) {
    const overFactor = newDose.doses - sub.overdoseThreshold;
    s.health = clampStat(s.health - overFactor * 10);
    s.sanity = clampStat(s.sanity - overFactor * 8);
    s.log = [...s.log, `☠️ ПЕРЕДОЗ ${sub.name}! HP и рассудок падают!`];
  }

  s.substanceLog = { ...s.substanceLog, [substanceId]: newDose };
  s.log = [...s.log, `${sub.emoji} ${sub.name} (доза ${newDose.doses}/${sub.overdoseThreshold})`];

  // Sasha relation hit for hard/extreme drugs
  if ((sub.tier === 'hard' || sub.tier === 'extreme') && s.relations['sasha'] !== undefined) {
    s.relations = { ...s.relations };
    s.relations['sasha'] = clampRelation(s.relations['sasha'] - (sub.tier === 'extreme' ? 5 : 2));
  }

  return s;
}

export function performInteraction(state: GameState, charId: string, interaction: CharacterInteraction): GameState {
  let s = { ...state };
  
  if (s.energy < interaction.energyCost) {
    const damage = getOverexertionDamage(s);
    if (damage > 0) {
      s.health = clampStat(s.health - damage);
      s.sanity = clampStat(s.sanity - Math.floor(damage / 2));
      s.overexertionDamage += 1;
      s.log = [...s.log, `⚠️ Переутомление! -${damage} HP, -${Math.floor(damage / 2)} рассудок`];
    }
  }
  s.energy = clampStat(s.energy - interaction.energyCost);
  
  s = applyEffects(s, interaction.effects);
  
  s.relations = { ...s.relations };
  s.relations[charId] = clampRelation((s.relations[charId] || 0) + interaction.relationChange);
  
  if (interaction.audienceEffects) {
    s = applyAudienceEffects(s, interaction.audienceEffects);
  }
  
  s.actionsToday += 1;
  
  const char = CHARACTERS.find(c => c.id === charId);
  s.log = [...s.log, `${interaction.emoji} ${char?.name}: ${interaction.message}`];
  
  return s;
}

// Serialization helpers for flags (Set -> Array for JSON)
export function serializeState(state: GameState): object {
  return {
    ...state,
    flags: Array.from(state.flags),
    firedUniqueEvents: Array.from(state.firedUniqueEvents),
  };
}

export function deserializeState(data: any): GameState {
  return {
    ...data,
    flags: new Set(data.flags || []),
    firedUniqueEvents: new Set(data.firedUniqueEvents || []),
  };
}
