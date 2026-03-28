import { NextResponse } from 'next/server';
import conditionsData from '@/src/data/conditions-enriched.json';

const slugs = conditionsData.map(c => c.slug);

export async function GET() {
  return NextResponse.json(slugs, {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
  });
}
