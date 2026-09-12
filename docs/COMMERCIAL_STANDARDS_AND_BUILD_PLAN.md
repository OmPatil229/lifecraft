# LIFECRAFT • Commercial Engineering Standards & Universal Build Plan

## 1. Executive Summary & Commercial Vision

**LIFECRAFT** is an enterprise-grade gamified productivity and performance operating system designed for professionals across all industries—including executives, founders, healthcare workers, consultants, managers, researchers, engineers, lawyers, creatives, and educators.

Rather than binding to a single niche or profession, LIFECRAFT unifies daily operational task execution, habit consistency, deep work sessions, and long-range strategic milestones into an immersive RPG progression framework.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        LIFECRAFT ECOSYSTEM                             │
├──────────────────┬──────────────────┬──────────────────────────────────┤
│ Professional Ops │ Personal Mastery │ Strategic Milestones             │
│ • Deep Work      │ • Health/Vitality│ • Boss Battles (Quarterly Goals) │
│ • Deliverables   │ • Fitness & Gym  │ • Daily Momentum Heatmap         │
│ • Learning/Study │ • Mindset/Focus  │ • Level & Attribute Scaling      │
└──────────────────┴──────────────────┴──────────────────────────────────┘
```

---

## 2. Universal Professional Taxonomy

The core domain model is structured around **universal human and professional performance pillars**, guaranteeing relevance for any career track while preserving backwards compatibility:

| Domain Pillar | Core Attributes | Typical Quests / Objectives | Mapped Attribute |
|---|---|---|---|
| **`Work`** *(Career & Craft)* | Strategy, Deliverables, Leadership, Innovation | Pitch decks, code commits, surgical procedures, legal filings, financial audits, client presentations | **Intelligence** |
| **`Studying`** *(Skill Acquisition)* | Knowledge, Certifications, Research | Executive education, professional licenses, technical certifications, language fluency | **Wisdom** |
| **`Reading`** *(Insights & Literature)* | Domain Knowledge, Strategic Foresight | Industry whitepapers, management books, research journals, market reports | **Wisdom** |
| **`Fitness`** *(Physical Energy)* | Stamina, Resilience, Power | Strength training, cardio workouts, marathon prep, mobility sessions | **Strength** |
| **`Health`** *(Vitality & Wellness)* | Longevity, Recovery, Sleep Hygiene | 8 hours sleep, optimal nutrition, hydration, preventive checkups, ergonomics | **Vitality** |
| **`Meditation`** *(Mindset & Clarity)* | Emotional Resilience, Cognitive Focus | Mindfulness meditation, strategic journaling, breathwork, digital detox | **Focus** |
| **`Personal`** *(Life Operations)* | Logistics, Finance, Administration | Tax prep, wealth management, family commitments, home maintenance | **Vitality / Gold** |
| **`Coding`** *(Legacy Alias)* | Technical Execution | Software engineering (automatically aliased under Work / Intelligence) | **Intelligence** |

---

## 3. Architecture & Monorepo Structure

```
LIFECRAFT/
├── apps/
│   ├── api/                     # Node.js + Express 5 + TypeScript + Mongoose
│   │   ├── src/
│   │   │   ├── controllers/     # Controller handlers (auth, character, quests, bosses)
│   │   │   ├── middleware/      # JWT auth guard, schema validation
│   │   │   ├── models/          # Strongly typed Mongoose models
│   │   │   ├── routes/          # Express route definitions
│   │   │   ├── utils/           # Deterministic game math & progression engine
│   │   │   └── index.ts         # App entry point & MongoDB connection manager
│   │   ├── package.json         # Workspace package config (build, dev, typecheck)
│   │   └── tsconfig.json        # Strict TypeScript compiler options
│   └── web/                     # React 19 + TypeScript + Vite 8 + Tailwind CSS
│       ├── src/
│       │   ├── components/      # UI components (QuestCard, StreakHeatmap, ProtectedRoute)
│       │   ├── contexts/        # AuthContext, CharacterContext
│       │   ├── lib/             # apiFetch typed HTTP client with credentials
│       │   ├── pages/           # WorldPage, QuestsPage, BossesPage, etc.
│       │   └── App.tsx          # App routing, navigation, modals
│       └── package.json         # Workspace package config
├── docs/                        # Architecture, API specs, and coding standards
├── package.json                 # Monorepo root coordinating workspace scripts
└── README.md                    # Quickstart and setup guide
```

---

## 4. Engineering & Coding Standards

All code contributed to LIFECRAFT must strictly adhere to the following standards:

### 4.1 TypeScript & Type Safety
1. **Zero Compiler Warnings / Errors**: Every workspace must compile cleanly under `tsc --noEmit` and `tsc -b`.
2. **Explicit Interfaces**: All entity payloads, API requests, and responses must be strongly typed with TypeScript interfaces or Zod schemas.
3. **Zod Validation Standards**:
   - Always access validation errors via `error.issues` (Zod v3+ standard), never deprecated or nonexistent properties.
   - Schemas must parse and sanitize incoming payload parameters prior to controller logic execution.

### 4.2 Error Handling & HTTP Status Codes
Every API endpoint must return standardized JSON payloads:
```typescript
// Success response
res.status(200).json(data);

