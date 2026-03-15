import { session } from 'electron';

export function configureCSP(): void {
  // Only enforce strict CSP in production — Vite dev server requires inline scripts for HMR
  if (process.env.VITE_DEV_SERVER_URL !== undefined) {
    return;
  }

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: file:",
            "font-src 'self' data:",
            "connect-src 'self'",
            "frame-src 'none'",
            "object-src 'none'",
            "base-uri 'self'"
          ].join('; ')
        ]
      }
    });
  });
}
