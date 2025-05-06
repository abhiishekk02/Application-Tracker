import { Job, JobImage, JobTag } from '../types';

// IndexedDB database name and version
const DB_NAME = 'job-tracker-db';
const DB_VERSION = 1;

// Initialize the database
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = (event) => {
      reject('Error opening database');
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('jobs')) {
        const jobsStore = db.createObjectStore('jobs', { keyPath: 'id' });
        jobsStore.createIndex('status', 'status', { unique: false });
        jobsStore.createIndex('company', 'company', { unique: false });
        jobsStore.createIndex('applicationDate', 'applicationDate', { unique: false });
      }
      
      if (!db.objectStoreNames.contains('tags')) {
        db.createObjectStore('tags', { keyPath: 'id' });
      }
    };
  });
};

// Add a job
export const addJob = async (job: Job): Promise<string> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['jobs'], 'readwrite');
    const store = transaction.objectStore('jobs');
    const request = store.add(job);

    request.onsuccess = () => {
      resolve(job.id);
    };

    request.onerror = () => {
      reject('Error adding job');
    };
  });
};

// Update a job
export const updateJob = async (job: Job): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['jobs'], 'readwrite');
    const store = transaction.objectStore('jobs');
    const request = store.put(job);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject('Error updating job');
    };
  });
};

// Delete a job
export const deleteJob = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['jobs'], 'readwrite');
    const store = transaction.objectStore('jobs');
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject('Error deleting job');
    };
  });
};

// Get all jobs
export const getAllJobs = async (): Promise<Job[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['jobs'], 'readonly');
    const store = transaction.objectStore('jobs');
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject('Error getting jobs');
    };
  });
};

// Get a job by ID
export const getJobById = async (id: string): Promise<Job | null> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['jobs'], 'readonly');
    const store = transaction.objectStore('jobs');
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = () => {
      reject('Error getting job');
    };
  });
};

// Add a tag
export const addTag = async (tag: JobTag): Promise<string> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['tags'], 'readwrite');
    const store = transaction.objectStore('tags');
    const request = store.add(tag);

    request.onsuccess = () => {
      resolve(tag.id);
    };

    request.onerror = () => {
      reject('Error adding tag');
    };
  });
};

// Get all tags
export const getAllTags = async (): Promise<JobTag[]> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['tags'], 'readonly');
    const store = transaction.objectStore('tags');
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject('Error getting tags');
    };
  });
};

// Delete a tag
export const deleteTag = async (id: string): Promise<void> => {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['tags'], 'readwrite');
    const store = transaction.objectStore('tags');
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject('Error deleting tag');
    };
  });
};

// Export all data to JSON
export const exportData = async (): Promise<string> => {
  try {
    const jobs = await getAllJobs();
    const tags = await getAllTags();
    const data = { jobs, tags };
    return JSON.stringify(data, null, 2);
  } catch (error) {
    throw new Error('Error exporting data');
  }
};

// Import data from JSON
export const importData = async (jsonData: string): Promise<void> => {
  try {
    const data = JSON.parse(jsonData);
    const db = await initDB();
    
    // Clear existing data
    const clearTransaction = db.transaction(['jobs', 'tags'], 'readwrite');
    clearTransaction.objectStore('jobs').clear();
    clearTransaction.objectStore('tags').clear();
    
    await new Promise<void>((resolve, reject) => {
      clearTransaction.oncomplete = () => resolve();
      clearTransaction.onerror = () => reject('Error clearing existing data');
    });
    
    // Import jobs
    const jobsTransaction = db.transaction(['jobs'], 'readwrite');
    const jobsStore = jobsTransaction.objectStore('jobs');
    
    for (const job of data.jobs) {
      jobsStore.add(job);
    }
    
    // Import tags
    const tagsTransaction = db.transaction(['tags'], 'readwrite');
    const tagsStore = tagsTransaction.objectStore('tags');
    
    for (const tag of data.tags) {
      tagsStore.add(tag);
    }
    
    return new Promise((resolve, reject) => {
      tagsTransaction.oncomplete = () => resolve();
      tagsTransaction.onerror = () => reject('Error importing data');
    });
  } catch (error) {
    throw new Error('Error importing data');
  }
};