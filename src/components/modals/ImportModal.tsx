import React, { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { useJobs } from '../../context/JobContext';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose }) => {
  const { importFromJson } = useJobs();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const selectedFile = files[0];
    
    if (selectedFile.type !== 'application/json') {
      setError('Please select a JSON file');
      return;
    }
    
    setFile(selectedFile);
    setError(null);
  };
  
  const handleImport = async () => {
    if (!file) return;
    
    setImporting(true);
    setError(null);
    
    try {
      const fileContent = await file.text();
      await importFromJson(fileContent);
      onClose();
    } catch (err) {
      setError('Failed to import data. The file format may be invalid.');
    } finally {
      setImporting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-20 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Import Data
              </h3>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Import your job data from a previously exported JSON file. This will replace all your current data.
                </p>
                
                <div className="mt-5">
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="file-upload" 
                      className="w-full cursor-pointer flex flex-col items-center px-4 py-6 bg-white text-blue-500 rounded-lg border-2 border-dashed border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Upload className="h-8 w-8" />
                      <p className="mt-2 text-sm font-medium">Click to select file or drag and drop</p>
                      <p className="mt-1 text-xs text-gray-500">.json files only</p>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".json,application/json"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  
                  {file && (
                    <div className="mt-3 flex items-center text-sm text-gray-600">
                      <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Selected file: {file.name}
                      </div>
                    </div>
                  )}
                  
                  {error && (
                    <div className="mt-3 flex items-center text-sm text-red-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleImport}
              disabled={!file || importing}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {importing ? 'Importing...' : 'Import Data'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;