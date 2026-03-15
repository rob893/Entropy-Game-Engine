import { ConsoleTransport } from '../../shared/telemetry/ConsoleTransport';
import { Logger } from '../../shared/telemetry/Logger';

const consoleTransport = new ConsoleTransport('debug');

const logger = new Logger('main');
logger.addTransport(consoleTransport);

export { logger };
