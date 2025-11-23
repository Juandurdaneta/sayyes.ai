export enum ProposalMode {
  LIGHT = 'LIGHT',
  FULL = 'FULL'
}

export enum ProjectStatus {
  LEAD = 'Lead',
  CONTRACT_SIGNED = 'Contract Signed',
  PLANNING = 'Planning',
}

export interface IntakeData {
  coupleName: string;
  email: string;
  eventDate: string;
  guestCount: string; // Range e.g., "100-120"
  budgetBand: string; // e.g., "$60k - $80k"
  location: string;
  vibeTags: string[]; // e.g., "Romantic", "Modern"
  notes: string;
}

export interface StyleDNA {
  palette: string[];
  adjectives: string[];
  motifs: string[];
  venueTypes: string[];
  summary: string;
}

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'gallery' | 'stats' | 'budget_chart';
  data?: any;
}

export interface ProposalPackage {
  id: string;
  mode: ProposalMode;
  title: string;
  createdAt: string;
  sections: ProposalSection[];
  isTeaser: boolean;
  styleDNA: StyleDNA;
}

export interface Project {
  id: string;
  clientName: string;
  status: ProjectStatus;
  intakeData?: IntakeData;
  styleDNA?: StyleDNA;
  proposals: ProposalPackage[];
}

export type ViewState = 
  | { view: 'DASHBOARD' }
  | { view: 'INTAKE_FORM'; projectId?: string }
  | { view: 'PROPOSAL_STUDIO'; projectId: string }
  | { view: 'PROPOSAL_PREVIEW'; proposal: ProposalPackage };
