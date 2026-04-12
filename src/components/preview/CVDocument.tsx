import { forwardRef, useEffect, useMemo, useRef, useState, type ForwardedRef } from 'react';
import { useCVStore } from '../../store/cvStore';

function assignRef<T>(ref: ForwardedRef<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === 'function') ref(value);
  else ref.current = value;
}

export const CVDocument = forwardRef<HTMLDivElement>(function CVDocument(_, ref) {
  const cv = useCVStore((s) => s.cv);
  const template = useCVStore((s) => s.template);

  const innerRef = useRef<HTMLDivElement | null>(null);
  const setRef = (node: HTMLDivElement | null) => {
    innerRef.current = node;
    assignRef(ref, node);
  };

  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const height = el.scrollHeight;
      const p = Math.max(1, Math.ceil(height / 1123));
      setPages(p);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const contactLine = useMemo(
    () =>
      [cv.basics.email, cv.basics.phone, cv.basics.location, cv.basics.linkedin, cv.basics.website]
        .filter((x) => !!x && x.trim().length > 0)
        .join(' · '),
    [cv.basics.email, cv.basics.phone, cv.basics.location, cv.basics.linkedin, cv.basics.website],
  );

  return (
    <div className="flex justify-center">
      <div className="w-full">
        {pages > 1 ? (
          <div className="mb-2 text-center text-xs font-medium text-zinc-500 print:hidden">
            Page 2{pages > 2 ? `–${pages}` : ''}
          </div>
        ) : null}

        <div
          ref={setRef}
          id="cv-document"
          className={[
            'rounded-md bg-white text-zinc-950 shadow-sm ring-1 ring-zinc-200 print:shadow-none print:ring-0',
            template === 'modern' ? 'tracking-tight' : '',
          ].join(' ')}
          style={{ width: 794 }}
        >
          <div
            className={[
              'text-[13px] leading-[1.35]',
              template === 'modern' ? 'px-11 py-11' : 'px-10 py-10',
            ].join(' ')}
          >
            <header className="mb-4">
              <div className="text-[24px] font-bold leading-tight">{cv.basics.name}</div>
              <div className="mt-1 text-[14px] font-medium text-zinc-700">{cv.basics.title}</div>
              <div className="mt-2 text-[12px] text-zinc-700">{contactLine}</div>
            </header>

            <div className="mb-5 border-b border-zinc-200" />

            <section className="mb-5">
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-zinc-800">
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {cv.experience.map((w) => (
                  <div key={w.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-semibold text-zinc-900">{w.jobTitle}</div>
                      <div className="shrink-0 text-[12px] text-zinc-600">
                        {w.startDate}
                        {w.startDate && w.endDate ? ' – ' : ''}
                        {w.endDate}
                      </div>
                    </div>
                    <div className="text-[12px] text-zinc-600">
                      {w.company} · {w.location}
                    </div>
                    <HtmlBullets html={w.descriptionHtml} />
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-zinc-800">
                EDUCATION
              </h2>
              <div className="space-y-3">
                {cv.education.map((e) => (
                  <div key={e.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-semibold text-zinc-900">{e.degree}</div>
                      <div className="shrink-0 text-[12px] text-zinc-600">
                        {e.startDate}
                        {e.startDate && e.endDate ? ' – ' : ''}
                        {e.endDate}
                      </div>
                    </div>
                    <div className="text-[12px] text-zinc-600">
                      {e.institution} · {e.location}
                    </div>
                    {e.notes?.trim() ? <div className="mt-1 text-zinc-800">{e.notes}</div> : null}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-zinc-800">
                SKILLS
              </h2>
              <div className="space-y-2">
                {cv.skills.map((g) => (
                  <div key={g.id} className="text-zinc-800">
                    <span className="font-semibold text-zinc-900">{g.category}:</span>{' '}
                    {g.items.join(', ')}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-zinc-800">
                LANGUAGES
              </h2>
              <div className="space-y-1 text-zinc-800">
                {cv.languages.map((l) => (
                  <div key={l.id}>
                    {l.language} — {l.level}
                  </div>
                ))}
              </div>
            </section>

            <section className="mb-5">
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-zinc-800">
                PROJECTS
              </h2>
              <div className="space-y-4">
                {cv.projects.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-semibold text-zinc-900">
                        {p.name}
                        {p.url?.trim() ? (
                          <span className="font-normal text-zinc-700"> ({p.url})</span>
                        ) : null}
                      </div>
                      <div className="shrink-0 text-[12px] text-zinc-600">
                        {p.startDate}
                        {p.startDate && p.endDate ? ' – ' : ''}
                        {p.endDate}
                      </div>
                    </div>
                    <HtmlBullets html={p.descriptionHtml} />
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-zinc-800">
                CERTIFICATIONS
              </h2>
              <div className="space-y-4">
                {cv.certifications.map((c) => (
                  <div key={c.id}>
                    <div className="flex items-baseline justify-between gap-3">
                      <div className="font-semibold text-zinc-900">{c.name}</div>
                      <div className="shrink-0 text-[12px] text-zinc-600">{c.date}</div>
                    </div>
                    <div className="text-[12px] text-zinc-600">
                      {c.issuer}
                      {c.credentialUrl?.trim() ? ` · ${c.credentialUrl}` : ''}
                    </div>
                    <HtmlBullets html={c.descriptionHtml} />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
});

function HtmlBullets({ html }: { html: string }) {
  const safe = html?.trim() ? html : '';
  if (!safe) return null;
  return (
    <div
      className="mt-2 text-zinc-800 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_p]:m-0"
      // Tiptap outputs clean ul/li; plan explicitly calls for innerHTML rendering.
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}

