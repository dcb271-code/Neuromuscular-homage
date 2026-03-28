import { NextResponse } from 'next/server';
import genesData from '@/src/data/genes-enriched.json';

// Include aliases and phenotype keywords for search matching
const geneList = genesData.map(g => ({
  symbol: g.symbol,
  fullName: g.fullName,
  aliases: g.aliases,
  locus: g.locus,
  inheritance: g.inheritance,
  omim: g.omim,
  categories: g.categories,
  phenotype: g.phenotype,
}));

export async function GET() {
  return NextResponse.json(geneList, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}
