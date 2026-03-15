import { ConsoleTransport } from '../../shared/telemetry/ConsoleTransport';
import { Logger } from '../../shared/telemetry/Logger';

const consoleTransport = new ConsoleTransport('debug');

const logger = new Logger('renderer');
logger.addTransport(consoleTransport);

export { logger };

export function trackToolOpen(toolId: string, entryPoint: string): void {
  logger.trackEvent('tool:open', { toolId, entryPoint });
}

export function startToolTimer(toolId: string): { done: (success: boolean, error?: string) => void } {
  const timer = logger.startTimer(`tool:${toolId}`);

  return {
    done: (success: boolean, error?: string) => {
      timer.done(success, error !== undefined ? { error } : undefined);
    }
  };
}
