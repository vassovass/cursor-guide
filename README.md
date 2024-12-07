# CursorGuide - AI Development Assistant

## Overview
CursorGuide is an AI-powered development assistant that helps create and maintain robust applications. This living document serves as our knowledge base and will evolve with the project.

## Core Architecture

### Technology Stack
- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: TanStack Query
- **Backend**: Supabase
- **Testing**: Vitest + Testing Library

### Project Structure
```
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI components
│   ├── features/     # Feature-specific components
│   └── layout/       # Layout components
├── hooks/            # Custom React hooks
├── pages/            # Route components
├── utils/            # Utility functions
├── types/            # TypeScript definitions
├── styles/           # Global styles
└── tests/            # Test files
```

## Development Guidelines

### Code Style

#### Naming Conventions
- **Components**: PascalCase (e.g., `FeatureCard.tsx`)
- **Files**: kebab-case (e.g., `api-utils.ts`)
- **Functions**: camelCase (e.g., `handleSubmit`)
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase with prefix (e.g., `TProps`, `IUser`)
- **CSS Classes**: kebab-case

#### Component Structure
```typescript
// Import statements
import { useState } from 'react';
import type { ComponentProps } from './types';

// Component interface
interface Props extends ComponentProps {
  title: string;
  onAction?: () => void;
}

// Component definition
export function FeatureComponent({ title, onAction }: Props) {
  // State hooks
  const [state, setState] = useState();

  // Event handlers
  const handleClick = () => {
    // Implementation
  };

  // Render
  return (
    // JSX
  );
}
```

### State Management
- Use **TanStack Query** for server state
- Use **Context** for global UI state
- Keep component state local when possible
- Consider performance implications of context consumers

### Styling Guidelines

#### Design Tokens
```typescript
const tokens = {
  colors: {
    primary: '#9b87f5',
    secondary: '#7E69AB',
    accent: '#6E59A5',
    // Add colors as needed
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    // Add spacing as needed
  },
  // Add other tokens as needed
};
```

#### Component Styling
- Use Tailwind classes for styling
- Follow mobile-first approach
- Maintain dark mode compatibility
- Use CSS variables for theme values

### Best Practices

#### Performance
- Implement code splitting
- Lazy load routes and heavy components
- Optimize images and assets
- Use proper memoization
- Monitor bundle size

#### Accessibility
- Follow WCAG 2.1 AA guidelines
- Support keyboard navigation
- Implement proper ARIA attributes
- Ensure sufficient color contrast
- Test with screen readers

#### Error Handling
- Use error boundaries
- Implement proper error states
- Log errors appropriately
- Show user-friendly messages
- Use toast notifications

### Testing Strategy
- Unit test utilities
- Integration test components
- E2E test critical paths
- Mock external dependencies
- Maintain test coverage goals

## Feature Implementation

### Documentation
Each feature should include:
- Technical documentation
- Usage examples
- Props/API documentation
- Testing guidelines
- Performance considerations

### AI Integration
- Model configuration
- Response handling
- Error recovery
- Performance optimization
- Usage tracking

## Deployment & CI/CD
- Environment configuration
- Build optimization
- Deployment verification
- Monitoring setup
- Performance tracking

## Security
- Input validation
- Authentication flows
- API security
- Data protection
- Regular audits

## Contributing
- PR guidelines
- Code review process
- Testing requirements
- Documentation updates
- Version control practices

## Resources
- [Project Documentation](docs/)
- [API Reference](api/)
- [Style Guide](style-guide/)
- [Testing Guide](testing/)
- [Security Guidelines](security/)

## Versioning
This document follows [Semantic Versioning](https://semver.org/). All notable changes are documented in the [CHANGELOG.md](CHANGELOG.md).

---

**Note**: This knowledge base is a living document. As the project evolves, update this guide to reflect current best practices and requirements.