import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import AdmZip from 'adm-zip';
import archiver from 'archiver';
import { createWriteStream } from 'fs';
import type { TemplateManifest } from '@shared/template-types';
import { validateManifest, addTemplateToRegistry } from './template-registry.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '..', 'client', 'public', 'templates');
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads', 'templates');

// Ensure upload directory exists
async function ensureUploadDirectory(): Promise<void> {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  await fs.mkdir(TEMPLATES_DIR, { recursive: true });
}

// Extract and validate uploaded template
export async function extractTemplate(zipPath: string): Promise<TemplateManifest> {
  await ensureUploadDirectory();

  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();

  // Find manifest.json
  const manifestEntry = zipEntries.find(entry => 
    entry.entryName === 'manifest.json' || entry.entryName.endsWith('/manifest.json')
  );

  if (!manifestEntry) {
    throw new Error('manifest.json not found in template zip');
  }

  // Extract manifest temporarily to validate
  const manifestContent = manifestEntry.getData().toString('utf8');
  const manifest: TemplateManifest = JSON.parse(manifestContent);

  // Validate required fields
  if (!manifest.id || !manifest.name || !manifest.version || !manifest.entryFile) {
    throw new Error('Invalid manifest: missing required fields');
  }

  // Check if entry file exists in zip
  const entryFileExists = zipEntries.some(entry =>
    entry.entryName === manifest.entryFile || entry.entryName.endsWith(`/${manifest.entryFile}`)
  );

  if (!entryFileExists) {
    throw new Error(`Entry file ${manifest.entryFile} not found in template zip`);
  }

  return manifest;
}

// Install template to public directory
export async function installTemplate(zipPath: string, manifest: TemplateManifest): Promise<string> {
  const templateDir = path.join(TEMPLATES_DIR, manifest.id);

  // Remove existing template if it exists
  try {
    await fs.rm(templateDir, { recursive: true, force: true });
  } catch (error) {
    // Ignore if directory doesn't exist
  }

  // Create template directory
  await fs.mkdir(templateDir, { recursive: true });

  // Extract zip to template directory
  const zip = new AdmZip(zipPath);
  zip.extractAllTo(templateDir, true);

  // Validate manifest in extracted location
  const manifestPath = path.join(templateDir, 'manifest.json');
  await validateManifest(manifestPath);

  // Determine entry file path
  const entryPath = path.join(templateDir, manifest.entryFile);

  // Verify entry file exists
  try {
    await fs.access(entryPath);
  } catch (error) {
    throw new Error(`Entry file ${manifest.entryFile} not accessible after extraction`);
  }

  // Add to registry
  const relativeManifestPath = `/templates/${manifest.id}/manifest.json`;
  const relativeEntryPath = `/templates/${manifest.id}/${manifest.entryFile}`;
  
  await addTemplateToRegistry(manifest, relativeManifestPath, relativeEntryPath);

  return templateDir;
}

// Create downloadable zip of portfolio code
export async function createPortfolioZip(
  portfolioData: any,
  templateId: string,
  outputPath: string
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const output = createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', () => {
        resolve(outputPath);
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      // Add portfolio files structure
      const folderStructure = generatePortfolioStructure(portfolioData, templateId);

      // Add files to archive
      for (const [filePath, content] of Object.entries(folderStructure)) {
        archive.append(content, { name: filePath });
      }

      await archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
}

// Generate 7-level folder structure for portfolio
function generatePortfolioStructure(portfolioData: any, templateId: string): Record<string, string> {
  return {
    // Root files
    'package.json': JSON.stringify({
      name: `${portfolioData.personal.name.toLowerCase().replace(/\s+/g, '-')}-portfolio`,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^18.3.1',
        'react-dom': '^18.3.1',
        'framer-motion': '^11.13.1',
        '@emailjs/browser': '^4.4.1',
      },
      devDependencies: {
        '@vitejs/plugin-react': '^4.7.0',
        vite: '^5.4.20',
        typescript: '^5.6.3',
        tailwindcss: '^3.4.17',
        autoprefixer: '^10.4.20',
      },
    }, null, 2),

    'README.md': `# ${portfolioData.personal.name}'s Portfolio\n\nGenerated using Template: ${templateId}\n\n## Getting Started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``,

    'index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${portfolioData.personal.name} - Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

    // Source files
    'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

    'src/App.tsx': `import Portfolio from './components/Portfolio';
import './App.css';

function App() {
  return <Portfolio />;
}

export default App;`,

    'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`,

    // Components
    'src/components/Portfolio.tsx': `import { portfolioData } from '../data/portfolio-data';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <header className="py-20">
        <h1 className="text-4xl font-bold">{portfolioData.personal.name}</h1>
        <p className="text-xl text-muted-foreground">{portfolioData.personal.title}</p>
      </header>
      {/* Template content will be rendered here */}
    </div>
  );
}`,

    'src/components/ContactForm.tsx': `import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // EmailJS integration will be configured here
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input 
        type="text" 
        placeholder="Name" 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        className="w-full p-2 border rounded"
      />
      <input 
        type="email" 
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
        className="w-full p-2 border rounded"
      />
      <textarea 
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({...formData, message: e.target.value})}
        className="w-full p-2 border rounded h-32"
      />
      <button type="submit" className="px-4 py-2 bg-primary text-white rounded">
        Send Message
      </button>
    </form>
  );
}`,

    // Data
    'src/data/portfolio-data.ts': `export const portfolioData = ${JSON.stringify(portfolioData, null, 2)};`,

    // Config
    'vite.config.ts': `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`,

    'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
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
      },
      include: ['src'],
    }, null, 2),
  };
}

// Delete template
export async function deleteTemplate(templateId: string): Promise<void> {
  const templateDir = path.join(TEMPLATES_DIR, templateId);
  await fs.rm(templateDir, { recursive: true, force: true });
}
