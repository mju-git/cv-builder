CV Builder — Complete Cursor Build Plan
Stack

React + TypeScript + Vite
Zustand — state + localStorage persistence
Tailwind CSS — styling
@dnd-kit/core + @dnd-kit/sortable — drag to reorder
Tiptap — rich text editor (bold, italic, links, bullet lists)
react-to-print — PDF export

Install everything at once:
bashnpm create vite@latest cv-builder -- --template react-ts
cd cv-builder
npm install zustand @dnd-kit/core @dnd-kit/sortable @tiptap/react @tiptap/starter-kit @tiptap/extension-link react-to-print tailwindcss postcss autoprefixer
npx tailwindcss init -p

Phase 1 — Types (src/types/cv.types.ts)

Cursor prompt: "Create src/types/cv.types.ts with the following complete type definitions. Do not add anything extra."

tsexport interface Basics {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary?: string;
}

export interface WorkEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;        // free text, e.g. "Present"
  descriptionHtml: string; // Tiptap outputs HTML
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  notes?: string;         // e.g. "GPA 1.4", thesis title
}

export interface SkillGroup {
  id: string;
  category: string;       // e.g. "Languages", "Tools"
  items: string[];        // comma-separated tags
}

export interface LanguageEntry {
  id: string;
  language: string;
  level: 'Native' | 'Fluent' | 'Advanced' | 'Intermediate' | 'Basic';
}

export interface ProjectEntry {
  id: string;
  name: string;
  url?: string;
  startDate: string;
  endDate: string;
  descriptionHtml: string;
}

export interface CertEntry {
  id: string;
  name: string;
  issuer: string;
  date: string;           // free text, e.g. "Apr 2024"
  credentialUrl?: string;
  descriptionHtml: string;
}

export type SectionKey =
  | 'basics'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certifications';

export interface CVData {
  basics: Basics;
  experience: WorkEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  languages: LanguageEntry[];
  projects: ProjectEntry[];
  certifications: CertEntry[];
}

Phase 2 — Store (src/store/cvStore.ts)

Cursor prompt: "Using the types from src/types/cv.types.ts, create a Zustand store at src/store/cvStore.ts with localStorage persistence. Include these actions: updateBasics, addEntry, removeEntry, updateEntry, reorderEntries. Pre-fill with realistic mock data so the preview looks good immediately."

Key implementation notes to include in your prompt:

reorderEntries(section, oldIndex, newIndex) — used by dnd-kit
updateEntry(section, id, partial) — merges partial update into the matching entry by id
All array entries must have a unique id (use crypto.randomUUID())
Persist the entire cv object under the key 'cv-store'


Phase 3 — App shell (src/components/layout/)

Cursor prompt: "Create the 3-panel layout using CSS grid: 160px 1fr 340px. Left = SectionNav, Middle = EditorPanel, Right = PreviewPanel (sticky, doesn't scroll). Use Tailwind. Include a top Toolbar with 'Template' and 'Export PDF' buttons."

SectionNav.tsx — renders a nav item per section. Each item shows:

A colored dot: gray = empty, green = has content, purple = currently active
Clicking sets activeSection in the store
A "+ Add section" button at the bottom (stretch goal: reorder sections themselves)

EditorPanel.tsx — renders the correct section component based on activeSection. Wrap in <Suspense> with lazy imports so unused sections don't load upfront.
PreviewPanel.tsx — renders <CVDocument ref={printRef} /> inside a fixed-ratio A4 container. Pass printRef up to Toolbar for the print button.

Phase 4 — Rich text field (src/components/editor/fields/RichTextField.tsx)

Cursor prompt: "Create a Tiptap rich text editor component. Use StarterKit and the Link extension. Show a small toolbar above the input with buttons for: Bold, Italic, Bullet list, Link. On change, call onChange(editor.getHTML()). Accept value: string as initial HTML. Style with Tailwind — minimal, matches the rest of the form."

This component is reused for WorkEntry.descriptionHtml, ProjectEntry.descriptionHtml, and CertEntry.descriptionHtml.

Phase 5 — Editor sections (src/components/editor/sections/)
Build these one at a time. For each, give Cursor this prompt pattern:

