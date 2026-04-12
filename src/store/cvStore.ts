import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  CVData,
  CVTemplateKey,
  EducationEntry,
  SectionKey,
  SkillGroup,
  WorkEntry,
} from '../types/cv.types';
import type { Basics, CertEntry, LanguageEntry, ProjectEntry } from '../types/cv.types';

const createId = (): string =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const defaultCV: CVData = {
  basics: {
    name: 'Maja Example',
    title: 'Data Scientist',
    email: 'maja@example.com',
    phone: '+47 000 00 000',
    location: 'Oslo, Norway',
    linkedin: 'linkedin.com/in/maja-example',
    website: 'maja.dev',
    summary:
      'Data scientist with experience in building reliable ML pipelines and analytics products. Focused on clear communication and measurable impact. Comfortable across Python, SQL, and modern web tooling.',
  },
  experience: [
    {
      id: createId(),
      jobTitle: 'Data Scientist',
      company: 'Example Company',
      location: 'Oslo',
      startDate: 'Mar 2023',
      endDate: 'Present',
      descriptionHtml:
        '<ul><li>Delivered a forecasting model that improved planning accuracy by 12%.</li><li>Built reproducible feature pipelines with automated validation.</li><li>Partnered with stakeholders to define success metrics and dashboards.</li></ul>',
    },
  ],
  education: [
    {
      id: createId(),
      degree: 'MSc Data Science',
      institution: 'Example University',
      location: 'Oslo',
      startDate: '2019',
      endDate: '2021',
      notes: 'Thesis: Interpretable models for time series forecasting.',
    },
  ],
  skills: [
    {
      id: createId(),
      category: 'Technical',
      items: ['Python', 'SQL', 'Pandas', 'scikit-learn', 'Docker', 'TypeScript'],
    },
  ],
  languages: [
    { id: createId(), language: 'Norwegian', level: 'Native' },
    { id: createId(), language: 'English', level: 'Fluent' },
  ],
  projects: [
    {
      id: createId(),
      name: 'CV Builder',
      url: 'github.com/maja/cv-builder',
      startDate: '2026',
      endDate: '2026',
      descriptionHtml:
        '<ul><li>Implemented an ATS-friendly A4 preview that prints pixel-perfect.</li><li>Added live editing with local persistence and section validation.</li></ul>',
    },
  ],
  certifications: [
    {
      id: createId(),
      name: 'Example Certification',
      issuer: 'Example Org',
      date: 'Apr 2024',
      credentialUrl: 'example.org/credential/123',
      descriptionHtml: '<ul><li>Credential focused on applied ML and deployment.</li></ul>',
    },
  ],
};

type EntrySection = Exclude<SectionKey, 'basics'>;

type CVStore = {
  cv: CVData;
  activeSection: SectionKey;
  template: CVTemplateKey;

  setActiveSection: (section: SectionKey) => void;
  setTemplate: (template: CVTemplateKey) => void;

  updateBasics: (partial: Partial<Basics>) => void;
  addEntry: (section: EntrySection) => void;
  removeEntry: (section: EntrySection, id: string) => void;
  updateEntry: {
    (section: 'experience', id: string, partial: Partial<WorkEntry>): void;
    (section: 'education', id: string, partial: Partial<EducationEntry>): void;
    (section: 'skills', id: string, partial: Partial<SkillGroup>): void;
    (section: 'languages', id: string, partial: Partial<LanguageEntry>): void;
    (section: 'projects', id: string, partial: Partial<ProjectEntry>): void;
    (section: 'certifications', id: string, partial: Partial<CertEntry>): void;
  };
  reorderEntries: (section: EntrySection, oldIndex: number, newIndex: number) => void;
  reset: () => void;
};

function move<T>(arr: T[], from: number, to: number): T[] {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  if (item === undefined) return arr;
  next.splice(to, 0, item);
  return next;
}

function newEntry(section: Exclude<SectionKey, 'basics'>) {
  const id = createId();
  switch (section) {
    case 'experience':
      return {
        id,
        location: '',
        jobTitle: '',
        company: '',
        startDate: '',
        endDate: '',
        descriptionHtml: '<ul><li></li></ul>',
      } satisfies WorkEntry;
    case 'education':
      return {
        id,
        degree: '',
        institution: '',
        location: '',
        startDate: '',
        endDate: '',
        notes: '',
      } satisfies EducationEntry;
    case 'skills':
      return { id, category: '', items: [] } satisfies SkillGroup;
    case 'languages':
      return { id, language: '', level: 'Intermediate' } satisfies LanguageEntry;
    case 'projects':
      return {
        id,
        name: '',
        url: '',
        startDate: '',
        endDate: '',
        descriptionHtml: '<ul><li></li></ul>',
      } satisfies ProjectEntry;
    case 'certifications':
      return {
        id,
        name: '',
        issuer: '',
        date: '',
        credentialUrl: '',
        descriptionHtml: '<ul><li></li></ul>',
      } satisfies CertEntry;
  }
}

