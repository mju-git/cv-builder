import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import { useCVStore } from '../../../store/cvStore';
import type { LanguageEntry } from '../../../types/cv.types';

export function LanguagesSection() {
  const languages = useCVStore((s) => s.cv.languages);
  const addEntry = useCVStore((s) => s.addEntry);
  const removeEntry = useCVStore((s) => s.removeEntry);
  const updateEntry = useCVStore((s) => s.updateEntry);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const ids = useMemo(() => languages.map((l) => l.id), [languages]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">Languages</div>
          <div className="text-sm text-zinc-500">List languages and proficiency.</div>
        </div>
        <button
          type="button"
          onClick={() => addEntry('languages')}
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
          useCVStore.getState().reorderEntries('languages', from, to);
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {languages.map((lang) => {
              const isExpanded = !!expanded[lang.id];
              return (
                <SortableCard
                  key={lang.id}
                  id={lang.id}
                  header={
                    <div className="flex items-start justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setExpanded((s) => ({ ...s, [lang.id]: !s[lang.id] }))}
                        className="min-w-0 text-left"
                      >
                        <div className="truncate text-sm font-semibold text-zinc-900">
                          {lang.language?.trim() || 'Language'}{' '}
                          <span className="font-normal text-zinc-500">— {lang.level}</span>
                        </div>
                      </button>

                      <div className="flex items-center gap-2">
                        <span className="cursor-grab select-none rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs text-zinc-600">
                          Drag
                        </span>
                        <button
                          type="button"
                          onClick={() => removeEntry('languages', lang.id)}
                          className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-xs hover:bg-zinc-50"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  }
                >
                  {isExpanded ? (
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <Field
                        label="Language"
                        value={lang.language}
                        onChange={(v) => updateEntry('languages', lang.id, { language: v })}
                        placeholder="English"
                      />
                      <LevelSelect
                        value={lang.level}
                        onChange={(v) => updateEntry('languages', lang.id, { level: v })}
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

function LevelSelect(props: {
  value: LanguageEntry['level'];
  onChange: (v: LanguageEntry['level']) => void;
}) {
  const levels: LanguageEntry['level'][] = [
    'Native',
    'Fluent',
    'Advanced',
    'Intermediate',
    'Basic',
  ];

  return (
    <div className="min-w-0">
      <label className="mb-1 block text-sm font-medium">Level</label>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value as LanguageEntry['level'])}
        className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none focus:border-zinc-950"
      >
        {levels.map((l) => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

