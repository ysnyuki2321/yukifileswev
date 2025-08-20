import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Removed server import to avoid client component issues

export interface DebugUser {
  id: string
  email: string
  quota_used: number
  quota_limit: number
  files_count: number
  subscription_type: "free" | "paid"
  is_admin: boolean
  is_verified: boolean
  is_active: boolean
  created_at: string
  last_login: string
}

export interface DebugFile {
  id: string
  original_name: string
  file_size: number
  share_token: string
  created_at: string
  is_public: boolean
  user_id: string
  content?: string
  type?: string
  mimeType?: string
}

export interface DebugTransaction {
  id: string
  user_id: string
  payment_method: "paypal" | "crypto"
  payment_id: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed"
  created_at: string
  completed_at?: string
}

export function getDebugUser(): DebugUser {
  return {
    id: "debug-user-123",
    email: "debug@yukifiles.com",
    quota_used: 1.5 * 1024 * 1024 * 1024, // 1.5GB
    quota_limit: 5 * 1024 * 1024 * 1024, // 5GB
    files_count: 23,
    subscription_type: "paid",
    is_admin: true,
    is_verified: true,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    last_login: new Date().toISOString()
  }
}

export function getDebugFiles(): DebugFile[] {
  return [
    {
      id: "debug-file-1",
      original_name: "app.js",
      file_size: 2048,
      share_token: "debug-share-1",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: true,
      user_id: "debug-user-123",
      type: "javascript",
      mimeType: "application/javascript",
      content: `// YukiFiles Demo - Main Application
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|txt|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type!'));
    }
  }
});

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  
  res.json({
    message: 'File uploaded successfully',
    file: {
      filename: req.file.filename,
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 YukiFiles server running on port \${PORT}\`);
});`
    },
    {
      id: "debug-file-2",
      original_name: "config.json",
      file_size: 512,
      share_token: "debug-share-2",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: false,
      user_id: "debug-user-123",
      type: "json",
      mimeType: "application/json",
      content: `{
  "app": {
    "name": "YukiFiles",
    "version": "2.0.0",
    "description": "Professional file sharing platform",
    "author": "YukiFiles Team"
  },
  "server": {
    "port": 3000,
    "host": "localhost",
    "cors": {
      "enabled": true,
      "origins": ["http://localhost:3000", "https://yukifiles.com"]
    }
  },
  "upload": {
    "maxFileSize": "10MB",
    "allowedTypes": [
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ],
    "destination": "./uploads"
  },
  "database": {
    "type": "postgresql",
    "host": "localhost",
    "port": 5432,
    "name": "yukifiles",
    "ssl": true
  },
  "security": {
    "jwtSecret": "your-jwt-secret-here",
    "bcryptRounds": 12,
    "rateLimiting": {
      "enabled": true,
      "maxRequests": 100,
      "windowMs": 900000
    }
  },
  "features": {
    "fileSharing": true,
    "publicUploads": true,
    "userAccounts": true,
    "adminPanel": true,
    "analytics": true
  }
}`
    },
    {
      id: "debug-file-3",
      original_name: "README.md",
      file_size: 1024,
      share_token: "debug-share-3",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: true,
      user_id: "debug-user-123",
      type: "markdown",
      mimeType: "text/markdown",
      content: `# YukiFiles - Professional File Sharing Platform

## 🚀 Features

- **Drag & Drop Upload**: Intuitive file uploading experience
- **Secure Sharing**: Password-protected and expiring links
- **File Management**: Organize files with folders and tags
- **Real-time Analytics**: Track downloads and engagement
- **Admin Dashboard**: Complete administrative control
- **Mobile Responsive**: Works perfectly on all devices

## 📦 Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/yukifiles/yukifiles.git

# Navigate to project directory
cd yukifiles

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
\`\`\`

## 🔧 Configuration

1. **Database Setup**: Configure your PostgreSQL database
2. **Storage**: Set up your preferred storage provider (AWS S3, Google Cloud, etc.)
3. **Authentication**: Configure your authentication provider
4. **Email**: Set up email service for notifications

## 🎨 Customization

YukiFiles is highly customizable:

- **Themes**: Multiple built-in themes with custom CSS support
- **Branding**: Add your own logo and brand colors
- **Features**: Enable/disable features as needed
- **Integrations**: Connect with popular services

## 📊 Analytics

Built-in analytics provide insights into:
- File upload trends
- Download statistics
- User engagement
- Storage usage
- Popular file types

## 🛡️ Security

- End-to-end encryption
- Secure file storage
- Rate limiting
- CSRF protection
- Input validation
- Regular security updates

## 📱 API

RESTful API with comprehensive documentation:

\`\`\`javascript
// Upload file
POST /api/upload

// Get file info
GET /api/files/:id

// Share file
POST /api/share/:id

// Delete file
DELETE /api/files/:id
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

- 📧 Email: support@yukifiles.com
- 💬 Discord: [Join our community](https://discord.gg/yukifiles)
- 📖 Documentation: [docs.yukifiles.com](https://docs.yukifiles.com)

---

Made with ❤️ by the YukiFiles Team`
    },
    {
      id: "debug-file-4",
      original_name: "styles.css",
      file_size: 2048,
      share_token: "debug-share-4",
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: false,
      user_id: "debug-user-123",
      type: "css",
      mimeType: "text/css",
      content: `/* YukiFiles - Main Stylesheet */
:root {
  --primary-color: #8b5cf6;
  --secondary-color: #ec4899;
  --background-dark: #0f0f23;
  --background-light: #1a1a2e;
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --border-color: rgba(139, 92, 246, 0.2);
  --success-color: #10b981;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, var(--background-dark) 0%, var(--background-light) 100%);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

/* Header Styles */
.header {
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Button Styles */
.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
}

.btn-outline {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-outline:hover {
  background: var(--primary-color);
  color: white;
}

/* Upload Area */
.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: rgba(139, 92, 246, 0.05);
}

.upload-area:hover {
  border-color: var(--primary-color);
  background: rgba(139, 92, 246, 0.1);
}

.upload-area.dragover {
  border-color: var(--secondary-color);
  background: rgba(236, 72, 153, 0.1);
  transform: scale(1.02);
}

/* File Grid */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.file-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.file-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-color);
  box-shadow: 0 10px 30px rgba(139, 92, 246, 0.2);
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.pulse {
  animation: pulse 2s infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav {
    padding: 0 1rem;
  }
  
  .file-grid {
    grid-template-columns: 1fr;
  }
  
  .upload-area {
    padding: 2rem 1rem;
  }
}

/* Dark mode enhancements */
.dark-mode {
  --background-dark: #000000;
  --background-light: #111111;
  --text-primary: #ffffff;
  --text-secondary: #888888;
}

/* Loading spinner */
.spinner {
  border: 3px solid rgba(139, 92, 246, 0.3);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`
    },
    {
      id: "debug-file-5",
      original_name: "component.tsx",
      file_size: 3072,
      share_token: "debug-share-5",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: true,
      user_id: "debug-user-123",
      type: "typescript",
      mimeType: "application/typescript",
      content: `import React, { useState, useCallback, useRef } from 'react';
import { Upload, File, X, Check, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>;
  maxFileSize?: number;
  allowedTypes?: string[];
  multiple?: boolean;
  className?: string;
}

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  maxFileSize = 10 * 1024 * 1024, // 10MB
  allowedTypes = ['image/*', 'application/pdf', 'text/*'],
  multiple = true,
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return \`File size exceeds \${(maxFileSize / 1024 / 1024).toFixed(1)}MB limit\`;
    }

    // Check file type
    const isAllowed = allowedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -2));
      }
      return file.type === type;
    });

    if (!isAllowed) {
      return 'File type not allowed';
    }

    return null;
  }, [maxFileSize, allowedTypes]);

  const handleFiles = useCallback(async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const newUploadedFiles: UploadedFile[] = [];

    // Validate files
    fileArray.forEach(file => {
      const error = validateFile(file);
      const uploadedFile: UploadedFile = {
        id: \`\${file.name}-\${Date.now()}\`,
        file,
        progress: 0,
        status: error ? 'error' : 'uploading',
        error
      };

      newUploadedFiles.push(uploadedFile);
      if (!error) {
        validFiles.push(file);
      }
    });

    setUploadedFiles(prev => [...prev, ...newUploadedFiles]);

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Simulate upload progress
      for (const uploadedFile of newUploadedFiles.filter(f => !f.error)) {
        // Update progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === uploadedFile.id
                ? { ...f, progress }
                : f
            )
          );
        }

        // Mark as completed
        setUploadedFiles(prev =>
          prev.map(f =>
            f.id === uploadedFile.id
              ? { ...f, status: 'completed' }
              : f
          )
        );
      }

      await onUpload(validFiles);
    } catch (error) {
      // Mark all as error
      setUploadedFiles(prev =>
        prev.map(f => ({
          ...f,
          status: 'error',
          error: 'Upload failed'
        }))
      );
    } finally {
      setIsUploading(false);
    }
  }, [validateFile, onUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((id: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={\`file-upload \${className}\`}>
      {/* Upload Area */}
      <div
        className={\`upload-area \${isDragOver ? 'drag-over' : ''}\`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileInput}
          className="hidden"
          accept={allowedTypes.join(',')}
        />
        
        <Upload className="upload-icon" size={48} />
        <h3>Drop files here or click to browse</h3>
        <p>
          Max file size: {(maxFileSize / 1024 / 1024).toFixed(1)}MB
        </p>
        <p className="allowed-types">
          Allowed types: {allowedTypes.join(', ')}
        </p>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="uploaded-files">
          <h4>Uploaded Files</h4>
          {uploadedFiles.map(uploadedFile => (
            <div key={uploadedFile.id} className="file-item">
              <div className="file-info">
                <File size={20} />
                <div className="file-details">
                  <span className="file-name">{uploadedFile.file.name}</span>
                  <span className="file-size">
                    {formatFileSize(uploadedFile.file.size)}
                  </span>
                </div>
              </div>
              
              <div className="file-status">
                {uploadedFile.status === 'uploading' && (
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: \`\${uploadedFile.progress}%\` }}
                    />
                  </div>
                )}
                
                {uploadedFile.status === 'completed' && (
                  <Check className="status-icon success" size={20} />
                )}
                
                {uploadedFile.status === 'error' && (
                  <AlertCircle className="status-icon error" size={20} />
                )}
                
                <button
                  onClick={() => removeFile(uploadedFile.id)}
                  className="remove-btn"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;`
    },
    {
      id: "debug-file-6",
      original_name: "demo.py",
      file_size: 1536,
      share_token: "debug-share-6",
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      is_public: false,
      user_id: "debug-user-123",
      type: "python",
      mimeType: "text/x-python",
      content: `#!/usr/bin/env python3
"""
YukiFiles Demo - File Processing Script
This script demonstrates file processing capabilities for the YukiFiles platform.
"""

import os
import hashlib
import mimetypes
from datetime import datetime
from typing import List, Dict, Optional
from pathlib import Path

class FileProcessor:
    """Handle file processing operations for YukiFiles."""
    
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(exist_ok=True)
        self.allowed_extensions = {
            '.txt', '.pdf', '.jpg', '.jpeg', '.png', '.gif', 
            '.mp4', '.mp3', '.doc', '.docx', '.xls', '.xlsx'
        }
        self.max_file_size = 50 * 1024 * 1024  # 50MB
    
    def validate_file(self, file_path: Path) -> Dict[str, any]:
        """Validate uploaded file and return metadata."""
        if not file_path.exists():
            return {"valid": False, "error": "File does not exist"}
        
        # Check file size
        file_size = file_path.stat().st_size
        if file_size > self.max_file_size:
            return {"valid": False, "error": "File too large"}
        
        # Check file extension
        if file_path.suffix.lower() not in self.allowed_extensions:
            return {"valid": False, "error": "File type not allowed"}
        
        # Generate file hash
        file_hash = self.calculate_hash(file_path)
        
        # Get MIME type
        mime_type, _ = mimetypes.guess_type(str(file_path))
        
        return {
            "valid": True,
            "size": file_size,
            "hash": file_hash,
            "mime_type": mime_type,
            "extension": file_path.suffix.lower(),
            "created_at": datetime.now().isoformat()
        }
    
    def calculate_hash(self, file_path: Path) -> str:
        """Calculate SHA-256 hash of the file."""
        hash_sha256 = hashlib.sha256()
        
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        
        return hash_sha256.hexdigest()
    
    def process_upload(self, file_path: Path, user_id: str) -> Dict[str, any]:
        """Process uploaded file and move to user directory."""
        validation = self.validate_file(file_path)
        
        if not validation["valid"]:
            return validation
        
        # Create user directory
        user_dir = self.upload_dir / user_id
        user_dir.mkdir(exist_ok=True)
        
        # Generate unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_name = f"{timestamp}_{file_path.name}"
        destination = user_dir / unique_name
        
        # Move file to user directory
        file_path.rename(destination)
        
        return {
            **validation,
            "file_path": str(destination),
            "unique_name": unique_name,
            "user_id": user_id
        }
    
    def get_user_files(self, user_id: str) -> List[Dict[str, any]]:
        """Get list of files for a specific user."""
        user_dir = self.upload_dir / user_id
        
        if not user_dir.exists():
            return []
        
        files = []
        for file_path in user_dir.iterdir():
            if file_path.is_file():
                stat = file_path.stat()
                files.append({
                    "name": file_path.name,
                    "size": stat.st_size,
                    "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    "path": str(file_path)
                })
        
        return sorted(files, key=lambda x: x["modified"], reverse=True)
    
    def cleanup_old_files(self, days: int = 30):
        """Clean up files older than specified days."""
        cutoff = datetime.now().timestamp() - (days * 24 * 60 * 60)
        removed_count = 0
        
        for user_dir in self.upload_dir.iterdir():
            if user_dir.is_dir():
                for file_path in user_dir.iterdir():
                    if file_path.is_file() and file_path.stat().st_mtime < cutoff:
                        file_path.unlink()
                        removed_count += 1
        
        return removed_count

def main():
    """Demo script execution."""
    processor = FileProcessor()
    
    # Example usage
    print("YukiFiles File Processor Demo")
    print("=" * 40)
    
    # Process a demo file
    demo_file = Path("demo_upload.txt")
    if demo_file.exists():
        result = processor.process_upload(demo_file, "demo_user")
        print(f"File processed: {result}")
    
    # Get user files
    user_files = processor.get_user_files("demo_user")
    print(f"User has {len(user_files)} files")
    
    # Cleanup old files
    removed = processor.cleanup_old_files(30)
    print(f"Cleaned up {removed} old files")

if __name__ == "__main__":
    main()`
    }
  ]
}

