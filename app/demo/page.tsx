"use client"

import { useState } from "react"
import { EnhancedFileManager } from "@/components/file-manager/enhanced-file-manager"
import { NavigationWrapper } from "@/components/ui/navigation-wrapper"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlayCircle, FileText, Code, Image, Video, Music } from "lucide-react"

export default function DemoPage() {
  const [user] = useState({ email: "demo@yukifiles.com", id: "demo-user" })
  const [userData] = useState({
    subscription_type: "premium",
    is_admin: false
  })

  // Demo files with rich content for testing
  const demoFiles = [
    {
      id: 'demo-welcome',
      name: 'Welcome-to-YukiFiles.md',
      type: 'text/markdown',
      size: 2500,
      lastModified: new Date(),
      isFolder: false,
      content: `# Welcome to YukiFiles Demo! 🎉

## What is YukiFiles?

YukiFiles is a **premium file management platform** designed for modern developers and teams. This demo showcases all our powerful features in action.

### ✨ Key Features

- **🎨 Advanced File Editor** - Edit code with syntax highlighting
- **📁 Smart File Management** - Organize files with ease
- **☁️ Cloud Storage** - Secure and fast file storage
- **🔄 Real-time Collaboration** - Work together seamlessly
- **📊 Analytics Dashboard** - Track your file usage
- **🔒 Enterprise Security** - Bank-level encryption

### 🚀 Getting Started

1. **Upload Files** - Drag & drop or click the upload button
2. **Edit Content** - Click on any text file to open our editor
3. **Organize** - Create folders and manage your files
4. **Share** - Generate secure sharing links
5. **Collaborate** - Invite team members

### 💎 Premium Features

This demo includes all **premium features**:

- ✅ Unlimited storage
- ✅ Advanced file editor
- ✅ Real-time collaboration
- ✅ Custom branding
- ✅ API access
- ✅ Priority support

### 🛠️ Technical Specifications

\`\`\`typescript
const yukiFiles = {
  storage: "Unlimited",
  bandwidth: "1TB/month",
  fileTypes: "All formats supported",
  api: "RESTful API",
  security: "AES-256 encryption",
  uptime: "99.9% SLA"
}
\`\`\`

---

**Ready to get started?** [Sign up for free](/auth/register) and experience the power of YukiFiles!`,
      path: '/demo'
    },
    {
      id: 'demo-javascript',
      name: 'demo-script.js',
      type: 'application/javascript',
      size: 1800,
      lastModified: new Date(),
      isFolder: false,
      content: `// YukiFiles Demo Script
// This file demonstrates JavaScript syntax highlighting

console.log("Welcome to YukiFiles Demo!");

// File Management Class
class FileManager {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.files = [];
    this.uploadQueue = [];
  }

  // Upload a file
  async uploadFile(file) {
    try {
      console.log(\`Uploading: \${file.name}\`);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        },
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        this.files.push(result.file);
        console.log('Upload successful!', result);
        return result;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  // Get all files
  async getFiles() {
    try {
      const response = await fetch('/api/files', {
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        }
      });
      
      const data = await response.json();
      this.files = data.files;
      return this.files;
    } catch (error) {
      console.error('Failed to fetch files:', error);
      return [];
    }
  }

  // Delete a file
  async deleteFile(fileId) {
    try {
      const response = await fetch(\`/api/files/\${fileId}\`, {
        method: 'DELETE',
        headers: {
          'Authorization': \`Bearer \${this.apiKey}\`
        }
      });
      
      if (response.ok) {
        this.files = this.files.filter(f => f.id !== fileId);
        console.log(\`File \${fileId} deleted successfully\`);
        return true;
      }
    } catch (error) {
      console.error('Delete error:', error);
      return false;
    }
  }
}

// Usage example
const fileManager = new FileManager('your-api-key-here');

// Event listeners
document.addEventListener('DOMContentLoaded', async () => {
  console.log('YukiFiles Demo loaded!');
  
  // Load existing files
  const files = await fileManager.getFiles();
  console.log('Current files:', files);
  
  // Setup file upload
  const uploadInput = document.getElementById('file-upload');
  if (uploadInput) {
    uploadInput.addEventListener('change', async (event) => {
      const files = Array.from(event.target.files);
      
      for (const file of files) {
        try {
          await fileManager.uploadFile(file);
        } catch (error) {
          alert(\`Failed to upload \${file.name}\`);
        }
      }
    });
  }
});

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const getFileExtension = (filename) => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

const isImageFile = (filename) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  return imageExtensions.includes(getFileExtension(filename));
};

// Export for use in other modules
export { FileManager, formatFileSize, getFileExtension, isImageFile };`,
      path: '/demo'
    },
    {
      id: 'demo-python',
      name: 'data_analyzer.py',
      type: 'text/x-python',
      size: 2200,
      lastModified: new Date(),
      isFolder: false,
      content: `#!/usr/bin/env python3
"""
YukiFiles Demo - Python Data Analyzer
Demonstrates Python syntax highlighting in the file editor
"""

import json
import pandas as pd
from datetime import datetime
from typing import List, Dict, Any

class FileAnalytics:
    """Analytics engine for file management insights"""
    
    def __init__(self):
        self.data = []
        self.reports = {}
    
    def load_data(self, source: str = "api") -> bool:
        """Load file data from various sources"""
        try:
            if source == "api":
                # Simulate API call
                self.data = self._generate_sample_data()
                print(f"Loaded {len(self.data)} records from API")
                return True
            elif source == "file":
                # Load from JSON file
                with open("file_data.json", "r") as f:
                    self.data = json.load(f)
                return True
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def _generate_sample_data(self) -> List[Dict[str, Any]]:
        """Generate sample file data for demo"""
        import random
        
        file_types = ['.txt', '.pdf', '.jpg', '.png', '.mp4', '.docx']
        users = ['alice', 'bob', 'charlie', 'diana', 'eve']
        
        data = []
        for i in range(100):
            file_record = {
                'id': f'file_{i:03d}',
                'name': f'document_{i}{random.choice(file_types)}',
                'size': random.randint(1024, 10*1024*1024),  # 1KB to 10MB
                'created_at': datetime.now().isoformat(),
                'downloads': random.randint(0, 50),
                'user': random.choice(users),
                'is_shared': random.choice([True, False])
            }
            data.append(file_record)
        
        return data
    
    def analyze_file_types(self) -> Dict[str, int]:
        """Analyze distribution of file types"""
        type_counts = {}
        
        for record in self.data:
            # Extract file extension
            name = record.get('name', '')
            ext = name.split('.')[-1] if '.' in name else 'unknown'
            type_counts[ext] = type_counts.get(ext, 0) + 1
        
        # Sort by count (descending)
        sorted_types = dict(sorted(type_counts.items(), 
                                 key=lambda x: x[1], reverse=True))
        
        self.reports['file_types'] = sorted_types
        return sorted_types
    
    def analyze_storage_usage(self) -> Dict[str, float]:
        """Calculate storage usage statistics"""
        if not self.data:
            return {}
        
        total_size = sum(record.get('size', 0) for record in self.data)
        avg_size = total_size / len(self.data)
        
        # Size by user
        user_sizes = {}
        for record in self.data:
            user = record.get('user', 'unknown')
            size = record.get('size', 0)
            user_sizes[user] = user_sizes.get(user, 0) + size
        
        storage_stats = {
            'total_gb': total_size / (1024**3),
            'average_mb': avg_size / (1024**2),
            'user_distribution': user_sizes
        }
        
        self.reports['storage'] = storage_stats
        return storage_stats
    
    def generate_report(self) -> str:
        """Generate comprehensive analytics report"""
        
        # Run analyses
        file_types = self.analyze_file_types()
        storage = self.analyze_storage_usage()
        
        report = f"""
YukiFiles Analytics Report
Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
{'='*50}

📊 OVERVIEW
Total Files: {len(self.data):,}
Total Storage: {storage.get('total_gb', 0):.2f} GB
Average File Size: {storage.get('average_mb', 0):.2f} MB

📁 FILE TYPES
"""
        
        for file_type, count in list(file_types.items())[:5]:
            percentage = (count / len(self.data)) * 100
            report += f"  {file_type}: {count:,} files ({percentage:.1f}%)\\n"
        
        report += f"""
👥 TOP USERS BY STORAGE
"""
        
        user_sizes = storage.get('user_distribution', {})
        sorted_users = sorted(user_sizes.items(), key=lambda x: x[1], reverse=True)
        
        for user, size in sorted_users[:5]:
            size_mb = size / (1024**2)
            report += f"  {user}: {size_mb:.1f} MB\\n"
        
        report += f"""
{'='*50}
✅ Report generation complete!
"""
        
        return report

# Usage example
if __name__ == "__main__":
    print("🚀 Starting YukiFiles Analytics Demo...")
    
    # Initialize analytics engine
    analytics = FileAnalytics()
    
    # Load and analyze data
    if analytics.load_data():
        print("\\n📈 Generating analytics report...")
        report = analytics.generate_report()
        print(report)
        
        # Save report to file
        with open("analytics_report.txt", "w") as f:
            f.write(report)
        
        print("💾 Report saved to 'analytics_report.txt'")
    else:
        print("❌ Failed to load data")`,
      path: '/demo'
    },
    {
      id: 'demo-config',
      name: 'app-config.json',
      type: 'application/json',
      size: 1200,
      lastModified: new Date(),
      isFolder: false,
      content: `{
  "app": {
    "name": "YukiFiles Demo",
    "version": "2.1.0",
    "description": "Premium file management platform",
    "environment": "demo"
  },
  "features": {
    "fileEditor": {
      "enabled": true,
      "supportedLanguages": [
        "javascript", "typescript", "python", "html", "css",
        "json", "markdown", "sql", "yaml", "xml", "php"
      ],
      "maxFileSize": "100MB",
      "autoSave": true,
      "syntaxHighlighting": true,
      "lineNumbers": true,
      "wordWrap": true,
      "search": true,
      "replace": true
    },
    "fileUpload": {
      "enabled": true,
      "dragAndDrop": true,
      "multipleFiles": true,
      "progressTracking": true,
      "maxFileSize": "500MB",
      "allowedTypes": ["*/*"],
      "storageQuota": "10GB"
    },
    "fileSharing": {
      "enabled": true,
      "passwordProtection": true,
      "expirationDates": true,
      "downloadLimits": true,
      "analytics": true
    }
  },
  "ui": {
    "theme": {
      "default": "premium",
      "options": ["light", "dark", "premium"],
      "customization": true
    },
    "layout": {
      "gridView": true,
      "listView": true,
      "defaultView": "grid"
    },
    "animations": {
      "enabled": true,
      "duration": 300,
      "easing": "ease-in-out"
    }
  },
  "demo": {
    "sampleFiles": 5,
    "mockData": true,
    "fullFeatures": true,
    "limitations": {
      "maxUploadSize": "10MB",
      "maxFiles": 20,
      "sessionTimeout": "30min"
    }
  }
}`,
      path: '/demo'
    },
    {
      id: 'demo-readme',
      name: 'README.txt',
      type: 'text/plain',
      size: 800,
      lastModified: new Date(),
      isFolder: false,
      content: `YukiFiles Demo Environment
=========================

Welcome to the YukiFiles interactive demo!

This demo showcases all the premium features of our file management platform:

✨ FEATURES INCLUDED:
- Advanced file editor with syntax highlighting
- Smart file upload with progress tracking
- Drag & drop file management
- Real-time file editing
- Multiple view modes (grid/list)
- Search and filter capabilities
- File sharing and collaboration tools

🎯 WHAT TO TRY:
1. Click on any file to open the advanced editor
2. Try uploading files using the upload button
3. Switch between grid and list views
4. Use the search functionality
5. Right-click files for context menu options
6. Test the responsive mobile interface

📝 SAMPLE FILES:
- Welcome-to-YukiFiles.md: Markdown with formatting
- demo-script.js: JavaScript with syntax highlighting
- data_analyzer.py: Python script example
- app-config.json: JSON configuration file
- README.txt: This plain text file

🔧 TECHNICAL NOTES:
- All data is simulated for demo purposes
- File editor supports 10+ programming languages
- Upload functionality is fully interactive
- Mobile-responsive design optimized for all devices

💡 NEXT STEPS:
Ready to experience the full power of YukiFiles?
- Sign up for a free account
- Import your existing files
- Invite team members
- Start collaborating!

For more information, visit: https://yukifiles.com
Support: support@yukifiles.com

Thank you for trying YukiFiles! 🚀`,
      path: '/demo'
    }
  ]

  return (
    <div className="min-h-screen theme-premium">
      <NavigationWrapper 
        brandName="YukiFiles Demo" 
        isAuthenticated={true} 
        isAdmin={false} 
      />
      
      {/* Demo Header */}
      <div className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border-purple-500/30 px-4 py-2">
                <PlayCircle className="w-4 h-4 mr-2" />
                Interactive Demo
              </Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Experience 
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"> YukiFiles</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
              Try all our premium features including the advanced file editor, smart upload system, and intuitive file management. Click on any file to start editing!
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>File Editor</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Code className="w-4 h-4 text-pink-400" />
                <span>Syntax Highlighting</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Image className="w-4 h-4 text-blue-400" />
                <span>All File Types</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Video className="w-4 h-4 text-green-400" />
                <span>Real-time Preview</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Music className="w-4 h-4 text-yellow-400" />
                <span>Smart Upload</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Demo File Manager */}
      <main className="container mx-auto px-4 pb-12">
        <EnhancedFileManager 
          files={demoFiles}
          onFileSelect={(file) => console.log('Demo file selected:', file)}
          onFileEdit={(file) => console.log('Demo file edit:', file)}
          onFileDelete={(fileId) => console.log('Demo file delete:', fileId)}
          onFileShare={(fileId) => console.log('Demo file share:', fileId)}
          onFileDownload={(fileId) => console.log('Demo file download:', fileId)}
          onFileUpload={(files) => console.log('Demo files upload:', files)}
        />
      </main>

      {/* Call to Action */}
      <div className="container mx-auto px-4 pb-12">
        <Card className="premium-card text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-white mb-4">
              Ready to get started?
            </CardTitle>
            <p className="text-gray-300 mb-6">
              Join thousands of users who trust YukiFiles for their file management needs.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              asChild
            >
              <a href="/auth/register">Start Free Trial</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-500 text-purple-300 hover:bg-purple-500/10 text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
              asChild
            >
              <a href="/pricing">View Pricing</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

