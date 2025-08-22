"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useProfessionalModal } from "@/components/ui/professional-modal"
import { 
  FileText, FileCode, Save, X, AlertCircle, CheckCircle,
  Type, Code, File, Folder, Maximize2, Minimize2, Eye,
  Search, Replace, WrapText, Copy, Download, Palette,
  Undo, Redo, ZoomIn, ZoomOut, RotateCcw, Settings,
  BookOpen, Hash, AlignLeft, FileCheck, ChevronUp, ChevronDown,
  ArrowUp, ArrowDown, SkipBack, SkipForward, MousePointer,
  Scissors, Clipboard, FileX, RefreshCw, Clock, Calculator,
  Regex, CaseSensitive, Filter, SortAsc, SortDesc,
  Indent, Outdent, ToggleLeft, ToggleRight, Sun, Moon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface FileItem {
  id: string
  name: string
  content: string
  type: string
  size: number
  lastModified: Date
}

interface FileEditorProps {
  file: FileItem
  onSave: (file: FileItem, newContent: string, newName?: string, newType?: string) => void
  onClose: () => void
  readOnly?: boolean
}

export function FileEditor({ file, onSave, onClose, readOnly = false }: FileEditorProps) {
  const [fileName, setFileName] = useState(file.name || 'untitled.txt')
  const [content, setContent] = useState(file.content || '')
  const [isModified, setIsModified] = useState(false)
  const [iconKey, setIconKey] = useState(0) // For icon animation
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const [wrapEnabled, setWrapEnabled] = useState(false)
  const [findQuery, setFindQuery] = useState('')
  const [replaceQuery, setReplaceQuery] = useState('')
  const [fontSize, setFontSize] = useState(14)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showTools, setShowTools] = useState(false)
  const [isDesktop, setIsDesktop] = useState(true)
  const [isWindows, setIsWindows] = useState(false)
  const [cursorPosition, setCursorPosition] = useState({ line: 1, column: 1 })
  const [selectedText, setSelectedText] = useState('')
  const [caseSensitive, setCaseSensitive] = useState(false)
  const [wholeWord, setWholeWord] = useState(false)
  const [useRegex, setUseRegex] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [autoSave, setAutoSave] = useState(false)
  const [syntaxHighlight, setSyntaxHighlight] = useState(true)
  const [mobileTooltip, setMobileTooltip] = useState<string | null>(null)
  
  // Professional modal system
  const { showInput, showConfirm, Modal } = useProfessionalModal()

  useEffect(() => {
    setFileName(file.name || 'untitled.txt')
    setContent(file.content || '')
    setIsModified(false)
  }, [file])

  const handleContentChange = (newContent: string) => {
    if (readOnly) return
    
    // Add to history for undo/redo
    if (newContent !== content) {
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(content)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
    }
    
    setContent(newContent)
    setIsModified(true)
  }

  const handleFileNameChange = (newName: string) => {
    if (readOnly) return
    const oldExtension = fileName.split('.').pop()?.toLowerCase()
    const newExtension = newName.split('.').pop()?.toLowerCase()
    
    // Trigger icon animation if extension changed
    if (oldExtension !== newExtension) {
      setIconKey(prev => prev + 1)
    }
    
    setFileName(newName)
    setIsModified(true)
  }

  const handleSave = () => {
    if (readOnly) return
    onSave(file, content, fileName)
    setIsModified(false)
  }

  const getFileIcon = () => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    const iconMap: { [key: string]: { icon: any, color: string } } = {
      'js': { icon: FileCode, color: 'text-yellow-400' },
      'ts': { icon: FileCode, color: 'text-blue-400' },
      'jsx': { icon: FileCode, color: 'text-cyan-400' },
      'tsx': { icon: FileCode, color: 'text-cyan-400' },
      'py': { icon: FileCode, color: 'text-green-400' },
      'java': { icon: FileCode, color: 'text-red-400' },
      'cpp': { icon: FileCode, color: 'text-blue-500' },
      'c': { icon: FileCode, color: 'text-blue-600' },
      'cs': { icon: FileCode, color: 'text-purple-400' },
      'php': { icon: FileCode, color: 'text-indigo-400' },
      'html': { icon: FileCode, color: 'text-orange-400' },
      'css': { icon: FileCode, color: 'text-pink-400' },
      'json': { icon: FileText, color: 'text-yellow-300' },
      'xml': { icon: FileCode, color: 'text-orange-300' },
      'yaml': { icon: FileCode, color: 'text-red-300' },
      'yml': { icon: FileCode, color: 'text-red-300' },
      'sql': { icon: FileCode, color: 'text-blue-300' },
      'md': { icon: FileText, color: 'text-gray-300' },
      'txt': { icon: FileText, color: 'text-gray-400' },
      'go': { icon: FileCode, color: 'text-cyan-300' },
      'rs': { icon: FileCode, color: 'text-orange-500' },
      'swift': { icon: FileCode, color: 'text-orange-400' },
      'kt': { icon: FileCode, color: 'text-purple-300' },
      'rb': { icon: FileCode, color: 'text-red-500' },
      'sh': { icon: FileCode, color: 'text-green-300' },
      'bash': { icon: FileCode, color: 'text-green-300' },
    }
    
    const fileInfo = iconMap[extension || ''] || { icon: FileText, color: 'text-gray-400' }
    const IconComponent = fileInfo.icon
    
    return <IconComponent className={`w-5 h-5 ${fileInfo.color}`} />
  }

  const getLanguage = () => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const langMap: { [key: string]: string } = {
      'js': 'JavaScript',
      'ts': 'TypeScript',
      'jsx': 'React JSX',
      'tsx': 'React TSX',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'php': 'PHP',
      'html': 'HTML',
      'css': 'CSS',
      'scss': 'SCSS',
      'sass': 'Sass',
      'json': 'JSON',
      'xml': 'XML',
      'yaml': 'YAML',
      'yml': 'YAML',
      'sql': 'SQL',
      'md': 'Markdown',
      'txt': 'Plain Text',
      'go': 'Go',
      'rs': 'Rust',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'rb': 'Ruby',
      'sh': 'Shell',
      'bash': 'Bash',
      'zsh': 'Zsh',
      'fish': 'Fish',
      'ps1': 'PowerShell',
      'vue': 'Vue.js',
      'svelte': 'Svelte',
      'dart': 'Dart',
      'scala': 'Scala',
      'clj': 'Clojure',
      'elm': 'Elm',
      'haskell': 'Haskell',
      'lua': 'Lua',
      'r': 'R',
      'matlab': 'MATLAB',
      'dockerfile': 'Dockerfile'
    }
    return langMap[extension || ''] || 'Plain Text'
  }

  // Find/Replace helpers
  const handleFindNext = () => {
    if (!findQuery || !textareaRef.current) return
    const text = content
    const start = textareaRef.current.selectionEnd
    const idx = text.indexOf(findQuery, start)
    const nextIdx = idx !== -1 ? idx : text.indexOf(findQuery, 0)
    if (nextIdx !== -1) {
      textareaRef.current.focus()
      textareaRef.current.setSelectionRange(nextIdx, nextIdx + findQuery.length)
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight * (nextIdx / text.length)
    }
  }

  const handleReplace = () => {
    if (!textareaRef.current || !findQuery) return
    const { selectionStart, selectionEnd } = textareaRef.current
    const selected = content.slice(selectionStart, selectionEnd)
    if (selected === findQuery) {
      const newText = content.slice(0, selectionStart) + replaceQuery + content.slice(selectionEnd)
      setContent(newText)
      setIsModified(true)
      const newPos = selectionStart + replaceQuery.length
      setTimeout(() => {
        textareaRef.current?.setSelectionRange(newPos, newPos)
      }, 0)
    } else {
      handleFindNext()
    }
  }

  const handleReplaceAll = () => {
    if (!findQuery) return
    if (!content.includes(findQuery)) return
    const newText = content.split(findQuery).join(replaceQuery)
    setContent(newText)
    setIsModified(true)
  }

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(content) } catch {}
  }

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleFormat = () => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'json') {
      try {
        const parsed = JSON.parse(content)
        const pretty = JSON.stringify(parsed, null, 2)
        setContent(pretty)
        setIsModified(true)
        return
      } catch {}
    }
    // No-op for other types (could integrate a formatter later)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setContent(history[historyIndex - 1])
      setIsModified(true)
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setContent(history[historyIndex + 1])
      setIsModified(true)
    }
  }

  const handleZoomIn = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const handleZoomOut = () => {
    setFontSize(prev => Math.max(prev - 2, 10))
  }

  const handleResetZoom = () => {
    setFontSize(14)
  }

  const getWordCount = () => {
    return content.trim().split(/\s+/).filter(word => word.length > 0).length
  }

  const getCharCount = () => {
    return content.length
  }

  const insertTemplate = () => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    let template = ''
    
    switch (ext) {
      case 'html':
        template = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`
        break
      case 'css':
        template = `/* CSS Reset */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
}`
        break
      case 'js':
      case 'jsx':
        template = `// JavaScript/JSX Template
