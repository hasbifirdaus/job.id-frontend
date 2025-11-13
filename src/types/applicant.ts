export interface IUser {
  id: number;
  name: string;
  email: string;
  dob?: string;
  education?: string;
  address?: string;
  gender?: string;
  profile_image_url?: string;
}

export interface IJob {
  id: number;
  title: string;
  company: { name: string; logo_image_url?: string };
}

export interface Applicant {
  id: number;
  user: IUser;
  job: IJob;
  expected_salary?: number;
  status: "INTERVIEW" | "ACCEPTED" | "REJECTED" | string;
  created_at: string;
  cv_url?: string;
}
