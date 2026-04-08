import fs from 'node:fs/promises';
import path from 'node:path';
import { app } from 'electron';
import { IPC_CHANNELS } from '../../../shared/constants';
import type { IGlobalSettings, IProjectSettings } from '../../../shared/types';
import { getDefaultGlobalSettings, getDefaultProjectSettings } from '../../../shared/types';
import { handle } from '../utils';

const GLOBAL_SETTINGS_FILE = 'editor-settings.json';
const PROJECT_SETTINGS_DIR = '.entropy';
const PROJECT_SETTINGS_FILE = 'editor-settings.json';

async function readJsonFile<T>(filePath: string, defaults: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const parsed = JSON.parse(content) as Partial<T>;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

function getGlobalSettingsPath(): string {
  return path.join(app.getPath('userData'), GLOBAL_SETTINGS_FILE);
}

function getProjectSettingsPath(projectPath: string): string {
  return path.join(projectPath, PROJECT_SETTINGS_DIR, PROJECT_SETTINGS_FILE);
}

export function registerSettingsHandlers(): void {
  handle(IPC_CHANNELS.SETTINGS_LOAD_GLOBAL, async (): Promise<IGlobalSettings> => {
    return readJsonFile(getGlobalSettingsPath(), getDefaultGlobalSettings());
  });

  handle(IPC_CHANNELS.SETTINGS_SAVE_GLOBAL, async (settings: Partial<IGlobalSettings>): Promise<void> => {
    const current = await readJsonFile(getGlobalSettingsPath(), getDefaultGlobalSettings());
    const merged = { ...current, ...settings };
    await writeJsonFile(getGlobalSettingsPath(), merged);
  });

  handle(IPC_CHANNELS.SETTINGS_LOAD_PROJECT, async (projectPath: string): Promise<IProjectSettings> => {
    return readJsonFile(getProjectSettingsPath(projectPath), getDefaultProjectSettings());
  });

  handle(
    IPC_CHANNELS.SETTINGS_SAVE_PROJECT,
    async (projectPath: string, settings: Partial<IProjectSettings>): Promise<void> => {
      const settingsPath = getProjectSettingsPath(projectPath);
      const current = await readJsonFile(settingsPath, getDefaultProjectSettings());
      const merged = { ...current, ...settings };
      await writeJsonFile(settingsPath, merged);
    }
  );
}
