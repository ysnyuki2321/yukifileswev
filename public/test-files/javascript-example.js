/**
 * YukiFiles - Advanced File Management System
 * JavaScript Client Example
 * 
 * This file demonstrates how to interact with the YukiFiles API
 * using modern JavaScript features and best practices.
 */

// Configuration
const CONFIG = {
  API_BASE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  SUPPORTED_FORMATS: [
    'image/*', 'video/*', 'audio/*', 'text/*',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx',
    '.zip', '.rar', '.7z', '.tar', '.gz'
  ],
  UPLOAD_CHUNK_SIZE: 1024 * 1024 // 1MB chunks
};

// Utility Functions
class FileUtils {
  /**
   * Format file size in human readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted file size
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension from filename
   * @param {string} filename - The filename
   * @returns {string} File extension
   */
  static getFileExtension(filename) {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file type is supported
   * @param {File} file - File object
   * @returns {boolean} Whether file type is supported
   */
  static isSupportedFileType(file) {
    return CONFIG.SUPPORTED_FORMATS.some(format => {
      if (format.includes('*')) {
        return file.type.startsWith(format.replace('/*', ''));
      }
      return file.name.toLowerCase().endsWith(format);
    });
  }

  /**
   * Generate unique file ID
   * @returns {string} Unique file ID
   */
  static generateFileId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

// File Upload Manager
class FileUploadManager {
  constructor() {
    this.uploads = new Map();
    this.eventListeners = new Map();
  }

  /**
   * Upload a single file with progress tracking
   * @param {File} file - File to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async uploadFile(file, options = {}) {
    const fileId = FileUtils.generateFileId();
    const uploadInfo = {
      id: fileId,
      file,
      status: 'pending',
      progress: 0,
      startTime: Date.now(),
      chunks: [],
      retries: 0,
      maxRetries: options.maxRetries || 3
    };

    this.uploads.set(fileId, uploadInfo);
    this.emit('uploadStart', uploadInfo);

    try {
      // Validate file
      if (!FileUtils.isSupportedFileType(file)) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      if (file.size > CONFIG.MAX_FILE_SIZE) {
        throw new Error(`File too large: ${FileUtils.formatFileSize(file.size)}`);
      }

      // Start upload
      uploadInfo.status = 'uploading';
      const result = await this.performUpload(uploadInfo, options);
      
      uploadInfo.status = 'completed';
      uploadInfo.progress = 100;
      this.emit('uploadComplete', { ...uploadInfo, result });

      return result;

    } catch (error) {
      uploadInfo.status = 'error';
      uploadInfo.error = error.message;
      this.emit('uploadError', uploadInfo);
      throw error;
    }
  }

  /**
   * Perform the actual upload with chunking
   * @param {Object} uploadInfo - Upload information
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} Upload result
   */
  async performUpload(uploadInfo, options) {
    const { file } = uploadInfo;
    const totalChunks = Math.ceil(file.size / CONFIG.UPLOAD_CHUNK_SIZE);

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    formData.append('fileType', file.type);
    formData.append('fileSize', file.size.toString());

    if (options.metadata) {
      formData.append('metadata', JSON.stringify(options.metadata));
    }

    // Upload with progress tracking
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          uploadInfo.progress = Math.round(progress);
          this.emit('uploadProgress', uploadInfo);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } catch (error) {
            reject(new Error('Invalid response format'));
          }
        } else {
          reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });

      xhr.open('POST', `${CONFIG.API_BASE_URL}/api/files/upload`);
      xhr.send(formData);
    });
  }

  /**
   * Upload multiple files
   * @param {File[]} files - Array of files to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object[]>} Array of upload results
   */
  async uploadMultipleFiles(files, options = {}) {
    const uploadPromises = files.map(file => 
      this.uploadFile(file, options)
    );

    return Promise.allSettled(uploadPromises);
  }

  /**
   * Cancel an upload
   * @param {string} fileId - File ID to cancel
   */
  cancelUpload(fileId) {
    const uploadInfo = this.uploads.get(fileId);
    if (uploadInfo && uploadInfo.status === 'uploading') {
      uploadInfo.status = 'cancelled';
      this.emit('uploadCancelled', uploadInfo);
    }
  }

  /**
   * Get upload status
   * @param {string} fileId - File ID
   * @returns {Object|null} Upload information
   */
  getUploadStatus(fileId) {
    return this.uploads.get(fileId) || null;
  }

  /**
   * Add event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  on(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  /**
   * Remove event listener
   * @param {string} event - Event name
   * @param {Function} callback - Event callback
   */
  off(event, callback) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }
}

