# Team Incident Dashboard

A React + TypeScript incident management application built with Vite, featuring real-time data persistence, filtering, sorting, and incident lifecycle management.

> **Note**: This is a coding challenge starter project. See [candidate-brief.md](candidate-brief.md) for requirements.

## Quick Start

### Prerequisites

- **Node.js 18+**
- **pnpm** (recommended) or npm/yarn

### Installation & Running

```bash
# Install dependencies
pnpm install

# Development server (with live reload)
pnpm dev
# App opens at http://localhost:5173

# Run tests (unit + component tests)
pnpm test

# Run E2E tests (Playwright)
pnpm e2e           # Headless mode
pnpm e2e:ui        # Interactive UI mode

# Build for production
pnpm build

# Preview production build
pnpm preview

# Code quality
pnpm lint          # ESLint check
pnpm format        # Prettier format
pnpm format:check  # Check formatting
```

The app opens at http://localhost:5173 with Vite hot-reload. Changes to React components, styles, and i18n files reflect instantly.

### Test Setup:

- setup.ts polyfills matchMedia, ResizeObserver (needed by Ant Design)
- render.tsx exports renderWithProviders() which wraps components in React Query + React Router

## Architecture & Key Decisions

### State Management: React Query (TanStack Query)

### Why:

Server-state management with built-in caching, refetching, and synchronization.

### Benefits:

- Automatic request deduplication & caching
- Background refetching with configurable stale times
- Optimistic updates for better UX
- Query invalidation patterns for cache coherence

### Implementation:

- Query keys defined in index.ts for centralized cache management
- Custom hooks: useIncidentsQuery(), useCreateIncidentMutation(), useUpdateIncidentMutation()
- Default cache stale time: 15 seconds (see queryClient.ts)

```typescript
// Example: Queries auto-invalidate & refetch on mutation success
useCreateIncidentMutation(); // onSuccess invalidates incident list cache
```

Data Fetching: Mock API with localStorage Persistence

### Why:

No backend required; data survives page refreshes for a real developer experience.

### How:

mockApi.ts intercepts fetch() calls to /api/\* endpoints
Data persisted in browser localStorage
300ms simulated delay (disabled in tests for speed)
Initialized automatically in main.tsx

### Available Endpoints:

| Method | Endpoint             | pURPOSE                     |
| ------ | -------------------- | --------------------------- |
| GET    | `/api/incidents`     | Fetch all incidents         |
| GET    | `/api/incidents/:id` | Fetch incident by ID        |
| POST   | `/api/incidents`     | Create new incident         |
| PATCH  | `/api/incidents/:id` | Update incident             |
| DELETE | `/api/incidents/:id` | Delete incident             |
| GET    | `/api/users`         | Fetch users for assignment  |
| POST   | `/api/reset`         | Reset data to seed defaults |

**API Reset & Seed Data**
To reset the dashboard to seed data:

```typescript
// Browser console
await fetch("/api/reset", { method: "POST" });
location.reload();
```

See seedData.ts for default incidents and users.

## Project Structure

