'use strict';

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  setupFiles: ['jest-canvas-mock'],
  testEnvironment: 'jsdom'
};
