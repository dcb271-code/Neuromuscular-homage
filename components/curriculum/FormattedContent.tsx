import React from 'react';

// Renders the curricula's markdown subset (see docs/eeg/design-spec.md, rule 7).
// Ported from the Neurogenetics Curriculum so content is interchangeable between the sites.

function renderInline(text: string, accent: string, basePath = '/eeg'): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*\n]+\*|\[\[[^\]]+\]\]|\[[^\[\]]+\]\([^)\s]+\))/g);
  return parts.map((part, i) => {
    const internal = part.match(/^\[\[([^|]+)\|([^\]]+)\]\]$/);
    if (internal) {
      return <a key={i} href={`${basePath}/${internal[1]}/`} className="font-medium underline-offset-2 hover:underline" style={{ color: accent }}>{internal[2]}</a>;
    }
    const ext = part.match(/^\[([^\[\]]+)\]\(([^)\s]+)\)$/);
    if (ext) {
      return <a key={i} href={ext[2]} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline" style={{ color: accent, opacity: 0.85 }}>{ext[1]}</a>;
    }
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-slate-900">{bold[1]}</strong>;
    const italic = part.match(/^\*([^*]+)\*$/);
    if (italic) return <em key={i}>{italic[1]}</em>;
    return part;
  });
}

const P = 'mb-4 leading-[1.8] last:mb-0';

// "Go deeper" blocks: a line ":::deeper Title", any content, then a line ":::". Rendered as a
// collapsed panel so optional depth does not lengthen the section a reader must get through.
const DEEPER = /^:::deeper[ \t]+(.+)\n([\s\S]*?)\n:::[ \t]*$/gm;

export function FormattedContent(props: { content: string; accent?: string; className?: string; basePath?: string }) {
  const { content, accent = '#2563eb', className = '', basePath = '/eeg' } = props;
  if (!/^:::deeper/m.test(content)) return <Blocks {...props} />;
  const parts: React.ReactNode[] = []; let last = 0; let k = 0;
  for (const m of content.matchAll(DEEPER)) {
    const before = content.slice(last, m.index).trim();
    if (before) parts.push(<Blocks key={k++} content={before} accent={accent} basePath={basePath} />);
    parts.push(
      <details key={k++} className="mb-5 rounded-xl border px-4 py-3" style={{ borderColor: accent + '40', background: accent + '06' }}>
        <summary className="cursor-pointer text-[13.5px] font-semibold" style={{ color: accent }}>Go deeper: {m[1]}</summary>
        <div className="mt-3"><Blocks content={m[2].trim()} accent={accent} basePath={basePath} className="text-[14px]" /></div>
      </details>,
    );
    last = (m.index ?? 0) + m[0].length;
  }
  const rest = content.slice(last).trim();
  if (rest) parts.push(<Blocks key={k++} content={rest} accent={accent} basePath={basePath} />);
  return <div className={className}>{parts}</div>;
}

function Blocks({ content, accent = '#2563eb', className = '', basePath = '/eeg' }: { content: string; accent?: string; className?: string; basePath?: string }) {
  const blocks = content.split(/\n\n+/);
  return (
    <div className={`text-[15px] text-slate-600 ${className}`}>
      {blocks.map((block, bi) => {
        const trimmed = block.trim();
        if (!trimmed) return null;
        const lines = trimmed.split('\n');

        // Pipe table
        if (lines.length >= 2 && lines[0].trim().startsWith('|') && /^\|[-\s:|]+\|$/.test(lines[1].trim())) {
          const cells = (l: string) => l.split('|').slice(1, -1).map(c => c.trim());
          const head = cells(lines[0]);
          const rows = lines.slice(2).filter(l => l.trim().startsWith('|')).map(cells);
          return (
            <div key={bi} className="mb-5 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {head.map((c, ci) => <th key={ci} className="text-left px-3 py-2 font-semibold text-[11px] uppercase tracking-wide text-slate-500">{renderInline(c, accent, basePath)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, ri) => (
                    <tr key={ri} className="border-b border-slate-100 last:border-0 odd:bg-white even:bg-slate-50/50 align-top">
                      {r.map((c, ci) => <td key={ci} className={`px-3 py-2 leading-snug ${ci === 0 ? 'font-medium text-slate-800' : ''}`}>{renderInline(c, accent, basePath)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        // Callout: every line starts with "> " (e.g. "> **Bedside trick.** ...")
        if (lines.every(l => /^>\s?/.test(l))) {
          const body = lines.map(l => l.replace(/^>\s?/, '')).join(' ');
          return (
            <aside key={bi} className="mb-5 rounded-xl border px-4 py-3 text-[14px] leading-[1.7]" style={{ borderColor: accent + '40', background: accent + '0a' }}>
              {renderInline(body, accent, basePath)}
            </aside>
          );
        }

        // Sub-heading: a lone **Bold** line
        if (lines.length === 1 && /^\*\*[^*]+\*\*[:.]?\s*$/.test(trimmed)) {
          return <h4 key={bi} className="text-[15px] font-semibold text-slate-900 mt-6 mb-1.5 first:mt-0">{trimmed.replace(/^\*\*/, '').replace(/\*\*[:.]?\s*$/, '')}</h4>;
        }

        const isBullet = (l: string) => /^\s*-\s+/.test(l);
        const isNum = (l: string) => /^\s*\d+\.\s+/.test(l);
        const firstBullet = lines.findIndex(isBullet);
        const firstNum = lines.findIndex(isNum);

        if (firstBullet >= 0 && lines.slice(firstBullet).every(isBullet)) {
          const preamble = lines.slice(0, firstBullet).join(' ');
          return (
            <div key={bi} className="mb-4">
              {preamble && <p className="mb-2 leading-[1.8]">{renderInline(preamble, accent, basePath)}</p>}
              <ul className="list-disc list-outside ml-5 space-y-1.5">
                {lines.slice(firstBullet).map((l, li) => <li key={li} className="leading-[1.7]">{renderInline(l.replace(/^\s*-\s+/, ''), accent, basePath)}</li>)}
              </ul>
            </div>
          );
        }
        if (firstNum >= 0 && lines.slice(firstNum).every(isNum)) {
          const preamble = lines.slice(0, firstNum).join(' ');
          return (
            <div key={bi} className="mb-4">
              {preamble && <p className="mb-2 leading-[1.8]">{renderInline(preamble, accent, basePath)}</p>}
              <ol className="list-decimal list-outside ml-5 space-y-1.5">
                {lines.slice(firstNum).map((l, li) => <li key={li} className="leading-[1.7]">{renderInline(l.replace(/^\s*\d+\.\s+/, ''), accent, basePath)}</li>)}
              </ol>
            </div>
          );
        }
        return <p key={bi} className={P}>{renderInline(lines.join(' '), accent, basePath)}</p>;
      })}
    </div>
  );
}
