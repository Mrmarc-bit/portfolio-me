# 🎨 Suntree Art - Modern Portfolio

A stunning, modern portfolio website built with **React**, **TypeScript**, **Vite**, and **shadcn UI-inspired components**. Features cutting-edge design, smooth animations, and interactive elements.

![Portfolio Preview](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-6.2.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎭 UI/UX Excellence

- **Shadcn UI-Inspired Design** - Modern, clean, and premium aesthetics
- **Glassmorphism Effects** - Frosted glass panels with blur effects
- **3D Hover Animations** - Interactive cards with parallax and magnetic effects
- **Smooth Transitions** - 60fps animations with cubic-bezier easing
- **Dark/Light Mode** - Adaptive color schemes with system preference detection
- **Mobile-First** - Fully responsive across all devices

### 🚀 Advanced Components

- **ModernSkillCard** - Circular progress rings with mastery badges
- **ModernProjectCard** - Parallax hover with magnetic button interaction
- **ModernButton** - Multiple variants with shimmer effects
- **FloatingScrollButton** - Appears on scroll for quick navigation
- **Skeleton Loaders** - Shimmer-animated loading states
- **Interactive Maps** - Zoom, pan, and click for location details

### 🎬 Animations & Interactions

- **Typewriter Effect** - Rotating text with cursor animation
- **Count-Up Numbers** - Smooth number animations with easing
- **Card Glow** - Neon glow on hover states
- **Gradient Borders** - Animated gradient outlines
- **Parallax Images** - Mouse-tracking image transforms
- **Pulse Animations** - Subtle breathing effects

### 📱 Mobile Features

- **Floating Navbar** - Transforms from pill to glass bar on scroll
- **Swipeable Navigation** - Smooth horizontal scroll
- **Touch-Optimized** - Perfect touch targets and gestures
- **Adaptive Layout** - Reflows content for small screens

## 🛠️ Tech Stack

```json
{
  "framework": "React 19.2.0",
  "language": "TypeScript 5.8.2",
  "build": "Vite 6.2.0",
  "styling": "Tailwind CSS (CDN)",
  "icons": "Lucide React 0.555.0",
  "deployment": "GitHub Pages"
}
```

## 📦 Installation

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Mrmarc-bit/portfolio-me.git
cd portfolio-me

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
portfolio-me/
├── components/           # React components
│   ├── AnimatedStatsCard.tsx
│   ├── FloatingScrollButton.tsx
│   ├── ModernButton.tsx
│   ├── ModernProjectCard.tsx
│   ├── ModernSkillCard.tsx
│   ├── ProfileCard.tsx
│   ├── SearchHeader.tsx
│   ├── Sidebar.tsx
│   └── Skeleton.tsx
├── img/                  # Images and assets
│   └── me.jpg
├── App.tsx              # Main application component
├── constants.tsx        # Data constants (projects, skills, etc.)
├── types.ts             # TypeScript type definitions
├── index.tsx            # React entry point
├── index.html           # HTML template with Tailwind config
├── index.css            # Custom CSS utilities
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## 🎨 Components Overview

### ModernSkillCard

- **Circular progress ring** - SVG-based animated skill level
- **Mastery badges** - Zap icons for 90%+ skills
- **3D hover effect** - Scale and rotate on interaction
- **Category tags** - Revealed on hover

### ModernProjectCard

- **Parallax images** - Mouse-tracking transforms
- **Magnetic button** - Follows cursor within bounds
- **Glassmorphism overlay** - Frosted info panel
- **Gradient badges** - Category with animated border

### ModernButton

**Variants:**

- `primary` - Solid with shadow
- `secondary` - Outlined with border
- `outline` - Transparent with border
- `ghost` - No background
- `gradient` - Colorful gradient background

**Features:**

- Loading states with spinner
- Icon support (left/right)
- Shimmer effect on hover
- Multiple sizes (sm, md, lg)

### FloatingScrollButton

- Auto-hide/show based on scroll
- Smooth scroll-to-top
- Mobile-only visibility
- Gradient background

## 🎭 Customization

### Colors

Edit `index.html` Tailwind config:

```javascript
colors: {
  primary: '#C3EED1',      // Soft Green
  secondary: '#D3E3FD',    // Soft Blue
  googleRed: '#EA4335',
  googleYellow: '#FBBC04',
  googleGreen: '#34A853',
  googleBlue: '#4285F4',
}
```

### Content

Update `constants.tsx`:

```typescript
export const PROFILE = {
  name: "Your Name",
  role: "Your Role",
  bio: "Your bio...",
  stats: { projects: 96, years: 8, awards: 12 },
  social: { /* ... */ }
};

export const SKILLS: Skill[] = [ /* ... */ ];
export const PROJECTS: Project[] = [ /* ... */ ];
```

### Animations

Modify `index.html` keyframes or add to `index.css`:

```css
@keyframes yourAnimation {
  0% { /* ... */ }
  100% { /* ... */ }
}
```

## 🚀 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s
- **Lazy Loading**: Images and animations
- **Code Splitting**: Component-level chunks

## 📱 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 90+     |
| Firefox | 88+     |
| Safari  | 14+     |
| Edge    | 90+     |

## 🐛 Known Issues & Fixes

### Issue: Dark mode not persisting

**Fix**: Implement localStorage to save preference

```typescript
localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
```

### Issue: Images not loading in production

**Fix**: Ensure images are in `public/` directory or use correct base path

## 🔮 Future Enhancements

- [ ] Blog section with MDX support
- [ ] Contact form with EmailJS integration
- [ ] Project filtering and search
- [ ] Analytics dashboard
- [ ] Multi-language support (i18n)
- [ ] PWA capabilities
- [ ] Accessibility improvements (WCAG AAA)

## 📄 License

MIT License - feel free to use this portfolio as a template!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

**Ma'ruf Muchlisin**

- Email: <muchlisinmaruf@gmail.com>
- GitHub: [@Mrmarc-bit](https://github.com/Mrmarc-bit)
- Portfolio: [https://mrmarc-bit.github.io/portfolio-me](https://mrmarc-bit.github.io/portfolio-me)

---

<p align="center">Made with ❤️ by Suntree Art</p>
<p align="center">Powered by React, TypeScript, and Modern Web Technologies</p>
