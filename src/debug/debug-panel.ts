import { DecisionObject, IntentId } from '../types';

const ALL_INTENTS: IntentId[] = ['BUY_NOW', 'COMPARE', 'USE_CASE', 'BUDGET', 'GENERAL'];

type SimulateCallback = (intent: IntentId) => void;

let panelElement: HTMLElement | null = null;
let toggleElement: HTMLElement | null = null;

export function showDebugPanel(decision: DecisionObject, onSimulate: SimulateCallback): void {
  injectDebugStyles();

  // Create toggle button
  toggleElement = document.createElement('button');
  toggleElement.id = 'isw-debug-toggle';
  toggleElement.textContent = 'ISW Debug';
  toggleElement.addEventListener('click', togglePanel);
  document.body.appendChild(toggleElement);

  // Create panel
  panelElement = document.createElement('div');
  panelElement.id = 'isw-debug-panel';
  document.body.appendChild(panelElement);

  // Populate panel
  updatePanel(decision);

  // Wire simulate buttons
  wireSimulateButtons(onSimulate);

  // Wire close button
  const closeBtn = panelElement.querySelector('[data-isw-close]');
  if (closeBtn) {
    closeBtn.addEventListener('click', togglePanel);
  }

  // Wire copy button
  wireCopyButton(decision);

  // Keyboard shortcut: Ctrl+Shift+D
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      e.preventDefault();
      togglePanel();
    }
  });
}

export function updatePanel(decision: DecisionObject): void {
  if (!panelElement) return;

  const maxScore = Math.max(decision.confidence, 6);
  const barWidth = Math.round((decision.confidence / maxScore) * 100);

  const intentLabel = decision.subIntent
    ? `${decision.intent} (${decision.subIntent})`
    : decision.intent;

  const signalsHTML = decision.signalsUsed.length > 0
    ? decision.signalsUsed.map(s => `
        <li class="isw-debug-signal">
          <span class="isw-debug-signal-source">${s.source}</span>
          <span class="isw-debug-signal-value">"${s.rawValue}"</span>
          <span class="isw-debug-signal-arrow">&rarr;</span>
          <span class="isw-debug-signal-contrib">${s.contributedTo}</span>
          <span class="isw-debug-signal-weight">+${s.weight}</span>
        </li>
      `).join('')
    : '<li class="isw-debug-signal"><span class="isw-debug-signal-source">No signals detected</span></li>';

  const simulateButtons = ALL_INTENTS.map(intent =>
    `<button class="isw-debug-sim-btn${intent === decision.intent ? ' isw-debug-sim-active' : ''}" data-isw-simulate="${intent}">${intent}</button>`
  ).join('');

  panelElement.innerHTML = `
    <div class="isw-debug-header">
      <div class="isw-debug-title">IntentSwap Debug</div>
      <button data-isw-close class="isw-debug-close">&times;</button>
    </div>
    <div class="isw-debug-body">
      <div class="isw-debug-section">
        <div class="isw-debug-label">Detected Intent</div>
        <div class="isw-debug-intent">
          <span class="isw-debug-intent-name">${intentLabel}</span>
        </div>
      </div>

      <div class="isw-debug-section">
        <div class="isw-debug-label">Confidence</div>
        <div class="isw-debug-confidence">
          <span class="isw-debug-confidence-value">${decision.confidence} / ${maxScore}</span>
          <div class="isw-debug-bar">
            <div class="isw-debug-bar-fill" style="width:${barWidth}%"></div>
          </div>
        </div>
      </div>

      <div class="isw-debug-section">
        <div class="isw-debug-label">Signals</div>
        <ul class="isw-debug-signals">${signalsHTML}</ul>
      </div>

      <div class="isw-debug-section">
        <div class="isw-debug-label">Decision</div>
        <div class="isw-debug-decision">
          <div class="isw-debug-row"><span class="isw-debug-key">Template</span><span class="isw-debug-val">${decision.template}</span></div>
          <div class="isw-debug-row"><span class="isw-debug-key">Image</span><span class="isw-debug-val">${decision.heroImage}</span></div>
          <div class="isw-debug-row"><span class="isw-debug-key">Headline</span><span class="isw-debug-val">${decision.headline}</span></div>
          <div class="isw-debug-row"><span class="isw-debug-key">CTA</span><span class="isw-debug-val">${decision.ctaText}</span></div>
        </div>
      </div>

      <div class="isw-debug-section">
        <div class="isw-debug-label">Reason</div>
        <p class="isw-debug-reason">${decision.reason}</p>
      </div>

      <div class="isw-debug-section">
        <div class="isw-debug-label">Simulate Intent</div>
        <div class="isw-debug-simulate">${simulateButtons}</div>
      </div>

      <div class="isw-debug-footer">
        <button data-isw-copy class="isw-debug-action-btn">Copy JSON</button>
      </div>
    </div>
  `;
}

function wireSimulateButtons(onSimulate: SimulateCallback): void {
  if (!panelElement) return;

  ALL_INTENTS.forEach((intent) => {
    const btn = panelElement!.querySelector(`[data-isw-simulate="${intent}"]`);
    if (btn) {
      btn.addEventListener('click', () => onSimulate(intent));
    }
  });
}

