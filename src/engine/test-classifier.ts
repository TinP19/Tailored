import { classifyIntent } from './intentClassifier';
import { buildDecision } from './decisionBuilder';
import type { SignalData } from './signalParser';

function makeSignals(overrides: Partial<{
  term: string;
  referrerType: string;
  device: string;
  time: string;
}>): SignalData {
  const term = (overrides.term ?? '')
    .toLowerCase()
    .split(/[\s+]+/)
    .filter((t) => t.length > 0);

  return {
    utm: { term, source: '', medium: '', campaign: '' },
    referrer: {
      url: '',
      type: (overrides.referrerType ?? 'direct') as SignalData['referrer']['type'],
    },
    device: {
      type: (overrides.device ?? 'desktop') as SignalData['device']['type'],
      time_context: (overrides.time ?? 'afternoon') as SignalData['device']['time_context'],
    },
    raw_url: '',
  };
}

const scenarios = [
  {
    name: '1. "buy gaming laptop now" from Google',
    signals: makeSignals({ term: 'buy gaming laptop now', referrerType: 'search_organic' }),
  },
  {
    name: '2. "best monitor 2026 vs" from Wirecutter',
    signals: makeSignals({ term: 'best monitor 2026 vs', referrerType: 'review_site' }),
  },
  {
    name: '3. "cheap headphones deal" from direct',
    signals: makeSignals({ term: 'cheap headphones deal', referrerType: 'direct' }),
  },
  {
    name: '4. "gift for him tech" from email',
    signals: makeSignals({ term: 'gift for him tech', referrerType: 'email' }),
  },
  {
    name: '5. No UTM, no referrer (fallback)',
    signals: makeSignals({ referrerType: 'direct' }),
  },
  {
    name: '6. "gaming setup streaming" from Instagram',
    signals: makeSignals({ term: 'gaming setup streaming', referrerType: 'social' }),
  },
];

for (const { name, signals } of scenarios) {
  const result = classifyIntent(signals);
  console.log(`\n${'='.repeat(60)}`);
  console.log(name);
  console.log('='.repeat(60));
  console.log(`  Intent:     ${result.primary_intent}`);
  console.log(`  Secondary:  ${result.secondary_intent ?? 'none'}`);
  console.log(`  Confidence: ${result.confidence.toFixed(3)}`);
  console.log(`  Fallback:   ${result.fallback_used}`);
  console.log(`  Scores:     ${JSON.stringify(result.scores)}`);
  console.log(`  Reasoning:  ${result.reasoning}`);
  console.log(`  Signals:    ${result.signals_used.join(', ')}`);
}

// ── Full pipeline: classifier → decisionBuilder ──────────────────────────

console.log(`\n\n${'#'.repeat(60)}`);
console.log('FULL PIPELINE: buildDecision() output');
console.log('#'.repeat(60));

const demoSignals = makeSignals({ term: 'best gaming laptop 2026', referrerType: 'review_site' });
const classification = classifyIntent(demoSignals);
const decision = buildDecision(classification, demoSignals, 'v_test01');

console.log(JSON.stringify(decision, null, 2));