```
.
├── .github/
│   └── workflows/
│       └── ci.yml                # CI/CD pipeline configuration
├── .gitignore
├── .prettierignore
├── .prettierrc
├── e2e/                          # End-to-end tests (Playwright)
│   └── incidents/
│       └── incidents.spec.ts     # E2E test flows
├── eslint.config.js              # ESLint configuration
├── index.html                    # HTML entry point
├── package.json                  # Dependencies & scripts
├── package-lock.json
├── pnpm-lock.yaml                # pnpm lock file
├── playwright.config.ts          # Playwright E2E configuration
├── public/                       # Static assets
├── README.md                     # Project documentation
├── src/
│   ├── api/                      # Data layer & mock API
│   │   ├── index.ts              # Public API exports
│   │   ├── mockApi.ts            # HTTP interceptor (300ms delay)
│   │   ├── mockApi.test.ts       # API behavior tests
│   │   ├── seedData.ts           # Default incidents & users
│   │   ├── storage.ts            # localStorage abstraction
│   │   └── types.ts              # Incident, User, status types
│   │
│   ├── services/                 # Business logic & fetch wrappers
│   │   ├── http.ts               # fetchJson() helper with error handling
│   │   ├── incidents.ts          # CRUD operations for incidents
│   │   └── users.ts              # User listing service
│   │
│   ├── features/incidents/       # Feature-scoped components & logic
│   │   ├── IncidentsPage.tsx     # Main page with filtering/sorting
│   │   ├── hooks/
│   │   │   └── index.ts          # React Query hooks & query keys
│   │   ├── components/
│   │   │   ├── CreateIncidentModal.tsx      # Form for new incidents (Zod validation)
│   │   │   ├── IncidentDetailDrawer.tsx     # Read-only details sidebar
│   │   │   ├── IncidentEditPanel.tsx        # In-drawer edit form
│   │   │   ├── IncidentFiltersBar.tsx       # Query, status, severity, assignee filters
│   │   │   ├── IncidentReadOnlyDetails.tsx  # Details display component
│   │   │   └── IncidentTable.tsx            # Sortable/paginated table
│   │   └── ___tests___/          # Component & integration tests
│   │       ├── CreateIncidentModal.test.tsx
│   │       └── IncidentsPage.test.tsx
│   │
│   ├── components/
│   │   └── AppShell.tsx          # Header layout with brand & title
│   │
│   ├── lib/
│   │   ├── queryClient.ts        # React Query configuration
│   │   ├── theme/
│   │   │   └── antdTheme.ts      # Danske Bank brand colors & Ant Design customization
│   │   └── i18n/
│   │       ├── index.ts          # i18next initialization
│   │       └── locales/
│   │           └── en.json       # English translations
│   │
│   ├── test/
│   │   ├── setup.ts              # Vitest setup (polyfills: matchMedia, ResizeObserver)
│   │   └── render.tsx            # Test utilities (renderWithProviders)
│   │
│   ├── App.css
│   ├── App.test.tsx              # App component test
│   ├── App.tsx                   # Router & route definitions
│   ├── index.css                 # Global styles
│   ├── main.tsx                  # React entry point & provider setup
│   └── vite-env.d.ts             # Vite type definitions
│
├── test-results/                 # Playwright test artifacts (generated)
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
└── vitest.config.ts              # Vitest unit test configuration
```

## Key Design Decisions

| Decision                | Rationale                                                                     |
| ----------------------- | ----------------------------------------------------------------------------- |
| React Query             | Eliminates Redux boilerplate; built for server-state; auto caching/refetch    |
| Mock API                | Realistic dev experience without backend; localStorage persistence            |
| Ant Design              | Rich component library; responsive tables, modals, drawers; Danske theme-able |
| Zod validation          | Type-safe schema validation for forms; runtime type checking                  |
| React Router v7         | Nested routes for detail view; URL-driven state (/incidents/:incidentId)      |
| i18n                    | Foundation for multi-language support (currently English only)                |
| Feature-based structure | Scales well; incidents feature self-contained & relocatable                   |

## Trade-offs & Limitations

What Works Well ✅

Responsive design: Mobile, tablet, desktop layouts via Ant Design grid system

- Fast local development: Mock API with instant feedback
- Type safety: Full TypeScript with strict mode
- Testing: Component tests + E2E via Playwright
- Theming: Danske Bank brand colors + Ant Design token system

Limitations & Future Improvements 🔧

| **Limitation**         | **Impact**                                 | **Would Improve With**                                     |
| ---------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| No error boundaries    | One component crash breaks app             | Add React Error Boundary wrapper; error recovery UI        |
| Single-language        | Only English supported                     | Complete i18n setup (EN, DK, etc.); use i18n workflow      |
| No real authentication | Anyone can edit any incident               | Auth service; role-based access control (RBAC); JWT tokens |
| localStorage only      | Data lost on browser clear                 | Real API backend                                           |
| Limited filtering      | No date-range, priority, or custom filters | Advanced filter builder; saved filter presets              |

What I'd Prioritize First

1. **Real backend API** → Swap mock API layer; same service interfaces
2. **Error boundaries & error UI** → Graceful failure; user feedback
3. **Complete i18n** → Multi-language dashboard
4. **Authentication & RBAC** → Security & data isolation
5. **Advanced filtering & saved views** → Power-user features

## Technology Stack

| **Layer**            | **Technology**        | **Version** |
| -------------------- | --------------------- | ----------- |
| Runtime              | Node.js               | 18+         |
| Framework            | React                 | 18.3.1      |
| Language             | TypeScript            | 5.6.2       |
| Build Tool           | Vite                  | 6.0.5       |
| State Management     | React Query           | 5.90.17     |
| UI Component Library | Ant Design            | 6.2.0       |
| Routing              | React Router          | 7.12.0      |
| Form Management      | React Hook Form       | 7.71.1      |
| Validation           | Zod                   | 4.3.5       |
| Internationalization | i18next               | 25.7.4      |
| Unit Testing         | Vitest                | 4.0.17      |
| Component Testing    | React Testing Library | 16.1.0      |
| E2E Testing          | Playwright            | 1.57.0      |
| Linting              | ESLint                | 9.17.0      |
| Formatting           | Prettier              | 3.7.4       |

