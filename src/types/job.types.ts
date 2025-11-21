export enum ContractType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  CONTRACT = "CONTRACT",
  INTERNSHIP = "INTERNSHIP",
  FREELANCE = "FREELANCE",
}

export interface JobPostingPayload {
  title: string;
  description: string;
  location: string;
  salary: number | null;
  banner_image_url?: string;
  preSelectionEnabled: boolean;
  preSelectionTestId?: number | null;
}
