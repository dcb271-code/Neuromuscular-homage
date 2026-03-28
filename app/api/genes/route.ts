import { NextResponse } from 'next/server';
import genesData from '@/src/data/genes-enriched.json';

// Light-weight gene list for search page matching
const geneList = genesData.map(g => ({
  symbol: g.symbol,
  fullName: g.fullName,
  locus: g.locus,
  inheritance: g.inheritance,
  omim: g.omim,
  categories: g.categories,
}));

export async function GET() {
  return NextResponse.json(geneList, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}
