import React, { createContext, useContext, useEffect, useState } from 'react';
import { Job, JobStatus, JobTag } from '../types';
import { 
  addJob, 
  updateJob, 
  deleteJob, 
  getAllJobs, 
  initDB, 
  getAllTags, 
  addTag, 
  deleteTag,
  exportData,
  importData
} from '../utils/db';
import { 
  createEmptyJob, 
  defaultTags, 
  filterJobsByStatus,
  filterJobsByTag, 
  searchJobs, 
  sortJobs, 
  downloadFile
} from '../utils/helpers';

interface JobContextType {
  jobs: Job[];
  loading: boolean;
  error: string | null;
  currentJob: Job | null;
  tags: JobTag[];
  filter: {
    status: JobStatus | 'All';
    tagId: string | null;
    search: string;
    sort: {
      field: keyof Job | 'default';
      direction: 'asc' | 'desc';
    };
  };
  filteredJobs: Job[];
  setFilter: React.Dispatch<React.SetStateAction<JobContextType['filter']>>;
  addNewJob: (job: Job) => Promise<void>;
  updateExistingJob: (job: Job) => Promise<void>;
  removeJob: (id: string) => Promise<void>;
  getJob: (id: string) => Promise<Job | null>;
  setCurrentJob: (job: Job | null) => void;
  createNewTag: (tag: JobTag) => Promise<void>;
  removeTag: (id: string) => Promise<void>;
  exportToJson: () => Promise<void>;
  importFromJson: (jsonData: string) => Promise<void>;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tags, setTags] = useState<JobTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [filter, setFilter] = useState<JobContextType['filter']>({
    status: 'All',
    tagId: null,
    search: '',
    sort: {
      field: 'default',
      direction: 'desc'
    }
  });

  // Initialize the database and load data
  useEffect(() => {
    const initialize = async () => {
      try {
        await initDB();
        
        // Load jobs
        const jobsData = await getAllJobs();
        setJobs(jobsData);
        
        // Load or initialize tags
        let tagsData = await getAllTags();
        
        // If no tags exist, add default tags
        if (tagsData.length === 0) {
          for (const tag of defaultTags) {
            await addTag(tag);
          }
          tagsData = defaultTags;
        }
        
        setTags(tagsData);
        setLoading(false);
      } catch (err) {
        setError('Failed to initialize database');
        setLoading(false);
      }
    };
    
    initialize();
  }, []);

  // Calculate filtered jobs based on filter criteria
  const filteredJobs = React.useMemo(() => {
    let filtered = [...jobs];
    
    // Apply status filter
    filtered = filterJobsByStatus(filtered, filter.status);
    
    // Apply tag filter
    filtered = filterJobsByTag(filtered, filter.tagId);
    
    // Apply search
    filtered = searchJobs(filtered, filter.search);
    
    // Apply sorting
    filtered = sortJobs(
      filtered,
      filter.sort.field,
      filter.sort.direction
    );
    
    return filtered;
  }, [jobs, filter]);

  // Add a new job
  const addNewJob = async (job: Job): Promise<void> => {
    try {
      await addJob(job);
      setJobs(prevJobs => [...prevJobs, job]);
    } catch (err) {
      setError('Failed to add job');
      throw err;
    }
  };

  // Update an existing job
  const updateExistingJob = async (job: Job): Promise<void> => {
    try {
      await updateJob(job);
      setJobs(prevJobs => 
        prevJobs.map(j => j.id === job.id ? job : j)
      );
    } catch (err) {
      setError('Failed to update job');
      throw err;
    }
  };

  // Remove a job
  const removeJob = async (id: string): Promise<void> => {
    try {
      await deleteJob(id);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
    } catch (err) {
      setError('Failed to delete job');
      throw err;
    }
  };

  // Get a job by ID
  const getJob = async (id: string): Promise<Job | null> => {
    try {
      const job = jobs.find(job => job.id === id) || null;
      return job;
    } catch (err) {
      setError('Failed to get job');
      throw err;
    }
  };

  // Create a new tag
  const createNewTag = async (tag: JobTag): Promise<void> => {
    try {
      await addTag(tag);
      setTags(prevTags => [...prevTags, tag]);
    } catch (err) {
      setError('Failed to add tag');
      throw err;
    }
  };

  // Remove a tag
  const removeTag = async (id: string): Promise<void> => {
    try {
      await deleteTag(id);
      setTags(prevTags => prevTags.filter(tag => tag.id !== id));
      
      // Remove tag from all jobs
      const updatedJobs = jobs.map(job => {
        if (job.tags.some(tag => tag.id === id)) {
          return {
            ...job,
            tags: job.tags.filter(tag => tag.id !== id),
            updatedAt: Date.now()
          };
        }
        return job;
      });
      
      // Update jobs in database
      for (const job of updatedJobs) {
        if (job.tags.length !== jobs.find(j => j.id === job.id)?.tags.length) {
          await updateJob(job);
        }
      }
      
      setJobs(updatedJobs);
    } catch (err) {
      setError('Failed to delete tag');
      throw err;
    }
  };

  // Export data to JSON
  const exportToJson = async (): Promise<void> => {
    try {
      const data = await exportData();
      downloadFile(
        data,
        `job-tracker-export-${new Date().toISOString().split('T')[0]}.json`,
        'application/json'
      );
    } catch (err) {
      setError('Failed to export data');
      throw err;
    }
  };

  // Import data from JSON
  const importFromJson = async (jsonData: string): Promise<void> => {
    try {
      await importData(jsonData);
      
      // Reload data
      const jobsData = await getAllJobs();
      const tagsData = await getAllTags();
      
      setJobs(jobsData);
      setTags(tagsData);
    } catch (err) {
      setError('Failed to import data');
      throw err;
    }
  };

  return (
    <JobContext.Provider
      value={{
        jobs,
        loading,
        error,
        currentJob,
        tags,
        filter,
        filteredJobs,
        setFilter,
        addNewJob,
        updateExistingJob,
        removeJob,
        getJob,
        setCurrentJob,
        createNewTag,
        removeTag,
        exportToJson,
        importFromJson
      }}
    >
      {children}
    </JobContext.Provider>
  );
};

export const useJobs = (): JobContextType => {
  const context = useContext(JobContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};