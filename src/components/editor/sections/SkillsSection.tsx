import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { useCVStore } from '../../../store/cvStore';

export function SkillsSection() {
  const skills = useCVStore((s) => s.cv.skills);
  const addEntry = useCVStore((s) => s.addEntry);
  const removeEntry = useCVStore((s) => s.removeEntry);
  const updateEntry = useCVStore((s) => s.updateEntry);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const ids = useMemo(() => skills.map((g) => g.id), [skills]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Skills</div>
          <div className="text-sm text-zinc-500">Group skills into clear categories.</div>
        </div>
        <button
          type="button"
          onClick={() => addEntry('skills')}
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
          useCVStore.getState().reorderEntries('skills', from, to);
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {skills.map((group) => {
              const isExpanded = !!expanded[group.id];
              const category = group.category?.trim() || 'Category';
              const preview = group.items.slice(0, 5).join(', ');
              return (
                <SortableCard
                  key={group.id}
                  id={group.id}
                  header={
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setExpanded((s) => ({ ...s, [group.id]: !s[group.id] }))}
                        className="min-w-0 text-left"
                      >
                        <div className="truncate text-sm font-semibold text-zinc-900">{category}</div>
                        <div className="mt-0.5 truncate text-xs text-zinc-500">
                          {preview || 'No skills yet'}
                          {group.items.length > 5 ? '…' : ''}
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="cursor-grab select-none rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-600">
                          Drag
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEntry('skills', group.id)}
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
                      <Field
                        label="Category"
                        value={group.category}
                        onChange={(v) => updateEntry('skills', group.id, { category: v })}
                        placeholder="Languages / Tools / Frameworks"
                      />

                      <TagInput
                        label="Items"
                        items={group.items}
                        onAdd={(item) => {
                          const next = item.trim();
                          if (!next) return;
                          updateEntry('skills', group.id, { items: [...group.items, next] });
                        }}
                        onRemove={(idx) => {
                          const next = group.items.filter((_, i) => i !== idx);
                          updateEntry('skills', group.id, { items: next });
                        }}
                      />
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

function TagInput(props: {
  label: string;
  items: string[];
  onAdd: (item: string) => void;
  onRemove: (index: number) => void;
}) {
  const [value, setValue] = useState('');
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{props.label}</label>
      <div className="flex flex-wrap gap-2">
        {props.items.map((it, idx) => (
          <span
            key={`${it}-${idx}`}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-300 bg-white px-3 py-1 text-xs"
          >
            {it}
            <button
              type="button"
              onClick={() => props.onRemove(idx)}
              className="text-zinc-500 hover:text-zinc-950"
              aria-label={`Remove ${it}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              props.onAdd(value);
              setValue('');
            }
          }}
          className="h-10 min-w-[180px] flex-1 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
          placeholder="Type a skill and press Enter"
        />
      </div>
    </div>
  );
}

