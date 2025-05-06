import React, { useState } from 'react';
import { Plus, X, Check, Tag as TagIcon } from 'lucide-react';
import { JobTag } from '../../types';
import { useJobs } from '../../context/JobContext';
import { generateId } from '../../utils/helpers';

interface TagFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// Predefined colors
const tagColors = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // yellow
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
];

const TagFilterPanel: React.FC<TagFilterPanelProps> = ({ isOpen, onClose }) => {
  const { tags, filter, setFilter, createNewTag, removeTag } = useJobs();
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(tagColors[0]);
  
  const handleSelectTag = (tagId: string) => {
    setFilter(prev => ({
      ...prev,
      tagId: prev.tagId === tagId ? null : tagId
    }));
  };
  
  const handleCreateTag = () => {
    if (newTagName.trim()) {
      const newTag: JobTag = {
        id: generateId(),
        name: newTagName.trim(),
        color: selectedColor
      };
      
      createNewTag(newTag);
      setNewTagName('');
      setSelectedColor(tagColors[0]);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-20 flex items-start justify-end overflow-hidden">
      <div 
        className="fixed inset-0 bg-black bg-opacity-25 transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-sm bg-white shadow-xl p-6 h-full overflow-y-auto transform transition-all">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-medium text-gray-900">Filter by Tags</h3>
          <button
            onClick={onClose}
            className="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <input
              type="text"
              placeholder="New tag name"
              className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
            />
            <button
              onClick={handleCreateTag}
              disabled={!newTagName.trim()}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {tagColors.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  selectedColor === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              >
                {selectedColor === color && (
                  <Check className="h-4 w-4 text-white mx-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {tags.length === 0 ? (
          <div className="text-center py-4">
            <TagIcon className="h-10 w-10 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No tags created yet</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {tags.map(tag => (
              <li key={tag.id} className="flex items-center justify-between">
                <button
                  onClick={() => handleSelectTag(tag.id)}
                  className={`flex-1 flex items-center px-3 py-2 text-sm rounded-md ${
                    filter.tagId === tag.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  } transition-colors`}
                >
                  <span 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: tag.color }}
                  />
                  {tag.name}
                </button>
                <button
                  onClick={() => removeTag(tag.id)}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TagFilterPanel;