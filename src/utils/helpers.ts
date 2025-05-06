import { Job, JobStatus, JobImage, JobTag } from '../types';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format date to YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Parse date from YYYY-MM-DD to Date object
export const parseDate = (dateString: string): Date => {
  return new Date(dateString);
};

// Create a new empty job with default values
export const createEmptyJob = (): Job => {
  const id = generateId();
  const now = Date.now();
  
  return {
    id,
    title: '',
    company: '',
    location: '',
    applicationDate: formatDate(new Date()),
    status: 'Applied',
    notes: '',
    images: [],
    tags: [],
    createdAt: now,
    updatedAt: now
  };
};

// Get status color
export const getStatusColor = (status: JobStatus): string => {
  switch (status) {
    case 'Applied':
      return 'bg-blue-500';
    case 'Interviewing':
      return 'bg-purple-500';
    case 'Offered':
      return 'bg-green-500';
    case 'Rejected':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};

// Get status text color
export const getStatusTextColor = (status: JobStatus): string => {
  switch (status) {
    case 'Applied':
      return 'text-blue-500';
    case 'Interviewing':
      return 'text-purple-500';
    case 'Offered':
      return 'text-green-500';
    case 'Rejected':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Create a job image from a file
export const createJobImage = async (file: File): Promise<JobImage> => {
  const data = await fileToBase64(file);
  return {
    id: generateId(),
    name: file.name,
    data,
    createdAt: Date.now()
  };
};

// Default tags with predefined colors
export const defaultTags: JobTag[] = [
  { id: generateId(), name: 'Remote', color: '#3b82f6' },
  { id: generateId(), name: 'Full-time', color: '#10b981' },
  { id: generateId(), name: 'Part-time', color: '#f59e0b' },
  { id: generateId(), name: 'Contract', color: '#8b5cf6' },
  { id: generateId(), name: 'Internship', color: '#ec4899' }
];

// Search jobs by query
export const searchJobs = (jobs: Job[], query: string): Job[] => {
  if (!query.trim()) return jobs;
  
  const lowerQuery = query.toLowerCase();
  return jobs.filter(job => 
    job.title.toLowerCase().includes(lowerQuery) ||
    job.company.toLowerCase().includes(lowerQuery) ||
    job.location.toLowerCase().includes(lowerQuery) ||
    job.notes.toLowerCase().includes(lowerQuery)
  );
};

// Filter jobs by status
export const filterJobsByStatus = (jobs: Job[], status: JobStatus | 'All'): Job[] => {
  if (status === 'All') return jobs;
  return jobs.filter(job => job.status === status);
};

// Filter jobs by tag
export const filterJobsByTag = (jobs: Job[], tagId: string | null): Job[] => {
  if (!tagId) return jobs;
  return jobs.filter(job => job.tags.some(tag => tag.id === tagId));
};

// Sort jobs by field
export const sortJobs = (
  jobs: Job[],
  field: keyof Job | 'default',
  direction: 'asc' | 'desc'
): Job[] => {
  const sortedJobs = [...jobs];
  
  if (field === 'default') {
    return sortedJobs.sort((a, b) => 
      direction === 'desc' ? b.updatedAt - a.updatedAt : a.updatedAt - b.updatedAt
    );
  }
  
  if (field === 'applicationDate') {
    return sortedJobs.sort((a, b) => {
      const dateA = new Date(a.applicationDate).getTime();
      const dateB = new Date(b.applicationDate).getTime();
      return direction === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }
  
  return sortedJobs.sort((a, b) => {
    const valA = a[field] as string;
    const valB = b[field] as string;
    return direction === 'desc' 
      ? valB.localeCompare(valA)
      : valA.localeCompare(valB);
  });
};

// Download a file
export const downloadFile = (data: string, fileName: string, type: string): void => {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};