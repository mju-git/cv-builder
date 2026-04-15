import { useMemo } from 'react';
import { useCVStore } from '../../../store/cvStore';

export function BasicsSection() {
  const basics = useCVStore((s) => s.cv.basics);
  const updateBasics = useCVStore((s) => s.updateBasics);

  const summaryCount = useMemo(() => {
    const txt = basics.summary?.trim() ?? '';
    const sentences = txt
      ? txt
          .split(/[.!?]\s+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    return { chars: txt.length, sentences: sentences.length };
  }, [basics.summary]);

  return (
    <div className="space-y-5">
      <div>
        <div className="text-lg font-semibold">Basics</div>
        <div className="text-sm text-zinc-500">These fields appear at the top of your CV.</div>
      </div>

      <div className="space-y-3">
        <Field
          label="Name"
          value={basics.name}
          onChange={(v) => updateBasics({ name: v })}
          placeholder="Your full name"
        />
        <Field
          label="Title"
          value={basics.title}
          onChange={(v) => updateBasics({ title: v })}
          placeholder="Software Engineer"
        />
        <Field
          label="Email"
          value={basics.email}
          onChange={(v) => updateBasics({ email: v })}
          placeholder="you@domain.com"
        />
        <Field
          label="Phone"
          value={basics.phone}
          onChange={(v) => updateBasics({ phone: v })}
          placeholder="+47 ..."
        />
        <Field
          label="Location"
          value={basics.location}
          onChange={(v) => updateBasics({ location: v })}
          placeholder="City, Country"
        />
        <Field
          label="LinkedIn"
          value={basics.linkedin ?? ''}
          onChange={(v) => updateBasics({ linkedin: v })}
          placeholder="linkedin.com/in/..."
        />
        <Field
          label="Website"
          value={basics.website ?? ''}
          onChange={(v) => updateBasics({ website: v })}
          placeholder="your-site.com"
        />
      </div>

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <label className="text-sm font-medium">Summary</label>
          <div className="text-xs text-zinc-500">
            {summaryCount.sentences}/5 sentences • {summaryCount.chars} chars
          </div>
        </div>
        <textarea
          value={basics.summary ?? ''}
          onChange={(e) => updateBasics({ summary: e.target.value })}
          rows={5}
          className="w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950"
          placeholder="3–5 sentences. Focus on role + impact + strengths."
        />
        {summaryCount.sentences > 5 ? (
          <div className="mt-1 text-xs text-amber-700">
            Keep the summary to 3–5 sentences for best ATS readability.
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-sm font-medium">{props.label}</label>
      <input
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
      />
    </div>
  );
}

