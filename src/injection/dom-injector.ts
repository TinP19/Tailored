import { RollbackSnapshot } from '../types';

const TARGET_SELECTORS = [
  '[data-intentswap="hero"]',
  '.hero',
  '#hero',
  '[class*="hero"]',
  'main > section:first-child',
  'header',
  'body > section:first-child',
];

export function findTarget(): HTMLElement | null {
  for (const selector of TARGET_SELECTORS) {
    try {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) return el;
    } catch {
      continue;
    }
  }
  return null;
}

export function createSnapshot(target: HTMLElement): RollbackSnapshot {
  return {
    target,
    originalHTML: target.innerHTML,
  };
}

export function swapDOM(target: HTMLElement, html: string): void {
  target.innerHTML = html;
}

export function rollback(snapshot: RollbackSnapshot): void {
  snapshot.target.innerHTML = snapshot.originalHTML;
}
