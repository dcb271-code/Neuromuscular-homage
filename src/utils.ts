// Day index seeded by calendar date in Eastern Time (resets at 12 AM EST/EDT)
export function todayIndex() {
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