// Validation error response
res.status(400).json({
  error: 'Validation failed',
  details: error.issues,
});

// Authentication error response
res.status(401).json({ error: 'Invalid or missing authentication credentials' });

// Resource not found
res.status(404).json({ error: 'Resource not found' });

// Internal failure
res.status(500).json({ error: 'Internal server error' });
```

### 4.3 Security & Production Configuration
- **HTTP-Only Cookies**: JWT tokens must be stored strictly in HTTP-only cookies (`httpOnly: true`, `sameSite: 'lax'`, `secure: process.env.NODE_ENV === 'production'`).
- **Dynamic CORS**: Use `process.env.CLIENT_URL || 'http://localhost:5173'` with `credentials: true` to enable zero-downtime deployment across custom enterprise domains.
- **Password Hashing**: Passwords must be hashed using bcrypt with an adaptive salt round of at least 12.

### 4.4 Deterministic Game Progression Engine
All level, streak, and reward formulas are encapsulated within `apps/api/src/utils/engine.ts`:
- **XP Threshold Formula**:
  $$\text{XP}_{\text{required}}(L) = \lfloor 100 \times L^{1.5} \rfloor$$
- **System Progression Boundaries**:
  - **Level Cap**: Hard cap at **Level 100** (`MAX_LEVEL = 100`) preventing unbounded loops.
  - **Boss Defeat XP**: Bound to $[50, 5000]$ XP (prevents inflation such as entering 5,000,000 XP).
  - **Boss Defeat Gold**: Bound to $[10, 2000]$ Gold.
  - **Boss HP**: Bound to $[10, 2000]$ HP.
  - **Backend Clamping**: Both Zod validation schemas and the quest completion engine enforce these boundaries server-side.
- **Streak Multipliers**:
  - $\ge 30$ days: **2.00×**
  - $\ge 7$ days: **1.50×**
  - $\ge 3$ days: **1.25×**
  - $< 3$ days: **1.00×**
- **Idempotency Guarantee**: Quest completion uses atomic database updates (`status: 'active' -> status: 'completed'`) ensuring rewards are never double-awarded.

---

## 5. Build, Test & CI Verification Commands

```bash
# 1. Full monorepo build (builds both api and web workspaces)
npm run build

# 2. Typecheck across all workspaces
npm run typecheck

# 3. Development server (starts concurrent api and web dev servers)
npm run dev

# 4. Linting
npm run lint
```

---

## 6. Commercialization Roadmap

- [x] **Phase 1: Multi-Professional Generalization** (Universal work taxonomy, customizable categories, cross-functional World Map).
- [x] **Phase 2: Reliability & Build Quality** (Zod error handling standard, monorepo build scripts, CORS configuration).
- [ ] **Phase 3: Team / Enterprise Guilds** (Shared objectives, department boss raids, team streak leaderboards).
- [ ] **Phase 4: Integrations** (Google Calendar sync, Notion / Linear / Jira quest imports, Slack daily summary bot).
- [ ] **Phase 5: Mobile PWA / Native App** (Offline-first sync, push notifications for streak maintenance).