function wireCopyButton(decision: DecisionObject): void {
  if (!panelElement) return;

  const copyBtn = panelElement.querySelector('[data-isw-copy]');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(JSON.stringify(decision, null, 2))
        .then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => { copyBtn.textContent = 'Copy JSON'; }, 2000);
        })
        .catch(() => {
          copyBtn.textContent = 'Copy failed';
          setTimeout(() => { copyBtn.textContent = 'Copy JSON'; }, 2000);
        });
    });
  }
}

function togglePanel(): void {
  if (!panelElement) return;
  const isHidden = panelElement.style.display === 'none';
  panelElement.style.display = isHidden ? 'block' : 'none';
}

function injectDebugStyles(): void {
  if (document.getElementById('isw-debug-styles')) return;

  const style = document.createElement('style');
  style.id = 'isw-debug-styles';
  style.textContent = `
    #isw-debug-panel {
      position: fixed;
      bottom: 60px;
      right: 16px;
      width: 380px;
      max-height: 80vh;
      overflow-y: auto;
      background: #1e293b;
      color: #e2e8f0;
      border-radius: 12px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Consolas', monospace;
      font-size: 13px;
      line-height: 1.5;
      z-index: 999999;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
      border: 1px solid #334155;
    }

    .isw-debug-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #0f172a;
      border-radius: 12px 12px 0 0;
      border-bottom: 1px solid #334155;
    }

    .isw-debug-title {
      font-weight: 700;
      font-size: 14px;
      color: #f1f5f9;
    }

    .isw-debug-close {
      background: none;
      border: none;
      color: #94a3b8;
      font-size: 20px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
    }

    .isw-debug-close:hover {
      color: #f1f5f9;
    }

    .isw-debug-body {
      padding: 0;
    }

    .isw-debug-section {
      padding: 12px 16px;
      border-bottom: 1px solid #1e3a5f;
    }

    .isw-debug-section:last-child {
      border-bottom: none;
    }

    .isw-debug-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 6px;
      font-weight: 600;
    }

    .isw-debug-intent-name {
      font-weight: 700;
      color: #38bdf8;
      font-size: 16px;
    }

    .isw-debug-confidence {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .isw-debug-confidence-value {
      color: #e2e8f0;
      font-weight: 600;
      white-space: nowrap;
    }

    .isw-debug-bar {
      flex: 1;
      height: 8px;
      background: #334155;
      border-radius: 4px;
      overflow: hidden;
    }

    .isw-debug-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #3b82f6, #22d3ee);
      border-radius: 4px;
      transition: width 0.4s ease;
    }

    .isw-debug-signals {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .isw-debug-signal {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      background: #0f172a;
      border-radius: 4px;
      margin-bottom: 4px;
      font-size: 12px;
    }

    .isw-debug-signal-source {
      color: #a78bfa;
      font-weight: 500;
    }

    .isw-debug-signal-value {
      color: #fbbf24;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 120px;
    }

    .isw-debug-signal-arrow {
      color: #64748b;
    }

    .isw-debug-signal-contrib {
      color: #38bdf8;
      font-weight: 500;
    }

    .isw-debug-signal-weight {
      color: #34d399;
      font-weight: 700;
      margin-left: auto;
    }

    .isw-debug-row {
      display: flex;
      justify-content: space-between;
      padding: 3px 0;
    }

    .isw-debug-key {
      color: #94a3b8;
    }

    .isw-debug-val {
      color: #f1f5f9;
      font-weight: 500;
      text-align: right;
      max-width: 220px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .isw-debug-reason {
      color: #cbd5e1;
      font-style: italic;
      font-size: 12px;
      margin: 0;
      line-height: 1.6;
      padding: 8px;
      background: #0f172a;
      border-radius: 4px;
    }

    .isw-debug-simulate {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .isw-debug-sim-btn {
      padding: 6px 12px;
      font-size: 11px;
      font-weight: 600;
      font-family: inherit;
      border: 1px solid #475569;
      border-radius: 6px;
      background: #334155;
      color: #e2e8f0;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .isw-debug-sim-btn:hover {
      background: #475569;
      border-color: #3b82f6;
    }

    .isw-debug-sim-active {
      background: #3b82f6;
      border-color: #3b82f6;
      color: #ffffff;
    }

    .isw-debug-footer {
      padding: 12px 16px;
      border-top: 1px solid #334155;
    }

    .isw-debug-action-btn {
      width: 100%;
      padding: 8px 12px;
      font-size: 12px;
      font-weight: 600;
      font-family: inherit;
      border: 1px solid #475569;
      border-radius: 6px;
      background: #1e293b;
      color: #e2e8f0;
      cursor: pointer;
      text-align: center;
      transition: background 0.15s;
    }

    .isw-debug-action-btn:hover {
      background: #334155;
    }

    #isw-debug-toggle {
      position: fixed;
      bottom: 16px;
      right: 16px;
      padding: 8px 16px;
      background: #3b82f6;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      z-index: 999999;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
      transition: background 0.15s;
    }

    #isw-debug-toggle:hover {
      background: #2563eb;
    }
  `;
  document.head.appendChild(style);
}
