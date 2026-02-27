import React from 'react';
import { SUBSTANCES } from '../gameData';
import type { GameState } from '../gameState';

interface Props {
  state: GameState;
  onTake: (substanceId: string) => void;
}

export const SubstancePanel: React.FC<Props> = ({ state, onTake }) => {
  return (
    <div className="space-y-1.5">
      <h3 className="text-sm font-bold text-purple-400 mb-2">💊 Вещества</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {SUBSTANCES.map(sub => {
          const dose = state.substanceLog[sub.id];
          const dosesToday = dose?.doses || 0;
          const addiction = dose?.addiction || 0;
          const isOverdose = dosesToday >= sub.overdoseThreshold;
          const canAfford = state.money >= sub.cost;

          return (
            <button
              key={sub.id}
              onClick={() => canAfford && onTake(sub.id)}
              disabled={!canAfford}
              className={`text-left p-2 rounded-lg border text-xs transition-all ${
                canAfford
                  ? isOverdose
                    ? 'border-red-700 bg-red-900/30 hover:bg-red-900/50 cursor-pointer'
                    : 'border-purple-800 bg-gray-800/80 hover:bg-purple-900/50 hover:border-purple-500 cursor-pointer'
                  : 'border-gray-800 bg-gray-900/50 opacity-40 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{sub.emoji} {sub.name}</span>
                <span className="text-yellow-400">{sub.cost}₽</span>
              </div>
              <div className="text-gray-500 text-[10px] mt-0.5">{sub.desc}</div>
              <div className="flex justify-between mt-1">
                <div className="flex flex-wrap gap-1">
                  {Object.entries(sub.effects).filter(([,v]) => v !== 0).map(([k, v]) => (
                    <span key={k} className={`text-[9px] px-1 rounded ${(v as number) > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                      {k}: {(v as number) > 0 ? '+' : ''}{v}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-1 text-[9px]">
                <span className={dosesToday >= sub.overdoseThreshold ? 'text-red-400 font-bold' : 'text-gray-500'}>
                  Доз: {dosesToday}/{sub.overdoseThreshold}
                </span>
                {addiction > 0 && (
                  <span className={`${addiction > 50 ? 'text-red-400' : 'text-yellow-500'}`}>
                    Зависимость: {Math.round(addiction)}%
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
