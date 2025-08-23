/**
 * YukiFiles V2.0 - Demo Scenarios
 * 
 * This file defines specific demo scenarios that guide users through
 * real-world use cases with step-by-step interactive experiences.
 */

import { DemoScenario, DemoStep, DemoAction, DemoFile } from './demo-architecture'

// ====================================================================
// DEMO SCENARIOS CONFIGURATION
// ====================================================================

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'personal-file-management',
    title: 'Personal File Management',
    description: 'Learn how to upload, organize, and manage your personal files efficiently',
    icon: '📁',
    estimatedTime: 5,
    difficulty: 'beginner',
    category: 'file-management',
    expectedOutcome: 'Understand basic file operations and organization',
    steps: [
      {
        id: 'upload-files',
        title: 'Upload Your First Files',
        description: 'Start by uploading some files to experience our drag-and-drop interface',
        component: 'UploadDemo',
        duration: 90,
        isCompleted: false,
        isOptional: false,
        prerequisites: [],
        learningObjectives: [
          'Understand drag-and-drop file upload',
          'Learn about file type support',
          'See real-time upload progress'
        ],
        actions: [
          {
            id: 'click-upload-area',
            type: 'click',
            target: '.upload-area',
            description: 'Click the upload area to select files',
            expectedResult: 'File picker opens',
            tooltip: 'This opens your file browser',
            highlight: true
          },
          {
            id: 'drag-files',
            type: 'upload',
            target: '.upload-dropzone',
            description: 'Drag and drop files here',
            expectedResult: 'Files are uploaded and appear in your library',
            tooltip: 'You can drag multiple files at once',
            highlight: true
          }
        ]
      },
      {
        id: 'organize-files',
        title: 'Organize with Folders',
        description: 'Create folders and organize your files for better management',
        component: 'OrganizeDemo',
        duration: 120,
        isCompleted: false,
        isOptional: false,
        prerequisites: ['upload-files'],
        learningObjectives: [
          'Create and name folders',
          'Move files between folders',
          'Understand folder hierarchy'
        ],
        actions: [
          {
            id: 'create-folder',
            type: 'click',
            target: '.create-folder-btn',
            description: 'Create a new folder',
            expectedResult: 'Folder creation dialog opens',
            tooltip: 'Keep your files organized',
            highlight: true
          },
          {
            id: 'move-files',
            type: 'organize',
            target: '.file-item',
            description: 'Drag files into folders',
            expectedResult: 'Files are moved to the target folder',
            tooltip: 'Drag and drop to organize',
            highlight: false
          }
        ]
      },
      {
        id: 'star-important-files',
        title: 'Star Important Files',
        description: 'Mark important files with stars for quick access',
        component: 'StarDemo',
        duration: 60,
        isCompleted: false,
        isOptional: true,
        prerequisites: ['upload-files'],
        learningObjectives: [
          'Mark files as favorites',
          'Access starred files quickly',
          'Understand file metadata'
        ],
        actions: [
          {
            id: 'star-file',
            type: 'click',
            target: '.star-button',
            description: 'Click the star icon on a file',
            expectedResult: 'File is marked as starred',
            tooltip: 'Starred files appear in your favorites',
            highlight: true
          }
        ]
      }
    ],
    sampleFiles: []
  },
  
  {
    id: 'team-collaboration',
    title: 'Team Collaboration',
    description: 'Experience real-time collaboration features with team members',
    icon: '👥',
    estimatedTime: 8,
    difficulty: 'intermediate',
    category: 'collaboration',
    expectedOutcome: 'Master team collaboration workflows',
    steps: [
      {
        id: 'invite-team-members',
        title: 'Invite Team Members',
        description: 'Add team members to collaborate on files and projects',
        component: 'InviteDemo',
        duration: 120,
        isCompleted: false,
        isOptional: false,
        prerequisites: [],
        learningObjectives: [
          'Send team invitations',
          'Set permission levels',
          'Manage team access'
        ],
        actions: [
          {
            id: 'click-invite',
            type: 'click',
            target: '.invite-button',
            description: 'Open team invitation dialog',
            expectedResult: 'Invitation form appears',
            tooltip: 'Collaborate with your team',
            highlight: true
          },
          {
            id: 'set-permissions',
            type: 'click',
            target: '.permission-selector',
            description: 'Set appropriate permissions',
            expectedResult: 'Permission level is selected',
            tooltip: 'Control what team members can do',
            highlight: true
          }
        ]
      },
      {
        id: 'real-time-editing',
        title: 'Real-time Collaboration',
        description: 'See live updates as team members work on shared files',
        component: 'RealTimeDemo',
        duration: 180,
        isCompleted: false,
        isOptional: false,
        prerequisites: ['invite-team-members'],
        learningObjectives: [
          'Experience real-time updates',
          'See team member cursors',
          'Understand collaboration indicators'
        ],
        actions: [
          {
            id: 'open-shared-file',
            type: 'click',
            target: '.shared-file',
            description: 'Open a file shared by team member',
            expectedResult: 'File opens with collaboration indicators',
            tooltip: 'See who else is viewing the file',
            highlight: true
          }
        ]
      },
      {
        id: 'comment-and-feedback',
        title: 'Comments & Feedback',
        description: 'Add comments and give feedback on team files',
        component: 'CommentDemo',
        duration: 150,
        isCompleted: false,
        isOptional: false,
        prerequisites: ['real-time-editing'],
        learningObjectives: [
          'Add file comments',
          'Reply to feedback',
          'Resolve discussions'
        ],
        actions: [
          {
            id: 'add-comment',
            type: 'click',
            target: '.comment-button',
            description: 'Add a comment to the file',
            expectedResult: 'Comment form opens',
            tooltip: 'Share your thoughts with the team',
            highlight: true
          }
        ]
      }
    ],
    sampleFiles: []
  },
  
  {
    id: 'client-file-sharing',
    title: 'Client File Sharing',
    description: 'Create secure, professional share links for clients and external partners',
    icon: '🔗',
    estimatedTime: 6,
    difficulty: 'intermediate',
    category: 'sharing',
    expectedOutcome: 'Master professional file sharing workflows',
    steps: [
      {
        id: 'create-share-link',
        title: 'Create Share Link',
        description: 'Generate a secure share link for your files',
        component: 'ShareLinkDemo',
        duration: 90,
        isCompleted: false,
        isOptional: false,
        prerequisites: [],
        learningObjectives: [
          'Generate secure share links',
          'Understand link settings',
          'Copy and distribute links'
        ],
        actions: [
          {
            id: 'click-share',
            type: 'share',
            target: '.share-button',
            description: 'Click share button on a file',
            expectedResult: 'Share dialog opens',
            tooltip: 'Share files securely with anyone',
            highlight: true
          },
          {
            id: 'copy-link',
            type: 'click',
            target: '.copy-link-button',
            description: 'Copy the generated share link',
            expectedResult: 'Link is copied to clipboard',
            tooltip: 'Ready to send to your client',
            highlight: true
          }
        ]
      },
      {
        id: 'set-access-controls',
        title: 'Access Controls',
        description: 'Configure password protection and expiration dates',
        component: 'AccessControlDemo',
        duration: 120,
        isCompleted: false,
        isOptional: false,
        prerequisites: ['create-share-link'],
        learningObjectives: [
          'Set password protection',
          'Configure expiration dates',
          'Limit download counts'
        ],
        actions: [
          {
            id: 'set-password',
            type: 'click',
            target: '.password-toggle',
            description: 'Enable password protection',
            expectedResult: 'Password field appears',
            tooltip: 'Add extra security for sensitive files',
            highlight: true
          },
          {
            id: 'set-expiration',
            type: 'click',
            target: '.expiration-date',
            description: 'Set link expiration date',
            expectedResult: 'Date picker opens',
            tooltip: 'Control how long the link remains active',
            highlight: true
          }
        ]
      },
      {
        id: 'track-share-analytics',
        title: 'Track Share Analytics',
        description: 'Monitor who accessed your shared files and when',
        component: 'ShareAnalyticsDemo',
        duration: 90,
        isCompleted: false,
        isOptional: true,
        prerequisites: ['set-access-controls'],
        learningObjectives: [
          'View access statistics',
          'Track download counts',
          'Monitor visitor locations'
        ],
        actions: [
          {
            id: 'view-analytics',
            type: 'click',
            target: '.analytics-tab',
            description: 'Switch to analytics view',
            expectedResult: 'Analytics dashboard shows',
            tooltip: 'See detailed share statistics',
            highlight: true
          }
        ]
      }
    ],
    sampleFiles: []
  },
  
  {
    id: 'project-organization',
    title: 'Project Organization',
    description: 'Organize complex projects with advanced folder structures and tagging',
    icon: '📊',
    estimatedTime: 7,
    difficulty: 'advanced',
    category: 'organization',
    expectedOutcome: 'Master advanced file organization techniques',
    steps: [
      {
        id: 'create-project-structure',
        title: 'Project Structure',
        description: 'Set up a comprehensive folder structure for your project',
        component: 'ProjectStructureDemo',
        duration: 180,
        isCompleted: false,
        isOptional: false,
        prerequisites: [],
        learningObjectives: [
          'Design folder hierarchies',
          'Use naming conventions',
          'Create template structures'
        ],
        actions: [
          {
            id: 'create-nested-folders',
            type: 'organize',
            target: '.folder-creator',
            description: 'Create nested folder structure',
            expectedResult: 'Project hierarchy is established',
            tooltip: 'Build organized project structure',
            highlight: true
          }
        ]
      },
      {
        id: 'use-tags-and-metadata',
        title: 'Tags & Metadata',
        description: 'Add tags and metadata for better file discovery',
        component: 'TaggingDemo',
        duration: 150,
        isCompleted: false,
        isOptional: false,
        prerequisites: ['create-project-structure'],
        learningObjectives: [
          'Add descriptive tags',
          'Use metadata fields',
          'Search by attributes'
        ],
        actions: [
          {
            id: 'add-tags',
            type: 'click',
            target: '.tag-input',
            description: 'Add relevant tags to files',
            expectedResult: 'Tags are added and visible',
            tooltip: 'Tags help you find files quickly',
            highlight: true
          }
        ]
      },
      {
        id: 'advanced-search',
        title: 'Advanced Search',
        description: 'Use powerful search filters to find files instantly',
        component: 'SearchDemo',
        duration: 120,
        isCompleted: false,
        isOptional: true,
        prerequisites: ['use-tags-and-metadata'],
        learningObjectives: [
          'Use search filters',
          'Combine search criteria',
          'Save search queries'
        ],
        actions: [
          {
            id: 'use-search-filters',
            type: 'click',
            target: '.search-filters',
            description: 'Apply search filters',
            expectedResult: 'Filtered results appear',
            tooltip: 'Find exactly what you need',
            highlight: true
          }
        ]
      }
    ],
    sampleFiles: []
  },
  
  {
    id: 'media-management',
    title: 'Media Management',
    description: 'Handle photos, videos, and audio files with specialized tools',
    icon: '🎬',
    estimatedTime: 6,
    difficulty: 'intermediate',
    category: 'file-management',
    expectedOutcome: 'Efficiently manage media files with preview and editing tools',
    steps: [
      {
        id: 'media-preview',
        title: 'Media Preview',
        description: 'Preview images, videos, and audio files without downloading',
        component: 'MediaPreviewDemo',
        duration: 120,
        isCompleted: false,
        isOptional: false,
        prerequisites: [],
        learningObjectives: [
          'Preview different media types',
          'Use media player controls',
          'Navigate media galleries'
        ],
        actions: [
          {
            id: 'open-media-preview',
            type: 'click',
            target: '.media-thumbnail',
            description: 'Click on a media file to preview',
            expectedResult: 'Media player/viewer opens',
            tooltip: 'Preview without downloading',
            highlight: true
          }
        ]
      },
      {
        id: 'media-organization',
        title: 'Media Organization',
        description: 'Organize media files by date, type, or custom albums',
        component: 'MediaOrganizationDemo',
        duration: 150,
        isCompleted: false,
        isOptional: false,
        prerequisites: ['media-preview'],
        learningObjectives: [
          'Create media albums',
          'Auto-organize by date',
          'Group by file type'
        ],
        actions: [
          {
            id: 'create-album',
            type: 'organize',
            target: '.create-album',
            description: 'Create a new media album',
            expectedResult: 'Album is created and ready for media',
            tooltip: 'Keep your media organized',
            highlight: true
          }
        ]
      },
      {
        id: 'media-sharing',
        title: 'Media Sharing',
        description: 'Share photo galleries and video collections with others',
        component: 'MediaSharingDemo',
        duration: 90,
        isCompleted: false,
        isOptional: true,
        prerequisites: ['media-organization'],
        learningObjectives: [
          'Share media collections',
          'Create public galleries',
          'Embed media players'
        ],
        actions: [
          {
            id: 'share-gallery',
            type: 'share',
            target: '.share-gallery',
            description: 'Share an entire media gallery',
            expectedResult: 'Gallery share link is created',
            tooltip: 'Share beautiful media collections',
            highlight: true
          }
        ]
      }
    ],
    sampleFiles: []
  },
  
  {
    id: 'document-workflow',
    title: 'Document Workflow',
    description: 'Streamline document review, approval, and version control processes',
    icon: '📄',
    estimatedTime: 9,
    difficulty: 'advanced',
    category: 'collaboration',
    expectedOutcome: 'Master professional document workflows and version control',
    steps: [
      {
        id: 'version-control',
        title: 'Version Control',
        description: 'Track document versions and changes over time',
        component: 'VersionControlDemo',
        duration: 180,
        isCompleted: false,
        isOptional: false,
        prerequisites: [],
        learningObjectives: [
          'Upload document versions',
          'Compare version differences',
          'Restore previous versions'
        ],
        actions: [
          {
            id: 'upload-new-version',
            type: 'upload',
            target: '.version-upload',
            description: 'Upload a new version of the document',
            expectedResult: 'New version is tracked in history',
            tooltip: 'Keep track of all document changes',
            highlight: true
          }
        ]
      },
      {
        id: 'approval-workflow',
        title: 'Approval Workflow',
        description: 'Set up approval processes for important documents',
        component: 'ApprovalWorkflowDemo',
        duration: 200,
        isCompleted: false,
        isOptional: false,
        prerequisites: ['version-control'],
        learningObjectives: [
          'Create approval workflows',
          'Assign reviewers',
          'Track approval status'
        ],
        actions: [
          {
            id: 'request-approval',
            type: 'click',
            target: '.request-approval',
            description: 'Request approval for the document',
            expectedResult: 'Approval workflow is initiated',
            tooltip: 'Get stakeholder sign-off',
            highlight: true
          }
        ]
      },
      {
        id: 'digital-signatures',
        title: 'Digital Signatures',
        description: 'Add digital signatures for legal document validation',
        component: 'DigitalSignatureDemo',
        duration: 150,
        isCompleted: false,
        isOptional: true,
        prerequisites: ['approval-workflow'],
        learningObjectives: [
          'Add digital signatures',
          'Verify signature authenticity',
          'Download signed documents'
        ],
        actions: [
          {
            id: 'add-signature',
            type: 'click',
            target: '.signature-pad',
            description: 'Add your digital signature',
            expectedResult: 'Signature is applied to document',
            tooltip: 'Legally validate documents',
            highlight: true
          }
        ]
      }
    ],
    sampleFiles: []
  }
]

