# 🚀 YukiFiles File Manager - Hướng Dẫn Sử Dụng

## ✨ Tính Năng Chính

### 📁 **File Management**
- **Unified Interface**: Giao diện thống nhất cho cả Desktop và Mobile
- **Rich Demo Data**: 40+ demo files trong 4 folders chính
- **Smart Navigation**: Breadcrumb navigation, folder drilling
- **Search & Filter**: Tìm kiếm nhanh, lọc theo loại file

### 🎯 **File Types Supported**
- **📝 Text Files**: TXT, MD, JS, TS, JSON, CSV
- **🖼️ Images**: JPG, PNG, GIF, SVG, WebP
- **🎥 Videos**: MP4, WebM, AVI, MOV, MKV
- **🎵 Audio**: MP3, WAV, OGG, M4A, FLAC
- **🗄️ Database**: SQLite, SQL files
- **📄 Documents**: PDF, DOCX, XLSX, PPTX

### 🎨 **UI/UX Features**
- **Responsive Design**: Tự động điều chỉnh theo device
- **Dark Theme**: Gradient design với purple/pink theme
- **Grid/List View**: Chuyển đổi giữa 2 chế độ xem
- **Multi-select**: Chọn nhiều files cùng lúc
- **Tabs System**: Mở nhiều files trong tabs

## 🎮 **Cách Sử Dụng**

### 1. **Navigation**
- **Root Level**: Xem tất cả files và folders
- **Folder Navigation**: Click vào folder để mở
- **Breadcrumb**: Click để quay lại folder trước
- **Back to Root**: Click "Root" để về trang chủ

### 2. **File Operations**
- **Open File**: Click vào file để mở trong tab
- **Preview**: Images, videos, audio được preview inline
- **Edit**: Text files mở trong editor
- **Database**: SQL files mở trong database editor

### 3. **Search & Filter**
- **Search Bar**: Tìm kiếm theo tên file
- **Filter Pills**: Lọc theo loại (All, Images, Videos, Audio, Documents, Code)
- **Sort Options**: Sắp xếp theo Name, Size, Date
- **View Mode**: Chuyển đổi Grid/List view

### 4. **Tabs System**
- **Multiple Tabs**: Mở nhiều files cùng lúc
- **Tab Navigation**: Click để chuyển đổi giữa tabs
- **Close Tab**: Click X để đóng tab
- **Tab Content**: File preview, editor, hoặc database view

## 📱 **Mobile Features**

### **Touch Optimized**
- **Larger Buttons**: Buttons 44px+ cho touch
- **Swipe Gestures**: Horizontal scroll cho tabs
- **Responsive Layout**: 2-column grid trên mobile
- **Compact UI**: Smaller fonts và padding

### **Mobile Layout**
- **Vertical Stack**: Filter buttons stack vertically
- **Full Width**: Action buttons full width
- **Touch Friendly**: Optimized cho mobile interaction

## 🔧 **Demo Data Structure**

### **Root Level Files**
```
📄 document.txt - Sample text file
🖼️ sample-image.jpg - Demo image
🎥 sample-video.mp4 - Demo video
🎵 sample-music.mp3 - Demo audio
🗄️ database.db - Sample database
💻 code.js - JavaScript code
📖 README.md - Project documentation
⚙️ config.json - Configuration file
📊 sample.csv - Sample data
🎨 logo.svg - Vector graphics
```

### **Folder Structure**
```
📁 Documents/
  ├ 📄 report.pdf
  ├ 📊 presentation.pptx
  ├ 📝 meeting-notes.txt
  ├ 📈 budget.xlsx
  ├ 📋 contract.pdf
  └ 📚 manual.docx

📁 Pictures/
  ├ 🖼️ nature.jpg
  ├ 🏙️ city.jpg
  ├ 🌅 sunset.png
  ├ 🎭 abstract.gif
  ├ 👤 portrait.jpg
  ├ 🏞️ landscape.webp
  ├ 🎨 icon.png
  └ 🖼️ banner.jpg

📁 Music/
  ├ 🎵 song1.mp3
  ├ 🎼 instrumental.wav
  ├ 🎧 podcast.mp3
  ├ 🎶 ambient.ogg
  ├ 🎵 jingle.m4a
  └ 🎼 soundtrack.flac

📁 Videos/
  ├ 🎥 tutorial.mp4
  ├ 🎬 demo.webm
  ├ 📹 screencast.mp4
  ├ 🎤 interview.avi
  ├ 🎭 presentation.mov
  └ 🎬 trailer.mkv
```

## 🚀 **Performance Features**

### **Optimizations**
- **Lazy Loading**: Components load khi cần
- **Chunk Splitting**: Code splitting cho performance
- **Caching**: Intelligent caching system
- **Mobile Detection**: Real-time responsive behavior

### **Build Optimizations**
- **Package Optimization**: Radix UI, Lucide React
- **Webpack Config**: Better chunk handling
- **TypeScript**: Ignore build errors for demo
- **ESLint**: Ignore during builds

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Chunk Loading Error**: Clean `.next` folder và rebuild
2. **Mobile Layout**: Check `isMobile` state
3. **File Preview**: Ensure correct MIME types
4. **Build Errors**: Use `--legacy-peer-deps`

### **Solutions**
```bash
# Clean build cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
npm install --legacy-peer-deps

# Rebuild project
npm run build

# Start dev server
npm run dev
```

## 🎯 **Next Steps**

### **Development**
- [ ] Add file upload functionality
- [ ] Implement file sharing
- [ ] Add user authentication
- [ ] Database integration
- [ ] API endpoints

### **Features**
- [ ] Drag & Drop upload
- [ ] File compression
- [ ] Version control
- [ ] Collaboration tools
- [ ] Advanced search

---

## 📞 **Support**

Nếu gặp vấn đề gì, hãy:
1. **Check console** cho error messages
2. **Verify dependencies** compatibility
3. **Clean build cache** và rebuild
4. **Check mobile detection** logic

---

**🎉 Happy File Managing! 🎉**