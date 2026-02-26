# CLAUDE.md - Remotion Video Project

## Project Overview

This is a **Remotion** video project for creating programmatic videos using React. The current main composition is `OpenClawTutorial` - a video tutorial demonstrating how to configure Discord channels for OpenClaw.

## Tech Stack

- **Framework**: [Remotion](https://www.remotion.dev/) v4.0.422 - Create videos with React
- **Runtime**: React 19.2.3
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS v4.0.0 with `@remotion/tailwind-v4`
- **Package Manager**: pnpm 10.28.2
- **Linting**: ESLint 9.19.0 with `@remotion/eslint-config-flat`
- **Formatting**: Prettier 3.6.0

## Development Commands

```bash
# Start development studio (preview and edit videos)
pnpm dev

# Build the project
pnpm build

# Lint and type check
pnpm lint

# Upgrade Remotion dependencies
pnpm upgrade
```

## Project Structure

```
src/
├── index.ts           # Entry point, registers the root component
├── index.css          # Global styles
├── Root.tsx           # Root component with Composition definitions
└── OpenClawTutorial.tsx  # Main tutorial composition
```

## Key Concepts

### Compositions
Compositions are defined in `src/Root.tsx`. Each composition represents a video with:
- `id`: Unique identifier
- `component`: React component to render
- `durationInFrames`: Video length
- `fps`: Frames per second (default: 30)
- `width`/`height`: Video resolution (default: 1920x1080)
- `schema`: Zod schema for props validation
- `defaultProps`: Default prop values

### Video Specifications
- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Format**: JPEG (configured in remotion.config.ts)
- **Default Duration**: 2700 frames (90 seconds at 30fps)

### Styling
- Uses Tailwind CSS v4
- Tailwind integration via `@remotion/tailwind-v4`
- Inline styles and standard CSS are also supported

## Code Style

- **TypeScript**: Strict mode enabled
- **Unused Locals**: Check enabled (`noUnusedLocals: true`)
- **JSX**: React 19 JSX transform (`react-jsx`)
- **ESLint**: Use Remotion's flat config
- **Prettier**: Configured with `.prettierrc`

## Remotion Best Practices

When working on this project:

1. **Always define Zod schemas** for composition props to ensure type safety
2. **Use absolute frame numbers** for timing, avoid magic numbers
3. **Test in the studio** (`pnpm dev`) before rendering
4. **Keep components pure** - avoid side effects during render
5. **Use Remotion hooks** like `useCurrentFrame()`, `useVideoConfig()` for timing
6. **Optimize images** - use appropriate formats and sizes

## Rendering Videos

```bash
# Render a composition to video
npx remotion render OpenClawTutorial out/video.mp4

# Render with custom options
npx remotion render OpenClawTutorial out/video.mp4 --props='{"title":"Custom"}'
```

## Configuration Files

- `remotion.config.ts`: Remotion-specific configuration
- `tsconfig.json`: TypeScript compiler options
- `postcss.config.mjs`: PostCSS configuration for Tailwind
- `eslint.config.mjs`: ESLint configuration
- `.prettierrc`: Code formatting rules

## Important Notes

- The project uses **pnpm** as package manager - avoid npm/yarn
- Image output format is set to **JPEG** for better compatibility
- **Overwrite output** is enabled by default
- TypeScript excludes `remotion.config.ts` from compilation

## Resources

- [Remotion Documentation](https://www.remotion.dev/docs)
- [Remotion Discord](https://discord.gg/6VzzNDwUwV)
- [Remotion GitHub Issues](https://github.com/remotion-dev/remotion/issues)