// File Manager Class
class YukiFilesManager {
  constructor(apiKey = null) {
    this.apiKey = apiKey;
    this.uploadManager = new FileUploadManager();
    this.baseURL = CONFIG.API_BASE_URL;
  }

  /**
   * Set API key for authentication
   * @param {string} apiKey - API key
   */
  setApiKey(apiKey) {
    this.apiKey = apiKey;
  }

  /**
   * Make authenticated API request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise<Object>} API response
   */
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get user's files
   * @param {Object} filters - Filter options
   * @returns {Promise<Object[]>} Array of files
   */
  async getFiles(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.limit) queryParams.append('limit', filters.limit.toString());
    if (filters.offset) queryParams.append('offset', filters.offset.toString());

    const endpoint = `/api/files?${queryParams.toString()}`;
    return this.apiRequest(endpoint);
  }

  /**
   * Get file details
   * @param {string} fileId - File ID
   * @returns {Promise<Object>} File details
   */
  async getFile(fileId) {
    return this.apiRequest(`/api/files/${fileId}`);
  }

  /**
   * Delete file
   * @param {string} fileId - File ID
   * @returns {Promise<Object>} Delete result
   */
  async deleteFile(fileId) {
    return this.apiRequest(`/api/files/${fileId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Rename file
   * @param {string} fileId - File ID
   * @param {string} newName - New filename
   * @returns {Promise<Object>} Rename result
   */
  async renameFile(fileId, newName) {
    return this.apiRequest(`/api/files/${fileId}/rename`, {
      method: 'PATCH',
      body: JSON.stringify({ name: newName })
    });
  }

  /**
   * Share file
   * @param {string} fileId - File ID
   * @param {Object} shareOptions - Share options
   * @returns {Promise<Object>} Share result
   */
  async shareFile(fileId, shareOptions = {}) {
    return this.apiRequest(`/api/files/${fileId}/share`, {
      method: 'POST',
      body: JSON.stringify(shareOptions)
    });
  }

  /**
   * Get file download URL
   * @param {string} fileId - File ID
   * @returns {Promise<string>} Download URL
   */
  async getDownloadUrl(fileId) {
    const result = await this.apiRequest(`/api/files/${fileId}/download`);
    return result.downloadUrl;
  }

  /**
   * Get storage usage
   * @returns {Promise<Object>} Storage information
   */
  async getStorageUsage() {
    return this.apiRequest('/api/storage/usage');
  }
}

// Usage Examples
const usageExamples = {
  // Basic file upload
  basicUpload: async () => {
    const fileManager = new YukiFilesManager('your-api-key');
    const fileInput = document.getElementById('fileInput');
    
    fileInput.addEventListener('change', async (event) => {
      const file = event.target.files[0];
      if (file) {
        try {
          const result = await fileManager.uploadManager.uploadFile(file);
          console.log('Upload successful:', result);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    });
  },

  // Multiple file upload with progress
  multipleUpload: async () => {
    const fileManager = new YukiFilesManager('your-api-key');
    
    fileManager.uploadManager.on('uploadProgress', (uploadInfo) => {
      console.log(`Upload progress for ${uploadInfo.file.name}: ${uploadInfo.progress}%`);
    });

    fileManager.uploadManager.on('uploadComplete', (uploadInfo) => {
      console.log(`Upload completed: ${uploadInfo.file.name}`);
    });

    const files = [/* array of File objects */];
    const results = await fileManager.uploadManager.uploadMultipleFiles(files);
    console.log('All uploads completed:', results);
  },

  // File management operations
  fileOperations: async () => {
    const fileManager = new YukiFilesManager('your-api-key');
    
    // Get all files
    const files = await fileManager.getFiles({ limit: 50 });
    console.log('User files:', files);

    // Get specific file
    const fileDetails = await fileManager.getFile('file-id');
    console.log('File details:', fileDetails);

    // Rename file
    await fileManager.renameFile('file-id', 'new-name.txt');

    // Share file
    const shareResult = await fileManager.shareFile('file-id', {
      public: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    console.log('Share link:', shareResult.shareUrl);

    // Delete file
    await fileManager.deleteFile('file-id');
  }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    YukiFilesManager,
    FileUploadManager,
    FileUtils,
    CONFIG,
    usageExamples
  };
}

// Export for use in browser
if (typeof window !== 'undefined') {
  window.YukiFiles = {
    YukiFilesManager,
    FileUploadManager,
    FileUtils,
    CONFIG,
    usageExamples
  };
}