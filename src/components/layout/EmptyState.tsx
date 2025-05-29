import React from 'react';
import { Briefcase, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddJob: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddJob }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <Briefcase className="h-8 w-8 text-blue-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h3>
      <p className="text-gray-500 max-w-md mb-6">
        Get started by adding your first job application to track your progress.
      </p>
      <button
        onClick={onAddJob}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Your First Job
      </button>
    </div>
  );
};

export default EmptyState;