// ====================================================================
// DEMO DATA GENERATORS
// ====================================================================

export function generateSampleFiles(scenarioId: string): DemoFile[] {
  const baseFiles: Record<string, DemoFile[]> = {
    'personal-file-management': [
      {
        id: 'demo-doc-1',
        name: 'My Resume.pdf',
        type: 'file',
        mimeType: 'application/pdf',
        size: 245760,
        content: 'data:application/pdf;base64,sample-pdf-content',
        parentId: null,
        path: [],
        isStarred: false,
        isShared: false,
        isPublic: false,
        shareSettings: {} as any,
        metadata: { version: 1, checksum: 'abc123', author: 'Demo User', software: 'YukiFiles' },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        lastAccessedAt: new Date(),
        downloadCount: 0,
        viewCount: 0,
        tags: ['resume', 'important'],
        description: 'My professional resume'
      },
      {
        id: 'demo-img-1',
        name: 'vacation-photos.jpg',
        type: 'file',
        mimeType: 'image/jpeg',
        size: 1024000,
        content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600',
        thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150',
        parentId: null,
        path: [],
        isStarred: true,
        isShared: false,
        isPublic: false,
        shareSettings: {} as any,
        metadata: { 
          version: 1, 
          checksum: 'def456',
          dimensions: { width: 1920, height: 1080 },
          camera: 'iPhone 13 Pro',
          location: { lat: 40.7128, lng: -74.0060 }
        },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10'),
        lastAccessedAt: new Date(),
        downloadCount: 0,
        viewCount: 0,
        tags: ['vacation', 'photos', 'memories'],
        description: 'Beautiful vacation memories'
      }
    ],
    'client-file-sharing': [
      {
        id: 'demo-proposal-1',
        name: 'Project Proposal - Q1 2024.docx',
        type: 'file',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 512000,
        content: 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,sample-docx-content',
        parentId: null,
        path: [],
        isStarred: true,
        isShared: true,
        isPublic: false,
        shareToken: 'proj_prop_q1_2024_abc123',
        shareSettings: {
          isEnabled: true,
          token: 'proj_prop_q1_2024_abc123',
          url: 'https://yukifiles.com/share/proj_prop_q1_2024_abc123',
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          maxDownloads: 50,
          currentDownloads: 12,
          password: 'demo123',
          allowDownload: true,
          allowView: true,
          allowComment: true,
          analytics: {
            totalViews: 45,
            totalDownloads: 12,
            uniqueVisitors: 23,
            countries: ['US', 'UK', 'CA', 'AU'],
            devices: ['Desktop', 'Mobile', 'Tablet'],
            referrers: ['Email', 'Direct', 'Slack'],
            dailyStats: [
              { date: '2024-01-20', views: 15, downloads: 4 },
              { date: '2024-01-21', views: 20, downloads: 5 },
              { date: '2024-01-22', views: 10, downloads: 3 }
            ]
          }
        },
        metadata: { 
          version: 3, 
          checksum: 'ghi789',
          author: 'John Smith',
          software: 'Microsoft Word',
          wordCount: 2500,
          pages: 8
        },
        createdAt: new Date('2024-01-18'),
        updatedAt: new Date('2024-01-20'),
        lastAccessedAt: new Date(),
        downloadCount: 12,
        viewCount: 45,
        tags: ['proposal', 'client', 'q1-2024', 'confidential'],
        description: 'Comprehensive project proposal for Q1 2024 initiatives'
      }
    ],
    'media-management': [
      {
        id: 'demo-video-1',
        name: 'Company Presentation.mp4',
        type: 'file',
        mimeType: 'video/mp4',
        size: 52428800,
        content: 'https://sample-videos.com/zip/10/mp4/480/sample-video-demo.mp4',
        thumbnail: 'https://img.youtube.com/vi/sample/maxresdefault.jpg',
        parentId: null,
        path: [],
        isStarred: false,
        isShared: true,
        isPublic: true,
        shareToken: 'company_presentation_video_xyz',
        shareSettings: {} as any,
        metadata: { 
          version: 1, 
          checksum: 'jkl012',
          duration: 300,
          dimensions: { width: 1280, height: 720 },
          software: 'Final Cut Pro'
        },
        createdAt: new Date('2024-01-12'),
        updatedAt: new Date('2024-01-12'),
        lastAccessedAt: new Date(),
        downloadCount: 8,
        viewCount: 156,
        tags: ['presentation', 'company', 'video', 'marketing'],
        description: 'Company overview presentation video'
      },
      {
        id: 'demo-audio-1',
        name: 'Background Music - Corporate.mp3',
        type: 'file',
        mimeType: 'audio/mpeg',
        size: 5242880,
        content: 'https://www.soundjay.com/misc/sounds-and-noises/sample-audio.mp3',
        parentId: null,
        path: [],
        isStarred: false,
        isShared: false,
        isPublic: false,
        shareSettings: {} as any,
        metadata: { 
          version: 1, 
          checksum: 'mno345',
          duration: 180,
          software: 'Logic Pro'
        },
        createdAt: new Date('2024-01-08'),
        updatedAt: new Date('2024-01-08'),
        lastAccessedAt: new Date(),
        downloadCount: 0,
        viewCount: 0,
        tags: ['audio', 'background-music', 'corporate', 'royalty-free'],
        description: 'Professional background music for corporate videos'
      }
    ]
  }

  return baseFiles[scenarioId] || []
}

