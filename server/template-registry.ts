import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import type { TemplateRegistryEntry, TemplateManifest } from '@shared/template-types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(__dirname, '..', 'client', 'public', 'templates', 'registry.json');
const TEMPLATES_DIR = path.join(__dirname, '..', 'client', 'public', 'templates');

export interface TemplateRegistry {
  version: string;
  lastUpdated: string;
  templates: TemplateRegistryEntry[];
}

// Ensure templates directory exists
export async function ensureTemplatesDirectory(): Promise<void> {
  await fs.mkdir(TEMPLATES_DIR, { recursive: true });
}

// Load registry from file
export async function loadRegistry(): Promise<TemplateRegistry> {
  try {
    await ensureTemplatesDirectory();
    const data = await fs.readFile(REGISTRY_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return empty registry if file doesn't exist
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      templates: [],
    };
  }
}

// Save registry to file
export async function saveRegistry(registry: TemplateRegistry): Promise<void> {
  await ensureTemplatesDirectory();
  registry.lastUpdated = new Date().toISOString();
  await fs.writeFile(REGISTRY_PATH, JSON.stringify(registry, null, 2));
}

// Add template to registry
export async function addTemplateToRegistry(
  manifest: TemplateManifest,
  manifestPath: string,
  entryPath: string
): Promise<void> {
  const registry = await loadRegistry();

  // Check if template already exists
  const existingIndex = registry.templates.findIndex(t => t.id === manifest.id);

  const entry: TemplateRegistryEntry = {
    id: manifest.id,
    name: manifest.name,
    version: manifest.version,
    description: manifest.description,
    category: manifest.category,
    thumbnail: manifest.thumbnail,
    manifestPath,
    entryPath,
    features: manifest.features || [],
    isPremium: manifest.isPremium || false,
    isActive: true,
    uploadedAt: existingIndex >= 0 ? registry.templates[existingIndex].uploadedAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    // Update existing template
    registry.templates[existingIndex] = entry;
  } else {
    // Add new template
    registry.templates.push(entry);
  }

  await saveRegistry(registry);
}

// Remove template from registry
export async function removeTemplateFromRegistry(templateId: string): Promise<void> {
  const registry = await loadRegistry();
  registry.templates = registry.templates.filter(t => t.id !== templateId);
  await saveRegistry(registry);
}

// Get all active templates
export async function getActiveTemplates(): Promise<TemplateRegistryEntry[]> {
  const registry = await loadRegistry();
  return registry.templates.filter(t => t.isActive);
}

// Get template by ID
export async function getTemplateById(templateId: string): Promise<TemplateRegistryEntry | undefined> {
  const registry = await loadRegistry();
  return registry.templates.find(t => t.id === templateId);
}

// Validate manifest structure
export async function validateManifest(manifestPath: string): Promise<TemplateManifest> {
  const manifestContent = await fs.readFile(manifestPath, 'utf-8');
  const manifest = JSON.parse(manifestContent);

  // Basic validation
  if (!manifest.id || !manifest.name || !manifest.version || !manifest.category || !manifest.entryFile) {
    throw new Error('Invalid manifest: missing required fields (id, name, version, category, entryFile)');
  }

  return manifest as TemplateManifest;
}
