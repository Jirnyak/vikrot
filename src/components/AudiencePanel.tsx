import React from 'react';
import { AUDIENCE_GROUPS } from '../gameData';
import type { GameState } from '../gameState';

interface Props {
  state: GameState;
}

export const AudiencePanel: React.FC<Props> = ({ state }) => {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-bold text-green-400 mb-2">👥 Аудитория</h3>
      {AUDIENCE_GROUPS.map(g => {
        const a = state.audience[g.id];
        if (!a) return null;
        const donatePerDay = Math.round(a.size * g.donateRate * (a.opinion / 50));
        return (
          <div key={g.id} className="bg-gray-800/50 rounded p-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-200">{g.emoji} {g.name}</span>
              <span className="text-gray-400">{a.size} чел.</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-gray-500">Мнение:</span>
              <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${a.opinion > 60 ? 'bg-green-500' : a.opinion > 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${a.opinion}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 w-6 text-right">{a.opinion}</span>
              <span className={`text-[10px] ${donatePerDay >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {donatePerDay >= 0 ? '+' : ''}{donatePerDay}₽/д
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
