import React from 'react';
import { CHARACTERS } from '../gameData';
import type { GameState } from '../gameState';
import { CharacterPortrait } from './CharacterPortrait';

interface Props {
  state: GameState;
}

export const RelationsPanel: React.FC<Props> = ({ state }) => {
  const sorted = CHARACTERS.map(c => ({
    ...c,
    relation: state.relations[c.id] || 0,
    inBand: state.bandMembers.some(m => m.characterId === c.id),
  })).sort((a, b) => b.relation - a.relation);

  const getRelEmoji = (r: number) => {
    if (r > 80) return '💕';
    if (r > 40) return '😊';
    if (r > 0) return '🙂';
    if (r > -20) return '😐';
    if (r > -60) return '😠';
    return '🤬';
  };

  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold text-pink-400 mb-2">💬 Отношения</h3>
      {sorted.map(c => (
        <div key={c.id} className="flex items-center gap-2 text-xs bg-gray-800/50 rounded-lg p-1.5">
          <CharacterPortrait emoji={c.portrait} color={c.color} name={c.name} size="sm" />
          <span className={`w-28 truncate ${c.inBand ? 'font-bold' : 'text-gray-300'}`} style={c.inBand ? { color: c.color } : {}}>
            {c.name} {c.inBand ? '🎸' : ''}
          </span>
          <span className="w-4 text-center">{getRelEmoji(c.relation)}</span>
          <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 flex">
              <div className="w-1/2 border-r border-gray-600" />
              <div className="w-1/2" />
            </div>
            <div
              className={`h-full rounded-full transition-all duration-300 ${c.relation >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ width: `${((c.relation + 128) / 256) * 100}%` }}
            />
          </div>
          <span className={`w-8 text-right font-mono ${c.relation > 0 ? 'text-green-400' : c.relation < 0 ? 'text-red-400' : 'text-gray-400'}`}>
            {c.relation > 0 ? '+' : ''}{c.relation}
          </span>
        </div>
      ))}
    </div>
  );
};