function addEntryToCv(cv: CVData, section: EntrySection): CVData {
  const entry = newEntry(section);
  switch (section) {
    case 'experience':
      return { ...cv, experience: [entry as WorkEntry, ...cv.experience] };
    case 'education':
      return { ...cv, education: [entry as EducationEntry, ...cv.education] };
    case 'skills':
      return { ...cv, skills: [entry as SkillGroup, ...cv.skills] };
    case 'languages':
      return { ...cv, languages: [entry as LanguageEntry, ...cv.languages] };
    case 'projects':
      return { ...cv, projects: [entry as ProjectEntry, ...cv.projects] };
    case 'certifications':
      return { ...cv, certifications: [entry as CertEntry, ...cv.certifications] };
  }
}

function removeEntryFromCv(cv: CVData, section: EntrySection, id: string): CVData {
  switch (section) {
    case 'experience':
      return { ...cv, experience: cv.experience.filter((e) => e.id !== id) };
    case 'education':
      return { ...cv, education: cv.education.filter((e) => e.id !== id) };
    case 'skills':
      return { ...cv, skills: cv.skills.filter((e) => e.id !== id) };
    case 'languages':
      return { ...cv, languages: cv.languages.filter((e) => e.id !== id) };
    case 'projects':
      return { ...cv, projects: cv.projects.filter((e) => e.id !== id) };
    case 'certifications':
      return { ...cv, certifications: cv.certifications.filter((e) => e.id !== id) };
  }
}

function reorderEntryArray<T>(arr: T[], oldIndex: number, newIndex: number): T[] {
  return move(arr, oldIndex, newIndex);
}

function reorderEntriesInCv(cv: CVData, section: EntrySection, oldIndex: number, newIndex: number): CVData {
  switch (section) {
    case 'experience':
      return { ...cv, experience: reorderEntryArray(cv.experience, oldIndex, newIndex) };
    case 'education':
      return { ...cv, education: reorderEntryArray(cv.education, oldIndex, newIndex) };
    case 'skills':
      return { ...cv, skills: reorderEntryArray(cv.skills, oldIndex, newIndex) };
    case 'languages':
      return { ...cv, languages: reorderEntryArray(cv.languages, oldIndex, newIndex) };
    case 'projects':
      return { ...cv, projects: reorderEntryArray(cv.projects, oldIndex, newIndex) };
    case 'certifications':
      return { ...cv, certifications: reorderEntryArray(cv.certifications, oldIndex, newIndex) };
  }
}

function updateEntryInCv(cv: CVData, section: EntrySection, id: string, partial: unknown): CVData {
  switch (section) {
    case 'experience': {
      const p = partial as Partial<WorkEntry>;
      return {
        ...cv,
        experience: cv.experience.map((e) => (e.id === id ? { ...e, ...p } : e)),
      };
    }
    case 'education': {
      const p = partial as Partial<EducationEntry>;
      return {
        ...cv,
        education: cv.education.map((e) => (e.id === id ? { ...e, ...p } : e)),
      };
    }
    case 'skills': {
      const p = partial as Partial<SkillGroup>;
      return {
        ...cv,
        skills: cv.skills.map((e) => (e.id === id ? { ...e, ...p } : e)),
      };
    }
    case 'languages': {
      const p = partial as Partial<LanguageEntry>;
      return {
        ...cv,
        languages: cv.languages.map((e) => (e.id === id ? { ...e, ...p } : e)),
      };
    }
    case 'projects': {
      const p = partial as Partial<ProjectEntry>;
      return {
        ...cv,
        projects: cv.projects.map((e) => (e.id === id ? { ...e, ...p } : e)),
      };
    }
    case 'certifications': {
      const p = partial as Partial<CertEntry>;
      return {
        ...cv,
        certifications: cv.certifications.map((e) => (e.id === id ? { ...e, ...p } : e)),
      };
    }
  }
}

export const useCVStore = create<CVStore>()(
  persist(
    (set) => ({
      cv: defaultCV,
      activeSection: 'basics',
      template: 'classic',

      setActiveSection: (activeSection) => set({ activeSection }),
      setTemplate: (template) => set({ template }),

      updateBasics: (partial) =>
        set((s) => ({
          cv: {
            ...s.cv,
            basics: { ...s.cv.basics, ...partial },
          },
        })),

      addEntry: (section) => set((s) => ({ cv: addEntryToCv(s.cv, section) })),

      removeEntry: (section, id) => set((s) => ({ cv: removeEntryFromCv(s.cv, section, id) })),

      updateEntry: ((section: EntrySection, id: string, partial: unknown) =>
        set((s) => ({
          cv: updateEntryInCv(s.cv, section, id, partial),
        }))) as CVStore['updateEntry'],

      reorderEntries: (section, oldIndex, newIndex) =>
        set((s) => ({ cv: reorderEntriesInCv(s.cv, section, oldIndex, newIndex) })),

      reset: () =>
        set({
          cv: defaultCV,
          activeSection: 'basics',
          template: 'classic',
        }),
    }),
    { name: 'cv-store' },
  ),
);

