import fs from 'node:fs/promises';
import path from 'node:path';
import { BrowserWindow, dialog, nativeImage } from 'electron';
import { FILE_EXTENSION, IPC_CHANNELS, PROJECT_DIRS, PROJECT_FILE } from '../../../shared/constants';
import type {
  IDiscoveredAsset,
  IDiscoveredGameObject,
  IDiscoveredUserComponent,
  IEditorMapFile,
  IEntropyProject,
  IFileOpenResult,
  IProjectScanResult
} from '../../../shared/types';
import { handle } from '../utils';

export function registerProjectHandlers(): void {
  handle(IPC_CHANNELS.PROJECT_OPEN, async (): Promise<IProjectScanResult | null> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return null;
    }

    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory'],
      title: 'Open Entropy Project'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const projectPath = result.filePaths[0];
    const configPath = path.join(projectPath, PROJECT_FILE);

    try {
      await fs.access(configPath);
    } catch {
      const defaultConfig: IEntropyProject = {
        name: path.basename(projectPath),
        version: '1.0.0',
        defaultScene: 'untitled'
      };

      await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf-8');
      await fs.mkdir(path.join(projectPath, PROJECT_DIRS.TILESETS), { recursive: true });
      await fs.mkdir(path.join(projectPath, PROJECT_DIRS.MAPS), { recursive: true });
    }

    return scanProject(projectPath);
  });

  handle(IPC_CHANNELS.PROJECT_SCAN, async (projectPath: string): Promise<IProjectScanResult> => {
    return scanProject(projectPath);
  });

  handle(IPC_CHANNELS.PROJECT_READ_IMAGE, async (absolutePath: string): Promise<string> => {
    const buffer = await fs.readFile(absolutePath);
    const ext = path.extname(absolutePath).slice(1).toLowerCase();
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;

    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  });

  handle(IPC_CHANNELS.PROJECT_READ_MAP, async (filePath: string): Promise<IEditorMapFile> => {
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content) as IEditorMapFile;

    return data;
  });

  handle(IPC_CHANNELS.PROJECT_SAVE_MAP, async (projectPath: string, filePath: string, data: IEditorMapFile): Promise<void> => {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  });

  handle(
    IPC_CHANNELS.PROJECT_CREATE_MAP,
    async (projectPath: string, name: string, tileWidth: number, tileHeight: number): Promise<IFileOpenResult> => {
      const mapsDir = path.join(projectPath, PROJECT_DIRS.MAPS);
      await fs.mkdir(mapsDir, { recursive: true });

      const filePath = path.join(mapsDir, `${name}${FILE_EXTENSION}`);
      const data: IEditorMapFile = {
        name,
        tileWidth,
        tileHeight,
        layers: [
          {
            type: 'tile',
            name: 'Layer 1',
            grid: Array.from({ length: 20 }, (): number[] => Array.from({ length: 30 }, (): number => 0)),
            tileSetId: '',
            visible: true,
            opacity: 1
          }
        ],
        tilesets: []
      };

      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
      return { filePath, data };
    }
  );

  handle(IPC_CHANNELS.PROJECT_IMPORT_TILESET, async (projectPath: string): Promise<string | null> => {
    const window = BrowserWindow.getFocusedWindow();

    if (window === null) {
      return null;
    }

    const result = await dialog.showOpenDialog(window, {
      filters: [{ name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'webp'] }],
      properties: ['openFile'],
      title: 'Import Tileset'
    });

    if (result.canceled || result.filePaths.length === 0) {
      return null;
    }

    const [relativePath] = await copyFilesToProject(projectPath, PROJECT_DIRS.TILESETS, [result.filePaths[0]]);

    return relativePath ?? null;
  });
}

async function copyFilesToProject(projectPath: string, relativeDir: string, sourcePaths: string[]): Promise<string[]> {
  const destinationDir = path.join(projectPath, relativeDir);
  await fs.mkdir(destinationDir, { recursive: true });

  const relativePaths: string[] = [];

  for (const sourcePath of sourcePaths) {
    const fileName = path.basename(sourcePath);
    const destinationPath = path.join(destinationDir, fileName);
    await fs.copyFile(sourcePath, destinationPath);
    relativePaths.push(toProjectRelativePath(projectPath, destinationPath));
  }

  return relativePaths;
}

