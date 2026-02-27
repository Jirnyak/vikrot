// Universal asset loader — just put .png files in the right folder!
// Portraits: public/assets/portraits/{characterId}.png
// Events: public/assets/events/{eventId}.png

const BASE = './';

export function getPortraitUrl(characterId: string): string {
  return `${BASE}assets/portraits/${characterId}.png`;
}

export function getViktorPortraitUrl(): string {
  return `${BASE}assets/portraits/viktor.png`;
}

export function getEventImageUrl(eventId: string): string {
  return `${BASE}assets/events/${eventId}.png`;
}
