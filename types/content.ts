export interface KnowledgeSystem {
  name: string;
  slug: string;
  auxiliary: string;
  summary: string;
  origin: string;
  concepts: string[];
  classics: string[];
  relatedSystems: string[];
}

export interface Concept {
  name: string;
  slug: string;
  aliases: string[];
  system: string;
  era: string;
  summary: string;
  core: string[];
  history: string;
  people: string[];
  classics: string[];
  techniques: string[];
  related: string[];
  references: string[];
}

export interface ThoughtEvolution {
  period: string;
  range: string;
  thesis: string;
  summary: string;
  ideas: string[];
}

export interface Classic {
  title: string;
  slug: string;
  dynasty: string;
  author: string;
  category: string;
  summary: string;
  status: string;
  contents: string[];
  people: string[];
  concepts: string[];
  techniques: string[];
}

export interface DeductionSystem {
  name: string;
  slug: string;
  description: string;
  basis: string;
  status: "available" | "planned";
}

export interface PersonProfile {
  name: string;
  era: string;
  role: string;
  summary: string;
  classics: string[];
  schools: string[];
  concepts: string[];
  sources: string[];
}

export interface SchoolProfile {
  name: string;
  era: string;
  summary: string;
  people: string[];
  classics: string[];
  concepts: string[];
  sources: string[];
}
