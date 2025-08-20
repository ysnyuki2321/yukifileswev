"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { 
  Search, Grid, List, MoreHorizontal, Plus, FolderPlus, FilePlus, Upload,
  FileText, FileCode, FileImage, Music, Video, FileArchive, Database,
  Eye, Download, Share2, Edit3, Trash2, Copy, Check,
  Folder, FolderOpen, X, AlertCircle, CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FileEditor } from "@/components/file-editor/file-editor"
import { LucideIcon } from "lucide-react"

interface DemoFile {
  id: string
  name: string
  type: 'file' | 'folder'
  size: number
  lastModified: Date
  content?: string
  mimeType?: string
  path: string
  isStarred?: boolean
}

// Enhanced demo files with more realistic content
const initialDemoFiles: DemoFile[] = [
  {
    id: '1',
    name: 'Projects',
    type: 'folder',
    size: 0,
    lastModified: new Date('2024-01-15'),
    path: '/'
  },
  {
    id: '2',
    name: 'app.js',
    type: 'file',
    size: 3456,
    lastModified: new Date('2024-01-14'),
    path: '/',
    mimeType: 'application/javascript',
    content: `// YukiFiles Demo Application
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    // Allow all file types for demo
    cb(null, true);
  }
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    res.json({
      success: true,
      file: {
        id: Date.now().toString(),
        name: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype,
        uploadedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.get('/api/files', (req, res) => {
  // Demo endpoint - return mock files
  res.json({
    files: [
      { id: '1', name: 'document.pdf', size: 1024000 },
      { id: '2', name: 'image.jpg', size: 2048000 },
      { id: '3', name: 'video.mp4', size: 10240000 }
    ]
  });
});

app.listen(PORT, () => {
  console.log(\`🚀 YukiFiles demo server running on port \${PORT}\`);
  console.log(\`📁 Upload directory: \${path.resolve('uploads')}\`);
});`
  },
  {
    id: '3',
    name: 'README.md',
    type: 'file',
    size: 2048,
    lastModified: new Date('2024-01-13'),
    path: '/',
    mimeType: 'text/markdown',
    content: `# YukiFiles Demo

Welcome to YukiFiles - the professional file sharing platform!

## 🚀 Features

- **Drag & Drop Upload**: Intuitive file uploading experience
- **File Management**: Create, organize, and manage your files
- **Secure Sharing**: Password-protected and expiring links
- **Real-time Collaboration**: Work together on files
- **Advanced Search**: Find your files quickly
- **Mobile Responsive**: Works on all devices

## 📁 File Types Supported

### Documents
- PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
- TXT, RTF, ODT, ODS, ODP

### Images
- JPG, JPEG, PNG, GIF, BMP, SVG, WEBP
- RAW, TIFF, PSD, AI, EPS

### Videos
- MP4, AVI, MOV, WMV, FLV, WEBM, MKV
- M4V, 3GP, OGV

### Audio
- MP3, WAV, FLAC, AAC, OGG, WMA
- M4A, OPUS

### Code Files
- JS, TS, JSX, TSX, HTML, CSS, SCSS
- PY, JAVA, CPP, C, PHP, RB, GO, RS
- JSON, XML, YAML, SQL, MD

### Archives
- ZIP, RAR, 7Z, TAR, GZ, BZ2

## 🎨 Demo Features

This is a fully functional demo showcasing:

1. **File Upload** - Try uploading different file types
2. **File Organization** - Create folders and organize files
3. **File Editing** - Edit text and code files inline
4. **File Sharing** - Generate shareable links
5. **File Preview** - Preview images and documents
6. **Search & Filter** - Find files quickly
7. **Responsive Design** - Works on mobile and desktop

## 🔧 Getting Started

1. Click "Upload Files" to add your files
2. Create folders to organize your content
3. Use the search bar to find specific files
4. Click on text files to edit them inline
5. Share files with the share button
6. Try different view modes (grid/list)

## 💡 Pro Tips

- Use keyboard shortcuts: Ctrl+U for upload, Ctrl+F for search
- Drag files between folders to organize them
- Right-click on files for more options
- Use the star icon to favorite important files
- Check out the syntax highlighting in code files

## 📊 File Statistics

- **Total Files**: 25+ demo files
- **File Types**: 15+ different formats
- **Total Size**: 50MB+ of demo content
- **Folders**: 5 organized directories

## 🌟 Premium Features

Upgrade to premium for:
- Unlimited storage (up to 1TB)
- Advanced sharing options
- Priority support
- Custom branding
- API access
- Advanced analytics

---

**Note**: This is a demo environment. Files uploaded here are for testing purposes only and may be removed periodically.

Made with ❤️ by the YukiFiles Team`
  },
  {
    id: '4',
    name: 'config.json',
    type: 'file',
    size: 1024,
    lastModified: new Date('2024-01-12'),
    path: '/',
    mimeType: 'application/json',
    content: `{
  "app": {
    "name": "YukiFiles Demo",
    "version": "2.1.0",
    "description": "Professional file sharing and management platform",
    "author": "YukiFiles Team",
    "license": "MIT"
  },
  "server": {
    "port": 3000,
    "host": "0.0.0.0",
    "cors": {
      "enabled": true,
      "origins": [
        "http://localhost:3000",
        "https://yukifiles.vercel.app",
        "https://demo.yukifiles.com"
      ]
    },
    "rateLimit": {
      "enabled": true,
      "maxRequests": 100,
      "windowMs": 900000
    }
  },
  "upload": {
    "maxFileSize": "50MB",
    "allowedTypes": [
      "image/*",
      "video/*",
      "audio/*",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/*",
      "application/json",
      "application/javascript",
      "application/typescript"
    ],
    "destination": "./uploads",
    "generateThumbnails": true,
    "virusScan": false
  },
  "database": {
    "provider": "supabase",
    "url": "https://whnwnshkyavvqldovaci.supabase.co",
    "ssl": true,
    "pool": {
      "min": 2,
      "max": 10
    }
  },
  "storage": {
    "provider": "supabase",
    "bucket": "files",
    "publicUrl": true,
    "cdn": {
      "enabled": true,
      "provider": "vercel"
    }
  },
  "security": {
    "jwtSecret": "your-jwt-secret-here",
    "bcryptRounds": 12,
    "sessionTimeout": 86400000,
    "csrfProtection": true,
    "helmet": {
      "enabled": true,
      "contentSecurityPolicy": true
    }
  },
  "features": {
    "fileSharing": true,
    "publicUploads": true,
    "userAccounts": true,
    "adminPanel": true,
    "analytics": true,
    "realTimeSync": false,
    "collaboration": false,
    "versioning": false
  },
  "ui": {
    "theme": "dark",
    "primaryColor": "#8b5cf6",
    "secondaryColor": "#ec4899",
    "showBranding": true,
    "customLogo": null,
    "animations": true
  },
  "demo": {
    "enabled": true,
    "maxFiles": 100,
    "maxSize": "100MB",
    "resetInterval": "24h",
    "features": {
      "upload": true,
      "download": true,
      "share": true,
      "edit": true,
      "delete": false
    }
  }
}`
  },
  {
    id: '5',
    name: 'styles.css',
    type: 'file',
    size: 4096,
    lastModified: new Date('2024-01-11'),
    path: '/',
    mimeType: 'text/css',
    content: `/* YukiFiles Demo - Enhanced Styles */

:root {
  /* Color Palette */
  --primary-color: #8b5cf6;
  --secondary-color: #ec4899;
  --accent-color: #06b6d4;
  --success-color: #10b981;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  
  /* Background Colors */
  --bg-primary: #0f0f23;
  --bg-secondary: #1a1a2e;
  --bg-tertiary: #16213e;
  --bg-glass: rgba(255, 255, 255, 0.05);
  
  /* Text Colors */
  --text-primary: #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
  
  /* Border Colors */
  --border-primary: rgba(139, 92, 246, 0.2);
  --border-secondary: rgba(255, 255, 255, 0.1);
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  --shadow-glow: 0 0 20px rgba(139, 92, 246, 0.3);
}

/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
  min-height: 100vh;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 0.5em;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.75rem; }
h4 { font-size: 1.5rem; }
h5 { font-size: 1.25rem; }
h6 { font-size: 1rem; }

p {
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

/* Links */
a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: var(--secondary-color);
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg), var(--shadow-glow);
}

.btn-secondary {
  background: var(--bg-glass);
  color: var(--text-primary);
  border: 1px solid var(--border-secondary);
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  border-color: var(--border-primary);
  background: rgba(139, 92, 246, 0.1);
}

/* Cards */
.card {
  background: var(--bg-glass);
  border: 1px solid var(--border-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.card:hover {
  border-color: var(--border-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* File Upload Area */
.upload-area {
  border: 2px dashed var(--border-primary);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  background: rgba(139, 92, 246, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-area:hover {
  border-color: var(--secondary-color);
  background: rgba(236, 72, 153, 0.1);
  transform: scale(1.02);
}

.upload-area.dragover {
  border-color: var(--accent-color);
  background: rgba(6, 182, 212, 0.1);
  transform: scale(1.05);
}

/* File Grid */
.file-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.file-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-secondary);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.file-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.file-card:hover {
  transform: translateY(-5px);
  border-color: var(--border-primary);
  box-shadow: var(--shadow-xl);
}

.file-card:hover::before {
  opacity: 1;
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Utility Classes */
.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.slide-in {
  animation: slideIn 0.6s ease-out;
}

.pulse {
  animation: pulse 2s infinite;
}

.spin {
  animation: spin 1s linear infinite;
}

/* Responsive Design */
@media (max-width: 768px) {
  .file-grid {
    grid-template-columns: 1fr;
  }
  
  .upload-area {
    padding: 2rem 1rem;
  }
  
  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }
  h3 { font-size: 1.5rem; }
}

@media (max-width: 480px) {
  .card {
    padding: 1rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}

/* Dark mode enhancements */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #000000;
    --bg-secondary: #111111;
    --text-secondary: #888888;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  :root {
    --border-secondary: rgba(255, 255, 255, 0.3);
    --text-secondary: #cccccc;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}`
  },
  {
    id: '6',
    name: 'demo.py',
    type: 'file',
    size: 2560,
    lastModified: new Date('2024-01-10'),
    path: '/',
    mimeType: 'text/x-python',
    content: `#!/usr/bin/env python3
"""
YukiFiles Demo - Python File Processing Script
Demonstrates file handling capabilities for the YukiFiles platform
"""

import os
import hashlib
import mimetypes
import json
from datetime import datetime
from typing import List, Dict, Optional, Union
from pathlib import Path
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('yukifiles_demo.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger('YukiFiles')

class FileProcessor:
    """Advanced file processing for YukiFiles demo."""
    
    def __init__(self, upload_dir: str = "uploads", max_size: int = 50 * 1024 * 1024):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(exist_ok=True)
        self.max_size = max_size
        
        # Supported file types
        self.allowed_extensions = {
            # Documents
            '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
            '.txt', '.rtf', '.odt', '.ods', '.odp',
            
            # Images
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp',
            '.tiff', '.ico', '.raw', '.psd',
            
            # Videos
            '.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv',
            '.m4v', '.3gp', '.ogv',
            
            # Audio
            '.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a',
            
            # Code
            '.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss',
            '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs',
            '.json', '.xml', '.yaml', '.yml', '.md', '.sql',
            
            # Archives
            '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'
        }
        
        logger.info(f"FileProcessor initialized with upload dir: {self.upload_dir}")
    
    def validate_file(self, file_path: Path) -> Dict[str, Union[bool, str, int]]:
        """Validate uploaded file and return comprehensive metadata."""
        try:
            if not file_path.exists():
                return {"valid": False, "error": "File does not exist"}
            
            # Check file size
            file_size = file_path.stat().st_size
            if file_size > self.max_size:
                return {
                    "valid": False, 
                    "error": f"File too large: {file_size} bytes (max: {self.max_size})"
                }
            
            # Check file extension
            if file_path.suffix.lower() not in self.allowed_extensions:
                return {
                    "valid": False, 
                    "error": f"File type not allowed: {file_path.suffix}"
                }
            
            # Generate file hash
            file_hash = self.calculate_hash(file_path)
            
            # Get MIME type
            mime_type, encoding = mimetypes.guess_type(str(file_path))
            
            # Get file category
            category = self.get_file_category(file_path.suffix.lower())
            
            return {
                "valid": True,
                "size": file_size,
                "hash": file_hash,
                "mime_type": mime_type,
                "encoding": encoding,
                "extension": file_path.suffix.lower(),
                "category": category,
                "created_at": datetime.now().isoformat(),
                "is_text": self.is_text_file(file_path),
                "is_image": category == "image",
                "is_video": category == "video",
                "is_audio": category == "audio"
            }
            
        except Exception as e:
            logger.error(f"Error validating file {file_path}: {str(e)}")
            return {"valid": False, "error": f"Validation error: {str(e)}"}
    
    def calculate_hash(self, file_path: Path, algorithm: str = "sha256") -> str:
        """Calculate file hash using specified algorithm."""
        hash_func = hashlib.new(algorithm)
        
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(8192), b""):
                hash_func.update(chunk)
        
        return hash_func.hexdigest()
    
    def get_file_category(self, extension: str) -> str:
        """Determine file category based on extension."""
        categories = {
            "document": {'.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt', '.rtf'},
            "image": {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp', '.tiff', '.ico'},
            "video": {'.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv', '.m4v'},
            "audio": {'.mp3', '.wav', '.flac', '.aac', '.ogg', '.wma', '.m4a'},
            "code": {'.js', '.ts', '.html', '.css', '.py', '.java', '.cpp', '.json', '.xml', '.md'},
            "archive": {'.zip', '.rar', '.7z', '.tar', '.gz', '.bz2'}
        }
        
        for category, extensions in categories.items():
            if extension in extensions:
                return category
        
        return "other"
    
    def is_text_file(self, file_path: Path) -> bool:
        """Check if file is a text file that can be edited."""
        text_extensions = {
            '.txt', '.md', '.json', '.xml', '.yaml', '.yml', '.csv',
            '.js', '.ts', '.jsx', '.tsx', '.html', '.css', '.scss',
            '.py', '.java', '.cpp', '.c', '.php', '.rb', '.go', '.rs',
            '.sql', '.sh', '.bat', '.ini', '.conf', '.log'
        }
        
        return file_path.suffix.lower() in text_extensions
    
    def process_upload(self, file_path: Path, user_id: str) -> Dict:
        """Process uploaded file and move to user directory."""
        validation = self.validate_file(file_path)
        
        if not validation["valid"]:
            return validation
        
        try:
            # Create user directory
            user_dir = self.upload_dir / user_id
            user_dir.mkdir(exist_ok=True)
            
            # Generate unique filename
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            unique_name = f"{timestamp}_{file_path.name}"
            destination = user_dir / unique_name
            
            # Move file to user directory
            file_path.rename(destination)
            
            logger.info(f"File processed successfully: {unique_name}")
            
            return {
                **validation,
                "file_path": str(destination),
                "unique_name": unique_name,
                "user_id": user_id,
                "url": f"/files/{user_id}/{unique_name}"
            }
            
        except Exception as e:
            logger.error(f"Error processing file: {str(e)}")
            return {"valid": False, "error": f"Processing error: {str(e)}"}
    
    def get_user_files(self, user_id: str) -> List[Dict]:
        """Get list of files for a specific user."""
        user_dir = self.upload_dir / user_id
        
        if not user_dir.exists():
            return []
        
        files = []
        for file_path in user_dir.iterdir():
            if file_path.is_file():
                stat = file_path.stat()
                validation = self.validate_file(file_path)
                
                files.append({
                    "name": file_path.name,
                    "size": stat.st_size,
                    "modified": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                    "path": str(file_path),
                    "category": validation.get("category", "other"),
                    "mime_type": validation.get("mime_type"),
                    "hash": validation.get("hash"),
                    "is_text": validation.get("is_text", False)
                })
        
        return sorted(files, key=lambda x: x["modified"], reverse=True)
    
    def cleanup_old_files(self, days: int = 30) -> int:
        """Clean up files older than specified days."""
        cutoff = datetime.now().timestamp() - (days * 24 * 60 * 60)
        removed_count = 0
        
        try:
            for user_dir in self.upload_dir.iterdir():
                if user_dir.is_dir():
                    for file_path in user_dir.iterdir():
                        if file_path.is_file() and file_path.stat().st_mtime < cutoff:
                            file_path.unlink()
                            removed_count += 1
                            logger.info(f"Removed old file: {file_path}")
            
            logger.info(f"Cleanup completed: {removed_count} files removed")
            return removed_count
            
        except Exception as e:
            logger.error(f"Cleanup error: {str(e)}")
            return 0
    
    def get_statistics(self) -> Dict:
        """Get file system statistics."""
        stats = {
            "total_files": 0,
            "total_size": 0,
            "categories": {},
            "users": 0,
            "last_upload": None
        }
        
        try:
            for user_dir in self.upload_dir.iterdir():
                if user_dir.is_dir():
                    stats["users"] += 1
                    
                    for file_path in user_dir.iterdir():
                        if file_path.is_file():
                            stats["total_files"] += 1
                            file_stat = file_path.stat()
                            stats["total_size"] += file_stat.st_size
                            
                            # Update last upload time
                            if not stats["last_upload"] or file_stat.st_mtime > stats["last_upload"]:
                                stats["last_upload"] = file_stat.st_mtime
                            
                            # Count by category
                            category = self.get_file_category(file_path.suffix.lower())
                            stats["categories"][category] = stats["categories"].get(category, 0) + 1
            
            # Convert timestamp to ISO format
            if stats["last_upload"]:
                stats["last_upload"] = datetime.fromtimestamp(stats["last_upload"]).isoformat()
            
            return stats
            
        except Exception as e:
            logger.error(f"Statistics error: {str(e)}")
            return stats

def main():
    """Demo script execution with comprehensive examples."""
    print("🚀 YukiFiles File Processor Demo")
    print("=" * 50)
    
    # Initialize processor
    processor = FileProcessor()
    
    # Demo file processing
    demo_file = Path("demo_upload.txt")
    if not demo_file.exists():
        # Create a demo file
        with open(demo_file, 'w') as f:
            f.write("This is a demo file for YukiFiles processing.\\n")
            f.write(f"Created at: {datetime.now()}\\n")
            f.write("File type: Text document\\n")
    
    print(f"📁 Processing demo file: {demo_file}")
    result = processor.process_upload(demo_file, "demo_user")
    print(f"✅ Processing result: {json.dumps(result, indent=2)}")
    
    # Get user files
    print("\\n📋 Getting user files...")
    user_files = processor.get_user_files("demo_user")
    print(f"👤 User has {len(user_files)} files")
    
    for file_info in user_files:
        print(f"  📄 {file_info['name']} ({file_info['size']} bytes)")
    
    # Get statistics
    print("\\n📊 File system statistics:")
    stats = processor.get_statistics()
    print(f"  Total files: {stats['total_files']}")
    print(f"  Total size: {stats['total_size']} bytes")
    print(f"  Active users: {stats['users']}")
    print(f"  Categories: {stats['categories']}")
    
    # Cleanup demo
    print("\\n🧹 Running cleanup (demo - 0 days)...")
    removed = processor.cleanup_old_files(0)
    print(f"🗑️  Cleaned up {removed} files")
    
    print("\\n✨ Demo completed successfully!")

if __name__ == "__main__":
    main()`
  },
  {
    id: '7',
    name: 'Documents',
    type: 'folder',
    size: 0,
    lastModified: new Date('2024-01-09'),
    path: '/'
  },
  {
    id: '8',
    name: 'Images',
    type: 'folder',
    size: 0,
    lastModified: new Date('2024-01-08'),
    path: '/'
  }
]

