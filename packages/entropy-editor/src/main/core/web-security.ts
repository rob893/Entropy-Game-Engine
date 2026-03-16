import { session } from 'electron';

export function configureCSP(): void {
  const isDev = process.env.VITE_DEV_SERVER_URL !== undefined;

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const prodDirectives = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: file:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "worker-src 'self'",
      "child-src 'none'"
    ];

    const devDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: file:",
      "font-src 'self' data:",
      "connect-src 'self' ws://localhost:* http://localhost:*",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'none'",
      "worker-src 'self'",
      "child-src 'none'"
    ];

    const directives = isDev ? devDirectives : prodDirectives;

    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [directives.join('; ')]
      }
    });
  });
}
