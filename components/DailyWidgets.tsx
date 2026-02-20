'use client';

import { useState, useEffect } from 'react';
import dailyData from '@/src/data/daily.json';

// Day index seeded by calendar day (resets each calendar day)
function todayIndex() {
  const d = new Date();
  return Math.floor(d.getFullYear() * 1000 + (d.getMonth() + 1) * 31 + d.getDate());
}

function pick<T>(arr: T[]): T {
  return arr[todayIndex() % arr.length];
}

// ─── Gene of the Day ──────────────────────────────────────────────────────────

type Gene = typeof dailyData.genes[0];

export function GeneOfDay() {
  const [mounted, setMounted] = useState(false);
  const [gene, setGene] = useState<Gene | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setGene(pick(dailyData.genes));
    setMounted(true);
  }, []);

  if (!mounted || !gene) {
    return <WidgetSkeleton accent="#3b82f6" label="Gene of the Day" />;
  }

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px 12px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#3b82f6',
          background: '#eff6ff',
          padding: '3px 8px',
          borderRadius: '99px',
        }}>Gene of the Day</span>
        <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 'auto' }}>
          OMIM #{gene.omim}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px 20px' }}>
        {/* Gene symbol + name */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span style={{
            fontFamily: 'ui-monospace, "Cascadia Code", monospace',
            fontSize: '26px',
            fontWeight: 700,
            color: '#1e293b',
            letterSpacing: '-0.5px',
          }}>{gene.symbol}</span>
          <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>{gene.fullName}</span>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <InhBadge text={gene.inheritance} />
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '99px',
            background: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
            fontFamily: 'ui-monospace, monospace',
          }}>{gene.locus}</span>
        </div>

        {/* Phenotype */}
        <p style={{ fontSize: '13px', color: '#334155', lineHeight: 1.6, marginBottom: '12px' }}>
          {gene.phenotype}
        </p>

        {/* Mechanism (collapsible) */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 600, color: '#3b82f6',
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
            marginBottom: expanded ? '10px' : 0,
          }}
        >
          <ChevronIcon open={expanded} />
          {expanded ? 'Hide' : 'Show'} mechanism &amp; hallmarks
        </button>

        {expanded && (
          <div>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.65, marginBottom: '14px', background: '#f8fafc', padding: '10px 12px', borderRadius: '8px' }}>
              {gene.mechanism}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {gene.hallmarks.map((h, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '10px',
                  fontSize: '12px', lineHeight: 1.6,
                }}>
                  <span style={{
                    flexShrink: 0,
                    width: '20px', height: '20px',
                    borderRadius: '50%',
                    background: '#eff6ff',
                    color: '#3b82f6',
                    fontWeight: 700,
                    fontSize: '11px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{i + 1}</span>
                  <div>
                    <span style={{ color: '#1e293b' }}>{h.point}</span>
                    <span style={{ display: 'block', color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>
                      — {h.citation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Factoid of the Day ───────────────────────────────────────────────────────

type Factoid = typeof dailyData.factoids[0];

export function FactoidOfDay() {
  const [mounted, setMounted] = useState(false);
  const [factoid, setFactoid] = useState<Factoid | null>(null);

  useEffect(() => {
    // offset by 7 to get a different entry than genes
    const arr = dailyData.factoids;
    setFactoid(arr[(todayIndex() + 7) % arr.length]);
    setMounted(true);
  }, []);

  if (!mounted || !factoid) {
    return <WidgetSkeleton accent="#f59e0b" label="Factoid of the Day" />;
  }

  const categoryColor: Record<string, string> = {
    History: '#d97706',
    Modern: '#0891b2',
    Discovery: '#7c3aed',
  };
  const accent = categoryColor[factoid.category] ?? '#64748b';

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        padding: '14px 20px 12px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: accent,
          background: accent + '18',
          padding: '3px 8px', borderRadius: '99px',
        }}>Factoid of the Day</span>
        <span style={{
          marginLeft: 'auto',
          fontSize: '11px', color: accent,
          background: accent + '15',
          padding: '2px 8px', borderRadius: '99px',
        }}>{factoid.category}</span>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{
          borderLeft: `3px solid ${accent}`,
          paddingLeft: '14px',
          marginBottom: '14px',
        }}>
          <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.7, margin: 0 }}>
            {factoid.text}
          </p>
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
          {factoid.source}
        </p>
      </div>
    </div>
  );
}

