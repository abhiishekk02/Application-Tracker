export type JobStatus = 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';

export interface JobTag {
  id: string;
  name: string;
  color: string;
}

export interface JobImage {
  id: string;
  name: string;
  data: string; // Base64 encoded image data
  createdAt: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  applicationDate: string;
  status: JobStatus;
  notes: string;
  images: JobImage[];
  tags: JobTag[];
  createdAt: number;
  updatedAt: number;
}