'use client';
import { useState, useEffect, useMemo } from 'react';
import { SEED_LEADS, STAGES, STAGE_META, computeStats, formatCurrency, formatDate } from '../lib/data';
import StatCard from '../components/StatCard';
import StageBadge from '../components/StageBadge';
import AddLeadModal from '../components/AddLeadModal';
import EditLeadModal from '../components/EditLeadModal';
import PipelineBar from '../components/PipelineBar';

const LS_KEY = 'landstorm_leads_v1';

function loadLeads() {
  if (typeof window === 'undefined') return SEED_LEADS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : SEED_LEADS;
  } catch { return SEED_LEADS; }
}

export default function Page() {
  const [leads, setLeads] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [filterStage, setFilterStage] = useState('All');
  const [sortKey, setSortKey] = useState('followUp'); // 'value' | 'company' | 'followUp'
  const [sortAsc, setSortAsc] = useState(true);
  const [search, setSearch] = useState('');

  /* ── Load from localStorage once ── */
  useEffect(() => {
    setLeads(loadLeads());
    setHydrated(true);
  }, []);

  /* ── Persist on change ── */
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(LS_KEY, JSON.stringify(leads));
  }, [leads, hydrated]);

  /* ── Derived stats ── */
  const stats = useMemo(() => computeStats(leads), [leads]);

  /* ── Filtered + sorted ── */
  const visible = useMemo(() => {
    let out = leads;
    if (filterStage !== 'All') out = out.filter(l => l.stage === filterStage);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(l =>
        l.company.toLowerCase().includes(q) ||
        l.project.toLowerCase().includes(q) ||
        l.notes.toLowerCase().includes(q)
      );
    }
    out = [...out].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (sortKey === 'value') { av = Number(av); bv = Number(bv); }
      if (av < bv) return sortAsc ? -1 : 1;
      if (av > bv) return sortAsc ? 1 : -1;
      return 0;
    });
    return out;
  }, [leads, filterStage, search, sortKey, sortAsc]);

  /* ── Upcoming follow-ups (next 7 days) ── */
  const upcomingFollowUps = useMemo(() => {
    const today = new Date(); today.setHours(0,0,0,0);
    const week  = new Date(today); week.setDate(week.getDate() + 7);
    return leads.filter(l => {
      if (!l.followUp) return false;
      const d = new Date(l.followUp);
      return d >= today && d <= week && l.stage !== 'Won' && l.stage !== 'Lost';
    }).sort((a,b) => a.followUp.localeCompare(b.followUp));
  }, [leads]);

  /* ── CRUD ── */
  function addLead(lead) { setLeads(prev => [lead, ...prev]); setShowAdd(false); }
  function saveLead(updated) {
    setLeads(prev => prev.map(l => l.id === updated.id ? updated : l));
    setEditLead(null);
  }
  function deleteLead(id) {
    setLeads(prev => prev.filter(l => l.id !== id));
    setEditLead(null);
  }

  function toggleSort(key) {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  }

  const SortIcon = ({ k }) => {
    if (sortKey !== k) return <span style={{ color: 'var(--border-lt)', marginLeft: 4 }}>↕</span>;
    return <span style={{ color: 'var(--amber)', marginLeft: 4 }}>{sortAsc ? '↑' : '↓'}</span>;
  };

  if (!hydrated) return null;

  return (
    <>
      <div className="top-accent" />

      {/* ── Main layout ── */}
      <div style={{ position: 'relative', zIndex: 1, minHeight: '100vh' }}>

        {/* ── Header ── */}
        <header style={{
          borderBottom: '1px solid var(--border)',
          background: 'rgba(15,15,15,0.92)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          padding: '0 32px',
        }}>
          <div style={{
            maxWidth: 1400,
            margin: '0 auto',
            height: 58,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Logo mark */}
              <div style={{
                width: 34,
                height: 34,
                background: 'var(--amber)',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 20h20M4 20V10l8-7 8 7v10M9 20v-6h6v6"/>
                </svg>
              </div>
              <div>
                <p className="font-display" style={{ fontSize: 17, fontWeight: 900, letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  LANDSTORM
                </p>
                <p className="font-display" style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Contracting · Pipeline
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {upcomingFollowUps.length > 0 && (
                <div style={{
                  background: 'rgba(232,146,10,0.1)',
                  border: '1px solid rgba(232,146,10,0.3)',
                  borderRadius: 2,
                  padding: '5px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--amber)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                  <span className="font-display" style={{ fontSize: 11, color: 'var(--amber)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700 }}>
                    {upcomingFollowUps.length} Follow-Up{upcomingFollowUps.length > 1 ? 's' : ''} This Week
                  </span>
                </div>
              )}
              <button className="btn-amber" onClick={() => setShowAdd(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> New Lead
              </button>
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 1400, margin: '0 auto', padding: '28px 32px 60px' }}>

          {/* ── Stat cards ── */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
            gap: 14,
            marginBottom: 22,
          }}>
            <StatCard label="Total Leads"    value={stats.total}                                                     accent="#4A9EFF" sub="all time" />
            <StatCard label="Pending Bids"   value={stats.pending}                                                   accent="#E8C20A" sub="lead / quoted / submitted" />
            <StatCard label="Jobs Won"        value={stats.won}                                                       accent="#34C97B" sub="signed contracts" />
            <StatCard label="Pipeline Value"  value={formatCurrency(stats.pipeline)} accent="var(--amber)"           sub="excl. lost" />
          </div>

          {/* ── Pipeline breakdown ── */}
          <div style={{ marginBottom: 22 }}>
            <PipelineBar leads={leads} />
          </div>

          {/* ── Follow-ups this week ── */}
          {upcomingFollowUps.length > 0 && (
            <div style={{
              background: 'rgba(232,146,10,0.05)',
              border: '1px solid rgba(232,146,10,0.2)',
              borderLeft: '3px solid var(--amber)',
              borderRadius: 3,
              padding: '14px 20px',
              marginBottom: 22,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <span className="font-display" style={{ fontSize: 11, color: 'var(--amber)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', flexShrink: 0 }}>
                Follow-Ups Due
              </span>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {upcomingFollowUps.map(l => (
                  <button
                    key={l.id}
                    onClick={() => setEditLead(l)}
                    style={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border-lt)',
                      borderRadius: 2,
                      padding: '5px 12px',
                      cursor: 'pointer',
                      color: 'var(--text)',
                      fontSize: 12,
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ color: 'var(--muted)', marginRight: 5 }}>{formatDate(l.followUp)}</span>
                    {l.company}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Filter + Search bar ── */}
          <div style={{
            display: 'flex',
            gap: 10,
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 14,
          }}>
            {/* Stage filter pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['All', ...STAGES].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStage(s)}
                  className="font-display"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '5px 13px',
                    borderRadius: 2,
                    border: filterStage === s ? '1px solid var(--amber)' : '1px solid var(--border)',
                    background: filterStage === s ? 'rgba(232,146,10,0.12)' : 'transparent',
                    color: filterStage === s ? 'var(--amber)' : 'var(--muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {s}
                  {s !== 'All' && (
                    <span style={{ marginLeft: 5, opacity: 0.7 }}>
                      {leads.filter(l => l.stage === s).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, minWidth: 180 }}>
              <input
                className="field-input"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search company, project, notes…"
                style={{ fontSize: 13 }}
              />
            </div>

            <span className="font-display" style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
              {visible.length} record{visible.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── Data Table ── */}
          <div style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 3,
            overflow: 'auto',
          }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => toggleSort('company')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Company <SortIcon k="company" />
                  </th>
                  <th>Project</th>
                  <th>Stage</th>
                  <th onClick={() => toggleSort('value')} style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'right' }}>
                    Est. Value <SortIcon k="value" />
                  </th>
                  <th onClick={() => toggleSort('followUp')} style={{ cursor: 'pointer', userSelect: 'none' }}>
                    Follow-Up <SortIcon k="followUp" />
                  </th>
                  <th>Notes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {visible.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--muted)', padding: '40px 14px' }}>
                      <span className="font-display" style={{ fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        No records found
                      </span>
                    </td>
                  </tr>
                )}
                {visible.map((lead, i) => {
                  const isOverdue = lead.followUp && new Date(lead.followUp) < new Date() && lead.stage !== 'Won' && lead.stage !== 'Lost';
                  return (
                    <tr
                      key={lead.id}
                      className="row-enter"
                      style={{ animationDelay: `${i * 0.03}s` }}
                      onClick={() => setEditLead(lead)}
                    >
                      <td>
                        <span style={{ fontWeight: 600 }}>{lead.company}</span>
                      </td>
                      <td style={{ color: 'var(--muted)', maxWidth: 260 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 260 }}>
                          {lead.project}
                        </span>
                      </td>
                      <td><StageBadge stage={lead.stage} /></td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="font-mono" style={{ fontSize: 13, color: lead.stage === 'Won' ? '#34C97B' : 'var(--text)' }}>
                          {formatCurrency(lead.value)}
                        </span>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 12,
                          color: isOverdue ? '#FF8A80' : 'var(--muted)',
                          fontWeight: isOverdue ? 600 : 400,
                        }}>
                          {isOverdue && '⚠ '}{formatDate(lead.followUp)}
                        </span>
                      </td>
                      <td style={{ maxWidth: 220 }}>
                        <span style={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 220,
                          fontSize: 12,
                          color: 'var(--muted)',
                        }}>
                          {lead.notes || '—'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right', paddingRight: 18 }}>
                        <span style={{ color: 'var(--border-lt)', fontSize: 16 }}>›</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Footer ── */}
          <div style={{
            marginTop: 28,
            paddingTop: 18,
            borderTop: '1px solid var(--border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 10,
          }}>
            <p className="font-display" style={{ fontSize: 11, color: 'var(--border-lt)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Landstorm Contracting · Carp, Ontario · Internal Use Only
            </p>
            <p className="font-mono" style={{ fontSize: 11, color: 'var(--border-lt)' }}>
              {leads.length} total records · {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' })}
            </p>
          </div>
        </main>
      </div>

      {/* ── Modals ── */}
      {showAdd  && <AddLeadModal  onClose={() => setShowAdd(false)} onSave={addLead} />}
      {editLead && <EditLeadModal lead={editLead} onClose={() => setEditLead(null)} onSave={saveLead} onDelete={deleteLead} />}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}