// ─── Question of the Day ─────────────────────────────────────────────────────

type Question = typeof dailyData.questions[0];

export function QuestionOfDay() {
  const [mounted, setMounted] = useState(false);
  const [q, setQ] = useState<Question | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    const arr = dailyData.questions;
    setQ(arr[(todayIndex() + 13) % arr.length]);
    setMounted(true);
  }, []);

  if (!mounted || !q) {
    return <WidgetSkeleton accent="#10b981" label="Question of the Day" />;
  }

  const answered = selected !== null;
  const correct = selected === q.answer;

  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e2e8f0',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        padding: '14px 20px 12px',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: '#10b981',
          background: '#f0fdf4', padding: '3px 8px', borderRadius: '99px',
        }}>Question of the Day</span>
        <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: 'auto' }}>Board-style</span>
      </div>

      <div style={{ padding: '18px 20px 20px' }}>
        <p style={{ fontSize: '13px', color: '#1e293b', lineHeight: 1.65, marginBottom: '16px', fontWeight: 500 }}>
          {q.question}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {q.choices.map((choice, i) => {
            let bg = '#f8fafc';
            let border = '1px solid #e2e8f0';
            let textColor = '#334155';

            if (answered) {
              if (i === q.answer) {
                bg = '#f0fdf4'; border = '1px solid #86efac'; textColor = '#166534';
              } else if (i === selected && !correct) {
                bg = '#fef2f2'; border = '1px solid #fca5a5'; textColor = '#991b1b';
              } else {
                textColor = '#94a3b8';
              }
            } else if (selected === i) {
              bg = '#eff6ff'; border = '1px solid #93c5fd';
            }

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => setSelected(i)}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: '10px',
                  padding: '10px 12px',
                  background: bg,
                  border,
                  borderRadius: '10px',
                  cursor: answered ? 'default' : 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{
                  flexShrink: 0,
                  width: '20px', height: '20px',
                  borderRadius: '50%',
                  background: answered && i === q.answer ? '#10b981' : answered && i === selected && !correct ? '#ef4444' : '#e2e8f0',
                  color: answered && (i === q.answer || (i === selected && !correct)) ? '#fff' : '#64748b',
                  fontSize: '11px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'ui-monospace, monospace',
                }}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span style={{ fontSize: '12.5px', lineHeight: 1.5, color: textColor }}>{choice}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div style={{
            background: correct ? '#f0fdf4' : '#fef9ec',
            border: `1px solid ${correct ? '#86efac' : '#fcd34d'}`,
            borderRadius: '10px',
            padding: '12px 14px',
          }}>
            <div style={{
              fontSize: '12px', fontWeight: 700,
              color: correct ? '#166534' : '#92400e',
              marginBottom: '6px',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              {correct ? '✓ Correct' : '✗ Incorrect'} — {correct ? 'Well done!' : `Answer: ${String.fromCharCode(65 + q.answer)}`}
            </div>
            <p style={{ fontSize: '12px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
              {q.explanation}
            </p>
          </div>
        )}

        {!answered && (
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            Select an answer to reveal the explanation.
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function InhBadge({ text }: { text: string }) {
  const t = text.toLowerCase();
  let bg = '#f1f5f9', color = '#475569';
  if (t.includes('dominant')) { bg = '#eff6ff'; color = '#1d4ed8'; }
  else if (t.includes('recessive')) { bg = '#faf5ff'; color = '#7c3aed'; }
  else if (t.includes('x-linked')) { bg = '#fff1f2'; color = '#be185d'; }
  else if (t.includes('mitochondrial')) { bg = '#fffbeb'; color = '#92400e'; }

  return (
    <span style={{
      fontSize: '11px', fontWeight: 500,
      padding: '2px 8px', borderRadius: '99px',
      background: bg, color,
    }}>{text}</span>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WidgetSkeleton({ accent, label }: { accent: string; label: string }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px',
      overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ padding: '14px 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
        <span style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
          textTransform: 'uppercase', color: accent,
          background: accent + '18', padding: '3px 8px', borderRadius: '99px',
        }}>{label}</span>
      </div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[80, 60, 90, 45].map((w, i) => (
          <div key={i} style={{
            height: '12px', background: '#f1f5f9', borderRadius: '4px', width: `${w}%`,
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        ))}
      </div>
    </div>
  );
}
