import type { ILogEntry, ITelemetryEvent, ITelemetryTransport, LogLevel } from '../types/telemetry';
import { LOG_LEVELS } from '../types/telemetry';

export class ConsoleTransport implements ITelemetryTransport {
  private readonly minLevel: LogLevel;

  public constructor(minLevel: LogLevel = 'debug') {
    this.minLevel = minLevel;
  }

  public log(entry: ILogEntry): void {
    if (LOG_LEVELS[entry.level] < LOG_LEVELS[this.minLevel]) {
      return;
    }

    const prefix = entry.context !== undefined ? `[${entry.context}]` : '';
    const timestamp = entry.timestamp.toISOString();
    const message = `${timestamp} ${entry.level.toUpperCase().padEnd(5)} ${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        console.debug(message, entry.data ?? '');
        break;
      case 'info':
        console.info(message, entry.data ?? '');
        break;
      case 'warn':
        console.warn(message, entry.data ?? '');
        break;
      case 'error':
        console.error(message, entry.data ?? '');
        break;
    }
  }

  public trackEvent(event: ITelemetryEvent): void {
    const timestamp = event.timestamp.toISOString();
    console.info(`${timestamp} EVENT ${event.name}`, {
      ...event.properties,
      ...event.measurements
    });
  }

  public flush(): void {
    // Console transport has no buffer to flush
  }
}