## Use of AI Tooling

**GitHub Copilot** was used strategically during development:

1. **Mock API boilerplate** → AI generated fetch interceptor pattern; refined error handling & validation
2. **Component templates** → AI scaffolded form layouts; refactored for state management & accessibility
3. **Type definitions** → AI inferred Incident, User, and StatusHistory types; validated against requirements
4. **Documentation** → AI helped structure Tables; I verified accuracy against implementation

**Manual work**

- All custom hooks & query logic (React Query patterns)
- Filtering & sorting algorithm in IncidentsPage.tsx
- i18n setup & locale keys
- Playwright E2E test flows
- Error handling & edge cases
- This README

## Screenshots

### Desktop View

<img width="1917" height="877" alt="image" src="https://github.com/user-attachments/assets/0e1d2920-9da1-4fee-a302-96fa270ea46e" />
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/45872708-53a4-47b9-b62f-35055fbaea06" />
<img width="1621" height="878" alt="image" src="https://github.com/user-attachments/assets/78b645a2-bfa0-44e0-a1b7-1845e0bcf612" />

Team Incident Dashboard - Desktop

Incidents table with filtering, sorting, and detail drawer (right sidebar)

- **Layout**: 3-column (filters, table, drawer)
- **Features**:
  - Real-time search by incident title
  - Filter by status (Open, In Progress, Resolved)
  - Filter by severity (Low, Medium, High, Critical)
  - Assign to team member
  - Sort by date created, title, or severity
  - Click row → view/edit in drawer
  - Create new incident button (top)

### Mobile View

<img width="717" height="762" alt="image" src="https://github.com/user-attachments/assets/ed5bdf6a-6fa5-4650-88e4-ceef0d96ba15" />
<img width="685" height="801" alt="image" src="https://github.com/user-attachments/assets/8c88cec1-b985-4de3-83e9-ac7db4c08037" />
<img width="739" height="795" alt="image" src="https://github.com/user-attachments/assets/b1684a57-d0c1-43ab-b8b4-5a22dd2ed6be" />

Team Incident Dashboard - Mobile

Compact view with collapsed filters and modal details

- **Layout**: Full-width stacked (filters collapsible, table full width, drawer as modal)
- **Features**:
  - Responsive filter bar with fewer options visible
  - Table scrolls horizontally on small screens
  - Incident details open in full-screen modal
  - Touch-friendly button sizes (40px min height)

## CI/CD Pipeline

The project uses **GitHub Actions** for automated testing and validation on every push and pull request.

### Pipeline Overview

The CI pipeline runs in two parallel jobs:

#### 1. **Lint, Format, Unit Tests & Build** (`unit_lint_build`)

Runs on every push and pull request.

**Steps**:

- ✅ Code format check (Prettier)
- ✅ Linting (ESLint)
- ✅ Unit & component tests (Vitest)
- ✅ Production build (TypeScript + Vite)

**Fails if any step fails** - prevents merging broken code.

#### 2. **E2E Tests** (`e2e`)

Runs **after** `unit_lint_build` succeeds, ensuring the app builds before testing.

**Steps**:

- ✅ Install Playwright browsers
- ✅ Build production bundle
- ✅ Run E2E tests (Playwright)
- ✅ Upload test report on failure

**Timeout**: 20 minutes

**Artifacts**: On failure, uploads `playwright-report/` for debugging.

### Configuration

**File**: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)

**Key settings**:

- **Node.js**: 20
- **pnpm**: 9
- **Concurrency**: Cancels previous runs on new push (faster feedback)
- **Cache**: Uses pnpm lock file for fast dependency installation

### Running Locally Before Push

To match CI behavior locally:

```bash
# Format check
pnpm format:check

# Lint
pnpm lint

# Unit tests
pnpm test

# Build (TypeScript check + bundle)
pnpm build

# E2E tests (optional, slower)
pnpm e2e

# Or run all at once:
pnpm format:check && pnpm lint && pnpm test && pnpm build && pnpm e2e
```

### Playwright Report

When E2E tests fail in CI, an artifact is uploaded. To view:

1. Go to GitHub Actions run
2. Scroll to "Artifacts" section
3. Download `playwright-report`
4. Extract and open `index.html` in browser
5. See failed test trace, screenshots, video

**Skipping CI (Not Recommended)**
Add `[skip ci]` to commit message to skip pipeline:

```bash
git commit -m "docs: update README [skip ci]"
```
