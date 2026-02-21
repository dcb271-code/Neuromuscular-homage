'use client';

import { useState, useEffect } from 'react';

// Timezone-aware date index — resets at midnight EST/EDT
function todayIndex() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);
  const year  = parseInt(parts.find(p => p.type === 'year')!.value);
  const month = parseInt(parts.find(p => p.type === 'month')!.value);
  const day   = parseInt(parts.find(p => p.type === 'day')!.value);
  return year * 10000 + month * 100 + day;
}

// Pick 2 items from opposite halves of the pool — no same-day overlap
function pick2<T>(arr: T[]): [T, T] {
  const n = arr.length;
  const idx = todayIndex() % n;
  return [arr[idx], arr[(idx + Math.floor(n / 2)) % n]];
}

// ─── Rotating Categories ──────────────────────────────────────────────────────

type Category = { name: string; color: string; url: string };

const ROTATING_CATEGORIES: Category[] = [
  { name: 'Congenital Ophthalmoplegia',       color: '#db2777', url: 'https://neuromuscular.wustl.edu/musdist/peeom.html#congophthal' },
  { name: 'Multicore / Minicore Myopathy',    color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html#multicore' },
  { name: 'Debrancher Deficiency (GSD III)',  color: '#dc2626', url: 'https://neuromuscular.wustl.edu/msys/glycogen.html#deb' },
  { name: 'DNA Repeat Sequences & Disease',   color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/mother/dnarep.htm' },
  { name: 'Dominant Hereditary Ataxias',      color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/domatax.html' },
  { name: 'Muscle Channelopathies',           color: '#0891b2', url: 'https://neuromuscular.wustl.edu/mother/chan.html' },
  { name: 'Vitamin Deficiency Neuropathies',  color: '#d97706', url: 'https://neuromuscular.wustl.edu/nother/vitamin.htm' },
  { name: 'Distal Hereditary Neuropathies',   color: '#2563eb', url: 'https://neuromuscular.wustl.edu/musdist/distal.html#nerve' },
  { name: 'Limb-Girdle MD Overview',         color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/musdist/lg.html#1' },
  { name: 'LGMD (Autosomal Recessive)',       color: '#4f46e5', url: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmd2' },
  { name: 'LGMD (X-Linked)',                  color: '#be185d', url: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgmdx' },
];

export function RotatingCategories() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<Category[]>([]);

  useEffect(() => {
    setItems(pick2(ROTATING_CATEGORIES));
    setMounted(true);
  }, []);

  return (
    <div style={{ marginTop: '10px' }}>
      <RotatingLabel />
      {!mounted ? (
        <SkeletonGrid />
      ) : (
        <div className="nm-2col">
          {items.map(cat => (
            <a
              key={cat.url}
              href={cat.url}
              target="_blank"
              rel="noopener"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '14px 16px',
                textDecoration: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = cat.color + '80';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 12px ${cat.color}18`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '8px', height: '8px',
                borderRadius: '50%',
                background: cat.color,
                flexShrink: 0,
              }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: '#1e293b', flex: 1 }}>{cat.name}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }}>
                <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Rotating Conditions ──────────────────────────────────────────────────────

type Condition = { label: string; abbr: string; gene: string; color: string; url: string };

const ROTATING_CONDITIONS: Condition[] = [
  { label: 'Renal Failure in Myoglobinuria',                          abbr: 'KD',       gene: 'multi',    color: '#dc2626', url: 'https://neuromuscular.wustl.edu/msys/myoglob.html#kd' },
  { label: 'COL4A1 Exercise Cramps',                                  abbr: 'COL4A1',   gene: 'COL4A1',   color: '#db2777', url: 'https://neuromuscular.wustl.edu/mother/activity.html#crampcol4a1' },
  { label: 'Malignant Hyperthermia',                                  abbr: 'MH',       gene: 'RYR1',     color: '#dc2626', url: 'https://neuromuscular.wustl.edu/msys/myoglob.html#mhgeneral' },
  { label: 'Leber Hereditary Optic Neuropathy',                       abbr: 'LHON',     gene: 'MT-ND4',   color: '#d97706', url: 'https://neuromuscular.wustl.edu/mitosyn.html#lhon' },
  { label: 'Krabbe Disease (GLD)',                                    abbr: 'GLD',      gene: 'GALC',     color: '#2563eb', url: 'https://neuromuscular.wustl.edu/time/hmsn.html#krabbe' },
  { label: 'Hereditary Spastic Paraplegia SPG10',                     abbr: 'SPG10',    gene: 'KIF5A',    color: '#0d9488', url: 'https://neuromuscular.wustl.edu/spinal/fsp.html#spg10' },
  { label: 'Klippel-Trenaunay-Weber Syndrome',                        abbr: 'KTW',      gene: '',         color: '#4f46e5', url: 'https://neuromuscular.wustl.edu/nother/nlarge.html#ktw' },
  { label: 'Klippel-Feil Syndrome',                                   abbr: 'KFS',      gene: 'GDF6',     color: '#0891b2', url: 'https://neuromuscular.wustl.edu/spinal/systemic2.html#kfs' },
  { label: 'Leigh Syndrome',                                          abbr: 'LS',       gene: 'multi',    color: '#d97706', url: 'https://neuromuscular.wustl.edu/mitosyn.html#leigh' },
  { label: 'Lafora Disease',                                          abbr: 'LD',       gene: 'EPM2A',    color: '#dc2626', url: 'https://neuromuscular.wustl.edu/msys/glycogen.html#lafora' },
  { label: 'LMNA Contracture Syndrome',                               abbr: 'LMNA-C',  gene: 'LMNA',     color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/msys/contract.html#laminac' },
  { label: 'Muscle-Eye-Brain Disease / Finnish CMD (Santavuori)',     abbr: 'MEB',      gene: 'POMGNT1',  color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html#santavuori' },
  { label: 'Myoadenylate Deaminase Deficiency',                       abbr: 'MADD',     gene: 'AMPD1',    color: '#dc2626', url: 'https://neuromuscular.wustl.edu/mother/mpain.html#mad' },
  { label: 'Pitt-Hopkins Syndrome (SMADIP1)',                         abbr: 'PTHS',     gene: 'ZFHX1B',  color: '#4f46e5', url: 'https://neuromuscular.wustl.edu/autonomic.html#smadip1' },
  { label: 'Metachromatic Leukodystrophy',                            abbr: 'MLD',      gene: 'ARSA',     color: '#2563eb', url: 'https://neuromuscular.wustl.edu/time/hmsn.html#mld' },
  { label: 'Paramyotonia Congenita',                                  abbr: 'PMC',      gene: 'SCN4A',    color: '#0891b2', url: 'https://neuromuscular.wustl.edu/mother/activity.html#pc' },
  { label: 'Ataxia-Telangiectasia',                                   abbr: 'A-T',      gene: 'ATM',      color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/dnarep.html#at' },
  { label: 'Cerebrotendinous Xanthomatosis',                          abbr: 'CTX',      gene: 'CYP27A1',  color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/metatax.html#cx' },
  { label: 'CASK-Related Ataxia',                                     abbr: 'CASK',     gene: 'CASK',     color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html#cask' },
  { label: 'LGMD Type 1D (DNAJB6)',                                   abbr: 'LGMD1D',   gene: 'DNAJB6',   color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/musdist/lg.html#lgd1d' },
  { label: 'Dejerine-Sottas Syndrome',                                abbr: 'DSS',      gene: 'MPZ',      color: '#2563eb', url: 'https://neuromuscular.wustl.edu/time/hmsn.html#ds' },
  { label: 'DRPLA',                                                   abbr: 'DRPLA',    gene: 'ATN1',     color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/domatax.html#drpla' },
  { label: 'FKBP14 Congenital Myopathy',                              abbr: 'FKBP14',   gene: 'FKBP14',   color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html#fkbp14' },
  { label: 'Fukuyama Congenital MD',                                  abbr: 'FCMD',     gene: 'FKTN',     color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html#fukuyama' },
  { label: 'CTDD Cerebellar Ataxia',                                  abbr: 'CTDD',     gene: 'TPP1',     color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html#ctdd' },
  { label: 'IRF2BPL Ataxia',                                          abbr: 'IRF2BPL',  gene: 'IRF2BPL',  color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html#irf2bpl' },
  { label: 'L1CAM Spastic Paraplegia (SPG1)',                         abbr: 'SPG1',     gene: 'L1CAM',    color: '#0d9488', url: 'https://neuromuscular.wustl.edu/spinal/fsp.html#l1cam' },
  { label: 'McArdle Disease (GSD V)',                                 abbr: 'GSD V',    gene: 'PYGM',     color: '#dc2626', url: 'https://neuromuscular.wustl.edu/msys/glycogen.html#McA' },
  { label: 'Exercise-Induced Myalgia',                                abbr: 'EIM',      gene: 'multi',    color: '#dc2626', url: 'https://neuromuscular.wustl.edu/mother/activity.html#am' },
  { label: 'Miyoshi Myopathy / LGMD2B',                              abbr: 'MM',       gene: 'DYSF',     color: '#7c3aed', url: 'https://neuromuscular.wustl.edu/musdist/lg.html#ml1' },
  { label: 'NARP Syndrome',                                           abbr: 'NARP',     gene: 'MT-ATP6',  color: '#d97706', url: 'https://neuromuscular.wustl.edu/mitosyn.html#narp' },
  { label: 'NAD Deficiency Neuropathy',                               abbr: 'NAD',      gene: 'HAAO',     color: '#2563eb', url: 'https://neuromuscular.wustl.edu/time/child.html#nad' },
  { label: 'Neurofibromatosis Type 1',                                abbr: 'NF1',      gene: 'NF1',      color: '#4f46e5', url: 'https://neuromuscular.wustl.edu/nanatomy/pntumor.htm#nf1' },
  { label: 'Niemann-Pick Disease Type C',                             abbr: 'NPC',      gene: 'NPC1',     color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/metatax.html#npc' },
  { label: 'Nemaline (Rod) Myopathy',                                 abbr: 'NM',       gene: 'multi',    color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html#rod' },
  { label: 'Episodic Ataxia Type 2',                                  abbr: 'EA2',      gene: 'CACNA1A',  color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/domatax.html#ea2' },
  { label: 'Neuralgic Amyotrophy',                                    abbr: 'NA',       gene: 'SEPT9',    color: '#dc2626', url: 'https://neuromuscular.wustl.edu/nanatomy/proxmot.html#na' },
  { label: 'GTDC2 Congenital MD',                                     abbr: 'GTDC2',    gene: 'GTDC2',    color: '#db2777', url: 'https://neuromuscular.wustl.edu/syncm.html#gtdc2' },
  { label: 'Pontocerebellar Hypoplasia',                              abbr: 'PCH',      gene: 'multi',    color: '#16a34a', url: 'https://neuromuscular.wustl.edu/ataxia/recatax.html#pch' },
  { label: 'Acid Maltase Deficiency (Pompe)',                         abbr: 'GSD II',   gene: 'GAA',      color: '#dc2626', url: 'https://neuromuscular.wustl.edu/msys/glycogen.html#am' },
  { label: 'PKU-Associated Spastic Paraplegia',                       abbr: 'PKU-SPG',  gene: 'PAH',      color: '#0d9488', url: 'https://neuromuscular.wustl.edu/spinal/fsp.html#pku' },
  { label: 'PEOADAR Mitochondrial Disease',                           abbr: 'PEOADAR',  gene: 'ADAR',     color: '#d97706', url: 'https://neuromuscular.wustl.edu/mitosyn.html#peoadar' },
  { label: 'Leigh-like Syndrome, Optic Atrophy & Ophthalmoplegia',   abbr: 'C12orf65', gene: 'C12orf65', color: '#d97706', url: 'https://neuromuscular.wustl.edu/mitosyn.html#c12orf65' },
  { label: 'Schwartz-Jampel Syndrome',                                abbr: 'SJS',      gene: 'HSPG2',    color: '#0891b2', url: 'https://neuromuscular.wustl.edu/mother/activity.html#sj' },
  { label: 'Tay-Sachs / GM2 Gangliosidosis',                          abbr: 'TSD',      gene: 'HEXA',     color: '#dc2626', url: 'https://neuromuscular.wustl.edu/synmot.html#hexA' },
  { label: 'Refsum Disease',                                          abbr: 'RD',       gene: 'PHYH',     color: '#2563eb', url: 'https://neuromuscular.wustl.edu/time/hmsn.html#refsum' },
];

export function RotatingConditions() {
  const [mounted, setMounted] = useState(false);
  const [items, setItems] = useState<Condition[]>([]);

  useEffect(() => {
    setItems(pick2(ROTATING_CONDITIONS));
    setMounted(true);
  }, []);

  return (
    <div style={{ marginTop: '10px', marginBottom: '28px' }}>
      <RotatingLabel />
      {!mounted ? (
        <SkeletonGrid />
      ) : (
        <div className="nm-2col">
          {items.map(cond => (
            <a
              key={cond.url}
              href={cond.url}
              target="_blank"
              rel="noopener"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                border: `1px solid ${cond.color}30`,
                borderRadius: '12px',
                padding: '12px 14px',
                textDecoration: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = cond.color + '80';
                (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 10px ${cond.color}18`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = cond.color + '30';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{
                  fontSize: '11px', fontWeight: 700,
                  color: cond.color,
                  background: cond.color + '12',
                  padding: '1px 7px', borderRadius: '99px',
                  flexShrink: 0,
                }}>
                  {cond.abbr}
                </span>
                <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ marginLeft: 'auto', flexShrink: 0 }}>
                  <path d="M2 10L10 2M10 2H5M10 2V7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#1e293b', lineHeight: 1.35, marginBottom: cond.gene ? '4px' : 0 }}>
                {cond.label}
              </span>
              {cond.gene && (
                <span style={{ fontSize: '10px', color: '#3b82f6', fontFamily: 'ui-monospace, monospace' }}>
                  {cond.gene}
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

function RotatingLabel() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      marginBottom: '10px',
    }}>
      <div style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#94a3b8',
      }}>
        Daily Spotlight
      </div>
      <span style={{
        fontSize: '9px', fontWeight: 600, letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#60a5fa', background: '#eff6ff',
        padding: '1px 6px', borderRadius: '99px',
        border: '1px solid #bfdbfe',
      }}>
        Rotates daily
      </span>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="nm-2col">
      {[1, 2].map(i => (
        <div key={i} style={{
          background: '#fff', border: '1px solid #e2e8f0',
          borderRadius: '12px', padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          <div style={{ height: '10px', width: '40%', background: '#f1f5f9', borderRadius: '4px' }} />
          <div style={{ height: '10px', width: '80%', background: '#f1f5f9', borderRadius: '4px' }} />
          <div style={{ height: '10px', width: '30%', background: '#f1f5f9', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
}
