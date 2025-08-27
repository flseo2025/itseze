/**
 * Simplified Test Setup - JavaScript only
 */

// Mock fetch for tests
if (!global.fetch) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
    text: async () => '',
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: async () => new ArrayBuffer(0),
    blob: async () => new Blob(),
    formData: async () => new FormData()
  });
}

// Environment setup
process.env.NODE_ENV = 'test';
process.env.TZ = 'UTC';

// Global test timeout
jest.setTimeout(10000);