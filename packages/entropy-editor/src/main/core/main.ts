import { app } from 'electron';
import { initializeApp } from './startup';

void app.whenReady().then(initializeApp);