// File type icons mapping
const fileTypeIcons: { [key: string]: LucideIcon } = {
  'javascript': FileCode,
  'typescript': FileCode,
  'python': FileCode,
  'java': FileCode,
  'cpp': FileCode,
  'html': FileCode,
  'css': FileCode,
  'json': FileText,
  'xml': FileText,
  'yaml': FileText,
  'md': FileText,
  'txt': FileText,
  'pdf': FileText,
  'doc': FileText,
  'docx': FileText,
  'xls': FileText,
  'xlsx': FileText,
  'jpg': FileImage,
  'jpeg': FileImage,
  'png': FileImage,
  'gif': FileImage,
  'svg': FileImage,
  'webp': FileImage,
  'mp3': Music,
  'wav': Music,
  'flac': Music,
  'mp4': Video,
  'avi': Video,
  'mov': Video,
  'zip': FileArchive,
  'rar': FileArchive,
  'tar': FileArchive,
  'sql': Database,
  'db': Database,
  'folder': Folder,
  'default': FileText
}

const getFileIcon = (file: DemoFile): LucideIcon => {
  if (file.type === 'folder') return file.name === 'Projects' ? FolderOpen : Folder
  
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  return fileTypeIcons[ext] || fileTypeIcons['default']
}

const getFileTypeColor = (file: DemoFile): string => {
  if (file.type === 'folder') return 'text-blue-400'
  
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  
  const colors: { [key: string]: string } = {
    'js': 'text-yellow-400',
    'ts': 'text-blue-400',
    'jsx': 'text-cyan-400',
    'tsx': 'text-cyan-400',
    'py': 'text-green-400',
    'java': 'text-red-400',
    'cpp': 'text-blue-500',
    'html': 'text-orange-400',
    'css': 'text-blue-400',
    'json': 'text-yellow-300',
    'md': 'text-gray-300',
    'txt': 'text-gray-300',
    'pdf': 'text-red-400',
    'jpg': 'text-green-400',
    'png': 'text-green-400',
    'mp3': 'text-purple-400',
    'mp4': 'text-red-400',
    'zip': 'text-yellow-400'
  }
  
  return colors[ext] || 'text-gray-400'
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

const isTextFile = (file: DemoFile): boolean => {
  if (file.type === 'folder') return false
  const textExtensions = ['txt', 'md', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'xml', 'yaml', 'yml', 'py', 'java', 'cpp', 'sql']
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  return textExtensions.includes(ext)
}

export default function DemoFileManager() {
  const [files, setFiles] = useState<DemoFile[]>(initialDemoFiles)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPath, setCurrentPath] = useState('/')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [createType, setCreateType] = useState<'file' | 'folder'>('file')
  const [newItemName, setNewItemName] = useState('')
  const [newFileType, setNewFileType] = useState('txt')
  const [newFileContent, setNewFileContent] = useState('')
  const [editingFile, setEditingFile] = useState<DemoFile | null>(null)
  const [showUploadDialog, setShowUploadDialog] = useState(false)

  // Filter files based on search and current path
  const filteredFiles = files.filter(file => {
    const matchesSearch = !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPath = file.path === currentPath
    return matchesSearch && matchesPath
  })

  // Handle file creation
  const handleCreateItem = useCallback(() => {
    if (!newItemName.trim()) return

    const newFile: DemoFile = {
      id: Date.now().toString(),
      name: createType === 'folder' 
        ? newItemName.trim()
        : newItemName.trim() + (newItemName.includes('.') ? '' : `.${newFileType}`),
      type: createType,
      size: createType === 'folder' ? 0 : newFileContent.length,
      lastModified: new Date(),
      path: currentPath,
      content: createType === 'file' ? newFileContent : undefined,
      mimeType: createType === 'file' ? `text/${newFileType}` : undefined
    }

    setFiles(prev => [...prev, newFile])
    setNewItemName('')
    setNewFileContent('')
    setShowCreateDialog(false)
  }, [newItemName, createType, newFileType, newFileContent, currentPath])

  // Handle file upload simulation
  const handleUpload = useCallback(() => {
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      if (target.files) {
        Array.from(target.files).forEach(file => {
          const newFile: DemoFile = {
            id: Date.now().toString() + Math.random(),
            name: file.name,
            type: 'file',
            size: file.size,
            lastModified: new Date(),
            path: currentPath,
            mimeType: file.type,
            content: isTextFile({ name: file.name, type: 'file' } as DemoFile) 
              ? `// Uploaded file: ${file.name}\n// This is demo content for the uploaded file.\n\nconsole.log('File uploaded successfully!');`
              : undefined
          }
          setFiles(prev => [...prev, newFile])
        })
      }
    }
    input.click()
  }, [currentPath])

  // Handle file actions
  const handleFileAction = useCallback((action: string, file: DemoFile) => {
    switch (action) {
      case 'edit':
        if (isTextFile(file)) {
          setEditingFile(file)
        }
        break
      case 'download':
        console.log('Download:', file.name)
        break
      case 'share':
        navigator.clipboard.writeText(`https://demo.yukifiles.com/share/${file.id}`)
        break
      case 'delete':
        setFiles(prev => prev.filter(f => f.id !== file.id))
        break
      case 'star':
        setFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, isStarred: !f.isStarred } : f
        ))
        break
    }
  }, [])

  const renderFileItem = (file: DemoFile) => {
    const FileIcon = getFileIcon(file)
    const isSelected = selectedFiles.includes(file.id)
    const colorClass = getFileTypeColor(file)

    if (viewMode === 'grid') {
      return (
        <motion.div
          key={file.id}
          layout
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            "group relative p-4 rounded-lg border cursor-pointer transition-all duration-200",
            isSelected 
              ? "bg-purple-500/20 border-purple-500" 
              : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30"
          )}
          onClick={() => {
            if (file.type === 'folder') {
              setCurrentPath(file.path + file.name + '/')
            } else if (isTextFile(file)) {
              setEditingFile(file)
            }
          }}
        >
          <div className="flex flex-col items-center space-y-3">
            <div className={cn(
              "w-16 h-16 rounded-lg flex items-center justify-center",
              file.type === 'folder' ? "bg-blue-500/20" : "bg-purple-500/20"
            )}>
              <FileIcon className={cn("w-8 h-8", colorClass)} />
            </div>
            <div className="text-center min-w-0 w-full">
              <p className="text-sm font-medium text-white truncate" title={file.name}>
                {file.name}
              </p>
              {file.type === 'file' && (
                <p className="text-xs text-gray-400">
                  {formatFileSize(file.size)}
                </p>
              )}
              <p className="text-xs text-gray-500">
                {formatDate(file.lastModified)}
              </p>
            </div>
          </div>

          {file.isStarred && (
            <div className="absolute top-2 left-2">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            </div>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isTextFile(file) && (
                <DropdownMenuItem onClick={() => handleFileAction('edit', file)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleFileAction('share', file)}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileAction('download', file)}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileAction('star', file)}>
                {file.isStarred ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Unstar
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Star
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleFileAction('delete', file)}
                className="text-red-400 focus:text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      )
    }

    // List view (simplified for space)
    return (
      <motion.div
        key={file.id}
        layout
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={cn(
          "group flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200",
          isSelected 
            ? "bg-purple-500/20 border-purple-500" 
            : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/30"
        )}
        onClick={() => {
          if (file.type === 'folder') {
            setCurrentPath(file.path + file.name + '/')
          } else if (isTextFile(file)) {
            setEditingFile(file)
          }
        }}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <FileIcon className={cn("w-5 h-5", colorClass)} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{file.name}</p>
            <p className="text-xs text-gray-400">
              {file.type === 'file' ? formatFileSize(file.size) : 'Folder'} • {formatDate(file.lastModified)}
            </p>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isTextFile(file) && (
              <DropdownMenuItem onClick={() => handleFileAction('edit', file)}>
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleFileAction('share', file)}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFileAction('download', file)}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => handleFileAction('delete', file)}
              className="text-red-400 focus:text-red-400"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>
    )
  }

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader className="border-b border-white/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Folder className="w-5 h-5 mr-2 text-purple-400" />
            File Manager Demo
            <Badge variant="outline" className="ml-2 border-purple-500 text-purple-300">
              {filteredFiles.length} items
            </Badge>
          </CardTitle>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400 w-64"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => {
                  setCreateType('file')
                  setShowCreateDialog(true)
                }}>
                  <FilePlus className="w-4 h-4 mr-2" />
                  New File
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  setCreateType('folder')
                  setShowCreateDialog(true)
                }}>
                  <FolderPlus className="w-4 h-4 mr-2" />
                  New Folder
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleUpload}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Files
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <div className="flex border border-white/10 rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Breadcrumb */}
        {currentPath !== '/' && (
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPath('/')}
              className="text-purple-400 hover:text-purple-300"
            >
              ← Back to root
            </Button>
          </div>
        )}

        {filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              {searchQuery ? 'No files found' : 'No files in this folder'}
            </h3>
            <p className="text-gray-400 mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Create your first file or upload files to get started.'}
            </p>
            <div className="flex justify-center space-x-3">
              <Button
                onClick={() => {
                  setCreateType('file')
                  setShowCreateDialog(true)
                }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <FilePlus className="w-4 h-4 mr-2" />
                Create File
              </Button>
              <Button
                onClick={handleUpload}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" 
                : "space-y-2"
            )}>
              {filteredFiles.map(renderFileItem)}
            </div>
          </AnimatePresence>
        )}
      </CardContent>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              Create New {createType === 'folder' ? 'Folder' : 'File'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {createType === 'folder' 
                ? 'Enter a name for your new folder.' 
                : 'Create a new file with optional content.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Name</Label>
              <Input
                id="name"
                placeholder={createType === 'folder' ? 'Folder name' : 'File name'}
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="bg-white/5 border-white/10 text-white"
              />
            </div>
            
            {createType === 'file' && (
              <>
                <div>
                  <Label htmlFor="type" className="text-white">File Type</Label>
                  <Select value={newFileType} onValueChange={setNewFileType}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="txt">Text (.txt)</SelectItem>
                      <SelectItem value="md">Markdown (.md)</SelectItem>
                      <SelectItem value="js">JavaScript (.js)</SelectItem>
                      <SelectItem value="ts">TypeScript (.ts)</SelectItem>
                      <SelectItem value="py">Python (.py)</SelectItem>
                      <SelectItem value="html">HTML (.html)</SelectItem>
                      <SelectItem value="css">CSS (.css)</SelectItem>
                      <SelectItem value="json">JSON (.json)</SelectItem>
                      <SelectItem value="sql">SQL (.sql)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="content" className="text-white">Content (Optional)</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter file content..."
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    className="bg-white/5 border-white/10 text-white min-h-[100px]"
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="border-white/10 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateItem}
              disabled={!newItemName.trim()}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* File Editor Dialog */}
      {editingFile && (
        <Dialog open={!!editingFile} onOpenChange={() => setEditingFile(null)}>
          <DialogContent className="max-w-6xl h-[80vh] p-0 bg-slate-900 border-white/10">
            <FileEditor
              file={{
                id: editingFile.id,
                name: editingFile.name,
                content: editingFile.content || '',
                type: editingFile.mimeType || 'text/plain',
                size: editingFile.size,
                lastModified: editingFile.lastModified
              }}
              onSave={(content) => {
                setFiles(prev => prev.map(f => 
                  f.id === editingFile.id 
                    ? { ...f, content, size: content.length, lastModified: new Date() }
                    : f
                ))
                setEditingFile(null)
              }}
              onClose={() => setEditingFile(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  )
}