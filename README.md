# ⚔️ LIFECRAFT

> **Turn your real life into a legendary story.**
> Complete real-world tasks. Gain XP. Build your world.

LIFECRAFT is a full-stack gamified life-management application that turns your daily habits, goals, and to-dos into an epic RPG adventure. Complete quests to level up your character, build daily streaks for XP multipliers, and challenge yourself with long-term Boss Battles.

---

## 📖 Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Environment Variables](#environment-variables)
5. [Features & How to Use](#features--how-to-use)
   - [Authentication](#authentication)
   - [World Map (Dashboard)](#world-map-dashboard)
   - [Quest Log](#quest-log)
   - [Boss Arena](#boss-arena)
   - [Streak Engine](#streak-engine)
   - [Character & XP System](#character--xp-system)
6. [Game Mechanics Reference](#game-mechanics-reference)
7. [API Reference](#api-reference)
8. [Architecture Overview](#architecture-overview)
9. [Bug Fixes & Known Issues](#bug-fixes--known-issues)

---

## Tech Stack

| Layer      | Technology                                          |
|------------|-----------------------------------------------------|
| Frontend   | React 19, TypeScript, Vite 8, Tailwind CSS v4      |
| Backend    | Node.js, Express 5, TypeScript, tsx (watch mode)   |
| Database   | MongoDB via Mongoose (local or Atlas)               |
| Auth       | JWT stored in HTTP-only cookies                     |
| Monorepo   | npm workspaces (`apps/web`, `apps/api`)             |

---

## Project Structure

```
LIFECRAFT/
├── apps/
│   ├── api/                     # Express REST API
│   │   └── src/
│   │       ├── controllers/     # Route handlers (auth, quests, character, bosses)
│   │       ├── middleware/      # JWT auth middleware
│   │       ├── models/          # Mongoose schemas (User, Character, Quest, Boss, QuestCompletion)
│   │       ├── routes/          # Express routers
│   │       ├── utils/
│   │       │   └── engine.ts    # XP, level, streak & reward calculation engine
│   │       └── index.ts         # App entry point
│   └── web/                     # React frontend
│       └── src/
│           ├── components/      # QuestCard, ProtectedRoute
│           ├── contexts/        # AuthContext, CharacterContext
│           ├── lib/             # apiFetch helper
│           ├── pages/           # WorldPage, QuestsPage, BossesPage, etc.
│           └── App.tsx          # Router, Navigation, layout
├── package.json                 # Monorepo root (concurrently dev script)
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **MongoDB** — either:
  - MongoDB Community Server running locally on `127.0.0.1:27017`, **or**
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster connection string

### Installation

```bash
# Clone/open the project folder
cd LIFECRAFT

# Install all dependencies for all workspaces
npm install
```

### Running in Development

```bash
npm run dev
```

This runs **both** the API server and the Vite frontend simultaneously using `concurrently`:

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173       |
| API      | http://localhost:3001/api  |

---

## Environment Variables

Create a file at `apps/api/.env`:

```env
# ── MongoDB ──────────────────────────────────────────────────
# Option A: Local MongoDB (default)
MONGODB_URI=mongodb://127.0.0.1:27017/lifecraft

# Option B: MongoDB Atlas Cloud (uncomment & replace)
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/lifecraft?retryWrites=true&w=majority

# ── Security ──────────────────────────────────────────────────
# IMPORTANT: Change this to a long random string in production!
JWT_SECRET=super_secret_jwt_key_change_in_production

# ── Server ────────────────────────────────────────────────────
# PORT=3001  (default, no need to set unless you have conflicts)
```

> **Fallback:** If MongoDB is unreachable, the server automatically downloads and starts an in-memory MongoDB instance (via `mongodb-memory-server`) for zero-config development. Note that all data is lost when the server restarts in this mode.

---

## Features & How to Use

### Authentication

LIFECRAFT uses secure, HTTP-only JWT cookie sessions.

#### Create an Account

1. Visit [http://localhost:5173](http://localhost:5173)
2. Click **Start Journey** → fill in your **Hero Name**, email, and password
3. Click **Awaken** — your character is created automatically

#### Log In

1. Click **Log In** → enter email and password
2. Click **Enter Realm**
3. You'll be redirected to the **World Map**

> Sessions are persistent. You remain logged in across browser refreshes.

---

### World Map (Dashboard)

**Route:** `/world`

The World Map is your main dashboard — a full-screen fantasy landscape showing the state of your kingdom.

#### Interactive Map Pins

Click any building pin to open a **detail panel** with:
- Live stat progress bar for that location
- Description of what quests power that building
- A **"Go to"** button to navigate directly

| Pin | Building | Powered By |
|-----|----------|------------|
| 🏰 | **The Castle** | Your overall Level & XP |
| 🔭 | **Observatory** | Focus (Meditation quests) |
| 🌳 | **Ancient Forest** | Wisdom (Studying quests) |
| ⚔️ | **Training Grounds** | Strength (Fitness quests) |
| 📚 | **Grand Library** | Intelligence (Coding quests) |
| 🏪 | **Marketplace** | Gold (all quests) |
| 💀 | **Boss Arena** | Active boss battles |

#### World Map HUD

- **Top bar**: Level, XP bar, Gold, Streak multiplier badge
- **Bottom-left**: Day counter + motivational quote
- **Bottom-right**: Quick links to Quest Log and Boss Arena

---

### Quest Log

**Route:** `/quests`

#### Creating a Quest

1. Click the **New Quest** button (top right)
2. Fill in:
   - **Title**: What you want to accomplish
   - **Description**: Optional details
   - **Category**: Determines which attribute grows (see table below)
   - **Difficulty**: Determines XP/Gold reward
   - **Due Date**: Optional deadline (shows relative countdown)
3. Click **Forge Quest**

#### Category → Attribute Map

| Category | Attribute Grown | Building Powered |
|----------|-----------------|-----------------|
| Coding | Intelligence | Grand Library |
| Studying | Wisdom | Ancient Forest |
| Reading | Wisdom | Ancient Forest |
| Fitness | Strength | Training Grounds |
| Meditation | Focus | Observatory |
| Health | Vitality | (all) |
| Personal | Vitality | (all) |

#### Difficulty → Reward Table

| Difficulty | XP | Gold | Boss Damage |
|------------|----|------|-------------|
| Easy | 50 | 10 | 5 HP |
| Medium | 100 | 25 | 15 HP |
| Hard | 200 | 50 | 30 HP |
| Epic | 500 | 200 | 60 HP |

> With an active streak multiplier, XP earned is scaled up automatically (see Streak Engine).

#### Completing a Quest

1. Click **Mark Complete** on any active quest card
2. A **Quest Complete modal** pops up showing your rewards
3. If you levelled up, a **Level Up modal** appears first
4. The XP bar in the navigation bar updates instantly

#### Filtering Quests

- Use **Category chips** (All, Coding, Fitness, etc.) to filter by type
- Use **Difficulty chips** (All, Easy, Medium, etc.) to filter by difficulty
- Switch between the **Active** and **Completed** tabs

#### Editing / Deleting a Quest

- Click **Details** on any quest card to open the edit page
- Change any field and click **Save Changes**
- Click the **red trash button** to permanently delete the quest

---

### Boss Arena

**Route:** `/bosses`

Boss Battles are long-term challenges represented as monsters with an HP bar. You chip away at them by completing regular quests in the same category.

#### Creating a Boss

1. Click **Summon Boss**
2. Fill in:
   - **Boss Name**: e.g. "Conquer Data Structures"
   - **Description**: Optional
   - **Category**: Must match quests you plan to complete (e.g. "Coding")
   - **HP Pool**: Higher HP = longer challenge (10–10,000)
   - **Defeat Reward XP / Gold**: The bonus awarded when the boss reaches 0 HP
3. Click **Summon Boss**

#### Dealing Damage

Every time you complete a quest, the system checks if you have an **alive boss** in the same category. If yes, the boss takes damage based on the quest's difficulty:

| Difficulty | Damage |
|------------|--------|
| Easy | 5 HP |
| Medium | 15 HP |
| Hard | 30 HP |
| Epic | 60 HP |

#### Boss Defeat

When a boss reaches 0 HP:
- A **Boss Defeated** celebration modal appears
- The boss's full reward (XP + Gold) is instantly added to your character
- The boss moves to the "Defeated" section of the arena

#### Abandoning a Boss

Click the **trash icon** on any boss card and confirm to permanently remove it.

---

### Streak Engine

A **streak** measures consecutive days you complete at least one quest.

| Streak Length | XP Multiplier |
|---------------|---------------|
| 0–2 days | 1.00× (no bonus) |
| 3–6 days | 1.25× |
| 7–29 days | 1.50× |
| 30+ days | 2.00× |

#### How Streaks Work

- Complete **at least one quest today** to keep your streak alive
- Complete a quest **2+ days after your last** → streak resets to 1
- Completing **multiple quests in the same day** does NOT increment the streak further

#### Streak Indicators

- **Nav bar**: 🔥 flame badge appears when streak ≥ 3 days
- **World Map HUD**: Streak day count + multiplier badge
- **Quest Complete modal**: Shows current streak and multiplier
- **WorldPage streak banner**: Animated orange banner when streak ≥ 3

---

### Character & XP System

#### Levelling Up

XP required to advance from Level `N` to Level `N+1`:

```
XP_required(N) = floor(100 × N^1.5)
```

| Level | XP Needed to Advance |
|-------|----------------------|
| 1 | 100 |
| 2 | 283 |
| 3 | 520 |
| 5 | 1,118 |
| 10 | 3,162 |

Level-ups are processed recursively, so completing a high-XP quest can advance you multiple levels at once.

#### Attributes

Each character has 5 attributes that grow permanently as you complete quests:

| Attribute | Grows From |
|-----------|-----------|
| Intelligence | Coding |
| Wisdom | Studying, Reading |
| Strength | Fitness |
| Focus | Meditation |
| Vitality | Health, Personal |

Each completed quest grants **+1 point** to the relevant attribute, permanently.

---

## Game Mechanics Reference

### XP Flow on Quest Completion

```
baseXp = difficulty reward (50 / 100 / 200 / 500)
streakMultiplier = getStreakMultiplier(newStreakDays)
bonusXp = floor(baseXp × (multiplier - 1))
totalXp = baseXp + bonusXp

character.totalXp += totalXp
character.gold    += goldReward
character.attributes[category] += 1
character.streakDays = newStreak
character.lastActivityDate = now

→ processLevelUps()  (may fire multiple times)
→ boss damage check  (if alive boss matches category)
→ QuestCompletion audit record saved
```

### Idempotency

Quest completion uses an **atomic MongoDB `findOneAndUpdate`** with a filter of `{ status: 'active' }`. This guarantees a quest can only ever be completed **once**, even if the user clicks the button multiple times or has a network hiccup.

---

## API Reference

### Authentication

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | `{ displayName, email, password }` | Create account |
| POST | `/api/auth/login` | `{ email, password }` | Log in, sets cookie |
| POST | `/api/auth/logout` | — | Log out, clears cookie |
| GET | `/api/auth/me` | — | Get current user |

### Character

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/character` | Get own character stats |

### Quests

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/quests` | — | Get all quests (newest first) |
| POST | `/api/quests` | `{ title, category, difficulty, description?, dueDate? }` | Create quest |
| GET | `/api/quests/:id` | — | Get quest by ID |
| PATCH | `/api/quests/:id` | Partial quest fields | Update quest |
| DELETE | `/api/quests/:id` | — | Delete quest |
| POST | `/api/quests/:id/complete` | — | Complete quest, award XP/Gold |

**Complete Quest Response:**
```json
{
  "quest": { ... },
  "reward": { "xp": 125, "baseXp": 100, "bonusXp": 25, "multiplier": 1.25, "gold": 25 },
  "streak": { "days": 4, "multiplier": 1.25, "isNew": false },
  "levelUp": false,
  "newLevel": 3,
  "levelsGained": 0,
  "character": { "level": 3, "totalXp": 450, "gold": 120, "attributes": {...}, "streakDays": 4 },
  "bossDamage": { "bossId": "...", "damage": 15, "remainingHp": 45 },
  "bossDefeated": null
}
```

### Bosses

| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| GET | `/api/bosses` | — | Get all bosses |
| POST | `/api/bosses` | `{ title, category, maxHp, reward?, description? }` | Create boss |
| DELETE | `/api/bosses/:id` | — | Abandon/delete boss |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  React Frontend (Vite, port 5173)                   │
│  ┌─────────────────┐  ┌──────────────────────────┐  │
│  │  AuthContext     │  │  CharacterContext         │  │
│  │  - user state   │  │  - level, XP, gold        │  │
│  │  - login/logout │  │  - streak, multiplier     │  │
│  └─────────────────┘  │  - applyReward()          │  │
│                        └──────────────────────────┘  │
│  Pages: WorldPage | QuestsPage | BossesPage          │
└────────────────────────┬────────────────────────────┘
                         │ fetch (credentials: include)
                         │ HTTP-only JWT cookie
┌────────────────────────▼────────────────────────────┐
│  Express API (tsx watch, port 3001)                  │
│  ┌─────────────────────────────────────────────────┐ │
│  │  Middleware: requireAuth (JWT verification)     │ │
│  └─────────────────────────────────────────────────┘ │
│  Routes: /api/auth | /api/quests | /api/bosses       │
│          /api/character                              │
│  ┌─────────────────────────────────────────────────┐ │
│  │  engine.ts: XP formula, streak calc, rewards    │ │
│  └─────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────┘
                         │ mongoose
┌────────────────────────▼────────────────────────────┐
│  MongoDB                                             │
│  Collections: users | characters | quests           │
│               bosses | questcompletions             │
└─────────────────────────────────────────────────────┘
```

---

## Bug Fixes & Known Issues

### Fixed in Current Build

| Bug | Fix |
|-----|-----|
| `streak.isNew` used stale `character.streakDays` after mutation | Snapshot `oldStreakDays` before modifying the character |
| Boss defeat reward applied to character but response returned pre-bonus values | Save character with boss bonus before capturing response snapshot |
| `window.location.pathname` in Nav didn't react to route changes | Replaced with `useLocation()` from react-router-dom |
| `/quests/new` route crashed when quest ID is `"new"` | Added `<Navigate to="/quests">` redirect; creation is now an inline modal |
| `@tailwindcss/vite` not installed in workspace | Installed via `npm install tailwindcss @tailwindcss/vite -w apps/web` |
| `Quest` interface not exported correctly (Vite module error) | Changed to `import { type Quest }` |

### Known Limitations

- **In-memory MongoDB**: If using the fallback in-memory database (no local MongoDB), all data is lost on server restart.
- **No password reset**: Forgot password flow is not yet implemented.
- **No mobile nav**: The navigation links are hidden on small screens; a hamburger menu is planned.
- **Stats Dashboard** (Commit 10): Attribute charts and 30-day XP history graph not yet built.

---

## Roadmap

| Commit | Feature | Status |
|--------|---------|--------|
| 07 | Streak Engine | ✅ Done |
| 08 | Boss Battles | ✅ Done |
| 09 | Polish Pass (modals, animations) | ✅ Done (inline) |
| 10 | Stats Dashboard | 🔜 Planned |
| 11 | Deployment (Vercel + Railway) | 🔜 Planned |

---

*Built with ⚔️ by the LIFECRAFT team.*
