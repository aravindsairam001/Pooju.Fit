# Pooju.Fit - Your Personal Fitness Coach

A modern Progressive Web App (PWA) designed to transform your fitness journey with personalized workouts and intelligent progress tracking.

## 🚀 Features

- **Progressive Web App**: Install on any device, works offline
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Beautiful gradient design with smooth animations
- **Workout Tracking**: Multiple workout types with progress monitoring
- **Offline Support**: Service worker for offline functionality
- **Cross-Platform**: Works on iOS, Android, and desktop browsers

## 🏋️ Workout Types

### Strength Training
- Progressive overload workouts
- Muscle building focus
- 45-60 minute sessions

### HIIT Cardio
- High-intensity interval training
- Fat burning and metabolism boost
- 20-30 minute sessions

### Mindful Movement
- Flexibility and balance
- Recovery and wellness focus
- 30-45 minute sessions

## 📱 Installation

### As a PWA (Recommended)
1. Visit the website on your mobile device
2. Look for "Add to Home Screen" prompt
3. Install for native app experience

### Development Setup
1. Clone this repository
2. Open `index.html` in a modern web browser
3. For development, use a local server:
   ```bash
   python -m http.server 8000
   # or
   npx serve .
   ```

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), Vanilla JavaScript
- **Icons**: Lucide Icons
- **PWA**: Service Worker, Web App Manifest
- **Storage**: localStorage for user data
- **Hosting**: GitHub Pages ready

## 📁 Project Structure

```
pooju-fit/
├── index.html          # Main HTML file
├── app.js             # Main application JavaScript
├── sw.js              # Service Worker
├── manifest.json      # PWA manifest
├── icons/             # App icons (placeholder)
├── screenshots/       # PWA screenshots (placeholder)
└── README.md          # This file
```

## 🚀 GitHub Pages Deployment

1. Push code to GitHub repository
2. Go to repository Settings > Pages
3. Select source branch (usually `main`)
4. Your app will be available at `https://yourusername.github.io/repository-name`

## 🔧 Configuration

### Customizing the App
- Edit `manifest.json` for PWA settings
- Modify color scheme in `index.html` styles
- Update app name and branding throughout files

### Adding Real Icons
The app currently uses placeholder icons. To add real icons:
1. Create PNG files in `/icons/` directory
2. Sizes needed: 72, 96, 128, 144, 152, 192, 384, 512px
3. Update `manifest.json` icon paths

## 📊 Features Roadmap

### Phase 1 (Current)
- ✅ Responsive landing page
- ✅ PWA infrastructure
- ✅ Basic workout categories
- ✅ Progress tracking UI

### Phase 2 (Planned)
- [ ] Actual workout flows
- [ ] Timer functionality
- [ ] Exercise database
- [ ] Detailed progress charts

### Phase 3 (Future)
- [ ] User accounts and sync
- [ ] Social features
- [ ] Nutrition tracking
- [ ] Wearable device integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- [Live Demo](https://yourusername.github.io/pooju-fit) (Update with your URL)
- [Issues](https://github.com/yourusername/pooju-fit/issues)
- [Discussions](https://github.com/yourusername/pooju-fit/discussions)

---

**Built with ❤️ for fitness enthusiasts**

Transform your fitness journey with Pooju.Fit - where technology meets wellness.