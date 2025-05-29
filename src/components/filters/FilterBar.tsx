import React from 'react';
import { Filter, Search, RotateCcw } from 'lucide-react';
import { JobStatus, JobTag } from '../../types';
import { useJobs } from '../../context/JobContext';

const statuses: JobStatus[] = ['Applied', 'Interviewing', 'Offered', 'Rejected'];

interface FilterBarProps {
  onShowFilterPanel: () => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onShowFilterPanel }) => {
  const { filter, setFilter } = useJobs();
  
  const handleStatusChange = (status: JobStatus | 'All') => {
    setFilter(prev => ({ ...prev, status }));
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(prev => ({ ...prev, search: e.target.value }));
  };
  
  const handleReset = () => {
    setFilter({
      status: 'All',
      tagId: null,
      search: '',
      sort: {
        field: 'default',
        direction: 'desc'
      }
    });
  };
  
  const hasActiveFilters = 
    filter.status !== 'All' || 
    filter.tagId !== null || 
    filter.search !== '';
  
  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search jobs..."
            value={filter.search}
            onChange={handleSearchChange}
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onShowFilterPanel}
            className={`inline-flex items-center px-3 py-2 border ${
              filter.tagId ? 'border-blue-500 text-blue-700 bg-blue-50' : 'border-gray-300 text-gray-700 bg-white'
            } rounded-md text-sm font-medium leading-4 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          >
            <Filter className="h-4 w-4 mr-1" />
            <span>Tags</span>
            {filter.tagId && <span className="ml-1 flex h-2 w-2 rounded-full bg-blue-500"></span>}
          </button>
          
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium leading-4 text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
      
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-700">Status:</span>
        <button
          onClick={() => handleStatusChange('All')}
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            filter.status === 'All'
              ? 'bg-gray-200 text-gray-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          } transition-colors`}
        >
          All
        </button>
        
        {statuses.map(status => (
          <button
            key={status}
            onClick={() => handleStatusChange(status)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              filter.status === status
                ? `${
                    status === 'Applied' ? 'bg-blue-100 text-blue-800' :
                    status === 'Interviewing' ? 'bg-purple-100 text-purple-800' :
                    status === 'Offered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } transition-colors`}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;