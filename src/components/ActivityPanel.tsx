import React from 'react';
import { ACTIVITIES, type Activity } from '../gameData';
import type { GameState } from '../gameState';
import { getOverexertionDamage } from '../gameState';

interface Props {
  state: GameState;
  onActivity: (activity: Activity) => void;
}

export const ActivityPanel: React.FC<Props> = ({ state, onActivity }) => {
  const overexertionDmg = getOverexertionDamage(state);
  
  const canDo = (a: Activity) => {
    if (a.requiredFocus && state.focus < a.requiredFocus) return false;
    if (a.effects.money && a.effects.money < 0 && state.money < Math.abs(a.effects.money)) return false;
    return true;
  };

  const isExhausting = (a: Activity) => {
    const energyCost = Math.abs(a.effects.energy || 0);
    return state.energy < energyCost && energyCost > 0;
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-cyan-400">🎯 Действия</h3>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="text-gray-400">Сегодня: <span className="text-cyan-300 font-bold">{state.actionsToday}</span> действий</span>
          {overexertionDmg > 0 && (
            <span className="text-red-400 font-bold animate-pulse">
              ⚠️ Переутомление! -{overexertionDmg} HP за действие
            </span>
          )}
        </div>
      </div>
      
      {state.energy <= 0 && (
        <div className="bg-red-900/30 border border-red-800 rounded-lg p-2 text-xs text-red-300 mb-2">
          ⚠️ <strong>Энергия на нуле!</strong> Каждое действие наносит {overexertionDmg} урона здоровью и {Math.floor(overexertionDmg/2)} рассудку. 
          Урон растёт с каждым действием! Рекомендуется поспать или закончить день.
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {ACTIVITIES.map(a => {
          const can = canDo(a);
          const exhausting = isExhausting(a);
          return (
            <button
              key={a.id}
              onClick={() => can && onActivity(a)}
              disabled={!can}
              className={`text-left p-2 rounded-lg border text-xs transition-all ${
                !can
                  ? 'border-gray-800 bg-gray-900/50 opacity-40 cursor-not-allowed'
                  : exhausting
                    ? 'border-red-800 bg-red-900/20 hover:bg-red-900/30 hover:border-red-600 cursor-pointer'
                    : 'border-cyan-800 bg-gray-800/80 hover:bg-cyan-900/50 hover:border-cyan-500 cursor-pointer'
              }`}
            >
              <div className="font-bold">{a.emoji} {a.name}</div>
              <div className="text-gray-500 text-[10px] mt-0.5">{a.desc}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(a.effects).filter(([,v]) => v !== 0 && v !== undefined).map(([k, v]) => (
                  <span key={k} className={`text-[9px] px-1 rounded ${(v as number) > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {k}: {(v as number) > 0 ? '+' : ''}{v}
                  </span>
                ))}
              </div>
              {exhausting && can && (
                <div className="text-[9px] text-red-400 mt-1">⚠️ Переутомление!</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
