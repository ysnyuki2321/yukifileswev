# 🎯 **YukiFiles Demo Experience Guide**

## 🚀 **Demo Overview**
YukiFiles là một **file management platform** hoàn chỉnh với các tính năng enterprise-grade. Demo này được thiết kế để showcase tất cả các khả năng của platform.

---

## 📱 **Mobile vs Desktop Experience**

### **Mobile Layout (Touch-First)**
- **Touch-friendly buttons** (48px+ minimum)
- **Compact grid layout** (2 columns)
- **Swipe gestures** và **long press** support
- **Bottom action bar** cho multi-select
- **Mobile-optimized filters** với horizontal scroll

### **Desktop Layout (Power-User)**
- **4-column grid** với advanced controls
- **Large file cards** (220px height)
- **Right-click context menu**
- **Sidebar với Quick Actions**
- **Keyboard shortcuts** support

---

## 🎵 **Discord Media Demo Files**

### **Audio: NAKISO - Track.mp3**
- **Source**: Discord CDN
- **Features**: 
  - Full audio player với controls
  - Album art display
  - Playback controls
  - Download & share options

### **Image: demo-image.jpg**
- **Source**: Discord CDN
- **Features**:
  - High-quality preview
  - Zoom, rotate controls
  - Download & share
  - Responsive display

### **Video: demo-video.mp4**
- **Source**: Discord CDN
- **Features**:
  - Custom video player
  - Fullscreen support
  - Playback speed control
  - Quality selection
  - Advanced controls

---

## 📁 **Folder Structure Demo**

### **Documents Folder**
- Empty folder để test navigation
- Test folder creation và organization

### **Media Folder**
- Contains audio, image, video files
- Test media preview capabilities

### **Projects Folder**
- Starred folder (special status)
- Test folder management features

---

## 🔧 **File Editor Experience**

### **Auto-Detect File Types**
1. **Change file extension** → Watch icon animation
2. **Auto-switch file type** based on extension
3. **Smooth transitions** với Framer Motion

### **Supported File Types**
- **Text**: .txt, .md, .json, .csv, .log, .rtf
- **Code**: .js, .ts, .jsx, .tsx, .html, .css, .py, .java, .cpp, .php, .rb, .go, .rs, .swift, .kt
- **Audio**: .mp3, .wav, .flac, .aac, .ogg, .m4a
- **Image**: .jpg, .jpeg, .png, .gif, .svg, .webp, .bmp
- **Video**: .mp4, .avi, .mov, .wmv, .flv, .webm, .mkv
- **Database**: .db, .sqlite, .sqlite3, .sql

### **Editor Features**
- **Real-time validation**
- **Extension checking**
- **Content editing**
- **File type switching**

---

## 🎬 **Media Player Experience**

### **Video Player**
- **Custom controls** với overlay
- **Playback speed**: 0.5x to 2x
- **Quality selection**: Auto, 1080p, 720p, 480p
- **Fullscreen support**
- **Volume control**
- **Skip forward/backward** (10s)
- **Auto-hide controls** (3s delay)

### **Audio Player**
- **Album art display**
- **Progress bar**
- **Volume control**
- **Playback controls**

### **Image Viewer**
- **Zoom controls** (0.5x to 3x)
- **Rotation** (90° increments)
- **Download & share**

---

## 🔗 **Sharing Experience**

### **Advanced Share Modal**
1. **Link Sharing**:
   - Generate unique share tokens
   - Password protection
   - Expiry dates
   - View/download limits
   - Public/private access

2. **Email Sharing**:
   - Multiple email addresses
   - Custom messages
   - Direct invitations

3. **Social Sharing**:
   - Twitter, Facebook, LinkedIn
   - Email sharing
   - QR code generation

### **Share Page Experience**
- **Real share links** (e.g., `/share/[token]`)
- **404 on reload** (demo limitation)
- **Secure access control**
- **Download restrictions**

---

## 🎮 **Interactive Features**

### **File Management**
- **Multi-select** với checkboxes
- **Drag & drop** (desktop)
- **Context menus** (right-click/long press)
- **Bulk actions** (delete, move, compress)

### **Search & Filter**
- **Real-time search**
- **File type filtering**
- **Sort by name, size, date**
- **Grid/list view toggle**

### **File Operations**
- **Create files/folders**
- **Rename files**
- **Move between folders**
- **Star/unstar files**
- **Archive/unarchive**

---

## 🔒 **Security Features**

### **Password Protection**
- **File-level encryption**
- **Share link passwords**
- **Access control**

### **Privacy Controls**
- **Public/private files**
- **View/download limits**
- **Expiry dates**
- **Access tracking**

---

## 📊 **Analytics & Insights**

### **Storage Statistics**
- **Used vs total space**
- **File type breakdown**
- **Upload/download counts**

### **Activity Feed**
- **Recent actions**
- **File modifications**
- **User activity**

---

## 🎨 **UI/UX Features**

### **Responsive Design**
- **Mobile-first approach**
- **Breakpoint detection** (768px)
- **Adaptive layouts**
- **Touch-friendly elements**

### **Animations**
- **Framer Motion** integration
- **Smooth transitions**
- **Loading states**
- **Hover effects**

### **Theme System**
- **Premium theme** với gradients
- **Glass effects**
- **Custom CSS variables**
- **Dark mode support**

---

## 🧪 **Testing Scenarios**

### **1. File Creation**
- Create text file → Change extension → Watch animation
- Create code file → Test syntax highlighting
- Create folder → Test organization

### **2. Media Preview**
- Open audio file → Test player controls
- Open image → Test zoom/rotate
- Open video → Test custom player

### **3. File Sharing**
- Generate share link → Copy to clipboard
- Set password protection
- Set expiry dates
- Test social sharing

### **4. Mobile Experience**
- Switch to mobile view → Test touch controls
- Test long press context menu
- Test mobile-optimized layout

### **5. Advanced Features**
- Test multi-select operations
- Test file compression
- Test database editor
- Test archive viewer

---

## 🚨 **Demo Limitations**

### **Technical Constraints**
- **No backend persistence** (files reset on reload)
- **Mock data** cho demo purposes
- **Limited file uploads** (demo mode)
- **Share links** expire on page reload

### **Expected Behavior**
- **Files disappear** after page refresh
- **Share links** show 404 on reload
- **Uploads** are simulated
- **Changes** are not saved permanently

---

## 🎯 **Demo Goals**

### **User Experience**
- **Showcase** tất cả features
- **Demonstrate** mobile/desktop differences
- **Highlight** advanced capabilities
- **Provide** realistic file management experience

### **Technical Demonstration**
- **Responsive design** implementation
- **Component architecture**
- **State management**
- **Performance optimization**

---

## 🔍 **Troubleshooting**

### **Common Issues**
1. **Files not loading** → Refresh page
2. **Share links 404** → Expected in demo
3. **Upload not working** → Demo limitation
4. **Mobile layout issues** → Check viewport

### **Performance Tips**
- **Use desktop** cho full feature set
- **Test mobile** trên actual device
- **Clear cache** nếu có issues
- **Check console** cho errors

---

## 📞 **Support**

Nếu gặp vấn đề hoặc cần hỗ trợ:
- **Check console** cho error messages
- **Refresh page** để reset demo state
- **Switch devices** để test responsiveness
- **Report issues** với detailed steps

---

**🎉 Enjoy exploring YukiFiles Demo!**