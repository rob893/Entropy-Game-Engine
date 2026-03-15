import { ipcMain } from 'electron';
import { logger as mainLogger } from '../platform/telemetry';

const logger = mainLogger.child('ipc');

export function handle<TArgs extends unknown[], TReturn>(
  channel: string,
  handler: (...args: TArgs) => Promise<TReturn> | TReturn
): void {
  ipcMain.handle(channel, async (_event, ...args: unknown[]) => {
    try {
      return await handler(...(args as TArgs));
    } catch (error) {
      logger.error(`Handler failed: ${channel}`, { error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  });
}