function main() {
    console.log('Hello, World!');
}

main();`
        break
      case 'ts':
      case 'tsx':
        template = `// TypeScript/TSX Template
interface Props {
    name: string;
}

function greet(props: Props): string {
    return \`Hello, \${props.name}!\`;
}

console.log(greet({ name: 'World' }));`
        break
      default:
        template = `# ${fileName}

Created: ${new Date().toLocaleDateString()}

## Description
Add your content here...`
    }
    
    setContent(template)
    setIsModified(true)
  }

  // Advanced tools
  const handleCut = () => {
    if (!textareaRef.current || readOnly) return
    const { selectionStart, selectionEnd } = textareaRef.current
    const selected = content.slice(selectionStart, selectionEnd)
    if (selected) {
      navigator.clipboard.writeText(selected)
      const newContent = content.slice(0, selectionStart) + content.slice(selectionEnd)
      setContent(newContent)
      setIsModified(true)
    }
  }

  const handlePaste = async () => {
    if (!textareaRef.current || readOnly) return
    try {
      const text = await navigator.clipboard.readText()
      const { selectionStart, selectionEnd } = textareaRef.current
      const newContent = content.slice(0, selectionStart) + text + content.slice(selectionEnd)
      setContent(newContent)
      setIsModified(true)
      setTimeout(() => {
        const newPos = selectionStart + text.length
        textareaRef.current?.setSelectionRange(newPos, newPos)
      }, 0)
    } catch {}
  }

  const handleSelectAll = () => {
    if (!textareaRef.current) return
    textareaRef.current.select()
  }

  const handleGoToLine = () => {
    showInput("Go to Line", {
      description: "Enter the line number you want to navigate to",
      placeholder: "Line number (1-" + content.split('\n').length + ")",
      onConfirm: (value) => {
        if (!value || !textareaRef.current) return
        const lineNum = parseInt(value)
        const lines = content.split('\n')
        if (lineNum > 0 && lineNum <= lines.length) {
          const position = lines.slice(0, lineNum - 1).join('\n').length + (lineNum > 1 ? 1 : 0)
          textareaRef.current.focus()
          textareaRef.current.setSelectionRange(position, position)
          textareaRef.current.scrollTop = textareaRef.current.scrollHeight * ((lineNum - 1) / lines.length)
        }
      }
    })
  }

  const handleDuplicateLine = () => {
    if (!textareaRef.current || readOnly) return
    const { selectionStart } = textareaRef.current
    const lines = content.split('\n')
    const currentLineIndex = content.slice(0, selectionStart).split('\n').length - 1
    const currentLine = lines[currentLineIndex]
    lines.splice(currentLineIndex + 1, 0, currentLine)
    const newContent = lines.join('\n')
    setContent(newContent)
    setIsModified(true)
  }

  const handleDeleteLine = () => {
    if (!textareaRef.current || readOnly) return
    const { selectionStart } = textareaRef.current
    const lines = content.split('\n')
    const currentLineIndex = content.slice(0, selectionStart).split('\n').length - 1
    lines.splice(currentLineIndex, 1)
    const newContent = lines.join('\n')
    setContent(newContent)
    setIsModified(true)
  }

  const handleMoveLine = (direction: 'up' | 'down') => {
    if (!textareaRef.current || readOnly) return
    const { selectionStart } = textareaRef.current
    const lines = content.split('\n')
    const currentLineIndex = content.slice(0, selectionStart).split('\n').length - 1
    
    if (direction === 'up' && currentLineIndex > 0) {
      [lines[currentLineIndex], lines[currentLineIndex - 1]] = [lines[currentLineIndex - 1], lines[currentLineIndex]]
    } else if (direction === 'down' && currentLineIndex < lines.length - 1) {
      [lines[currentLineIndex], lines[currentLineIndex + 1]] = [lines[currentLineIndex + 1], lines[currentLineIndex]]
    }
    
    const newContent = lines.join('\n')
    setContent(newContent)
    setIsModified(true)
  }

  const handleIndent = () => {
    if (!textareaRef.current || readOnly) return
    const { selectionStart, selectionEnd } = textareaRef.current
    const beforeSelection = content.slice(0, selectionStart)
    const selection = content.slice(selectionStart, selectionEnd)
    const afterSelection = content.slice(selectionEnd)
    
    const indentedSelection = selection.split('\n').map(line => '  ' + line).join('\n')
    const newContent = beforeSelection + indentedSelection + afterSelection
    setContent(newContent)
    setIsModified(true)
  }

  const handleOutdent = () => {
    if (!textareaRef.current || readOnly) return
    const { selectionStart, selectionEnd } = textareaRef.current
    const beforeSelection = content.slice(0, selectionStart)
    const selection = content.slice(selectionStart, selectionEnd)
    const afterSelection = content.slice(selectionEnd)
    
    const outdentedSelection = selection.split('\n').map(line => line.replace(/^  /, '')).join('\n')
    const newContent = beforeSelection + outdentedSelection + afterSelection
    setContent(newContent)
    setIsModified(true)
  }

  const handleToggleComment = () => {
    if (!textareaRef.current || readOnly) return
    const ext = fileName.split('.').pop()?.toLowerCase()
    let commentPrefix = '//'
    
    switch (ext) {
      case 'html':
      case 'xml':
        commentPrefix = '<!-- '
        break
      case 'css':
        commentPrefix = '/* '
        break
      case 'py':
        commentPrefix = '# '
        break
      case 'sql':
        commentPrefix = '-- '
        break
    }
    
    const { selectionStart, selectionEnd } = textareaRef.current
    const beforeSelection = content.slice(0, selectionStart)
    const selection = content.slice(selectionStart, selectionEnd)
    const afterSelection = content.slice(selectionEnd)
    
    const lines = selection.split('\n')
    const toggledLines = lines.map(line => {
      if (line.trim().startsWith(commentPrefix.trim())) {
        return line.replace(new RegExp(`^\\s*${commentPrefix.trim()}\\s?`), '')
      } else {
        return commentPrefix + line
      }
    })
    
    const newContent = beforeSelection + toggledLines.join('\n') + afterSelection
    setContent(newContent)
    setIsModified(true)
  }

  const handleSortLines = (ascending: boolean = true) => {
    if (!textareaRef.current || readOnly) return
    const { selectionStart, selectionEnd } = textareaRef.current
    const beforeSelection = content.slice(0, selectionStart)
    const selection = content.slice(selectionStart, selectionEnd)
    const afterSelection = content.slice(selectionEnd)
    
    const lines = selection.split('\n')
    const sortedLines = lines.sort((a, b) => ascending ? a.localeCompare(b) : b.localeCompare(a))
    const newContent = beforeSelection + sortedLines.join('\n') + afterSelection
    setContent(newContent)
    setIsModified(true)
  }

  const handleWordCount = () => {
    const words = getWordCount()
    const chars = getCharCount()
    const lines = content.split('\n').length
    const charsNoSpaces = content.replace(/\s/g, '').length
    
    alert(`Statistics:
Words: ${words}
Characters: ${chars}
Characters (no spaces): ${charsNoSpaces}
Lines: ${lines}
Paragraphs: ${content.split(/\n\s*\n/).length}`)
  }

  // Update cursor position
  const updateCursorPosition = () => {
    if (!textareaRef.current) return
    const { selectionStart, selectionEnd } = textareaRef.current
    const textBeforeCursor = content.slice(0, selectionStart)
    const lines = textBeforeCursor.split('\n')
    const line = lines.length
    const column = lines[lines.length - 1].length + 1
    setCursorPosition({ line, column })
    
    if (selectionStart !== selectionEnd) {
      setSelectedText(content.slice(selectionStart, selectionEnd))
    } else {
      setSelectedText('')
    }
  }

  // Simple syntax highlighting
  const applySyntaxHighlighting = (code: string): string => {
    if (!syntaxHighlight) return code
    
    const ext = fileName.split('.').pop()?.toLowerCase()
    
    // Keywords for different languages
    const keywords: { [key: string]: string[] } = {
      'js': ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'default', 'async', 'await', 'try', 'catch'],
      'jsx': ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'React', 'useState', 'useEffect'],
      'ts': ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'interface', 'type', 'enum'],
      'tsx': ['function', 'const', 'let', 'var', 'if', 'else', 'for', 'while', 'return', 'class', 'import', 'export', 'default', 'async', 'await', 'try', 'catch', 'interface', 'type', 'enum', 'React', 'useState', 'useEffect'],
      'py': ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'lambda'],
      'css': ['color', 'background', 'margin', 'padding', 'border', 'width', 'height', 'display', 'position', 'font-family', 'font-size'],
      'html': ['html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'li', 'table', 'tr', 'td']
    }
    
    let highlighted = code
    
    // Apply syntax highlighting based on file type
    if (keywords[ext || '']) {
      keywords[ext || ''].forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g')
        highlighted = highlighted.replace(regex, `<span class="syntax-keyword">${keyword}</span>`)
      })
    }
    
    // Highlight strings
    highlighted = highlighted.replace(/(["'])((?:\\.|(?!\1)[^\\])*?)\1/g, '<span class="syntax-string">$&</span>')
    
    // Highlight comments
    if (['js', 'jsx', 'ts', 'tsx', 'css'].includes(ext || '')) {
      highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="syntax-comment">$&</span>')
      highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="syntax-comment">$&</span>')
    } else if (ext === 'py') {
      highlighted = highlighted.replace(/#.*$/gm, '<span class="syntax-comment">$&</span>')
    } else if (ext === 'html') {
      highlighted = highlighted.replace(/<!--[\s\S]*?-->/g, '<span class="syntax-comment">$&</span>')
    }
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+(\.\d+)?\b/g, '<span class="syntax-number">$&</span>')
    
    return highlighted
  }

  // Prevent body scroll when modal is open and add custom scrollbar styles
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    
    // Check if desktop and Windows
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768)
    }
    const checkWindows = () => {
      setIsWindows(navigator.platform.toLowerCase().includes('win'))
    }
    checkDesktop()
    checkWindows()
    window.addEventListener('resize', checkDesktop)
    
    // Add custom scrollbar styles and syntax highlighting
    const style = document.createElement('style')
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(55, 65, 81, 0.5);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(139, 92, 246, 0.6);
        border-radius: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(139, 92, 246, 0.8);
      }
      .custom-scrollbar::-webkit-scrollbar-corner {
        background: rgba(55, 65, 81, 0.5);
      }
      
      .syntax-keyword {
        color: #c678dd;
        font-weight: 600;
      }
      .syntax-string {
        color: #98c379;
      }
      .syntax-comment {
        color: #5c6370;
        font-style: italic;
      }
      .syntax-number {
        color: #d19a66;
      }
      .syntax-highlight-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 12px;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace;
        white-space: pre;
        overflow: scroll;
        pointer-events: none;
        z-index: 1;
        color: transparent;
        scrollbar-width: none;
        -ms-overflow-style: none;
      }
      .syntax-highlight-overlay::-webkit-scrollbar {
        display: none;
      }
      .syntax-highlight-overlay span {
        color: inherit;
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.body.style.overflow = 'unset'
      document.head.removeChild(style)
      window.removeEventListener('resize', checkDesktop)
    }
  }, [])



  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md overflow-hidden"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-2 sm:inset-4 bg-gradient-to-br from-slate-900/95 via-purple-950/60 to-slate-900/95 border border-purple-500/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 sm:p-6 border-b border-purple-500/20 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
              <motion.div
                key={iconKey} // Re-animate when iconKey changes
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.4, type: "spring", damping: 20, stiffness: 300 }}
                className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center ring-2 ring-purple-500/20 flex-shrink-0"
              >
                {getFileIcon()}
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="min-w-0 flex-1"
              >
                <h2 className="text-lg sm:text-xl font-semibold text-white truncate">File Editor</h2>
                <p className="text-xs sm:text-sm text-gray-400 truncate">{fileName}</p>
              </motion.div>
              {isModified && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-shrink-0"
                >
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30 text-xs">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1 animate-pulse"></div>
                    <span className="hidden sm:inline">Modified</span>
                    <span className="sm:hidden">*</span>
                  </Badge>
                </motion.div>
              )}
            </div>
            
            <motion.div 
              className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleSave}
                disabled={!isModified || readOnly}
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-xs sm:text-sm"
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-2" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-red-500/20 transition-all duration-200"
              >
                <X className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>

          {/* Content */}
          <motion.div 
            className="flex flex-col h-[calc(100vh-120px)] sm:h-[calc(100vh-180px)] overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {/* File Name Input */}
            <div className="p-3 sm:p-6 border-b border-purple-500/10 flex-shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-300 mb-2 block">File Name</label>
                  <Input
                    value={fileName}
                    onChange={(e) => handleFileNameChange(e.target.value)}
                    className="bg-slate-800/50 border-purple-500/20 text-white focus:border-purple-400 transition-colors duration-200"
                    placeholder="Enter file name..."
                    disabled={readOnly}
                    readOnly={readOnly}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-400">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {getLanguage()}
                  </Badge>
                  <span className="text-xs sm:text-sm">{content.length} chars</span>
                  <span className="text-xs sm:text-sm">{content.split('\n').length} lines</span>
                </div>
              </div>

                          {/* Tools */}
            <div className="mt-3 space-y-2">
              {/* Mobile Toggle Button */}
              <div className="flex justify-between items-center">
                {!isWindows && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs px-2 md:hidden"
                    onClick={() => setShowTools(!showTools)}
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    {showTools ? 'Hide Tools' : 'Show Tools'}
                  </Button>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>Ln {cursorPosition.line}, Col {cursorPosition.column}</span>
                  {selectedText && <span>({selectedText.length} selected)</span>}
                  <span>{getCharCount()} chars</span>
                  <span>{getWordCount()} words</span>
                  <span>{content.split('\n').length} lines</span>
                </div>
              </div>

              {/* Find/Replace Row - Always show on Windows, collapsible on mobile */}
              {!readOnly && (isWindows || showTools || isDesktop) && (
                <div className="flex flex-col sm:flex-row gap-2 p-2 bg-slate-800/30 rounded-lg">
                  <div className="flex flex-1 gap-1">
                    <div className="relative flex-1">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <Input
                        value={findQuery}
                        onChange={(e) => setFindQuery(e.target.value)}
                        placeholder="Find..."
                        className="h-8 bg-slate-700/50 border-purple-500/20 text-white text-xs pl-7"
                      />
                    </div>
                    <div className="relative flex-1">
                      <Replace className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <Input
                        value={replaceQuery}
                        onChange={(e) => setReplaceQuery(e.target.value)}
                        placeholder="Replace..."
                        className="h-8 bg-slate-700/50 border-purple-500/20 text-white text-xs pl-7"
                      />
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" className="h-8 px-2" onClick={handleFindNext} title="Find Next">
                      <Search className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleReplace} title="Replace">
                      <Replace className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleReplaceAll} title="Replace All">
                      <AlignLeft className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant={caseSensitive ? 'default' : 'outline'} className="h-8 px-2" onClick={() => setCaseSensitive(!caseSensitive)} title="Case Sensitive">
                      <CaseSensitive className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant={wholeWord ? 'default' : 'outline'} className="h-8 px-2" onClick={() => setWholeWord(!wholeWord)} title="Whole Word">
                      <Hash className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant={useRegex ? 'default' : 'outline'} className="h-8 px-2" onClick={() => setUseRegex(!useRegex)} title="Use Regex">
                      <Regex className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Main Tools Row - Always show on Windows */}
              <div className={`flex flex-wrap gap-1 p-2 bg-slate-800/20 rounded-lg ${!isWindows && !showTools && 'hidden md:flex'}`}>
                {/* Edit Tools */}
                {!readOnly && (
                  <div className="flex gap-1 border-r border-gray-600 pr-2 mr-1">
                    <div className="relative">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-2" 
                        onClick={handleUndo} 
                        disabled={historyIndex <= 0}
                        onTouchStart={() => setMobileTooltip('Undo (Ctrl+Z)')}
                        onTouchEnd={() => setTimeout(() => setMobileTooltip(null), 1500)}
                        onMouseLeave={() => setMobileTooltip(null)}
                      >
                        <Undo className="w-3 h-3" />
                        <span className="hidden md:inline ml-1 text-xs">Undo</span>
                      </Button>
                      {mobileTooltip === 'Undo (Ctrl+Z)' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.8 }}
                          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-purple-500/30 z-50 whitespace-nowrap"
                        >
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-purple-500/30 rotate-45"></div>
                          Undo (Ctrl+Z)
                        </motion.div>
                      )}
                    </div>
                    <div className="relative">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 px-2" 
                        onClick={handleRedo} 
                        disabled={historyIndex >= history.length - 1}
                        onTouchStart={() => setMobileTooltip('Redo (Ctrl+Y)')}
                        onTouchEnd={() => setTimeout(() => setMobileTooltip(null), 1500)}
                        onMouseLeave={() => setMobileTooltip(null)}
                      >
                        <Redo className="w-3 h-3" />
                        <span className="hidden md:inline ml-1 text-xs">Redo</span>
                      </Button>
                      {mobileTooltip === 'Redo (Ctrl+Y)' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.8 }}
                          className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-purple-500/30 z-50 whitespace-nowrap"
                        >
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-purple-500/30 rotate-45"></div>
                          Redo (Ctrl+Y)
                        </motion.div>
                      )}
                    </div>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleCut} title="Cut (Ctrl+X)">
                      <Scissors className="w-3 h-3" />
                      <span className="hidden md:inline ml-1 text-xs">Cut</span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handlePaste} title="Paste (Ctrl+V)">
                      <Clipboard className="w-3 h-3" />
                      <span className="hidden md:inline ml-1 text-xs">Paste</span>
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleSelectAll} title="Select All (Ctrl+A)">
                      <MousePointer className="w-3 h-3" />
                      <span className="hidden md:inline ml-1 text-xs">Select</span>
                    </Button>
                  </div>
                )}

                {/* Line Tools */}
                {!readOnly && (
                  <div className="flex gap-1 border-r border-gray-600 pr-2 mr-1">
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => handleMoveLine('up')} title="Move Line Up">
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => handleMoveLine('down')} title="Move Line Down">
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleDuplicateLine} title="Duplicate Line">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleDeleteLine} title="Delete Line">
                      <FileX className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleToggleComment} title="Toggle Comment">
                      <Hash className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {/* Indent Tools */}
                {!readOnly && (
                  <div className="flex gap-1 border-r border-gray-600 pr-2 mr-1">
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleIndent} title="Indent (Tab)">
                      <Indent className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleOutdent} title="Outdent (Shift+Tab)">
                      <Outdent className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => handleSortLines(true)} title="Sort Lines A-Z">
                      <SortAsc className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={() => handleSortLines(false)} title="Sort Lines Z-A">
                      <SortDesc className="w-3 h-3" />
                    </Button>
                  </div>
                )}

                {/* View Tools */}
                <div className="flex gap-1 border-r border-gray-600 pr-2 mr-1">
                  <Button size="sm" variant={wrapEnabled ? 'default' : 'outline'} className="h-8 px-2" onClick={() => setWrapEnabled(prev => !prev)} title="Toggle Word Wrap">
                    <WrapText className="w-3 h-3" />
                  </Button>
                                      <Button size="sm" variant={showLineNumbers ? 'default' : 'outline'} className="h-8 px-2" onClick={() => setShowLineNumbers(prev => !prev)} title="Toggle Line Numbers">
                    <Hash className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleZoomOut} title="Zoom Out">
                    <ZoomOut className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleResetZoom} title="Reset Zoom">
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleZoomIn} title="Zoom In">
                    <ZoomIn className="w-3 h-3" />
                  </Button>
                </div>

                {/* Navigation Tools */}
                <div className="flex gap-1 border-r border-gray-600 pr-2 mr-1">
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleGoToLine} title="Go to Line (Ctrl+G)">
                    <SkipForward className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleWordCount} title="Word Count">
                    <Calculator className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={insertTemplate} title="Insert Template">
                    <BookOpen className="w-3 h-3" />
                  </Button>
                </div>

                {/* File Tools */}
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleCopy} title="Copy All (Ctrl+C)">
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleDownload} title="Download File">
                    <Download className="w-3 h-3" />
                  </Button>
                  {!readOnly && (
                    <Button size="sm" variant="outline" className="h-8 px-2" onClick={handleFormat} title="Format Code">
                      <Palette className="w-3 h-3" />
                    </Button>
                  )}
                  <Button size="sm" variant={syntaxHighlight ? 'default' : 'outline'} className="h-8 px-2" onClick={() => setSyntaxHighlight(!syntaxHighlight)} title="Toggle Syntax Highlighting">
                    <Code className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant={darkMode ? 'default' : 'outline'} className="h-8 px-2" onClick={() => setDarkMode(!darkMode)} title="Toggle Theme">
                    {darkMode ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                  </Button>
                </div>

                {/* Status Indicator */}
                {readOnly && (
                  <div className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 px-2 py-1 rounded ml-auto">
                    <Eye className="w-3 h-3" />
                    <span className="hidden sm:inline">Read Only</span>
                  </div>
                )}
              </div>
            </div>
            </div>

            {/* Code Editor */}
            <div className="flex-1 p-3 md:p-6 min-h-0 overflow-hidden">
              <div className="h-full relative rounded-lg border border-purple-500/20 bg-slate-800/30 overflow-hidden">
                <div className="flex h-full">
                  {/* Line numbers */}
                  {showLineNumbers && (
                    <div 
                      ref={lineNumbersRef}
                      className="flex-shrink-0 bg-slate-800/80 border-r border-purple-500/20 px-2 py-3 text-gray-500 font-mono select-none overflow-y-scroll overflow-x-hidden"
                      style={{
                        fontSize: `${fontSize - 2}px`,
                        lineHeight: `${fontSize + 6}px`,
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        maxHeight: '100%'
                      }}
                    >
                      {content.split('\n').map((_, index) => (
                        <div key={index} className="text-right min-w-[2.5rem] pr-2" style={{ height: `${fontSize + 6}px` }}>
                          {String(index + 1).padStart(3, ' ')}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Code area */}
                  <div className="flex-1 relative min-w-0 overflow-hidden">
                    {/* Syntax highlighting overlay */}
                    {syntaxHighlight && (
                      <div 
                        className="syntax-highlight-overlay"
                        style={{
                          fontSize: `${fontSize}px`,
                          lineHeight: `${fontSize + 6}px`,
                          whiteSpace: wrapEnabled ? 'pre-wrap' : 'pre'
                        }}
                        dangerouslySetInnerHTML={{
                          __html: applySyntaxHighlighting(content)
                        }}
                      />
                    )}
                    
                    <Textarea
                      ref={textareaRef}
                      value={content}
                      onChange={(e) => handleContentChange(e.target.value)}
                      className="allow-select file-editor-content text-editor"
                      onScroll={(e) => {
                        // Sync line numbers scroll with textarea scroll
                        if (lineNumbersRef.current && showLineNumbers) {
                          lineNumbersRef.current.scrollTop = e.currentTarget.scrollTop
                        }
                        // Sync syntax highlighting overlay scroll
                        const overlay = e.currentTarget.parentElement?.querySelector('.syntax-highlight-overlay') as HTMLElement
                        if (overlay) {
                          overlay.scrollTop = e.currentTarget.scrollTop
                          overlay.scrollLeft = e.currentTarget.scrollLeft
                        }
                      }}
                      onKeyUp={updateCursorPosition}
                      onMouseUp={updateCursorPosition}
                      onKeyDown={(e) => {
                        // Handle keyboard shortcuts
                        if (e.ctrlKey || e.metaKey) {
                          switch (e.key) {
                            case 'z':
                              if (!readOnly) {
                                e.preventDefault()
                                handleUndo()
                              }
                              break
                            case 'y':
                              if (!readOnly) {
                                e.preventDefault()
                                handleRedo()
                              }
                              break
                            case 'g':
                              e.preventDefault()
                              handleGoToLine()
                              break
                            case 'a':
                              e.preventDefault()
                              handleSelectAll()
                              break
                            case 's':
                              if (!readOnly) {
                                e.preventDefault()
                                handleSave()
                              }
                              break
                          }
                        }
                        updateCursorPosition()
                      }}
                      className={`w-full h-full bg-transparent border-0 font-mono resize-none focus:ring-0 focus:outline-none p-3 custom-scrollbar relative z-10 ${syntaxHighlight ? 'text-transparent caret-white' : 'text-white'} ${wrapEnabled ? 'whitespace-pre-wrap break-words' : 'whitespace-pre'}`}
                      placeholder={readOnly ? "File content (read-only)" : "Start typing your code here..."}
                      style={{ 
                        height: '100%',
                        maxHeight: '100%',
                        overflowY: 'scroll',
                        overflowX: wrapEnabled ? 'hidden' : 'scroll',
                        fontSize: `${fontSize}px`,
                        lineHeight: `${fontSize + 6}px`,
                        tabSize: 2,
                        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#8b5cf6 #374151',
                        caretColor: syntaxHighlight ? 'white' : 'inherit'
                      }}
                      disabled={readOnly}
                      readOnly={readOnly}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <motion.div 
              className="p-2 sm:p-4 border-t border-purple-500/10 bg-slate-900/30 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-gray-400 flex-shrink-0"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <span className="truncate">Modified: {file.lastModified.toLocaleDateString()}</span>
                <span>Size: {(content.length / 1024).toFixed(1)} KB</span>
                <span>Font: {fontSize}px</span>
                <span>{getLanguage()}</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <span>{getCharCount()}</span>
                  <span className="text-gray-500">chars</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>{getWordCount()}</span>
                  <span className="text-gray-500">words</span>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${readOnly ? 'bg-amber-400' : 'bg-green-400'}`}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span>{readOnly ? 'Read Only' : 'Ready'}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Professional Modal */}
      <Modal />
    </AnimatePresence>
  )
}