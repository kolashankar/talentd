import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Template manifest validation schema
interface TemplateManifest {
  id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  entryFile: string;
  features?: string[];
  isPremium?: boolean;
}

// Extract and validate template from zip file
export async function extractTemplate(zipPath: string): Promise<TemplateManifest> {
  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();

  // Find and validate manifest.json
  const manifestEntry = zipEntries.find(entry => entry.entryName === 'manifest.json');
  if (!manifestEntry) {
    throw new Error('Template must contain a manifest.json file');
  }

  const manifestContent = manifestEntry.getData().toString('utf8');
  const manifest: TemplateManifest = JSON.parse(manifestContent);

  // Validate required fields
  const requiredFields = ['id', 'name', 'version', 'category', 'entryFile'];
  for (const field of requiredFields) {
    if (!manifest[field as keyof TemplateManifest]) {
      throw new Error(`manifest.json is missing required field: ${field}`);
    }
  }

  // Validate entry file exists
  const entryFileExists = zipEntries.some(entry => entry.entryName === manifest.entryFile);
  if (!entryFileExists) {
    throw new Error(`Entry file ${manifest.entryFile} not found in template`);
  }

  return manifest;
}

// Install template to public directory
export async function installTemplate(zipPath: string, manifest: TemplateManifest): Promise<string> {
  const templateDir = path.join(__dirname, '..', 'public', 'templates', manifest.id);

  // Create template directory
  await fs.mkdir(templateDir, { recursive: true });

  // Extract zip contents
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(templateDir, true);

  return templateDir;
}

// Delete template files
export async function deleteTemplate(templateId: string): Promise<void> {
  const templatePath = path.join(__dirname, '..', 'public', 'templates', templateId);

  try {
    await fs.rm(templatePath, { recursive: true, force: true });
  } catch (error) {
    console.error(`Error deleting template ${templateId}:`, error);
    throw new Error(`Failed to delete template files: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Create portfolio zip file
export async function createPortfolioZip(portfolioData: any, templateId: string, outputPath: string): Promise<void> {
  const structure = generatePortfolioStructure(portfolioData, templateId);
  const zip = new AdmZip();

  // Add all files to zip
  for (const [filePath, content] of Object.entries(structure)) {
    zip.addFile(filePath, Buffer.from(content, 'utf8'));
  }

  // Write zip file
  zip.writeZip(outputPath);
}

// Generate 5-level folder structure for portfolio
function generatePortfolioStructure(portfolioData: any, templateId: string): Record<string, string> {
  return {
    // Root level files
    'package.json': JSON.stringify({
      name: `${portfolioData.personal.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        deploy: 'npm run build && echo "Deploy to your hosting provider"'
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'react-router-dom': '^6.22.0',
        'framer-motion': '^11.13.1',
        '@emailjs/browser': '^4.4.1',
        'lucide-react': '^0.344.0',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.7.0',
        vite: '^5.4.20',
        typescript: '^5.6.3',
        tailwindcss: '^3.4.17',
        autoprefixer: '^10.4.20',
      },
    }, null, 2),

    'README.md': `# ${portfolioData.personal.name}'s Portfolio

Professional portfolio website built with React, TypeScript, and Tailwind CSS.

## Features
- 🎨 Modern, responsive design
- 📱 Mobile-first approach
- ⚡ Fast performance with Vite
- 🎭 Smooth animations with Framer Motion
- 📧 Contact form with EmailJS
- 🚀 Easy deployment

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

Visit http://localhost:5173

## Build for Production

\`\`\`bash
npm run build
\`\`\`

## Deploy

Upload the \`dist\` folder to your hosting provider or use services like Vercel, Netlify, or GitHub Pages.

## Template
Generated using Template: ${templateId}

## License
MIT License - Feel free to use this template for your own portfolio!`,

    'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${portfolioData.personal.bio || `${portfolioData.personal.name} - ${portfolioData.personal.title}`}" />
    <meta property="og:title" content="${portfolioData.personal.name} - Portfolio" />
    <meta property="og:description" content="${portfolioData.personal.bio || portfolioData.personal.title}" />
    <title>${portfolioData.personal.name} - Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});`,

    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          900: '#1e3a8a',
        },
        accent: '#f59e0b',
      },
    },
  },
  plugins: [],
}`,

    'postcss.config.js': `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,

    'tsconfig.json': JSON.stringify({
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: ['src'],
    }, null, 2),

    // Source files - Level 1: src/
    'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);`,

    'src/App.tsx': `import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Layout>
  );
}

export default App;`,

    // Level 2: src/styles/
    'src/styles/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-gray-900;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-bold;
  }
}

