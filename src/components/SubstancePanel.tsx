import React from 'react';
import { SUBSTANCES, SUBSTANCE_TIER_INFO, type SubstanceTier } from '../gameData';
import type { GameState } from '../gameState';

interface Props {
  state: GameState;
  onTake: (substanceId: string) => void;
}

const EFFECT_LABELS: Record<string, string> = {
  focus: '🎯фокус',
  creativity: '✨креатив',
  health: '❤️HP',
  sanity: '🧠рассудок',
  energy: '⚡энергия',
  bladder: '💧мочевой',
  bowel: '💩кишечник',
};

export const SubstancePanel: React.FC<Props> = ({ state, onTake }) => {
  const tiers: SubstanceTier[] = ['light', 'medium', 'hard', 'extreme'];

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-purple-400 mb-2">💊 Вещества</h3>

      {tiers.map(tier => {
        const info = SUBSTANCE_TIER_INFO[tier];
        const subs = SUBSTANCES.filter(s => s.tier === tier);
        if (subs.length === 0) return null;

        return (
          <div key={tier}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">{info.emoji}</span>
              <span className="text-xs font-bold" style={{ color: info.color }}>{info.name}</span>
              <span className="text-[9px] text-gray-500">{info.desc}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {subs.map(sub => {
                const dose = state.substanceLog[sub.id];
                const dosesToday = dose?.doses || 0;
                const addiction = dose?.addiction || 0;
                const isOverdose = dosesToday >= sub.overdoseThreshold;
                const canAfford = state.money >= sub.cost;
                const isExtreme = tier === 'extreme';
                const isHard = tier === 'hard';

                return (
                  <button
                    key={sub.id}
                    onClick={() => canAfford && onTake(sub.id)}
                    disabled={!canAfford}
                    className={`text-left p-2 rounded-lg border text-xs transition-all ${
                      canAfford
                        ? isOverdose
                          ? 'border-red-700 bg-red-900/30 hover:bg-red-900/50 cursor-pointer'
                          : isExtreme
                            ? 'border-red-800/50 bg-red-950/30 hover:bg-red-900/40 hover:border-red-500 cursor-pointer'
                            : isHard
                              ? 'border-yellow-800/50 bg-yellow-950/20 hover:bg-yellow-900/30 hover:border-yellow-500 cursor-pointer'
                              : 'border-purple-800 bg-gray-800/80 hover:bg-purple-900/50 hover:border-purple-500 cursor-pointer'
                        : 'border-gray-800 bg-gray-900/50 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold">{sub.emoji} {sub.name}</span>
                      <span className="text-yellow-400">{sub.cost}₽</span>
                    </div>
                    <div className="text-gray-500 text-[10px] mt-0.5">{sub.desc}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {Object.entries(sub.effects).filter(([, v]) => v !== 0 && v !== undefined).map(([k, v]) => (
                        <span key={k} className={`text-[9px] px-1 rounded ${(v as number) > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                          {EFFECT_LABELS[k] || k}: {(v as number) > 0 ? '+' : ''}{v}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2 mt-1 text-[9px]">
                      <span className={dosesToday >= sub.overdoseThreshold ? 'text-red-400 font-bold' : 'text-gray-500'}>
                        Доз: {dosesToday}/{sub.overdoseThreshold}
                      </span>
                      {addiction > 0 && (
                        <span className={`${addiction > 50 ? 'text-red-400 font-bold' : addiction > 20 ? 'text-yellow-500' : 'text-gray-500'}`}>
                          Зависимость: {Math.round(addiction)}%
                        </span>
                      )}
                      {isExtreme && <span className="text-red-500 font-bold animate-pulse">⚠️ ОПАСНО</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Total addiction summary */}
      {Object.values(state.substanceLog).some(d => d.addiction > 0) && (
        <div className="mt-3 p-2 rounded-lg bg-gray-900/50 border border-gray-800">
          <div className="text-[10px] font-bold text-gray-400 mb-1">📊 Зависимости:</div>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(state.substanceLog)
              .filter(([, d]) => d.addiction > 0)
              .sort(([, a], [, b]) => b.addiction - a.addiction)
              .map(([id, d]) => {
                const sub = SUBSTANCES.find(s => s.id === id);
                return sub && (
                  <div key={id} className="text-[9px] flex items-center gap-1">
                    <span>{sub.emoji}</span>
                    <div className="w-12 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${d.addiction > 70 ? 'bg-red-500' : d.addiction > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                        style={{ width: `${d.addiction}%` }}
                      />
                    </div>
                    <span className={d.addiction > 70 ? 'text-red-400' : 'text-gray-500'}>{Math.round(d.addiction)}%</span>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
