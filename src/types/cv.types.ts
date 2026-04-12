export interface Basics {
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
  endDate: string; // free text, e.g. "Present"
  descriptionHtml: string; // Tiptap outputs HTML
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  notes?: string; // e.g. "GPA 1.4", thesis title
}

export interface SkillGroup {
  id: string;
  category: string; // e.g. "Languages", "Tools"
  items: string[]; // comma-separated tags
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
  date: string; // free text, e.g. "Apr 2024"
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

export type CVTemplateKey = 'classic' | 'modern';

export interface CVData {
  basics: Basics;
  experience: WorkEntry[];
  education: EducationEntry[];
  skills: SkillGroup[];
  languages: LanguageEntry[];
  projects: ProjectEntry[];
  certifications: CertEntry[];
}

