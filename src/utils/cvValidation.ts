import type { CVData, SectionKey } from '../types/cv.types';

export type CVIssue = {
  section: SectionKey;
  message: string;
  severity: 'warning' | 'error';
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCV(cv: CVData): CVIssue[] {
  const issues: CVIssue[] = [];

  const email = cv.basics.email?.trim() ?? '';
  const phone = cv.basics.phone?.trim() ?? '';

  // Missing phone/email (errors)
  if (!email) {
    issues.push({ section: 'basics', severity: 'error', message: 'Missing email.' });
  }
  if (!phone) {
    issues.push({ section: 'basics', severity: 'error', message: 'Missing phone number.' });
  }

  // Email format (error)
  if (email && !EMAIL_RE.test(email)) {
    issues.push({ section: 'basics', severity: 'error', message: 'Email format looks invalid.' });
  }

  // Summary over 5 sentences (warning)
  const summary = cv.basics.summary?.trim() ?? '';
  if (summary) {
    const sentences = summary
      .split(/[.!?]\s+/)
      .map((s) => s.trim())
      .filter(Boolean).length;
    if (sentences > 5) {
      issues.push({
        section: 'basics',
        severity: 'warning',
        message: 'Summary is over 5 sentences. Keep it to 3–5.',
      });
    }
  }

  // Date consistency heuristic: encourage "Mon YYYY" or "YYYY"
  const looksLikeDate = (v: string) => {
    const s = v.trim();
    if (!s) return true;
    if (s.toLowerCase() === 'present') return true;
    if (/^\d{4}$/.test(s)) return true;
    if (/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{4}$/i.test(s)) return true;
    return false;
  };
  if (
    cv.experience.some((w) => !looksLikeDate(w.startDate) || !looksLikeDate(w.endDate)) ||
    cv.education.some((e) => !looksLikeDate(e.startDate) || !looksLikeDate(e.endDate)) ||
    cv.projects.some((p) => !looksLikeDate(p.startDate) || !looksLikeDate(p.endDate)) ||
    cv.certifications.some((c) => !looksLikeDate(c.date))
  ) {
    issues.push({
      section: 'experience',
      severity: 'warning',
      message: 'Date format inconsistent. Prefer "Mon YYYY" (e.g. "Mar 2021") or "YYYY".',
    });
  }

  // Any job description under 20 words (warning)
  const stripHtml = (html: string) =>
    html
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  if (
    cv.experience.some((w) => {
      const txt = stripHtml(w.descriptionHtml ?? '');
      const words = txt ? txt.split(' ').length : 0;
      return words > 0 && words < 20;
    })
  ) {
    issues.push({
      section: 'experience',
      severity: 'warning',
      message: 'Some job descriptions look very short (< 20 words).',
    });
  }

  // Duplicate skill items (warning)
  const skillSet = new Set<string>();
  let dup = false;
  for (const g of cv.skills) {
    for (const it of g.items) {
      const key = it.trim().toLowerCase();
      if (!key) continue;
      if (skillSet.has(key)) dup = true;
      skillSet.add(key);
    }
  }
  if (dup) {
    issues.push({
      section: 'skills',
      severity: 'warning',
      message: 'Duplicate skill items detected.',
    });
  }

  // Experience reverse-chronological check (warning)
  const parseApprox = (s: string) => {
    const t = s.trim();
    if (!t || t.toLowerCase() === 'present') return Number.POSITIVE_INFINITY;
    const m = /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})$/i.exec(t);
    if (m) {
      const monthIndex =
        ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(
          m[1]!.toLowerCase(),
        ) + 1;
      return Number(m[2]) * 100 + monthIndex;
    }
    if (/^\d{4}$/.test(t)) return Number(t) * 100;
    return NaN;
  };
  const starts = cv.experience.map((w) => parseApprox(w.startDate));
  for (let i = 1; i < starts.length; i++) {
    const prev = starts[i - 1];
    const cur = starts[i];
    if (Number.isFinite(prev) && Number.isFinite(cur) && cur > prev) {
      issues.push({
        section: 'experience',
        severity: 'warning',
        message: 'Experience entries may not be in reverse-chronological order.',
      });
      break;
    }
  }

  return issues;
}

