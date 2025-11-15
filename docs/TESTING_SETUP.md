# Testing Setup Guide for Replicon

## Quick Setup

### 1. Install Testing Dependencies

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Add Test Scripts to package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 3. Create vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 4. Create Test Setup File

File: `src/test/setup.ts`
```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});
```

### 5. Example Test

File: `src/components/Button.test.tsx`
```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<button>Click me</button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const user = userEvent.setup();
    let clicked = false;

    render(<button onClick={() => { clicked = true; }}>Click</button>);

    await user.click(screen.getByText('Click'));
    expect(clicked).toBe(true);
  });
});
```

### 6. Run Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run with UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

## Testing Checklist Before Deployment

- [ ] Unit tests for utility functions
- [ ] Component tests for critical UI components
- [ ] Integration tests for API calls
- [ ] E2E tests for critical user flows
- [ ] Test coverage > 70%
- [ ] All tests passing
