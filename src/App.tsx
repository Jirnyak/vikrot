import { useState, useRef, useEffect, useCallback } from 'react';
import { OPERAS, CHARACTERS } from './gameData';
import type { Activity, CharacterInteraction } from './gameData';
import {
  createInitialState,
  applyEffects,
  applyAudienceEffects,
  applyRelationEffects,
  applyChoiceMetaEffects,
  markEventFired,
  processNight,
  takeSubstance,
  checkBodyEmergency,
  checkGameOver,
  getRandomEvent,
  getOverexertionDamage,
  calculateDonations,
  getBandBuffs,
  performInteraction,
  type GameState,
  type BandMember,
} from './gameState';
import { StatBar } from './components/StatBar';
import { ActivityPanel } from './components/ActivityPanel';
import { SubstancePanel } from './components/SubstancePanel';
import { BandPanel } from './components/BandPanel';
import { AudiencePanel } from './components/AudiencePanel';
import { EventModal } from './components/EventModal';
import { CharacterPanel } from './components/CharacterPanel';
import { CharacterPortrait } from './components/CharacterPortrait';

type Tab = 'actions' | 'people' | 'substances' | 'band' | 'audience' | 'log';

export default function App() {
  const [state, setState] = useState<GameState>(createInitialState());
  const [tab, setTab] = useState<Tab>('actions');
  const [notification, setNotification] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [state.log]);

  const notify = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const applyOverexertion = (s: GameState): GameState => {
    const damage = getOverexertionDamage(s);
    if (damage > 0) {
      s.health = Math.max(0, s.health - damage);
      s.sanity = Math.max(0, s.sanity - Math.floor(damage / 2));
      s.overexertionDamage += 1;
      s.log = [...s.log, `💀 Переутомление! -${damage} ❤️, -${Math.floor(damage / 2)} 🧠`];
      notify(`⚠️ Переутомление! -${damage} HP!`);
    }
    return s;
  };

  const handleActivity = (activity: Activity) => {
    if (state.phase !== 'action') return;
    let s = { ...state, flags: new Set(state.flags), pendingEvents: [...state.pendingEvents], firedUniqueEvents: new Set(state.firedUniqueEvents) };

    const energyCost = Math.abs(activity.effects.energy || 0);
    if (s.energy < energyCost && energyCost > 0) {
      s = applyOverexertion(s);
    }

    let effects = { ...activity.effects };
    if (activity.id === 'write_opera') {
      const focusMult = s.focus / 50;
      const creativityMult = s.creativity / 50;
      if (effects.operaProgress) {
        effects.operaProgress = Math.round(effects.operaProgress * focusMult * creativityMult);
      }
    }

    s = applyEffects(s, effects as Record<string, number | undefined>);
    if (activity.audienceEffects) s = applyAudienceEffects(s, activity.audienceEffects);

    s.actionsToday += 1;
    s.log = [...s.log, `${activity.emoji} ${activity.name}`];

    const emergency = checkBodyEmergency(s);
    if (emergency) { s.log = [...s.log, emergency]; notify(emergency); }

    const go = checkGameOver(s);
    if (go) { s.gameOver = true; s.gameOverReason = go; s.phase = 'gameover'; s.log = [...s.log, go]; }

    setState(s);
  };

  const handleSubstance = (substanceId: string) => {
    let s = takeSubstance(state, substanceId);
    const go = checkGameOver(s);
    if (go) { s.gameOver = true; s.gameOverReason = go; s.phase = 'gameover'; s.log = [...s.log, go]; }
    const emergency = checkBodyEmergency(s);
    if (emergency) notify(emergency);
    setState(s);
  };

  const handleCharacterInteraction = (charId: string, interaction: CharacterInteraction) => {
    if (state.phase !== 'action') return;
    let s = { ...state, flags: new Set(state.flags), pendingEvents: [...state.pendingEvents], firedUniqueEvents: new Set(state.firedUniqueEvents) };
    if (s.energy < interaction.energyCost) s = applyOverexertion(s);
    s = performInteraction(s, charId, interaction);

    const emergency = checkBodyEmergency(s);
    if (emergency) { s.log = [...s.log, emergency]; notify(emergency); }
    const go = checkGameOver(s);
    if (go) { s.gameOver = true; s.gameOverReason = go; s.phase = 'gameover'; s.log = [...s.log, go]; }
    setState(s);
  };

  const handleSelectCharacter = (charId: string) => {
    setState(s => ({ ...s, interactingWith: s.interactingWith === charId ? null : charId }));
  };

  const handleEventChoice = (choiceIndex: number) => {
    if (!state.currentEvent) return;
    const event = state.currentEvent;
    const choice = event.choices[choiceIndex];

    let s = { ...state, flags: new Set(state.flags), pendingEvents: [...state.pendingEvents], firedUniqueEvents: new Set(state.firedUniqueEvents) };
    s = applyEffects(s, choice.effects as Record<string, number | undefined>);
    if (choice.audienceEffects) s = applyAudienceEffects(s, choice.audienceEffects);
    if (choice.relationEffects) s = applyRelationEffects(s, choice.relationEffects);

    // Apply meta effects (flags, chains)
    s = applyChoiceMetaEffects(s, choice);
    
    // Mark event as fired
    s = markEventFired(s, event);

    s.log = [...s.log, `→ ${choice.text}: ${choice.message}`];
    s.currentEvent = null;

    s = processNight(s);

    const go = checkGameOver(s);
    if (go) { s.gameOver = true; s.gameOverReason = go; s.phase = 'gameover'; s.log = [...s.log, go]; }

    setState(s);
  };

  const handleStartDay = () => setState(s => ({ ...s, phase: 'action' }));

  const handleEndDay = () => {
    let s = { ...state, flags: new Set(state.flags), pendingEvents: [...state.pendingEvents], firedUniqueEvents: new Set(state.firedUniqueEvents) };
    const event = getRandomEvent(s);
    if (event) {
      s.currentEvent = event;
      s.phase = 'event';
      s.log = [...s.log, `📢 ${event.title}`];
    } else {
      s = processNight(s);
      const go = checkGameOver(s);
      if (go) { s.gameOver = true; s.gameOverReason = go; s.phase = 'gameover'; s.log = [...s.log, go]; }
    }
    setState(s);
  };

  const handleBandUpdate = (members: BandMember[]) => {
    const kicked = state.bandMembers.filter(m => !members.some(nm => nm.characterId === m.characterId));
    const added = members.filter(m => !state.bandMembers.some(om => om.characterId === m.characterId));

    let s = { ...state, bandMembers: members, relations: { ...state.relations }, flags: new Set(state.flags) };

    kicked.forEach(m => {
      const char = CHARACTERS.find(c => c.id === m.characterId);
      s.relations[m.characterId] = Math.max(-128, (s.relations[m.characterId] || 0) - 20);
      s.log = [...s.log, `👢 ${char?.name || m.characterId} выгнан!`];
    });
    added.forEach(m => {
      const char = CHARACTERS.find(c => c.id === m.characterId);
      s.relations[m.characterId] = Math.min(128, (s.relations[m.characterId] || 0) + 10);
      s.log = [...s.log, `🎉 ${char?.name || m.characterId} в группе!`];
    });

    setState(s);
  };

  const handleRestart = () => { setState(createInitialState()); setShowIntro(true); };

  const currentOpera = OPERAS[state.currentOperaIndex];
  const operaPct = currentOpera ? Math.min(100, (state.operaProgress / currentOpera.requiredProgress) * 100) : 100;
  const donations = calculateDonations(state);
  const buffs = getBandBuffs(state);
  const overexertionDmg = getOverexertionDamage(state);
  const activeFlags = state.flags.size;

  // Intro screen
  if (showIntro) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg text-center space-y-4">
          <CharacterPortrait emoji="🎹" color="#06b6d4" name="Виктор" size="xl" isViktor className="mx-auto" characterId="viktor" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Виктор Аргонов
          </h1>
          <h2 className="text-xl text-gray-400">Симулятор композитора-трансгуманиста</h2>
          
          <div className="flex justify-center gap-1 flex-wrap">
            {CHARACTERS.map(c => (
              <div key={c.id} className="flex flex-col items-center" title={c.name}>
                <CharacterPortrait emoji={c.portrait} color={c.color} name={c.name} size="sm" characterId={c.id} />
                <span className="text-[8px] text-gray-500 mt-0.5">{c.name.split(' ')[0]}</span>
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500 space-y-2 text-left bg-gray-900/50 p-4 rounded-xl border border-gray-800">
            <p>📍 <strong>Владивосток.</strong> Ты — Виктор Аргонов, композитор, философ и биохакер.</p>
            <p>🎼 <strong>Цель:</strong> Великие оперы, популярность, группа "Комплексные числа".</p>
            <p>⚡ <strong>Энергия:</strong> Действуй пока есть силы! На нуле — урон здоровью.</p>
            <p>💊 <strong>Вещества:</strong> От чая до альфа-ПВП. Большой буст = большой риск!</p>
            <p>🔗 <strong>События:</strong> Цепочки, флаги, последствия. Выборы имеют значение!</p>
            <p>🎭 <strong>Аудитория:</strong> Шизы, хомяки, интеллектуалы... Всем не угодишь!</p>
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-xl font-bold text-lg hover:from-cyan-500 hover:to-purple-500 transition-all cursor-pointer shadow-lg shadow-purple-900/50"
          >
            🎮 Начать игру
          </button>
        </div>
      </div>
    );
  }

  // Game over
  if (state.phase === 'gameover') {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-4">
        <div className="max-w-md text-center space-y-4">
          <div className="text-6xl mb-2">💀</div>
          <h1 className="text-2xl font-bold text-red-400">ИГРА ОКОНЧЕНА</h1>
          <p className="text-gray-400">{state.gameOverReason}</p>
          <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 space-y-1 text-sm text-left">
            <p>📅 Дней: <strong className="text-cyan-400">{state.day}</strong></p>
            <p>🎼 Опер: <strong className="text-purple-400">{state.completedOperas.length}</strong></p>
            <p>⭐ Популярность: <strong className="text-yellow-400">{state.popularity}</strong></p>
            <p>💰 Денег: <strong className="text-green-400">{state.money.toLocaleString()}₽</strong></p>
            <p>🏳️ Флагов: <strong className="text-gray-400">{state.flags.size}</strong></p>
            <p>📜 Уникальных событий: <strong className="text-gray-400">{state.firedUniqueEvents.size}</strong></p>
          </div>
          <button onClick={handleRestart} className="px-8 py-3 bg-gradient-to-r from-red-600 to-purple-600 rounded-xl font-bold hover:from-red-500 hover:to-purple-500 transition-all cursor-pointer">
            🔄 Заново
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; emoji: string }[] = [
    { id: 'actions', label: 'Действия', emoji: '🎯' },
    { id: 'people', label: 'Люди', emoji: '👥' },
    { id: 'substances', label: 'Вещества', emoji: '💊' },
    { id: 'band', label: 'Группа', emoji: '🎸' },
    { id: 'audience', label: 'Фанаты', emoji: '📊' },
    { id: 'log', label: 'Лог', emoji: '📜' },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-900/90 border border-red-500 text-red-200 px-4 py-2 rounded-lg text-sm animate-bounce shadow-lg max-w-xs text-center">
          {notification}
        </div>
      )}

      {state.currentEvent && state.phase === 'event' && (
        <EventModal event={state.currentEvent} onChoice={handleEventChoice} />
      )}

      {/* Header */}
      <header className="bg-gray-900/80 border-b border-gray-800 p-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CharacterPortrait emoji="🎹" color="#06b6d4" name="Виктор" size="md" isViktor characterId="viktor" />
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Виктор Аргонов
              </h1>
              <div className="text-[10px] text-gray-500">
                Владивосток • День {state.day} • {state.actionsToday > 0 ? `${state.actionsToday} действий` : 'Утро'}
                {activeFlags > 0 && <span className="text-yellow-600 ml-1">• 🏳️{activeFlags}</span>}
                {state.pendingEvents.length > 0 && <span className="text-orange-500 ml-1">• 🔗{state.pendingEvents.length}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs flex-shrink-0">
            <span className="text-yellow-400 font-bold">💰{state.money.toLocaleString()}₽</span>
            <span className="text-cyan-400">⭐{state.popularity}</span>
            <span className="text-green-400 text-[10px]">+{donations}₽/д</span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="bg-gray-900/50 border-b border-gray-800 p-2">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1">
          <StatBar label="Здоровье" value={state.health} max={100} color="bg-red-500" emoji="❤️" />
          <StatBar label="Рассудок" value={state.sanity} max={100} color="bg-purple-500" emoji="🧠" />
          <StatBar label="Энергия" value={state.energy} max={100} color="bg-yellow-500" emoji="⚡" warning={20} danger={5} />
          <StatBar label="Фокус" value={state.focus} max={100} color="bg-cyan-500" emoji="🎯" />
          <StatBar label="Креатив" value={state.creativity} max={100} color="bg-pink-500" emoji="✨" />
          <StatBar label="Мочевой" value={state.bladder} max={100} color="bg-blue-500" emoji="💧" warning={20} danger={10} />
          <StatBar label="Кишечник" value={state.bowel} max={100} color="bg-amber-600" emoji="💩" warning={20} danger={10} />
          {overexertionDmg > 0 && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="w-5 text-center">☠️</span>
              <span className="text-red-400 font-bold animate-pulse">Переутомл: -{overexertionDmg} HP/дейст</span>
            </div>
          )}
        </div>
      </div>

      {/* Opera Progress */}
      <div className="bg-gray-900/30 border-b border-gray-800 p-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-purple-400 font-bold">🎼</span>
            <span className="text-gray-300 flex-shrink-0">{currentOpera ? currentOpera.name : '✅ Все завершены!'}</span>
            {currentOpera && (
              <>
                <div className="flex-1 h-2.5 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500" style={{ width: `${operaPct}%` }} />
                </div>
                <span className="text-gray-400 w-20 text-right">{state.operaProgress}/{currentOpera.requiredProgress}</span>
              </>
            )}
          </div>
          {state.completedOperas.length > 0 && (
            <div className="flex gap-1 mt-1 flex-wrap">
              {state.completedOperas.map(id => {
                const o = OPERAS.find(op => op.id === id);
                return o && <span key={id} className="text-[9px] bg-purple-900/50 text-purple-300 px-1.5 py-0.5 rounded">✅ {o.name}</span>;
              })}
            </div>
          )}
          {(buffs.focus !== 0 || buffs.creativity !== 0 || buffs.sanity !== 0 || buffs.popularity !== 0) && (
            <div className="flex gap-2 mt-1 text-[9px] text-gray-500 flex-wrap">
              <span>🎸 Баффы:</span>
              {buffs.focus !== 0 && <span className={buffs.focus > 0 ? 'text-green-400' : 'text-red-400'}>фокус {buffs.focus > 0 ? '+' : ''}{buffs.focus}</span>}
              {buffs.creativity !== 0 && <span className={buffs.creativity > 0 ? 'text-green-400' : 'text-red-400'}>креатив {buffs.creativity > 0 ? '+' : ''}{buffs.creativity}</span>}
              {buffs.sanity !== 0 && <span className={buffs.sanity > 0 ? 'text-green-400' : 'text-red-400'}>рассудок {buffs.sanity > 0 ? '+' : ''}{buffs.sanity}</span>}
              {buffs.popularity !== 0 && <span className={buffs.popularity > 0 ? 'text-green-400' : 'text-red-400'}>попул. {buffs.popularity > 0 ? '+' : ''}{buffs.popularity}</span>}
            </div>
          )}
        </div>
      </div>

      {/* Morning banner */}
      {state.phase === 'morning' && (
        <div className="bg-gradient-to-r from-orange-900/30 to-yellow-900/30 border-b border-yellow-800/50 p-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-3xl mb-2">🌅</div>
            <h2 className="text-lg font-bold text-yellow-300">Утро дня {state.day}</h2>
            <p className="text-xs text-gray-400 mt-1">Действуй пока есть силы!</p>
            {state.pendingEvents.length > 0 && (
              <p className="text-[10px] text-orange-400 mt-1">
                🔗 Ожидает событий: {state.pendingEvents.length} (ближайшее через {Math.max(0, state.pendingEvents[0].firesOnDay - state.day)} дн.)
              </p>
            )}
            <button onClick={handleStartDay} className="mt-3 px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-lg font-bold text-sm hover:from-yellow-500 hover:to-orange-500 transition-all cursor-pointer">
              ☀️ Начать день
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      {(state.phase === 'action' || state.phase === 'event') && (
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          <div className="flex border-b border-gray-800 bg-gray-900/50 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  tab === t.id ? 'border-b-2 border-cyan-400 text-cyan-400 bg-cyan-900/20' : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/50'
                }`}
              >
                {t.emoji} {t.label}
              </button>
            ))}
            <button
              onClick={handleEndDay}
              className="ml-auto px-3 py-2 text-xs text-orange-400 hover:bg-orange-900/30 cursor-pointer whitespace-nowrap font-medium"
            >
              🌙 Конец дня ({state.actionsToday})
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3">
            {tab === 'actions' && <ActivityPanel state={state} onActivity={handleActivity} />}
            {tab === 'people' && <CharacterPanel state={state} onSelectCharacter={handleSelectCharacter} onInteract={handleCharacterInteraction} />}
            {tab === 'substances' && <SubstancePanel state={state} onTake={handleSubstance} />}
            {tab === 'band' && <BandPanel state={state} onUpdateBand={handleBandUpdate} />}
            {tab === 'audience' && <AudiencePanel state={state} />}
            {tab === 'log' && (
              <div ref={logRef} className="space-y-0.5 text-xs font-mono max-h-[500px] overflow-y-auto">
                <h3 className="text-sm font-bold text-gray-400 mb-2">📜 Журнал</h3>
                {state.log.map((entry, i) => (
                  <div key={i} className="text-gray-400 py-0.5 border-b border-gray-800/50">{entry}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <footer className="bg-gray-900/50 border-t border-gray-800 p-1.5 text-center text-[9px] text-gray-600">
        Виктор Аргонов v0.3 • Комплексные Числа • Владивосток 🌊 • Флагов: {activeFlags} • Событий: {state.firedUniqueEvents.size}
      </footer>
    </div>
  );
}
