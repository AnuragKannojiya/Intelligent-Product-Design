# GradPath AI – Career to Loan Intelligence Platform

## Overview

A large-scale, enterprise-grade "Outcome-based Education Financing Platform" built for ambitious students and NBFCs (lenders). The platform uses 4 AI engine layers to predict career outcomes, placement risk, ROI, and loan eligibility.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Frontend**: React + Vite + Tailwind CSS v4 + shadcn/ui
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Routing**: Wouter
- **Forms**: react-hook-form + Zod
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Architecture

### 4 AI Engine Layers

1. **AI Career Navigator** (`/career`) — Country, course, and university recommendations
2. **ROI / Outcome Intelligence Engine** (`/roi`) — Placement score, salary prediction, timeline
3. **Placement Risk Engine** — Low/Medium/High classification with explainability
4. **Loan Readiness Engine** (`/loan`) — EMI scenarios, eligibility, readiness score

### Pages

- `/` — Landing page with hero, 4 AI layers overview
- `/onboarding` — Multi-step student profile form (3 steps)
- `/dashboard` — Intelligence Hub with real data from DB
- `/career` — AI Career Navigator
- `/roi` — ROI & Outcome Intelligence
- `/loan` — Loan Readiness Engine
- `/profiles` — Student profiles directory

### AI Engine (`artifacts/api-server/src/lib/ai-engine.ts`)

Contains the deterministic AI logic:
- `computePlacementScore()` — Weighted formula (CGPA 25%, Internship 20%, Tier 20%, Field Demand 20%, Skills 10%, Market 5%)
- `getCareerRecommendations()` — Country/course/university recommendations
- `getRoiPrediction()` — Full ROI analysis
- `getLoanEligibility()` — EMI scenarios and readiness scoring

### DB Tables

- `students` — Student profiles
- `assessments` — Completed assessments with scores

## Design

- Dark mode first (deep navy `#0a0f1e` style)
- Electric teal/cyan primary accent
- Glassmorphism cards
- Recharts data visualizations

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
