# 🎓 English Quick Drill

**Interactive English learning application using Oxford & Cambridge methodology**

[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-blue?logo=github)](https://yourusername.github.io/english-learning-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-4+-646CFF?logo=vite)](https://vitejs.dev)

## 🌟 Features

- ✅ **Oxford & Cambridge Methodology** - Proven learning techniques used by professionals
- ✅ **Phrase-Based Learning** - Learn collocations like native speakers
- ✅ **Sentence Patterns** - Master sentence construction for different contexts
- ✅ **Quick Drills** - 5-10 minute sessions perfect for busy learners
- ✅ **Progress Tracking** - Monitor your learning journey with detailed statistics
- ✅ **Mobile-First Design** - Learn anywhere, anytime on any device
- ✅ **Offline Support** - PWA for learning without internet connection
- ✅ **Free & Open Source** - No hidden costs or paywalls
- ✅ **Multiple Exercise Types** - Varied practice for better retention

## 🚀 Quick Start

### Online (Recommended)
Visit: **[https://yourusername.github.io/english-learning-app](https://yourusername.github.io/english-learning-app)**

### Local Development

```bash
# Clone repository
git clone https://github.com/yourusername/english-learning-app.git
cd english-learning-app

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📖 Documentation

- **[Getting Started Guide](./docs/GETTING_STARTED.md)** - Step-by-step setup instructions
- **[User Guide](./docs/USER_GUIDE.md)** - How to use the app effectively
- **[Methodology](./docs/METHODOLOGY.md)** - Oxford/Cambridge learning methodology
- **[API Documentation](./docs/API.md)** - Anthropic API integration
- **[Contributing Guidelines](./docs/CONTRIBUTING.md)** - How to contribute
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy on GitHub Pages

## 🎯 How It Works

Each session follows a scientifically-proven 4-phase learning model:

1. **Warmup Phase** (1 min)
   - Activate your existing knowledge with quick questions
   
2. **Learning Phase** (2-3 min)
   - Master new vocabulary, phrases & sentence patterns
   - Presented in digestible chunks with clear examples

3. **Practice Phase** (2-3 min)
   - Complete varied exercise types for better retention
   - From multiple choice to sentence building

4. **Summary Phase** (1 min)
   - Review what you learned and consolidate knowledge
   - Track your progress and stay motivated

## 🛠️ Tech Stack

**Frontend:**
- React 18+ with Vite (fast development)
- React Router for navigation
- Tailwind CSS (styling)
- Lucide React (icons)
- Zustand (state management)

**Hosting & CI/CD:**
- GitHub Pages (free hosting)
- GitHub Actions (auto-deploy)

**API:**
- Anthropic Claude API (optional, for session generation)

## 📁 Project Structure

```
english-learning-app/
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── EnglishDrill.jsx (main app)
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── About.jsx
│   │   └── Guide.jsx
│   ├── App.jsx (routing)
│   └── main.jsx (entry point)
├── public/
│   ├── index.html
│   ├── manifest.json (PWA)
│   ├── robots.txt
│   └── sitemap.xml
├── docs/
│   ├── GETTING_STARTED.md
│   ├── USER_GUIDE.md
│   ├── METHODOLOGY.md
│   └── ...
├── package.json
├── vite.config.js
└── README.md
```

## 🔧 Environment Setup

Create `.env` file in project root:

```bash
VITE_ANTHROPIC_API_KEY=your_api_key_here
VITE_SITE_URL=https://yourusername.github.io/english-learning-app
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **Never commit `.env` file!** Use `.env.example` as template.

Get your Anthropic API key: [console.anthropic.com](https://console.anthropic.com)

## 🌐 Deployment

### Deploy to GitHub Pages (Automatic)

1. **Create GitHub Repository**
   ```bash
   # On GitHub: Create new repository "english-learning-app"
   # Set visibility to Public
   ```

2. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: English Learning App"
   git branch -M main
   git remote add origin https://github.com/yourusername/english-learning-app.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to Repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (created automatically by Actions)
   - Save

4. **Done!** 🎉
   Your site is now live at: `https://yourusername.github.io/english-learning-app`

GitHub Actions will automatically build and deploy on every push to `main` branch.

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./docs/CONTRIBUTING.md)

### Development Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push and create Pull Request
git push origin feature/your-feature
```

## 📊 Project Statistics

- **Lines of Code**: ~3000
- **Components**: 6
- **Pages**: 4
- **Exercise Types**: 6+
- **Themes**: 5+
- **Built in**: 3 weeks

## 🐛 Known Issues & Roadmap

### Current Known Issues
- [ ] API key security (use serverless proxy in production)
- [ ] Mobile Safari fullscreen mode

### Planned Features
- 🔄 Multiple language proficiency levels (A1-C1)
- 👥 User accounts with cloud sync
- 🎮 Gamification (achievements, leaderboards)
- 🎤 Speech recognition
- 📊 Advanced analytics dashboard
- 📱 Mobile app (React Native)
- 🌙 Dark mode
- ♿ Enhanced accessibility
- 🧪 Unit & E2E tests
- 💬 Community forum

## 📄 License

This project is licensed under the MIT License - see [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Oxford English Dictionary** - Vocabulary reference
- **Cambridge** - Learning methodology approach
- **Anthropic** - Claude API for content generation
- **React & Vite teams** - Excellent development tools

## 📞 Support & Contact

- **GitHub Issues**: Report bugs or request features
- **GitHub Discussions**: Ask questions and discuss ideas
- **Email**: contact@example.com
- **Website**: [Your personal website]

## 🚦 Project Status

- **Status**: 🟢 **Active Development**
- **Last Updated**: 2026-04-19
- **Current Version**: 1.0.0
- **Contributors**: Welcome!

---

Made with ❤️ by Your Name

**Happy Learning!** 🎓📚✨
