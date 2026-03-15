import type { IElectronAPI } from '../../shared/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Window {
    electronAPI: IElectronAPI;
  }
}
