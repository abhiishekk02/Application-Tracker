import React from 'react';
import { Job } from '../../types';
import JobCard from './JobCard';
import EmptyState from '../layout/EmptyState';

interface JobGridProps {
  jobs: Job[];
  onAddJob: () => void;
  onEditJob: (job: Job) => void;
  onDeleteJob: (id: string) => void;
  onViewJob: (job: Job) => void;
}

const JobGrid: React.FC<JobGridProps> = ({ 
  jobs, 
  onAddJob, 
  onEditJob, 
  onDeleteJob,
  onViewJob
}) => {
  if (jobs.length === 0) {
    return <EmptyState onAddJob={onAddJob} />;
  }

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onEdit={onEditJob}
          onDelete={onDeleteJob}
          onView={onViewJob}
        />
      ))}
    </div>
  );
};

export default JobGrid;