// ====================================================================
// DEMO PROGRESS TRACKING
// ====================================================================

export class DemoProgress {
  private completedSteps: Set<string> = new Set()
  private currentScenario: string | null = null
  
  markStepCompleted(stepId: string) {
    this.completedSteps.add(stepId)
    this.saveProgress()
  }
  
  isStepCompleted(stepId: string): boolean {
    return this.completedSteps.has(stepId)
  }
  
  getScenarioProgress(scenarioId: string): number {
    const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId)
    if (!scenario) return 0
    
    const totalSteps = scenario.steps.length
    const completedSteps = scenario.steps.filter(step => 
      this.isStepCompleted(step.id)
    ).length
    
    return Math.round((completedSteps / totalSteps) * 100)
  }
  
  getOverallProgress(): number {
    const totalSteps = DEMO_SCENARIOS.reduce((sum, scenario) => 
      sum + scenario.steps.length, 0
    )
    return Math.round((this.completedSteps.size / totalSteps) * 100)
  }
  
  setCurrentScenario(scenarioId: string) {
    this.currentScenario = scenarioId
    this.saveProgress()
  }
  
  getCurrentScenario(): string | null {
    return this.currentScenario
  }
  
  private saveProgress() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('yukifiles-demo-progress', JSON.stringify({
        completedSteps: Array.from(this.completedSteps),
        currentScenario: this.currentScenario
      }))
    }
  }
  
  loadProgress() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('yukifiles-demo-progress')
      if (saved) {
        const data = JSON.parse(saved)
        this.completedSteps = new Set(data.completedSteps || [])
        this.currentScenario = data.currentScenario || null
      }
    }
  }
}

export const demoProgress = new DemoProgress()