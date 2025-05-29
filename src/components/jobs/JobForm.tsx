import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';
import { Job, JobStatus, JobImage, JobTag } from '../../types';
import { useJobs } from '../../context/JobContext';
import { createJobImage, getStatusColor, getStatusTextColor } from '../../utils/helpers';

interface JobFormProps {
  job: Job;
  onSave: (job: Job) => void;
  onCancel: () => void;
}

const statuses: JobStatus[] = ['Applied', 'Interviewing', 'Offered', 'Rejected'];

const JobForm: React.FC<JobFormProps> = ({ job, onSave, onCancel }) => {
  const { tags } = useJobs();
  const [form, setForm] = useState<Job>(job);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedTags, setSelectedTags] = useState<JobTag[]>(job.tags);
  
  useEffect(() => {
    setForm(job);
    setSelectedTags(job.tags);
  }, [job]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    try {
      const newImages: JobImage[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const newImage = await createJobImage(files[i]);
        newImages.push(newImage);
      }
      
      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...newImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    }
    
    // Clear the input value so the same file can be uploaded again
    e.target.value = '';
  };
  
  const handleRemoveImage = (id: string) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter(image => image.id !== id)
    }));
  };
  
  const toggleTag = (tag: JobTag) => {
    setSelectedTags(prev => {
      const exists = prev.some(t => t.id === tag.id);
      
      if (exists) {
        return prev.filter(t => t.id !== tag.id);
      } else {
        return [...prev, tag];
      }
    });
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!form.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    
    if (!form.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    
    if (!form.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    if (!form.applicationDate) {
      newErrors.applicationDate = 'Application date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const updatedJob: Job = {
      ...form,
      tags: selectedTags,
      updatedAt: Date.now()
    };
    
    onSave(updatedJob);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={form.title}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.title 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Software Engineer"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Company *
            </label>
            <input
              type="text"
              name="company"
              id="company"
              value={form.company}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.company 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="Acme Inc."
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600">{errors.company}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location *
            </label>
            <input
              type="text"
              name="location"
              id="location"
              value={form.location}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.location 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
              placeholder="New York, NY or Remote"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="applicationDate" className="block text-sm font-medium text-gray-700">
              Application Date *
            </label>
            <input
              type="date"
              name="applicationDate"
              id="applicationDate"
              value={form.applicationDate}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                errors.applicationDate 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.applicationDate && (
              <p className="mt-1 text-sm text-red-600">{errors.applicationDate}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              id="status"
              value={form.status}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            name="notes"
            id="notes"
            rows={4}
            value={form.notes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Add any details about the job, interview process, contacts, etc."
          />
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          {tags.length === 0 ? (
            <p className="text-sm text-gray-500">No tags available. Create tags in the filter panel.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedTags.some(t => t.id === tag.id)
                      ? `text-white`
                      : `text-gray-700 bg-gray-100 hover:bg-gray-200`
                  }`}
                  style={{
                    backgroundColor: selectedTags.some(t => t.id === tag.id) 
                      ? tag.color 
                      : undefined
                  }}
                >
                  {tag.name}
                  {selectedTags.some(t => t.id === tag.id) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="flex items-center space-x-2">
            <label 
              htmlFor="image-upload" 
              className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Images
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="sr-only"
                onChange={handleImageUpload}
              />
            </label>
          </div>
          
          {form.images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.images.map(image => (
                <div key={image.id} className="relative group">
                  <div className="aspect-w-1 aspect-h-1 rounded-md overflow-hidden bg-gray-200">
                    <img 
                      src={image.data} 
                      alt={image.name}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 truncate">{image.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Save Job
        </button>
      </div>
    </form>
  );
};

export default JobForm;