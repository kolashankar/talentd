# Modern Portfolio Template

A professional, responsive portfolio template with 5-level nested folder structure.

## Features
- Fully responsive design
- Project showcase with filtering
- Skills section
- Contact form
- Smooth scrolling navigation
- Mobile-friendly menu

## Folder Structure (5 Levels)

```
modern-portfolio/ (Level 1 - Root)
├── manifest.json
├── index.html
├── README.md
├── assets/ (Level 2)
│   ├── css/
│   │   ├── style.css
│   │   └── components/ (Level 3)
│   │       └── sections/ (Level 4)
│   │           ├── hero.css (Level 5)
│   │           └── projects.css (Level 5)
│   ├── images/ (Level 2)
│   │   ├── profile/ (Level 3)
│   │   └── projects/ (Level 3)
│   │       └── thumbnails/ (Level 4)
│   └── js/ (Level 2)
│       ├── main.js
│       └── utils/ (Level 3)
│           └── helpers/ (Level 4)
│               └── dom.js (Level 5)
├── pages/ (Level 2)
│   └── projects/ (Level 3)
│       └── details/ (Level 4)
│           └── project-detail.html (Level 5)
└── components/ (Level 2)
    └── sections/ (Level 3)
        ├── hero/ (Level 4)
        └── about/ (Level 4)
            └── info/ (Level 5)
                └── personal-info.html (Level 5)
```

## How to Use
1. Upload this template via the admin panel
2. The template uses placeholder variables like {{name}}, {{email}}, {{bio}}
3. These will be replaced with actual portfolio data when rendered
4. Customize the CSS in assets/css/ to match your branding

## Customization
- Edit `assets/css/style.css` for global styles
- Modify `assets/css/components/sections/` for section-specific styles
- Update `assets/js/main.js` for functionality changes

## Template Variables
- {{name}} - User's full name
- {{title}} - Professional title
- {{bio}} - Biography/description
- {{email}} - Email address
- {{phone}} - Phone number
- {{location}} - Location
- {{profileImage}} - Profile picture URL
- {{github}} - GitHub URL
- {{linkedin}} - LinkedIn URL
- {{projects}} - Array of project objects
- {{skills}} - Array of skills

## Browser Compatibility
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)
