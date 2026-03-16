'use client';

export const STAGES = ['Lead', 'Quoted', 'Bid Submitted', 'Won', 'Lost'];

export const STAGE_META = {
  Lead:          { color: '#4A9EFF', bg: 'rgba(74,158,255,0.12)',  dot: '#4A9EFF' },
  Quoted:        { color: '#E8C20A', bg: 'rgba(232,194,10,0.12)', dot: '#E8C20A' },
  'Bid Submitted':{ color: '#E8920A', bg: 'rgba(232,146,10,0.14)', dot: '#E8920A' },
  Won:           { color: '#34C97B', bg: 'rgba(52,201,123,0.12)', dot: '#34C97B' },
  Lost:          { color: '#888580', bg: 'rgba(136,133,128,0.12)', dot: '#888580' },
};

export const SEED_LEADS = [
  {
    id: '1',
    company: 'JP2G Consultants',
    project: 'Septic System Design — McArthur Lake',
    value: 28000,
    stage: 'Quoted',
    followUp: '2026-03-20',
    notes: 'Civil engineer contact. Awaiting callback from Pierre.',
  },
  {
    id: '2',
    company: 'Novatech Engineering',
    project: 'Site Grading & Drainage — Almonte Subdivision',
    value: 74500,
    stage: 'Bid Submitted',
    followUp: '2026-03-18',
    notes: 'Sent full bid package. Decision expected end of month.',
  },
  {
    id: '3',
    company: 'Campanale Homes',
    project: 'Excavation — Carleton Place Infill Lots',
    value: 51000,
    stage: 'Lead',
    followUp: '2026-03-25',
    notes: 'Referred by Modello Homes. Need to schedule site visit.',
  },
  {
    id: '4',
    company: 'J. Lacourse Carpentry',
    project: 'Septic Replacement — Renfrew County',
    value: 18500,
    stage: 'Won',
    followUp: '',
    notes: 'Contract signed. Start date TBD.',
  },
  {
    id: '5',
    company: 'Argue Construction',
    project: 'Trench Excavation — Perth Road Corridor',
    value: 33000,
    stage: 'Lost',
    followUp: '',
    notes: 'Lost to lower bid. Follow up in Q3.',
  },
  {
    id: '6',
    company: 'Lagois Design-Build',
    project: 'Foundation Excavation — Westboro Custom Home',
    value: 42000,
    stage: 'Quoted',
    followUp: '2026-03-22',
    notes: 'Quote sent. Waiting on architect revisions.',
  },
  {
    id: '7',
    company: 'Brenmar Construction',
    project: 'Utility Trench — Kanata Commercial Lot',
    value: 29500,
    stage: 'Lead',
    followUp: '2026-03-28',
    notes: 'Cold outreach sent via email. No reply yet.',
  },
  {
    id: '8',
    company: 'Modello Homes',
    project: 'Lot Clearing & Grading — Mississippi Mills',
    value: 61000,
    stage: 'Bid Submitted',
    followUp: '2026-03-24',
    notes: 'Second project with Modello. Strong relationship.',
  },
];

export function formatCurrency(val) {
  if (!val && val !== 0) return '—';
  return '$' + Number(val).toLocaleString('en-CA', { maximumFractionDigits: 0 });
}

export function formatDate(str) {
  if (!str) return '—';
  const [y, m, d] = str.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[+m - 1]} ${+d}, ${y}`;
}

export function computeStats(leads) {
  const active = leads.filter(l => l.stage !== 'Lost');
  const pending = leads.filter(l => l.stage === 'Lead' || l.stage === 'Quoted' || l.stage === 'Bid Submitted');
  const won     = leads.filter(l => l.stage === 'Won');
  const pipeline = active.reduce((s, l) => s + (Number(l.value) || 0), 0);

  return {
    total:    leads.length,
    pending:  pending.length,
    won:      won.length,
    pipeline,
  };
}
