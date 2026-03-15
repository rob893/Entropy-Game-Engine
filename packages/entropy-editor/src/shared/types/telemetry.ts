export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface ILogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: string;
  data?: Record<string, unknown>;
}

export interface ITelemetryEvent {
  name: string;
  timestamp: Date;
  properties?: Record<string, unknown>;
  measurements?: Record<string, number>;
}

export interface ITelemetryTransport {
  log(entry: ILogEntry): void;
  trackEvent(event: ITelemetryEvent): void;
  flush(): void;
}

export const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};
