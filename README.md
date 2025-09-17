# CodeQuest Frontend

A modern, AI-powered coding interview assistant built with React. CodeQuest helps interviewers manage coding sessions, search for solutions using AI, extract questions from images using OCR, and generate alternative approaches.

## 🚀 Features

### Core Functionality
- **Session Management**: Create, track, and manage interview sessions with candidate details
- **AI-Powered Search**: Intelligent code solution search with detailed explanations
- **OCR Support**: Extract questions from uploaded images using Tesseract.js
- **Alternative Solutions**: Generate optimized, simplified, or different approaches
- **Real-time Chat**: Follow-up discussions with AI for deeper understanding

### Modern UI/UX
- **Responsive Design**: Optimized for all devices and screen sizes
- **Glassmorphism Effects**: Modern backdrop blur and transparency effects
- **Smooth Animations**: Framer Motion powered transitions and interactions
- **Dark/Light Themes**: Adaptive theming with user preferences
- **Progressive Web App**: Offline capabilities and app-like experience

### Advanced Features
- **Session Export**: Download session data in JSON, Markdown, or CSV formats
- **Admin Dashboard**: Complete admin panel for user and content management
- **Real-time Notifications**: Toast notifications with custom styling
- **Search History**: Track and reuse previous searches
- **Code Highlighting**: Syntax highlighting for multiple programming languages

## 🛠️ Technology Stack

### Frontend Framework
- **React 18**: Latest React with concurrent features
- **React Router 6**: Modern routing with data loading
- **Context API**: Global state management without Redux

### Styling & UI
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Production-ready motion library
- **Lucide React**: Beautiful & consistent icon library
- **React Hot Toast**: Elegant notifications

### Data & Charts
- **Recharts**: Composable charting library
- **React Hook Form**: Performant forms with minimal re-renders
- **Axios**: Promise-based HTTP client

### Specialized Libraries
- **Tesseract.js**: Pure Javascript OCR library
- **React Syntax Highlighter**: Code syntax highlighting
- **Date-fns**: Modern JavaScript date utility library
- **Lodash**: Utility library for data manipulation

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AdminDashboard.jsx
│   ├── AuthPage.jsx
│   ├── ErrorBoundary.jsx
│   ├── Navigation.jsx
│   ├── ProtectedRoute.jsx
│   ├── SearchPage.jsx
│   └── SessionsPage.jsx
├── contexts/            # React Context providers
│   ├── AppContext.jsx
│   ├── AuthContext.jsx
│   └── SessionContext.jsx
├── services/           # API and utility services
│   ├── api.js
│   └── utils.js
├── App.jsx            # Main application component
├── App.css           # Global styles and custom CSS
├── index.css         # Tailwind CSS imports and base styles
└── main.jsx          # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- Backend API server running on port 8001

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/codequest-frontend.git
   cd codequest-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:8001
   REACT_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 📖 Usage Guide

### 1. Authentication
- Register a new account or login with existing credentials
- Admin accounts have additional privileges for user and content management

### 2. Session Management
- **Create Session**: Start with candidate name, company, and date
- **Active Sessions**: View and manage currently active sessions
- **Session History**: Browse and export past session data

### 3. AI Search
- **Text Input**: Type coding questions or problems
- **Image Upload**: Upload images containing questions for OCR extraction
- **Language Filters**: Filter results by programming language
- **Alternative Solutions**: Generate different approaches for the same problem

### 4. Code Features
- **Clean Code Display**: Automatically removes comments from code
- **Syntax Highlighting**: Beautiful code presentation with language detection
- **Copy to Clipboard**: Easy code copying functionality
- **Export Options**: Download code and explanations in various formats

### 5. Admin Features
- **User Management**: Create, view, and delete users
- **Content Review**: Approve or reject user-submitted content
- **Analytics Dashboard**: View system statistics and usage metrics
- **System Settings**: Configure application parameters

## 🎨 UI Components

### Search Interface
- **Modern Glass Design**: Backdrop blur effects with transparency
- **Drag & Drop**: Intuitive file upload with visual feedback
- **Progress Indicators**: Real-time OCR progress tracking
- **Responsive Layout**: Adaptive design for all screen sizes

### Session Management
- **Card Views**: Beautiful card layouts for session display
- **Filter & Sort**: Advanced filtering and sorting capabilities
- **Export Controls**: Multiple format export options
- **Status Indicators**: Visual session status representation

### Admin Dashboard
- **Tabbed Interface**: Organized admin functions in tabs
- **Data Visualization**: Charts and graphs for analytics
- **Bulk Actions**: Efficient management of multiple items
- **Real-time Updates**: Live data updates without refresh

## 🔧 Configuration

### API Configuration
Update `src/services/api.js` to configure API endpoints:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001/api';
```

### Theme Configuration
Customize themes in `src/services/utils.js`:
```javascript
export const themes = {
  light: { /* light theme colors */ },
  dark: { /* dark theme colors */ }
};
```

### OCR Configuration
Adjust OCR settings in `src/contexts/SessionContext.jsx`:
```javascript
const result = await Tesseract.recognize(
  imageFile,
  'eng', // Language
  { /* Tesseract options */ }
);
```

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Route Protection**: Protected routes with role-based access
- **Input Validation**: Comprehensive form validation
- **XSS Prevention**: Sanitized data handling
- **CSRF Protection**: Cross-site request forgery prevention

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Adaptive Features
- **Navigation**: Collapsible sidebar on mobile
- **Forms**: Stacked layouts on smaller screens
- **Tables**: Horizontal scrolling on mobile
- **Images**: Responsive image scaling

## ⚡ Performance Optimizations

### Code Splitting
- **Route-based**: Automatic code splitting by routes
- **Component-based**: Lazy loading for heavy components
- **Bundle Analysis**: Built-in bundle analyzer

### Caching Strategies
- **Service Worker**: Offline capability with service workers
- **Browser Caching**: Optimized asset caching
- **API Caching**: Intelligent API response caching

### Optimization Features
- **Image Optimization**: Automatic image compression
- **Tree Shaking**: Dead code elimination
- **Minification**: JavaScript and CSS minification

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository
2. Configure environment variables
3. Deploy with automatic previews

### Netlify Deployment
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Configure redirects for SPA

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- **ESLint**: Follow configured linting rules
- **Prettier**: Use consistent code formatting
- **Conventional Commits**: Follow commit message conventions
- **Component Guidelines**: Follow React best practices

## 📝 API Integration

### Authentication Endpoints
```javascript
// Login
POST /api/token
// Get current user
GET /api/me
// Register (admin only)
POST /api/admin/users
```

### Session Endpoints
```javascript
// Create session
POST /api/sessions
// Get sessions
GET /api/sessions
// End session
PUT /api/sessions/:id/end
```

### Search Endpoints
```javascript
// AI search
POST /api/search
// Generate alternatives
POST /api/generate-alternative
// Continue chat
POST /api/continue-chat
```

## 🐛 Troubleshooting

### Common Issues

**OCR Not Working**
- Ensure images are clear and readable
- Check browser compatibility with WebAssembly
- Verify Tesseract.js is properly loaded

**Session Not Saving**
- Check API connectivity
- Verify authentication tokens
- Review browser console for errors

**Styling Issues**
- Clear browser cache
- Check Tailwind CSS compilation
- Verify custom CSS conflicts

**Performance Issues**
- Enable React DevTools Profiler
- Check network tab for slow requests
- Review bundle size and code splitting

## 📞 Support

For support and questions:
- **Documentation**: Check this README and inline code comments
- **Issues**: Open GitHub issues for bugs and feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by the CodeQuest Team**