export interface IssueLink {
  url: string;
  text: string;
}

export interface IssueItem {
  title?: string;
  content: string;
  links: IssueLink[];
  images?: string[];
}

export interface Section {
  id: string;
  title: string;
  items: IssueItem[];
}

export interface WeeklyIssue {
  number: number;
  title: string;
  date: string;
  coverImage?: string;
  coverCaption?: string;
  summary?: string;
  sections: Section[];
  sourceUrl: string;
  githubUrl: string;
}

export interface ManifestIssue {
  number: number;
  title: string;
  date: string;
  coverImage?: string;
  summary?: string;
  sourceUrl: string;
}

export interface Manifest {
  latest: number;
  syncedAt: string;
  total: number;
  issues: ManifestIssue[];
}
