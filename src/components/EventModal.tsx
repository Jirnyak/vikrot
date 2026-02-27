import React from 'react';
import { CHARACTERS } from '../gameData';
import type { GameEvent } from '../gameData';
import { CharacterPortrait } from './CharacterPortrait';

interface Props {
  event: GameEvent;
  onChoice: (choiceIndex: number) => void;
}

export const EventModal: React.FC<Props> = ({ event, onChoice }) => {
  const char = event.characterId ? CHARACTERS.find(c => c.id === event.characterId) : null;

  return (
    <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border-2 border-cyan-600 rounded-xl p-5 max-w-md w-full shadow-2xl shadow-cyan-900/30"
        style={char ? { borderColor: `${char.color}99` } : {}}
      >
        <div className="text-center mb-4">
          {char ? (
            <div className="flex flex-col items-center gap-2 mb-2">
              <CharacterPortrait emoji={char.portrait} color={char.color} name={char.name} size="xl" />
              <div className="text-[10px] px-2 py-0.5 rounded-full border border-gray-600 text-gray-400"
                style={{ borderColor: `${char.color}66`, color: char.color }}>
                {char.name}
              </div>
            </div>
          ) : (
            <div className="text-5xl mb-2 p-3 inline-block rounded-full bg-gray-800/50">{event.emoji}</div>
          )}
          <h2 className="text-lg font-bold text-cyan-300" style={char ? { color: char.color } : {}}>{event.title}</h2>
          <p className="text-sm text-gray-400 mt-2 leading-relaxed">{event.desc}</p>
        </div>

        <div className="space-y-2">
          {event.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoice(i)}
              className="w-full text-left p-3 rounded-lg border border-gray-700 bg-gray-800/80 hover:bg-cyan-900/30 hover:border-cyan-600 transition-all cursor-pointer group"
            >
              <div className="text-sm font-medium text-gray-200 group-hover:text-white">{choice.text}</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {Object.entries(choice.effects).filter(([,v]) => v !== 0 && v !== undefined).map(([k, v]) => (
                  <span key={k} className={`text-[9px] px-1 rounded ${(v as number) > 0 ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                    {k}: {(v as number) > 0 ? '+' : ''}{v}
                  </span>
                ))}
                {choice.relationEffects && Object.entries(choice.relationEffects).map(([cid, v]) => {
                  const rc = CHARACTERS.find(c => c.id === cid);
                  return rc && (
                    <span key={cid} className={`text-[9px] px-1 rounded ${v > 0 ? 'bg-pink-900/50 text-pink-400' : 'bg-red-900/50 text-red-400'}`}>
                      {rc.portrait} {v > 0 ? '+' : ''}{v}
                    </span>
                  );
                })}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
