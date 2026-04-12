import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { useCVStore } from '../../../store/cvStore';
import { RichTextField } from '../fields/RichTextField';

export function ProjectsSection() {
  const projects = useCVStore((s) => s.cv.projects);
  const addEntry = useCVStore((s) => s.addEntry);
  const removeEntry = useCVStore((s) => s.removeEntry);
  const updateEntry = useCVStore((s) => s.updateEntry);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const ids = useMemo(() => projects.map((p) => p.id), [projects]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Projects</div>
          <div className="text-sm text-zinc-500">Optional, but useful if relevant.</div>
        </div>
        <button
          type="button"
          onClick={() => addEntry('projects')}
          className="h-9 rounded-lg bg-zinc-950 px-3 text-sm font-medium text-white hover:bg-zinc-800"
        >
          Add
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
          useCVStore.getState().reorderEntries('projects', from, to);
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {projects.map((p) => {
              const isExpanded = !!expanded[p.id];
              return (
                <SortableCard
                  key={p.id}
                  id={p.id}
                  header={
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setExpanded((s) => ({ ...s, [p.id]: !s[p.id] }))}
                        className="min-w-0 text-left"
                      >
                        <div className="truncate text-sm font-semibold text-zinc-900">
                          {p.name?.trim() || 'Project'}{' '}
                          {p.url?.trim() ? (
                            <span className="font-normal text-zinc-500">({p.url})</span>
                          ) : null}
                        </div>
                        <div className="mt-0.5 text-xs text-zinc-500">
                          {p.startDate}
                          {p.startDate && p.endDate ? ' – ' : ''}
                          {p.endDate}
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="cursor-grab select-none rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-600">
                          Drag
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEntry('projects', p.id)}
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
                      <div className="grid grid-cols-2 gap-3">
                        <Field
                          label="Name"
                          value={p.name}
                          onChange={(v) => updateEntry('projects', p.id, { name: v })}
                        />
                        <Field
                          label="URL"
                          value={p.url ?? ''}
                          onChange={(v) => updateEntry('projects', p.id, { url: v })}
                          placeholder="github.com/..."
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <Field
                            label="Start date"
                            value={p.startDate}
                            onChange={(v) => updateEntry('projects', p.id, { startDate: v })}
                          />
                          <Field
                            label="End date"
                            value={p.endDate}
                            onChange={(v) => updateEntry('projects', p.id, { endDate: v })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-sm font-medium">Description</label>
                        <RichTextField
                          value={p.descriptionHtml}
                          onChange={(html) => updateEntry('projects', p.id, { descriptionHtml: html })}
                        />
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

function SortableCard(props: { id: string; header: React.ReactNode; children: React.ReactNode }) {
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

