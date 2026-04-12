import { useCVStore } from '../../store/cvStore';
import type { SectionKey } from '../../types/cv.types';
import { lazy, Suspense } from 'react';

const BasicsSection = lazy(() => import('../editor/sections/BasicsSection').then((m) => ({ default: m.BasicsSection })));
const ExperienceSection = lazy(() =>
  import('../editor/sections/ExperienceSection').then((m) => ({ default: m.ExperienceSection })),
);
const EducationSection = lazy(() =>
  import('../editor/sections/EducationSection').then((m) => ({ default: m.EducationSection })),
);
const SkillsSection = lazy(() => import('../editor/sections/SkillsSection').then((m) => ({ default: m.SkillsSection })));
const LanguagesSection = lazy(() =>
  import('../editor/sections/LanguagesSection').then((m) => ({ default: m.LanguagesSection })),
);
const ProjectsSection = lazy(() =>
  import('../editor/sections/ProjectsSection').then((m) => ({ default: m.ProjectsSection })),
);
const CertificationsSection = lazy(() =>
  import('../editor/sections/CertificationsSection').then((m) => ({ default: m.CertificationsSection })),
);

export function EditorPanel() {
  const activeSection = useCVStore((s) => s.activeSection);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <Suspense fallback={<div className="text-sm text-zinc-500">Loading…</div>}>
        {renderSection(activeSection)}
      </Suspense>
    </div>
  );
}

function renderSection(section: SectionKey) {
  switch (section) {
    case 'basics':
      return <BasicsSection />;
    case 'experience':
      return <ExperienceSection />;
    case 'education':
      return <EducationSection />;
    case 'skills':
      return <SkillsSection />;
    case 'languages':
      return <LanguagesSection />;
    case 'projects':
      return <ProjectsSection />;
    case 'certifications':
      return <CertificationsSection />;
    default:
      return null;
  }
}

