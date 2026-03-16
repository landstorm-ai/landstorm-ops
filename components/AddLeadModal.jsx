'use client';
import { useState } from 'react';
import { STAGES } from '../lib/data';

const EMPTY = {
  company: '',
  project: '',
  value: '',
  stage: 'Lead',
  followUp: '',
  notes: '',
};

export default function AddLeadModal({ onClose, onSave }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  function set(k, v) {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.company.trim()) e.company = 'Required';
    if (!form.project.trim()) e.project = 'Required';
    if (!form.value || isNaN(Number(form.value)) || Number(form.value) < 0)
      e.value = 'Enter a valid amount';
    return e;
  }

  function handleSave() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({
      id: Date.now().toString(),
      company: form.company.trim(),
      project: form.project.trim(),
      value: Number(form.value),
      stage: form.stage,
      followUp: form.followUp,
      notes: form.notes.trim(),
    });
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <p className="font-display" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 2 }}>
              Landstorm Contracting
            </p>
            <h2 className="font-display" style={{ fontSize: 22, fontWeight: 800, letterSpacing: '0.02em' }}>
              NEW LEAD
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="field-label">Company Name *</label>
              <input
                className="field-input"
                value={form.company}
                onChange={e => set('company', e.target.value)}
                placeholder="e.g. Novatech Engineering"
              />
              {errors.company && <p style={{ color: '#FF6B6B', fontSize: 11, marginTop: 3 }}>{errors.company}</p>}
            </div>
            <div>
              <label className="field-label">Estimated Value *</label>
              <input
                className="field-input font-mono"
                type="number"
                min="0"
                value={form.value}
                onChange={e => set('value', e.target.value)}
                placeholder="0"
              />
              {errors.value && <p style={{ color: '#FF6B6B', fontSize: 11, marginTop: 3 }}>{errors.value}</p>}
            </div>
          </div>

          <div>
            <label className="field-label">Project Name *</label>
            <input
              className="field-input"
              value={form.project}
              onChange={e => set('project', e.target.value)}
              placeholder="e.g. Septic System Install — Calabogie"
            />
            {errors.project && <p style={{ color: '#FF6B6B', fontSize: 11, marginTop: 3 }}>{errors.project}</p>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label className="field-label">Project Stage</label>
              <select className="field-input" value={form.stage} onChange={e => set('stage', e.target.value)}>
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label">Follow-Up Date</label>
              <input
                className="field-input"
                type="date"
                value={form.followUp}
                onChange={e => set('followUp', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="field-label">Notes</label>
            <textarea
              className="field-input"
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Key contacts, context, next steps…"
            />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 10,
          justifyContent: 'flex-end',
        }}>
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-amber" onClick={handleSave}>Add Lead</button>
        </div>
      </div>
    </div>
  );
}
