import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts',
        'scripts/',
        'config/',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
    include: ['tests/**/*.test.ts', 'src/**/*.test.ts'],
    exclude: [
      'node_modules/',
      'dist/',
      'coverage/',
      '**/*.d.ts',
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src'),
      '@/components': path.resolve(__dirname, '../src/components'),
      '@/utils': path.resolve(__dirname, '../src/utils'),
      '@/types': path.resolve(__dirname, '../src/types'),
      '@/hooks': path.resolve(__dirname, '../src/hooks'),
      '@/services': path.resolve(__dirname, '../src/services'),
      '@/constants': path.resolve(__dirname, '../src/constants'),
      '@/config': path.resolve(__dirname, '../src/config'),
      '@/tests': path.resolve(__dirname, '../tests'),
    },
  },
});