export function getDebugTransactions(): DebugTransaction[] {
  return [
    {
      id: "debug-transaction-1",
      user_id: "debug-user-123",
      payment_method: "paypal",
      payment_id: "PAY-123456789",
      amount: 1.00,
      currency: "USD",
      status: "completed",
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "debug-transaction-2",
      user_id: "debug-user-123",
      payment_method: "crypto",
      payment_id: "BTC-987654321",
      amount: 0.001,
      currency: "BTC",
      status: "pending",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
}

export function getDebugStats() {
  return {
    totalUsers: 156,
    totalFiles: 892,
    totalTransactions: 45,
    pendingTransactions: 3,
    suspiciousIPs: 12,
    totalStorageUsed: 2.3 * 1024 * 1024 * 1024 * 1024, // 2.3TB
    recentUsers: [
      { email: "user1@example.com", created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { email: "user2@example.com", created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { email: "user3@example.com", created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() }
    ],
    recentTransactions: [
      { id: "tx-1", amount: 1.00, status: "completed", created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString() },
      { id: "tx-2", amount: 0.001, status: "pending", created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() }
    ]
  }
}

export async function isDebugModeEnabled(): Promise<boolean> {
  const supabase = createServerClient()
  if (!supabase) return false
  
  try {
    const { data: settings } = await supabase.from("admin_settings").select("setting_key, setting_value")
    const map = (settings || []).reduce((acc: Record<string, string>, s: any) => {
      acc[s.setting_key] = s.setting_value
      return acc
    }, {} as Record<string, string>)
    
    return map["debug_mode"] === "true"
  } catch (e) {
    return false
  }
}

export async function createDebugUser() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll() {
          // No-op for debug
        }
      }
    }
  )
  
  // Debug user creation logic here
  return supabase
}