function toProjectRelativePath(projectPath: string, filePath: string): string {
  // Compute path relative to public/ so the stored path matches the runtime URL.
  // Vite serves public/ at root, so public/assets/X.png → /assets/X.png at runtime.
  return path.relative(path.join(projectPath, 'public'), filePath).replace(/\\/g, '/');
}

async function scanProject(projectPath: string): Promise<IProjectScanResult> {
  const configPath = path.join(projectPath, PROJECT_FILE);
  const configContent = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(configContent) as IEntropyProject;

  const mapsDir = path.join(projectPath, PROJECT_DIRS.MAPS);
  const maps = await discoverFiles(mapsDir, FILE_EXTENSION);

  const tilesetsDir = path.join(projectPath, PROJECT_DIRS.TILESETS);
  const tilesets = await discoverImages(tilesetsDir, projectPath, '');

  const userComponents = await discoverUserComponents(projectPath);
  const gameObjects = await discoverGameObjects(projectPath);

  return { projectPath, config, maps, tilesets, userComponents, gameObjects };
}

async function discoverFiles(dir: string, extension: string): Promise<string[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    return entries
      .filter(entry => entry.isFile() && entry.name.endsWith(extension))
      .map(entry => path.join(dir, entry.name));
  } catch {
    return [];
  }
}

async function discoverImages(dir: string, projectPath: string, parentCategory: string): Promise<IDiscoveredAsset[]> {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const results: IDiscoveredAsset[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const category = parentCategory !== '' ? `${parentCategory}/${entry.name}` : entry.name;
        const subResults = await discoverImages(fullPath, projectPath, category);
        results.push(...subResults);
      } else if (entry.isFile() && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        const buffer = await fs.readFile(fullPath);
        const ext = path.extname(entry.name).slice(1).toLowerCase();
        const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`;
        const imageDataUrl = `data:${mimeType};base64,${buffer.toString('base64')}`;
        const { width, height } = nativeImage.createFromPath(fullPath).getSize();

        results.push({
          relativePath: toProjectRelativePath(projectPath, fullPath),
          name: path.basename(entry.name, path.extname(entry.name)),
          category: parentCategory !== '' ? parentCategory : 'uncategorized',
          imageDataUrl,
          width,
          height
        });
      }
    }

    return results;
  } catch {
    return [];
  }
}

const COMPONENT_CLASS_PATTERN = /class\s+(\w+)\s+extends\s+Component\b/g;
const GAME_OBJECT_CLASS_PATTERN = /class\s+(\w+)\s+extends\s+GameObject\b/g;

async function discoverUserComponents(projectPath: string): Promise<IDiscoveredUserComponent[]> {
  const srcDir = path.join(projectPath, 'src');

  try {
    await fs.access(srcDir);
  } catch {
    return [];
  }

  const tsFiles = await findTsFiles(srcDir);
  const components: IDiscoveredUserComponent[] = [];

  for (const filePath of tsFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const classMatches = content.matchAll(COMPONENT_CLASS_PATTERN);

    for (const match of classMatches) {
      const className = match[1];

      components.push({
        typeName: className,
        displayName: className,
        filePath: path.relative(projectPath, filePath).replace(/\\/g, '/')
      });
    }
  }

  return components;
}

async function discoverGameObjects(projectPath: string): Promise<IDiscoveredGameObject[]> {
  const srcDir = path.join(projectPath, 'src');

  try {
    await fs.access(srcDir);
  } catch {
    return [];
  }

  const tsFiles = await findTsFiles(srcDir);
  const gameObjects: IDiscoveredGameObject[] = [];

  for (const filePath of tsFiles) {
    const content = await fs.readFile(filePath, 'utf-8');
    const classMatches = content.matchAll(GAME_OBJECT_CLASS_PATTERN);

    for (const match of classMatches) {
      const className = match[1];
      const relativePath = path.relative(projectPath, filePath).replace(/\\/g, '/');
      const dirName = path.basename(path.dirname(filePath));

      gameObjects.push({
        className,
        filePath: relativePath,
        category: dirName === 'src' ? 'General' : dirName
      });
    }
  }

  return gameObjects;
}

async function findTsFiles(dir: string): Promise<string[]> {
  const results: string[] = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subResults = await findTsFiles(fullPath);
        results.push(...subResults);
      } else if (entry.isFile() && entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
        results.push(fullPath);
      }
    }
  } catch {
    // Directory not readable — skip
  }

  return results;
}
