import React from 'react';
import { Edit, Trash2, ExternalLink } from 'lucide-react';
import { Job } from '../../types';
import { getStatusColor } from '../../utils/helpers';

interface JobCardProps {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
  onView: (job: Job) => void;
}

const JobCard: React.FC<JobCardProps> = ({ job, onEdit, onDelete, onView }) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden transition-shadow hover:shadow-md">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 
              className="text-lg font-medium text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onView(job)}
            >
              {job.title}
            </h3>
            <p className="text-sm text-gray-600">{job.company}</p>
          </div>
          <div className={`${getStatusColor(job.status)} text-white text-xs font-medium rounded-full px-2.5 py-0.5`}>
            {job.status}
          </div>
        </div>
        
        <div className="mt-2 text-sm text-gray-500">
          <p>{job.location}</p>
          <p>Applied: {new Date(job.applicationDate).toLocaleDateString()}</p>
        </div>
        
        {job.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {job.tags.map(tag => (
              <span 
                key={tag.id} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
                style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}
        
        {job.images.length > 0 && (
          <div className="mt-3 flex -space-x-2 overflow-hidden">
            {job.images.slice(0, 3).map(image => (
              <div key={image.id} className="inline-block h-10 w-10 rounded-md border border-white bg-gray-200 overflow-hidden">
                <img 
                  src={image.data} 
                  alt={image.name}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
            {job.images.length > 3 && (
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white bg-gray-100 text-xs font-medium text-gray-500">
                +{job.images.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        <button
          onClick={() => onView(job)}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          View
        </button>
        
        <div className="flex space-x-3">
          <button
            onClick={() => onEdit(job)}
            className="text-sm text-gray-600 hover:text-gray-900 flex items-center transition-colors"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </button>
          
          <button
            onClick={() => onDelete(job.id)}
            className="text-sm text-red-600 hover:text-red-800 flex items-center transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;