import React from 'react';
import { CHARACTERS } from '../gameData';
import type { CharacterInteraction } from '../gameData';
import type { GameState } from '../gameState';
import { CharacterPortrait } from './CharacterPortrait';

interface Props {
  state: GameState;
  onSelectCharacter: (charId: string) => void;
  onInteract: (charId: string, interaction: CharacterInteraction) => void;
}

const getRelEmoji = (r: number) => {
  if (r > 80) return '💕';
  if (r > 40) return '😊';
  if (r > 0) return '🙂';
  if (r > -20) return '😐';
  if (r > -60) return '😠';
  return '🤬';
};

const getRelLabel = (r: number) => {
  if (r > 80) return 'Обожание';
  if (r > 40) return 'Дружба';
  if (r > 0) return 'Приятель';
  if (r > -20) return 'Нейтрально';
  if (r > -60) return 'Неприязнь';
  return 'Ненависть';
};

export const CharacterPanel: React.FC<Props> = ({ state, onSelectCharacter, onInteract }) => {
  const selectedChar = state.interactingWith ? CHARACTERS.find(c => c.id === state.interactingWith) : null;
  const selectedRel = selectedChar ? (state.relations[selectedChar.id] || 0) : 0;
  const isInBand = selectedChar ? state.bandMembers.some(m => m.characterId === selectedChar.id) : false;

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-pink-400 mb-2">👥 Персонажи</h3>
      
      {/* Character grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {CHARACTERS.map(c => {
          const rel = state.relations[c.id] || 0;
          const inBand = state.bandMembers.some(m => m.characterId === c.id);
          const isSelected = state.interactingWith === c.id;
          return (
            <button
              key={c.id}
              onClick={() => onSelectCharacter(c.id)}
              className={`flex flex-col items-center p-2 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-pink-500 bg-pink-900/30 scale-105'
                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800'
              }`}
            >
              <CharacterPortrait emoji={c.portrait} color={c.color} name={c.name} size="sm" />
              <span className="text-[10px] font-medium text-gray-300 mt-1 truncate w-full text-center">{c.name}</span>
              <span className="text-[9px]">{getRelEmoji(rel)} {rel > 0 ? '+' : ''}{rel}</span>
              {inBand && <span className="text-[8px] text-amber-400">🎸</span>}
            </button>
          );
        })}
      </div>

      {/* Selected character detail */}
      {selectedChar && (
        <div
          className="rounded-xl border p-3 space-y-3"
          style={{
            borderColor: `${selectedChar.color}66`,
            background: `linear-gradient(135deg, ${selectedChar.color}11, ${selectedChar.color}05)`,
          }}
        >
          {/* Header */}
          <div className="flex items-start gap-3">
            <CharacterPortrait emoji={selectedChar.portrait} color={selectedChar.color} name={selectedChar.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold" style={{ color: selectedChar.color }}>{selectedChar.name}</h4>
                {isInBand && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-900/50 text-amber-300 rounded border border-amber-700">
                    🎸 {state.bandMembers.find(m => m.characterId === selectedChar.id)?.role}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{selectedChar.desc}</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {selectedChar.traits.map(t => (
                  <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full border border-gray-600 text-gray-400 bg-gray-800/50">{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Relation bar */}
          <div className="flex items-center gap-2">
            <span className="text-lg">{getRelEmoji(selectedRel)}</span>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-gray-400">{getRelLabel(selectedRel)}</span>
                <span className={selectedRel >= 0 ? 'text-green-400' : 'text-red-400'}>
                  {selectedRel > 0 ? '+' : ''}{selectedRel}
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden relative">
                <div className="absolute inset-0 w-1/2 border-r border-gray-600" />
                <div
                  className={`h-full rounded-full transition-all duration-500 ${selectedRel >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ width: `${((selectedRel + 128) / 256) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Perks */}
          <div>
            <div className="text-[10px] text-gray-500 mb-1 font-medium">ПЕРКИ:</div>
            <div className="space-y-1">
              {selectedChar.perks.map(p => (
                <div key={p.name} className="flex items-start gap-1.5 text-[10px]">
                  <span className="text-yellow-400">★</span>
                  <div>
                    <span className="font-medium text-yellow-300">{p.name}:</span>{' '}
                    <span className="text-gray-400">{p.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactions */}
          <div>
            <div className="text-[10px] text-gray-500 mb-1.5 font-medium">ВЗАИМОДЕЙСТВИЯ:</div>
            <div className="space-y-1.5">
              {selectedChar.interactions.map(inter => {
                const locked = inter.requiredRelation !== undefined && selectedRel < inter.requiredRelation;
                const isExhausting = state.energy < inter.energyCost;
                return (
                  <button
                    key={inter.id}
                    onClick={() => !locked && onInteract(selectedChar.id, inter)}
                    disabled={locked}
                    className={`w-full text-left p-2 rounded-lg border text-xs transition-all ${
                      locked
                        ? 'border-gray-800 bg-gray-900/50 opacity-40 cursor-not-allowed'
                        : isExhausting
                          ? 'border-red-800 bg-red-900/20 hover:bg-red-900/30 cursor-pointer'
                          : 'border-gray-700 bg-gray-800/60 hover:bg-gray-700/60 cursor-pointer hover:border-gray-500'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{inter.emoji} {inter.name}</span>
                      <span className={`text-[10px] ${isExhausting ? 'text-red-400' : 'text-yellow-500'}`}>
                        ⚡-{inter.energyCost}
                      </span>
                    </div>
                    <div className="text-gray-500 text-[10px] mt-0.5">{inter.desc}</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <span className={`text-[9px] px-1 rounded ${inter.relationChange >= 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                        ❤️ {inter.relationChange > 0 ? '+' : ''}{inter.relationChange}
                      </span>
                      {Object.entries(inter.effects).filter(([, v]) => v !== 0 && v !== undefined).map(([k, v]) => (
                        <span key={k} className={`text-[9px] px-1 rounded ${(v as number) > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                          {k}: {(v as number) > 0 ? '+' : ''}{v}
                        </span>
                      ))}
                    </div>
                    {locked && (
                      <div className="text-[9px] text-red-400 mt-1">🔒 Нужно отношение ≥ {inter.requiredRelation}</div>
                    )}
                    {isExhausting && !locked && (
                      <div className="text-[9px] text-red-400 mt-1">⚠️ Переутомление! Будет урон здоровью</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
