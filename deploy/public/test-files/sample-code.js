// YukiFiles Sample JavaScript Code
// This file demonstrates various JavaScript features for testing the file editor

class FileManager {
  constructor() {
    this.files = [];
    this.maxFileSize = 1024 * 1024 * 100; // 100MB
    this.supportedTypes = ['txt', 'md', 'js', 'py', 'css', 'html', 'json'];
  }

  // Upload a new file
  async uploadFile(file) {
    try {
      if (file.size > this.maxFileSize) {
        throw new Error('File size exceeds limit');
      }

      const fileExtension = file.name?.split('.').pop()?.toLowerCase() || '';
      if (!this.supportedTypes.includes(fileExtension)) {
        throw new Error('File type not supported');
      }

      const fileData = {
        id: this.generateId(),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date(),
        content: await this.readFileContent(file)
      };

      this.files.push(fileData);
      return fileData;
    } catch (error) {
      console.error('Upload failed:', error.message);
      throw error;
    }
  }

  // Read file content
  readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Generate unique ID
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get file by ID
  getFile(id) {
    return this.files.find(file => file.id === id);
  }

  // Update file content
  updateFile(id, newContent) {
    const file = this.getFile(id);
    if (file) {
      file.content = newContent;
      file.lastModified = new Date();
      return file;
    }
    throw new Error('File not found');
  }

  // Delete file
  deleteFile(id) {
    const index = this.files.findIndex(file => file.id === id);
    if (index !== -1) {
      return this.files.splice(index, 1)[0];
    }
    throw new Error('File not found');
  }

  // Get all files
  getAllFiles() {
    return this.files;
  }

  // Search files by name
  searchFiles(query) {
    if (!query || typeof query !== 'string') return this.files;
    return this.files.filter(file => 
      file.name && file.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}

// Utility functions
const utils = {
  formatFileSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },

  formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  },

  validateFileName(name) {
    const invalidChars = /[<>:"/\\|?*]/;
    return !invalidChars.test(name) && name.length > 0 && name.length <= 255;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FileManager, utils };
}

// Example usage
const fileManager = new FileManager();

// Event listeners for file operations
document.addEventListener('DOMContentLoaded', () => {
  console.log('File Manager initialized');
  
  // Example: Handle file upload
  const uploadButton = document.getElementById('upload-btn');
  if (uploadButton) {
    uploadButton.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.txt,.md,.js,.py,.css,.html,.json';
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (file) {
          try {
            const uploadedFile = await fileManager.uploadFile(file);
            console.log('File uploaded:', uploadedFile);
          } catch (error) {
            console.error('Upload error:', error);
          }
        }
      };
      input.click();
    });
  }
});