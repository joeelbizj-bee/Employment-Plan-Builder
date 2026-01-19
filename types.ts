
export interface EmploymentPlanData {
  firstName: string;
  lastName: string;
  field: string;
  position: string;
  company: string;
  companyUrl: string;
  requirements: string[];
  location: string;
  reason: string;
  jobOptions: string[];
  selectedJobOption: string;
  signatureData: string | null;
  date: string;
}

export enum PageType {
  PLANNER = 'planner',
  PREVIEW = 'preview'
}
