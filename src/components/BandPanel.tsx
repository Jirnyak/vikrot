import React, { useState } from 'react';
import { CHARACTERS, BAND_ROLES } from '../gameData';
import type { GameState, BandMember } from '../gameState';
import { CharacterPortrait } from './CharacterPortrait';

interface Props {
  state: GameState;
  onUpdateBand: (members: BandMember[]) => void;
}

function getRoleFit(charId: string, roleId: string): 'natural' | 'ok' | 'mismatch' {
  const char = CHARACTERS.find(c => c.id === charId);
  if (!char) return 'ok';
  if (char.naturalRoles.includes(roleId)) return 'natural';
  if (char.mismatchQuotes && char.mismatchQuotes[roleId]) return 'mismatch';
  return 'ok';
}

function getFitLabel(fit: 'natural' | 'ok' | 'mismatch') {
  switch (fit) {
    case 'natural': return { text: '★ Талант', color: 'text-green-400', bg: 'bg-green-900/30 border-green-700/50' };
    case 'ok': return { text: '○ Норм', color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/30' };
    case 'mismatch': return { text: '✗ Не то', color: 'text-red-400', bg: 'bg-red-900/30 border-red-700/50' };
  }
}

export const BandPanel: React.FC<Props> = ({ state, onUpdateBand }) => {
  const [addingChar, setAddingChar] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [changingRole, setChangingRole] = useState<string | null>(null); // characterId of member changing role

  const currentMembers = state.bandMembers;
  const memberIds = currentMembers.map(m => m.characterId);
  const availableChars = CHARACTERS.filter(c => !memberIds.includes(c.id));

  // Roles already filled
  const filledRoles = currentMembers.map(m => m.role);

  const handleKick = (charId: string) => {
    onUpdateBand(currentMembers.filter(m => m.characterId !== charId));
    setChangingRole(null);
  };

  const handleAdd = () => {
    if (addingChar && selectedRole) {
      onUpdateBand([...currentMembers, { characterId: addingChar, role: selectedRole }]);
      setAddingChar(null);
      setSelectedRole('');
    }
  };

  const handleChangeRole = (charId: string, newRole: string) => {
    onUpdateBand(currentMembers.map(m =>
      m.characterId === charId ? { ...m, role: newRole } : m
    ));
    setChangingRole(null);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-amber-400 mb-2">🎸 Комплексные Числа — Управление составом</h3>
      <p className="text-[10px] text-gray-500 mb-2">
        Назначай кого угодно на любую роль! Но у каждого есть <span className="text-green-400">таланты</span> и <span className="text-red-400">антиталанты</span>...
      </p>

      {/* Current members */}
      <div className="space-y-2">
        <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Текущий состав ({currentMembers.length})</div>
        {currentMembers.map(m => {
          const char = CHARACTERS.find(c => c.id === m.characterId);
          if (!char) return null;
          const rel = state.relations[m.characterId] || 0;
          const role = BAND_ROLES.find(r => r.id === m.role);
          const fit = getRoleFit(m.characterId, m.role);
          const fitInfo = getFitLabel(fit);
          const mismatchQuote = fit === 'mismatch' && char.mismatchQuotes ? char.mismatchQuotes[m.role] : null;

          return (
            <div key={m.characterId} className="rounded-lg p-2.5 border"
              style={{ borderColor: `${char.color}44`, background: `${char.color}08` }}>
              <div className="flex items-center gap-2">
                <CharacterPortrait emoji={char.portrait} color={char.color} name={char.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold flex items-center gap-2">
                    <span style={{ color: char.color }}>{char.name}</span>
                    <span className="text-gray-500">—</span>
                    <span className="text-white">{role?.emoji} {role?.name || m.role}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border ${fitInfo.bg} ${fitInfo.color}`}>
                      {fitInfo.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] ${rel > 0 ? 'text-green-400' : rel < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      ❤️ {rel > 0 ? '+' : ''}{rel}
                    </span>
                    {fit === 'natural' && (
                      <span className="text-[9px] text-green-500">Баффы усилены!</span>
                    )}
                    {fit === 'mismatch' && (
                      <span className="text-[9px] text-red-400">Баффы ослаблены!</span>
                    )}
                  </div>
                  {mismatchQuote && (
                    <div className="text-[9px] text-red-300/70 italic mt-0.5">{mismatchQuote}</div>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => setChangingRole(changingRole === m.characterId ? null : m.characterId)}
                    className="text-[10px] px-2 py-1 bg-blue-900/50 border border-blue-700 rounded hover:bg-blue-800 text-blue-300 cursor-pointer"
                  >
                    🔄
                  </button>
                  <button
                    onClick={() => handleKick(m.characterId)}
                    className="text-[10px] px-2 py-1 bg-red-900/50 border border-red-700 rounded hover:bg-red-800 text-red-300 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Role change */}
              {changingRole === m.characterId && (
                <div className="mt-2 pt-2 border-t border-gray-700/50">
                  <div className="text-[10px] text-gray-400 mb-1">Сменить роль:</div>
                  <div className="flex flex-wrap gap-1">
                    {BAND_ROLES.map(r => {
                      const rFit = getRoleFit(m.characterId, r.id);
                      const rFitInfo = getFitLabel(rFit);
                      const isCurrent = r.id === m.role;
                      const isTaken = filledRoles.includes(r.id) && r.id !== m.role;
                      return (
                        <button
                          key={r.id}
                          onClick={() => !isCurrent && handleChangeRole(m.characterId, r.id)}
                          disabled={isCurrent}
                          className={`text-[10px] px-2 py-1 rounded border cursor-pointer transition-all flex items-center gap-1 ${
                            isCurrent
                              ? 'border-cyan-500 bg-cyan-900/30 text-cyan-300 cursor-default'
                              : 'border-gray-600 hover:border-gray-400 text-gray-400 hover:text-gray-200'
                          }`}
                          title={`${r.desc} • ${rFitInfo.text}`}
                        >
                          <span>{r.emoji}</span>
                          <span>{r.name}</span>
                          <span className={`${rFitInfo.color} text-[8px]`}>
                            {rFit === 'natural' ? '★' : rFit === 'mismatch' ? '✗' : '○'}
                          </span>
                          {isTaken && <span className="text-orange-400 text-[8px]">⚠️</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Show role buffs */}
              {role && (
                <div className="flex gap-2 mt-1 text-[9px] text-gray-500 flex-wrap">
                  {role.buffs.focus && <span>🎯+{role.buffs.focus}</span>}
                  {role.buffs.creativity && <span>✨+{role.buffs.creativity}</span>}
                  {role.buffs.sanity && <span>🧠+{role.buffs.sanity}</span>}
                  {role.buffs.popularity && <span>⭐+{role.buffs.popularity}</span>}
                  {role.buffs.donateBonus && <span>💰+{role.buffs.donateBonus}%</span>}
                  {role.buffs.operaBonus && <span>🎼+{role.buffs.operaBonus}%</span>}
                  <span className="text-gray-600">
                    {fit === 'natural' ? '(×1.5)' : fit === 'mismatch' ? '(×0.3)' : '(×0.7)'}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {currentMembers.length === 0 && (
          <div className="text-xs text-gray-500 text-center py-4">Группа пуста. Добавьте участников!</div>
        )}
      </div>

      {/* Add member */}
      <div className="bg-gray-800/50 rounded-lg p-2.5 border border-gray-700">
        <div className="text-[10px] text-gray-400 mb-1.5 font-semibold uppercase tracking-wide">➕ Добавить участника</div>
        <div className="flex flex-wrap gap-1.5">
          {availableChars.map(c => {
            const rel = state.relations[c.id] || 0;
            return (
              <button
                key={c.id}
                onClick={() => { setAddingChar(c.id === addingChar ? null : c.id); setSelectedRole(''); }}
                className={`flex items-center gap-1 text-[10px] px-2 py-1.5 rounded border cursor-pointer transition-all ${
                  addingChar === c.id ? 'border-amber-500 bg-amber-900/30' : 'border-gray-600 hover:border-amber-600'
                }`}
                style={addingChar === c.id ? { borderColor: c.color, background: `${c.color}22` } : {}}
              >
                <span>{c.portrait}</span>
                <span className="text-gray-300">{c.name}</span>
                <span className={`text-[8px] ${rel > 0 ? 'text-green-400' : rel < 0 ? 'text-red-400' : 'text-gray-500'}`}>
                  ({rel > 0 ? '+' : ''}{rel})
                </span>
              </button>
            );
          })}
          {availableChars.length === 0 && (
            <div className="text-[10px] text-gray-500">Все персонажи уже в группе!</div>
          )}
        </div>

        {addingChar && (() => {
          const char = CHARACTERS.find(c => c.id === addingChar);
          if (!char) return null;
          return (
            <div className="mt-2 p-2.5 rounded-lg border border-gray-600 bg-gray-800/50">
              <div className="flex items-center gap-2 mb-2">
                <CharacterPortrait emoji={char.portrait} color={char.color} name={char.name} size="sm" />
                <div>
                  <div className="text-xs font-bold" style={{ color: char.color }}>{char.name}</div>
                  <div className="text-[9px] text-gray-500">{char.desc}</div>
                  <div className="flex gap-1 mt-0.5">
                    <span className="text-[8px] text-green-400">
                      Таланты: {char.naturalRoles.map(r => BAND_ROLES.find(br => br.id === r)?.name || r).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-[10px] text-gray-400 mb-1">Выбери роль (любую!):</div>
              <div className="flex flex-wrap gap-1">
                {BAND_ROLES.map(r => {
                  const fit = getRoleFit(addingChar, r.id);
                  const fitInfo = getFitLabel(fit);
                  const isTaken = filledRoles.includes(r.id);
                  const mq = fit === 'mismatch' && char.mismatchQuotes ? char.mismatchQuotes[r.id] : null;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setSelectedRole(r.id)}
                      className={`text-[10px] px-2 py-1.5 rounded border cursor-pointer transition-all flex flex-col items-start ${
                        selectedRole === r.id
                          ? 'border-green-500 bg-green-900/40 text-green-300'
                          : 'border-gray-600 hover:border-gray-400 text-gray-400 hover:text-gray-200'
                      }`}
                      title={mq || r.desc}
                    >
                      <div className="flex items-center gap-1">
                        <span>{r.emoji}</span>
                        <span>{r.name}</span>
                        <span className={`${fitInfo.color} text-[8px] font-bold`}>
                          {fit === 'natural' ? '★' : fit === 'mismatch' ? '✗' : '○'}
                        </span>
                        {isTaken && <span className="text-orange-400 text-[8px]" title="Роль уже занята">⚠️</span>}
                      </div>
                      {selectedRole === r.id && mq && (
                        <div className="text-[8px] text-red-300/70 italic mt-0.5">{mq}</div>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedRole && (() => {
                const role = BAND_ROLES.find(r => r.id === selectedRole);
                const fit = getRoleFit(addingChar, selectedRole);
                const fitInfo = getFitLabel(fit);
                return (
                  <div className="mt-2 space-y-1.5">
                    <div className={`text-[10px] p-1.5 rounded border ${fitInfo.bg}`}>
                      <span className={fitInfo.color}>{fitInfo.text}</span>
                      <span className="text-gray-400 ml-1">
                        — баффы роли будут на {fit === 'natural' ? '150%' : fit === 'mismatch' ? '30%' : '70%'} эффективности
                      </span>
                    </div>
                    <button
                      onClick={handleAdd}
                      className="text-xs px-3 py-1.5 bg-green-800 border border-green-600 rounded hover:bg-green-700 text-green-200 cursor-pointer font-medium"
                    >
                      ✅ Добавить {char.name} как {role?.emoji} {role?.name}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        })()}
      </div>

      {/* Role legend */}
      <div className="bg-gray-800/30 rounded-lg p-2 border border-gray-700/50">
        <div className="text-[10px] text-gray-500 font-semibold mb-1">📋 Все роли в группе:</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1">
          {BAND_ROLES.map(r => {
            const filled = currentMembers.find(m => m.role === r.id);
            const filledChar = filled ? CHARACTERS.find(c => c.id === filled.characterId) : null;
            return (
              <div key={r.id} className={`text-[9px] p-1 rounded border ${
                filled ? 'border-gray-600 bg-gray-800/50' : 'border-gray-800 bg-gray-900/30 opacity-50'
              }`}>
                <div className="flex items-center gap-1">
                  <span>{r.emoji}</span>
                  <span className="text-gray-300">{r.name}</span>
                  {filledChar && (
                    <span className="ml-auto" style={{ color: filledChar.color }}>
                      {filledChar.portrait} {filledChar.name.split(' ')[0]}
                    </span>
                  )}
                  {!filled && <span className="ml-auto text-gray-600">пусто</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
