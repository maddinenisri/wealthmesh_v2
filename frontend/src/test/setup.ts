import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, expect } from 'vitest';
import { setupServer } from 'msw/node';

export const server = setupServer();
let unhandledFrames = 0;
beforeAll(() =>
  server.listen({
    onUnhandledFrame: ({ defaults }) => {
      unhandledFrames += 1;
      defaults.error();
    },
  }),
);
afterEach(() => {
  cleanup();
  server.resetHandlers();
  expect(unhandledFrames, 'Every test request needs an explicit MSW handler').toBe(0);
  unhandledFrames = 0;
});
afterAll(() => server.close());