@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors;
  }

  .section-title {
    @apply text-4xl font-bold mb-8;
  }
}`,

    // Level 2: src/data/
    'src/data/portfolio.ts': `export const portfolioData = ${JSON.stringify(portfolioData, null, 2)};`,

    // Level 2: src/config/
    'src/config/emailjs.ts': `export const emailjsConfig = {
  serviceId: 'YOUR_SERVICE_ID',
  templateId: 'YOUR_TEMPLATE_ID', 
  userId: 'YOUR_PUBLIC_KEY',
};

// Get your EmailJS credentials from https://www.emailjs.com/`,

    // Level 2: src/pages/
    'src/pages/HomePage.tsx': `import { motion } from 'framer-motion';
import { Hero } from '../components/sections/Hero';
import { FeaturedProjects } from '../components/sections/FeaturedProjects';
import { Skills } from '../components/sections/Skills';
import { portfolioData } from '../data/portfolio';

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Hero data={portfolioData.personal} />
      <FeaturedProjects projects={portfolioData.projects.slice(0, 3)} />
      <Skills skills={portfolioData.skills} />
    </motion.div>
  );
}`,

    'src/pages/ProjectsPage.tsx': `import { motion } from 'framer-motion';
import { ProjectCard } from '../components/cards/ProjectCard';
import { portfolioData } from '../data/portfolio';

export default function ProjectsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="section-title text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          My Projects
        </motion.h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {portfolioData.projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}`,

    'src/pages/AboutPage.tsx': `import { motion } from 'framer-motion';
import { portfolioData } from '../data/portfolio';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="section-title text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          About Me
        </motion.h1>

        <motion.div 
          className="mt-12 space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Biography</h2>
            <p className="text-gray-700 leading-relaxed">{portfolioData.personal.bio}</p>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="space-y-6">
              {portfolioData.experience.map((exp, index) => (
                <div key={index} className="border-l-4 border-primary pl-4">
                  <h3 className="text-xl font-semibold">{exp.title}</h3>
                  <p className="text-gray-600">{exp.company} • {exp.duration}</p>
                  <p className="text-gray-700 mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Education</h2>
            <div className="space-y-4">
              {portfolioData.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution} • {edu.year}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}`,

    'src/pages/ContactPage.tsx': `import { motion } from 'framer-motion';
import { ContactForm } from '../components/forms/ContactForm';
import { portfolioData } from '../data/portfolio';
import { Mail, MapPin, Linkedin, Github } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h1 
          className="section-title text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          Get In Touch
        </motion.h1>

        <div className="grid md:grid-cols-2 gap-12 mt-12">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>{portfolioData.personal.email}</span>
              </div>
              {portfolioData.personal.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{portfolioData.personal.location}</span>
                </div>
              )}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Connect with me</h3>
              <div className="flex space-x-4">
                {portfolioData.social?.linkedin && (
                  <a href={portfolioData.social.linkedin} className="text-primary hover:text-primary-600">
                    <Linkedin className="h-6 w-6" />
                  </a>
                )}
                {portfolioData.social?.github && (
                  <a href={portfolioData.social.github} className="text-primary hover:text-primary-600">
                    <Github className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
}`,

    // Level 3: src/components/layout/
    'src/components/layout/Layout.tsx': `import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}`,

    'src/components/layout/Header.tsx': `import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-primary">
              {portfolioData.personal.name}
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="block py-2 text-gray-700 hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}`,

    'src/components/layout/Footer.tsx': `import { portfolioData } from '../../data/portfolio';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">{portfolioData.personal.name}</h3>
            <p className="text-gray-400">{portfolioData.personal.title}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-gray-400 hover:text-white">Home</a>
              <a href="/projects" className="block text-gray-400 hover:text-white">Projects</a>
              <a href="/about" className="block text-gray-400 hover:text-white">About</a>
              <a href="/contact" className="block text-gray-400 hover:text-white">Contact</a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              {portfolioData.social?.github && (
                <a href={portfolioData.social.github} className="text-gray-400 hover:text-white">
                  <Github className="h-6 w-6" />
                </a>
              )}
              {portfolioData.social?.linkedin && (
                <a href={portfolioData.social.linkedin} className="text-gray-400 hover:text-white">
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              <a href={\`mailto:\${portfolioData.personal.email}\`} className="text-gray-400 hover:text-white">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>© {new Date().getFullYear()} {portfolioData.personal.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}`,

    // Level 3: src/components/sections/
    'src/components/sections/Hero.tsx': `import { motion } from 'framer-motion';

interface HeroProps {
  data: any;
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            {data.profileImage && (
              <img 
                src={data.profileImage} 
                alt={data.name}
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-primary"
              />
            )}
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {data.name}
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-600 mb-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {data.title}
          </motion.p>

          <motion.p
            className="text-lg text-gray-700 max-w-2xl mx-auto mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {data.bio}
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a href="/contact" className="btn-primary">
              Get In Touch
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}`,

    'src/components/sections/FeaturedProjects.tsx': `import { motion } from 'framer-motion';
import { ProjectCard } from '../cards/ProjectCard';

interface FeaturedProjectsProps {
  projects: any[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="section-title text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Featured Projects
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}`,

    'src/components/sections/Skills.tsx': `import { motion } from 'framer-motion';

interface SkillsProps {
  skills: string[];
}

export function Skills({ skills }: SkillsProps) {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="section-title text-center"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
        >
          Skills & Technologies
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 mt-12">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              className="bg-primary text-white px-6 py-3 rounded-full"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.1 }}
            >
              {skill}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}`,

    // Level 4: src/components/cards/
    'src/components/cards/ProjectCard.tsx': `import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

interface ProjectCardProps {
  project: any;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      {project.imageUrl && (
        <img 
          src={project.imageUrl} 
          alt={project.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className="text-gray-600 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.technologies.map((tech: string, i: number) => (
            <span key={i} className="text-xs bg-primary-50 text-primary px-2 py-1 rounded">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex space-x-4">
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary-600"
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-primary hover:text-primary-600"
            >
              <Github className="h-4 w-4 mr-1" />
              Code
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}`,

    // Level 4: src/components/forms/
    'src/components/forms/ContactForm.tsx': `import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '../../config/emailjs';

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await emailjs.send(
        emailjsConfig.serviceId,
        emailjsConfig.templateId,
        formData,
        emailjsConfig.userId
      );
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full disabled:opacity-50"
      >
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && (
        <p className="text-green-600 text-center">Message sent successfully!</p>
      )}
      {status === 'error' && (
        <p className="text-red-600 text-center">Failed to send message. Please try again.</p>
      )}
    </form>
  );
}`,

    // Level 5: src/utils/
    'src/utils/animations.ts': `export const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 }
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};`,

    'src/utils/constants.ts': `export const SOCIAL_LINKS = {
  GITHUB: 'https://github.com',
  LINKEDIN: 'https://linkedin.com',
  TWITTER: 'https://twitter.com',
};

export const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}$/i;`,

    // Additional assets
    'public/vite.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 257"><defs><linearGradient id="a" x1="-.8%" x2="57.6%" y1="7.7%" y2="78.4%"><stop offset="0%" stop-color="#41D1FF"/><stop offset="100%" stop-color="#BD34FE"/></linearGradient></defs><path fill="url(#a)" d="m255.2 39.4-99.7 180.2c-3.2 5.7-11.4 5.7-14.6 0L41.1 39.4c-3.6-6.5 1.2-14.5 8.6-14.5h197c7.5 0 12.2 8 8.6 14.5Z"/></svg>`,

    '.gitignore': `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`,

    'LICENSE': `MIT License

Copyright (c) ${new Date().getFullYear()} ${portfolioData.personal.name}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  };
}