import Link from 'next/link';
import type { Metadata } from 'next';
import { EXAM_VIDEOS, UTAH_CREDIT, UTAH_LICENSE_URL, utahPageUrl } from '@/src/loc/videos';
import { LOC_TEXTS } from '@/src/loc/curriculum';

export const metadata: Metadata = {
  title: 'Credits and licenses · Where Before What',
  description: 'Third-party material used on this site, with its source, license and required attribution.',
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[18px] font-bold text-slate-900 mt-10 mb-3 tracking-tight">{children}</h2>;
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="text-[14px] text-slate-600 leading-relaxed mb-3">{children}</p>;
}
const A = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="underline text-teal-700">{children}</a>
);

export default function CreditsPage() {
  return (
    <main className="max-w-[760px] mx-auto px-4 py-10">
      <nav className="text-[12px] text-slate-400 mb-4"><Link href="/" className="no-underline text-slate-400">Where Before What</Link> / <span className="text-slate-700 font-semibold">Credits</span></nav>
      <h1 className="font-mono font-extrabold tracking-tight text-slate-900 mb-3" style={{ fontSize: 'clamp(26px, 5vw, 36px)' }}>Credits and licenses</h1>
      <P>
        The teaching text, figures and interactive models on this site are original work. Where the site uses material made by others, it is listed below with its source, its license and the attribution the owner asks for. The site is free and non-commercial. Licenses marked NC (non-commercial) and SA (share-alike) apply to the reused material itself, and any adaptation of it carries the same license.
      </P>

      <H>Exam videos (Localization)</H>
      <P>{UTAH_CREDIT}</P>
      <P>
        License terms: <A href={UTAH_LICENSE_URL}>NeuroLogic Exam Creative Commons license and movie re-use</A>. The clips play from the University of Utah&apos;s own video host and load only when you press play. Poster stills are frames from the same clips. Captions are our own.
      </P>
      <div className="overflow-x-auto rounded-xl border border-slate-200 mb-3">
        <table className="w-full text-[12.5px]">
          <thead><tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wide text-slate-500"><th className="px-3 py-2">Clip</th><th className="px-3 py-2">Collection</th><th className="px-3 py-2">Source page</th></tr></thead>
          <tbody>
            {EXAM_VIDEOS.map(v => (
              <tr key={v.id} className="border-t border-slate-100 align-top">
                <td className="px-3 py-1.5 text-slate-800">{v.title}{v.courtesy ? <span className="text-slate-400"> (courtesy of {v.courtesy})</span> : null}</td>
                <td className="px-3 py-1.5 text-slate-500">{v.site === 'pediatric' ? 'Pediatric NeuroLogic Exam' : 'NeuroLogic Exam'}</td>
                <td className="px-3 py-1.5"><A href={utahPageUrl(v)}>{v.page.replace('.html', '')} ({v.id})</A></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H>Books and papers cited (Localization)</H>
      <P>
        The localization modules are written in our own words and cite these texts by page. No text or figure is reproduced from them. Papers are cited by PubMed link in the modules where they are used.
      </P>
      <ul className="list-disc ml-5 text-[13.5px] text-slate-600 space-y-1 mb-3">{LOC_TEXTS.map(t => <li key={t}>{t}</li>)}</ul>

      <H>EEG tracings</H>
      <P>
        Most tracings are from St. Louis EK, Frey LC, eds. <em>Electroencephalography (EEG): An Introductory Text and Atlas of Normal and Abnormal Findings in Adults, Children, and Infants</em>. American Epilepsy Society, 2016, licensed <A href="https://creativecommons.org/licenses/by-nc-sa/4.0/">CC BY-NC-SA 4.0</A>. A smaller set is reproduced with the permission of Jaime Shoup, MD, University of Louisville; those images are not under a Creative Commons license and may not be copied elsewhere without the author's consent. Every tracing carries its credit in its caption. Full list: <a href="/eeg/ATTRIBUTIONS.md" className="underline text-teal-700">EEG attributions</a>.
      </P>

      <H>MRI atlas templates</H>
      <P>
        The brain templates are population averages obtained from <A href="https://www.templateflow.org">TemplateFlow</A> and redistributed under their original licenses: the MNI infant and pediatric templates (Fonov et al., MNI/McGill permissive license), the UNC infant atlases with AAL labels (Shi et al., CC BY 4.0) and the dHCP neonatal atlas (Schuh et al., CC BY 4.0). Citations, license texts and the changes made are listed in the <a href="/atlas/ATTRIBUTION.md" className="underline text-teal-700">atlas attribution file</a>.
      </P>

      <H>Neuromuscular data</H>
      <P>
        Gene and disease information in the neuromuscular section draws on the <A href="https://neuromuscular.wustl.edu">Washington University Neuromuscular Disease Center</A>, <A href="https://www.ncbi.nlm.nih.gov/gene">NCBI Gene</A> and <A href="https://www.omim.org">OMIM</A>. For clinical use, always refer to these primary sources.
      </P>

      <H>Software</H>
      <P>
        The MRI viewer uses <A href="https://github.com/niivue/niivue">NiiVue</A> (BSD 2-Clause). The site is built with Next.js, React and Tailwind CSS (MIT).
      </P>

      <p className="text-[12px] text-slate-400 mt-10">If you are a rights holder and something here is credited incorrectly, please contact the site owner and it will be corrected.</p>
    </main>
  );
}
