import type { ILogEntry, ITelemetryEvent, ITelemetryTransport, LogLevel } from '../types/telemetry';

export class Logger {
  private readonly transports: ITelemetryTransport[] = [];

  private readonly context: string | undefined;

  public constructor(context?: string) {
    this.context = context;
  }

  public addTransport(transport: ITelemetryTransport): void {
    this.transports.push(transport);
  }

  public child(context: string): Logger {
    const child = new Logger(this.context !== undefined ? `${this.context}:${context}` : context);

    for (const transport of this.transports) {
      child.addTransport(transport);
    }

    return child;
  }

  public debug(message: string, data?: Record<string, unknown>): void {
    this.log('debug', message, data);
  }

  public info(message: string, data?: Record<string, unknown>): void {
    this.log('info', message, data);
  }

  public warn(message: string, data?: Record<string, unknown>): void {
    this.log('warn', message, data);
  }

  public error(message: string, data?: Record<string, unknown>): void {
    this.log('error', message, data);
  }

  public trackEvent(name: string, properties?: Record<string, unknown>, measurements?: Record<string, number>): void {
    const event: ITelemetryEvent = {
      name,
      timestamp: new Date(),
      properties,
      measurements
    };

    for (const transport of this.transports) {
      transport.trackEvent(event);
    }
  }

  public startTimer(eventName: string): ITimerHandle {
    const start = performance.now();

    return {
      done: (success: boolean, properties?: Record<string, unknown>) => {
        const durationMs = performance.now() - start;

        this.trackEvent(eventName, {
          success,
          ...properties
        }, {
          durationMs
        });
      }
    };
  }

  public flush(): void {
    for (const transport of this.transports) {
      transport.flush();
    }
  }

  private log(level: LogLevel, message: string, data?: Record<string, unknown>): void {
    const entry: ILogEntry = {
      level,
      message,
      timestamp: new Date(),
      context: this.context,
      data
    };

    for (const transport of this.transports) {
      transport.log(entry);
    }
  }
}

export interface ITimerHandle {
  done: (success: boolean, properties?: Record<string, unknown>) => void;
}
