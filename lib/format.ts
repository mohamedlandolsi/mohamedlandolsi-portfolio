const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parts(iso: string): { year: string; month?: number; day?: number } {
  const [year, month, day] = iso.split("-");
  return {
    year,
    month: month ? Number(month) : undefined,
    day: day ? Number(day) : undefined,
  };
}

/** "2026-10-08" becomes "8 October 2026", "2026-10" becomes "October 2026". For prose. */
export function formatDate(iso: string): string {
  const { year, month, day } = parts(iso);
  if (!month || !MONTHS[month - 1]) return iso;
  const name = MONTHS[month - 1];
  return day ? `${day} ${name} ${year}` : `${name} ${year}`;
}

/** "2025-12" becomes "Dec 2025". For tight metadata. */
export function formatMonth(iso: string): string {
  const { year, month } = parts(iso);
  if (!month || !MONTHS[month - 1]) return iso;
  return `${MONTHS[month - 1].slice(0, 3)} ${year}`;
}

/** "2026-10-08" becomes "8 Oct 2026". For tags and badges. */
export function formatShortDate(iso: string): string {
  const { year, month, day } = parts(iso);
  if (!month || !MONTHS[month - 1]) return iso;
  const name = MONTHS[month - 1].slice(0, 3);
  return day ? `${day} ${name} ${year}` : `${name} ${year}`;
}

/** "https://github.com/mohamedlandolsi" becomes "github.com/mohamedlandolsi". For links that must read on paper. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}
