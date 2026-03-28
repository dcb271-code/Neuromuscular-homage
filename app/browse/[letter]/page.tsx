import LetterPageClient from './LetterPageClient';
import { getEntriesByLetter, type IndexEntry } from '@/src/data/curatedIndex';
import genesData from '@/src/data/genes-enriched.json';
import conditionsData from '@/src/data/conditions-enriched.json';

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Build a merged index: curated entries + all enriched genes + all enriched conditions
function getMergedEntries(letter: string): IndexEntry[] {
  const curated = getEntriesByLetter(letter);
  const curatedNames = new Set(curated.map(e => e.name.split(/[\s(]/)[0].toUpperCase()));

  // Add genes from enriched data that aren't in curated index
  const extraGenes: IndexEntry[] = genesData
    .filter(g => g.symbol[0].toUpperCase() === letter && !curatedNames.has(g.symbol.toUpperCase()))
    .map(g => ({
      letter,
      type: 'gene' as const,
      name: g.symbol,
      href: g.wustlUrl,
      dagger: g.adultOnset,
    }));

  // Add conditions from enriched data that aren't in curated index
  const curatedCondNames = new Set(curated.filter(e => e.type === 'condition').map(e => e.name.toLowerCase()));
  const extraConds: IndexEntry[] = conditionsData
    .filter(c => c.letter === letter && !curatedCondNames.has(c.name.toLowerCase()))
    .map(c => ({
      letter,
      type: 'condition' as const,
      name: c.name,
      href: c.wustlUrl,
      dagger: c.adultOnset,
    }));

  return [...curated, ...extraGenes, ...extraConds];
}

export function generateStaticParams() {
  return ALL_LETTERS.map(letter => ({ letter }));
}

export default function LetterPage({ params }: { params: { letter: string } }) {
  const letter = params.letter.toUpperCase();
  const entries = getMergedEntries(letter);
  return <LetterPageClient letter={letter} entries={entries} />;
}
