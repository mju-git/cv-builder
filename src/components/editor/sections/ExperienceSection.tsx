import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { useCVStore } from '../../../store/cvStore';
import { RichTextField } from '../fields/RichTextField';

export function ExperienceSection() {
  const experience = useCVStore((s) => s.cv.experience);
  const addEntry = useCVStore((s) => s.addEntry);
  const removeEntry = useCVStore((s) => s.removeEntry);
  const reorderEntries = useCVStore((s) => s.reorderEntries);
  const updateEntry = useCVStore((s) => s.updateEntry);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const ids = useMemo(() => experience.map((e) => e.id), [experience]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Experience</div>
          <div className="text-sm text-zinc-500">Reverse chronological (newest first).</div>
        </div>
        <button
          type="button"
          onClick={() => addEntry('experience')}
          className="h-9 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Add entry
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;
          const from = ids.indexOf(active.id as string);
          const to = ids.indexOf(over.id as string);
          if (from === -1 || to === -1) return;

          // Store API expects indices; we keep newest first.
          reorderEntries('experience', from, to);
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {experience.map((job) => {
              const isExpanded = !!expanded[job.id];
              const title = job.jobTitle?.trim() || 'Job title';
              const company = job.company?.trim() || 'Company';
              return (
                <SortableCard
                  key={job.id}
                  id={job.id}
                  header={
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setExpanded((s) => ({ ...s, [job.id]: !s[job.id] }))}
                        className="min-w-0 text-left"
                      >
                        <div className="truncate text-sm font-semibold text-zinc-900">
                          {title} — {company}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">
                          {job.startDate}
                          {job.startDate && job.endDate ? ' – ' : ''}
                          {job.endDate}
                          {job.location ? ` · ${job.location}` : ''}
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="cursor-grab select-none rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-600">
                          Drag
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEntry('experience', job.id)}
                          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  }
                >
                  {isExpanded ? (
                    <div className="mt-3 space-y-3">
                      <div className="space-y-3">
                        <Field
                          label="Job title"
                          value={job.jobTitle}
                          onChange={(v) => updateEntry('experience', job.id, { jobTitle: v })}
                        />
                        <Field
                          label="Company"
                          value={job.company}
                          onChange={(v) => updateEntry('experience', job.id, { company: v })}
                        />
                        <Field
                          label="Location"
                          value={job.location}
                          onChange={(v) => updateEntry('experience', job.id, { location: v })}
                        />
                        <Field
                          label="Start date"
                          value={job.startDate}
                          onChange={(v) => updateEntry('experience', job.id, { startDate: v })}
                          placeholder="Mar 2021"
                        />
                        <Field
                          label="End date"
                          value={job.endDate}
                          onChange={(v) => updateEntry('experience', job.id, { endDate: v })}
                          placeholder="Present"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <RichTextField
                          value={job.descriptionHtml}
                          onChange={(html) => updateEntry('experience', job.id, { descriptionHtml: html })}
                        />
                        <div className="mt-1 text-xs text-zinc-500">
                          Use bullet points for ATS-friendly descriptions.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </SortableCard>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

function SortableCard(props: {
  id: string;
  header: React.ReactNode;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: props.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'rounded-xl border border-zinc-200 bg-white p-4 shadow-sm',
        isDragging ? 'opacity-70' : '',
      ].join(' ')}
    >
      <div {...attributes} {...listeners}>
        {props.header}
      </div>
      {props.children}
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

