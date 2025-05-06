import React, { useState } from 'react';
import { ArrowLeft, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Job } from '../../types';
import { getStatusColor, getStatusTextColor } from '../../utils/helpers';

interface JobDetailProps {
  job: Job;
  onBack: () => void;
  onEdit: (job: Job) => void;
  onDelete: (id: string) => void;
}

const JobDetail: React.FC<JobDetailProps> = ({ job, onBack, onEdit, onDelete }) => {
  const [activeImage, setActiveImage] = useState<string | null>(
    job.images.length > 0 ? job.images[0].data : null
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };
  
  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span>Back to jobs</span>
          </button>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(job)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </button>
            
            <button
              onClick={() => onDelete(job.id)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-5">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="mt-1 text-lg text-gray-600">{job.company}</p>
            <p className="mt-1 text-sm text-gray-500">{job.location}</p>
          </div>
          
          <div className={`${getStatusColor(job.status)} text-white text-sm font-medium rounded-full px-3 py-1 mt-2 sm:mt-0`}>
            {job.status}
          </div>
        </div>
        
        <div className="mt-6 border-t border-gray-200 pt-5">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Application Date</dt>
              <dd className="mt-1 text-sm text-gray-900">{formatDate(job.applicationDate)}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Tags</dt>
              <dd className="mt-1">
                {job.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {job.tags.map(tag => (
                      <span 
                        key={tag.id} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                        style={{ backgroundColor: `${tag.color}20`, color: tag.color }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No tags</span>
                )}
              </dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Notes</dt>
              <dd className="mt-1 text-sm text-gray-900 whitespace-pre-line">
                {job.notes || 'No notes added'}
              </dd>
            </div>
          </dl>
        </div>
        
        {job.images.length > 0 && (
          <div className="mt-6 border-t border-gray-200 pt-5">
            <h3 className="text-lg font-medium text-gray-900">Images</h3>
            
            <div className="mt-4">
              <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                {activeImage ? (
                  <img 
                    src={activeImage} 
                    alt="Job application" 
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500">No image selected</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {job.images.map(image => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveImage(image.data)}
                    className={`relative rounded overflow-hidden border-2 ${
                      activeImage === image.data ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <img 
                      src={image.data} 
                      alt={image.name}
                      className="w-full h-14 object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 border-t border-gray-200 pt-5 text-sm text-gray-500">
          <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
          <p>Last updated: {new Date(job.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;