"Using the store from cvStore.ts and types from cv.types.ts, build [Name]Section.tsx. Each entry should be an expandable card (collapsed shows job title + company, expanded shows all fields). Include a drag handle using @dnd-kit/sortable on the card. Include an 'Add entry' button at the bottom. Use RichTextField for description fields."

Section-by-section field list:
BasicsSection — no drag (single entry): name, title, email, phone, location, linkedin, website, summary (plain textarea with sentence counter — warn after 5 sentences)
ExperienceSection — draggable cards: jobTitle, company, location, startDate, endDate, descriptionHtml (RichTextField)
EducationSection — draggable cards: degree, institution, location, startDate, endDate, notes (plain text)
SkillsSection — draggable cards: category (text), items (tag input — type a skill and press Enter to add, click × to remove)
LanguagesSection — draggable cards: language, level (dropdown with the 5 levels from the type)
ProjectsSection — draggable cards: name, url, startDate, endDate, descriptionHtml (RichTextField)
CertificationsSection — draggable cards: name, issuer, date, credentialUrl, descriptionHtml (RichTextField)

Phase 6 — CV Preview (src/components/preview/CVDocument.tsx)

Cursor prompt: "Create CVDocument.tsx as a forwardRef component (ref needed for printing). It reads from the Zustand store directly. Render an A4 page (794px wide, auto height). Use only standard HTML — no tables, no CSS columns, no floats. All text must be selectable (ATS requirement). Follow the structure below exactly."

Render order and ATS rules:
[Name] — largest text on page, font-size ~24px
[Title] — directly below, muted
[email] · [phone] · [location] · [linkedin] · [website]  — one line, separator dots
────────────────────────────────────────────────
EXPERIENCE
  [Job Title]                        [StartDate – EndDate]
  [Company] · [Location]
  • bullet from Tiptap HTML (render innerHTML directly)

EDUCATION
  [Degree]                           [StartDate – EndDate]
  [Institution] · [Location]
  [Notes if present]

SKILLS
  [Category]: item, item, item

LANGUAGES
  [Language] — [Level]

PROJECTS
  [Name] ([URL if present])          [StartDate – EndDate]
  • description bullets

CERTIFICATIONS
  [Name]                             [Date]
  [Issuer] · [credentialUrl if present]
  • description
ATS enforcement rules to include in the prompt:

No <table>, no position: absolute on text, no column-count
Render Tiptap HTML with dangerouslySetInnerHTML — Tiptap outputs clean <ul><li> which ATS parsers handle correctly
Section headings must be plain text in a <h2> tag, not images or icons
Page overflow: add a visual indicator ("Page 2") but don't hard-break — let it flow naturally and print across pages


Phase 7 — PDF export (src/utils/exportPdf.ts)

Cursor prompt: "Add a useReactToPrint hook in Toolbar.tsx that triggers printing of the CVDocument ref. Add a @media print CSS block in index.css that hides everything except the preview panel, removes all padding/borders from the A4 container, and sets the page size to A4 portrait."

css@media print {
  body * { visibility: hidden; }
  #cv-document, #cv-document * { visibility: visible; }
  #cv-document { position: absolute; top: 0; left: 0; width: 100%; }
  @page { size: A4 portrait; margin: 15mm; }
}

Phase 8 — Validation (src/utils/cvValidation.ts)

Cursor prompt: "Create a validation utility that takes CVData and returns a list of { section, message, severity: 'warning' | 'error' } objects. Show these as small inline warnings in the editor, not blocking alerts."

Rules to validate:
CheckSeverityEmail formaterrorSummary over 5 sentenceswarningAny job description under 20 wordswarningDate format inconsistent across entrieswarningDuplicate skill itemswarningMissing phone or emailerrorExperience entries not in reverse-chron orderwarning

Phase 9 — Second template (stretch)
Once Classic works, add a Modern.tsx template in src/components/preview/templates/. The Toolbar "Template" button toggles a template value in the store. CVDocument.tsx reads it and renders the matching template — same data, different layout/fonts.

Cursor workflow tips

Always open the relevant files with @filename before each prompt so Cursor has the types in context
Build and check in the browser after each phase — don't chain multiple phases without testing
If Cursor drifts from the types, paste the relevant interface directly into the prompt as a reminder
The order matters: types → store → layout → fields → sections → preview → export. Never skip ahead.