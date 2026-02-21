import LetterPageClient from './LetterPageClient';
import { getEntriesByLetter } from '@/src/data/curatedIndex';

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function generateStaticParams() {
  return ALL_LETTERS.map(letter => ({ letter }));
}

export default function LetterPage({ params }: { params: { letter: string } }) {
  const letter = params.letter.toUpperCase();
  const entries = getEntriesByLetter(letter);
  return <LetterPageClient letter={letter} entries={entries} />;
}
