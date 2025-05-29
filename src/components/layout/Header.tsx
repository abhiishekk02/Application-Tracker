import React from 'react';
import { Plus, FileDown, FileUp, Briefcase } from 'lucide-react';
import { useJobs } from '../../context/JobContext';

interface HeaderProps {
  onAddJob: () => void;
  onImport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddJob, onImport }) => {
  const { exportToJson } = useJobs();
  
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Briefcase className="h-8 w-8 text-blue-500" />
            <h1 className="ml-2 text-xl font-semibold text-gray-900">JobTrack</h1>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={onImport}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FileUp className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Import</span>
            </button>
            
            <button
              onClick={() => exportToJson()}
              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <FileDown className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Export</span>
            </button>
            
            <button
              onClick={onAddJob}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Add Job</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;