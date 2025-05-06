import React, { useState } from 'react';
import { createEmptyJob } from './utils/helpers';
import { Job } from './types';
import { JobProvider, useJobs } from './context/JobContext';

import Header from './components/layout/Header';
import FilterBar from './components/filters/FilterBar';
import TagFilterPanel from './components/filters/TagFilterPanel';
import JobGrid from './components/jobs/JobGrid';
import JobForm from './components/jobs/JobForm';
import JobDetail from './components/jobs/JobDetail';
import ImportModal from './components/modals/ImportModal';
import ConfirmModal from './components/modals/ConfirmModal';

type View = 'list' | 'form' | 'detail';

const Dashboard: React.FC = () => {
  const { 
    filteredJobs, 
    addNewJob, 
    updateExistingJob, 
    removeJob, 
    currentJob, 
    setCurrentJob,
    loading
  } = useJobs();
  
  const [view, setView] = useState<View>('list');
  const [isTagFilterOpen, setIsTagFilterOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<string | null>(null);
  
  const handleAddJob = () => {
    setCurrentJob(createEmptyJob());
    setView('form');
  };
  
  const handleEditJob = (job: Job) => {
    setCurrentJob(job);
    setView('form');
  };
  
  const handleViewJob = (job: Job) => {
    setCurrentJob(job);
    setView('detail');
  };
  
  const handleSaveJob = async (job: Job) => {
    try {
      if (job.id === currentJob?.id) {
        await updateExistingJob(job);
      } else {
        await addNewJob(job);
      }
      setView('list');
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };
  
  const handleDeleteConfirm = (id: string) => {
    setJobToDelete(id);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleDeleteJob = async () => {
    if (!jobToDelete) return;
    
    try {
      await removeJob(jobToDelete);
      setIsConfirmDeleteOpen(false);
      setJobToDelete(null);
      
      // If we're in detail view and deleting the current job, go back to list
      if (view === 'detail' && currentJob?.id === jobToDelete) {
        setView('list');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        onAddJob={handleAddJob} 
        onImport={() => setIsImportModalOpen(true)} 
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {view === 'list' && (
          <>
            <FilterBar onShowFilterPanel={() => setIsTagFilterOpen(true)} />
            <JobGrid 
              jobs={filteredJobs}
              onAddJob={handleAddJob}
              onEditJob={handleEditJob}
              onDeleteJob={handleDeleteConfirm}
              onViewJob={handleViewJob}
            />
          </>
        )}
        
        {view === 'form' && currentJob && (
          <JobForm
            job={currentJob}
            onSave={handleSaveJob}
            onCancel={() => setView('list')}
          />
        )}
        
        {view === 'detail' && currentJob && (
          <JobDetail
            job={currentJob}
            onBack={() => setView('list')}
            onEdit={handleEditJob}
            onDelete={handleDeleteConfirm}
          />
        )}
      </main>
      
      <TagFilterPanel 
        isOpen={isTagFilterOpen} 
        onClose={() => setIsTagFilterOpen(false)} 
      />
      
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
      
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        title="Delete Job"
        message="Are you sure you want to delete this job? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteJob}
        onCancel={() => {
          setIsConfirmDeleteOpen(false);
          setJobToDelete(null);
        }}
        variant="danger"
      />
    </div>
  );
};

function App() {
  return (
    <JobProvider>
      <Dashboard />
    </JobProvider>
  );
}

export default App;