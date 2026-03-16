import { app } from 'electron';
import { initializeApp } from './startup';

void app
  .whenReady()
  .then(initializeApp)
  .catch((error: unknown) => {
    console.error('Failed to initialize application:', error);
    app.exit(1);
  });
