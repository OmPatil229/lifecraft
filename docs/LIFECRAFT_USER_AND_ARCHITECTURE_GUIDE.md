# ⚔️ LIFECRAFT • Complete User & Architecture Guide

Welcome to the comprehensive guide for **LIFECRAFT**, the full-stack gamified productivity operating system. This guide covers how the platform functions, its game mechanics, step-by-step user workflows, and technical system architecture.

---

## 1. Core Concept & The Master Loop

LIFECRAFT transforms real-world productivity, professional deliverables, and daily wellness habits into an immersive RPG adventure. It is universally designed for **all professionals**—founders, executives, doctors, engineers, creatives, consultants, and knowledge workers.

### The Master Productivity Loop

```
  ┌─────────────────────────────────────────────────────────────┐
  │ 1. DEFINE QUESTS                                            │
  │    Input your real-life tasks, deliverables, and habits     │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 2. EXECUTE IN REAL LIFE                                     │
  │    Do your deep work, workouts, reading, or client tasks    │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 3. COMPLETE QUEST                                           │
  │    • Gain Base XP & Gold                                    │
  │    • Multiply XP via Active Streak Multiplier (up to 2.0×)  │
  │    • Gain +1 Attribute Point (Intelligence, Strength, etc.) │
  │    • Deal automatic damage to any active Category Boss      │
  └──────────────────────────────┬──────────────────────────────┘
                                 │
                                 ▼
  ┌─────────────────────────────────────────────────────────────┐
  │ 4. LEVEL UP & CONQUER                                       │
  │    Level up character, defeat long-term bosses, build       │
  │    your Momentum Matrix on the 52-week heatmap              │
  └─────────────────────────────────────────────────────────────┘
```

---

## 2. Step-by-Step User Guide

### 2.1 Identity & Authentication
1. **Signup / Login**: Create your identity using email, password, and hero display name.
2. **Session Security**: Authentication uses cryptographically signed JWT tokens stored in **HTTP-only, secure cookies** (`sameSite: 'lax'`), safeguarding credentials against XSS attacks.
3. **Automatic Character Initialization**: Upon registration, an adventurer character document is automatically provisioned at **Level 1** with 0 XP, 0 Gold, and clean attribute pools.

---

### 2.2 The Interactive World Map (`/world`)
The World Map serves as your primary visual command center. It features interactive pins mapped directly to core performance disciplines:

| Map Location | Category & Sublabel | Associated Attribute | Real-World Activities |
|---|---|---|---|
| **The Castle** | `YOUR HQ` | **Overall Level** | Central seat of power. Tracks overall character level, cumulative XP, and rank progression. |
| **Spire of Craft** | `WORK & CAREER` | **Intelligence** | Strategic deliverables, business execution, deep work, project milestones, client proposals. |
| **Ancient Forest** | `STUDYING` | **Wisdom** | Professional certifications, research, coursework, academic study. |
| **Grand Archives** | `READING` | **Wisdom** | Industry literature, business books, market research, scientific papers. |
| **Training Grounds** | `FITNESS` | **Strength** | Weightlifting, cardio workouts, marathon training, mobility. |
| **Healing Springs** | `HEALTH` | **Vitality** | Nutrition tracking, 8h sleep hygiene, hydration, preventive health. |
| **Observatory** | `MEDITATION` | **Focus** | Mindfulness meditation, reflection, journaling, strategic planning. |
| **Marketplace** | `PERSONAL` | **Vitality & Gold** | Personal logistics, taxes, home administration, budgeting. |
| **Boss Arena** | `BATTLES` | **Milestones** | Long-term high-stakes objectives with massive completion rewards. |

> **Map Interactions**:
> - **Single Click**: Opens the location's detailed stat panel showing current level progress, attribute points, or gold.
> - **Double Click / "Open" Button**: Navigates directly to the Quest Log filtered specifically for that category.

---

### 2.3 Quest Log & Task Execution (`/quests`)
Quests represent your actionable items. You can view them in **Active** or **Completed** tabs, and filter by category or difficulty.

#### Creating a Quest
Click **"+ New Quest"** to configure:
- **Title**: Action-oriented task name (e.g., *"Finalize Q3 Budget Proposal"*).
- **Description**: Supporting details, links, or success criteria.
- **Category**: Work, Studying, Fitness, Reading, Meditation, Health, or Personal.
- **Difficulty**: Determines the reward payout:
  - **Easy**: `+50 XP`, `+20 Gold` (Quick errands, 15m inbox clearing)
  - **Medium**: `+100 XP`, `+40 Gold` (Standard focused tasks, 45m workout)
  - **Hard**: `+200 XP`, `+80 Gold` (Complex deliverable, deep work block)
  - **Epic**: `+500 XP`, `+200 Gold` (Major project completion, marathon run)
- **Due Date**: Optional deadline.

#### Completing a Quest
When you click **"Complete"**:
1. The completion request is atomically committed to prevent double-claiming.
2. Base XP is scaled by your **Streak Multiplier**.
3. Your character earns **+1 permanent Attribute Point** matching the quest category.
4. If an active **Boss** matches the quest category, damage is automatically dealt to the boss.
5. If the new XP crosses the next level threshold, a Level-Up celebration is triggered.

---

### 2.4 Boss Battles & Strategic Milestones (`/bosses`)
A **Boss** represents a **long-term macro objective** that cannot be accomplished in a single sitting (e.g., *"Pass the CFA Exam"*, *"Ship Product v1.0"*, *"Run a Half Marathon"*).

1. **Boss HP Pool**: You configure the boss's total Health Points (e.g., 100 HP).
2. **Category Alignment**: Set the boss to match the discipline required (e.g., Category: `Work`).
3. **Passive Damage Mechanics**: Whenever you complete a quest matching that boss's category, damage is automatically inflicted based on quest difficulty:
   - **Easy Quest**: `5 Damage`
   - **Medium Quest**: `15 Damage`
   - **Hard Quest**: `30 Damage`
   - **Epic Quest**: `60 Damage`
4. **Victory Rewards**: When the boss's HP reaches `0`, the boss is marked `defeated`, awarding massive completion rewards (typically `+500 XP` and `+200 Gold`).

---

### 2.5 Streak Engine & Consistency Matrix
Daily consistency is rewarded via an exponential compounding streak engine.

#### Streak Rules
- **Activity Today**: If you complete one or more quests on the current day, your streak remains active.
- **Consecutive Day**: Completing a quest the following day increments your streak count by `+1`.
- **Missed Day**: Inactivity for more than 24 hours resets the streak to `1`.

#### XP Multiplier Tiers
| Streak Duration | XP Multiplier | Benefit |
|---|---|---|
| **0 – 2 Days** | **1.00×** | Standard base rewards |
| **3 – 6 Days** | **1.25×** | +25% bonus XP on every completed quest |
| **7 – 29 Days** | **1.50×** | +50% bonus XP on every completed quest |
| **30+ Days** | **2.00×** | **Double XP (100% bonus)** on every completed quest |

#### The Consistency Matrix Modal
Clicking the **"Streak" button** in the top navigation bar opens the **Consistency Matrix**:
- Displays a **52-week activity heatmap** graphing daily quest completion density.
- Visualizes productivity momentum across the entire year.

---

## 3. Mathematical Progression Engine

All mathematical logic is deterministic and encapsulated in [`apps/api/src/utils/engine.ts`](file:///c:/Users/OM/.gemini/antigravity-ide/scratch/LIFECRAFT/apps/api/src/utils/engine.ts):

### 3.1 XP Requirement Curve
The XP needed to reach the next level scales exponentially to maintain long-term engagement:
$$\text{XP}_{\text{required}}(L) = \lfloor 100 \times L^{1.5} \rfloor$$

| Level | XP to Next Level | Cumulative Total XP |
|---|---|---|
| **Level 1** | 100 XP | 0 XP |
| **Level 2** | 282 XP | 100 XP |
| **Level 3** | 519 XP | 382 XP |
| **Level 5** | 1,118 XP | 1,798 XP |
| **Level 10** | 3,162 XP | 11,460 XP |

### 3.2 Multi-Level Processing
If a large reward (such as completing an Epic quest while having a 2.0× streak multiplier or defeating a boss) awards more XP than required for a single level, `processLevelUps` calculates multiple level-ups iteratively, granting all earned levels immediately.

---

## 4. Technical Architecture & Monorepo Overview

```
LIFECRAFT (npm workspaces)
│
├── apps/api (Port 3001)
│   ├── src/index.ts            # Server entry, dynamic CORS, MongoDB connection
│   ├── src/controllers/        # auth.ts, character.ts, quests.ts, bosses.ts
│   ├── src/models/             # User, Character, Quest, Boss, QuestCompletion
│   ├── src/middleware/         # auth.ts (JWT verification & req.userId decoration)
│   └── src/utils/engine.ts     # Deterministic game math and progression algorithms
│
└── apps/web (Port 5173)
    ├── src/App.tsx             # Persistent HUD navigation, modal managers, router
    ├── src/contexts/           # AuthContext, CharacterContext (real-time state sync)
    ├── src/pages/              # WorldPage, QuestsPage, BossesPage, QuestDetailPage
    └── src/components/         # QuestCard, StreakHeatmap, ProtectedRoute
```

### 4.1 Monorepo Commands
From the project root:
```bash
# Start both Backend API and Frontend Vite simultaneously
npm run dev

# Full workspace production build (compiles backend with tsc, frontend with vite)
npm run build

# Strict TypeScript typechecking across all workspaces
npm run typecheck
```

---

## 5. Frequently Asked Questions

**Q: Can I use LIFECRAFT for non-coding professions?**  
A: Yes. All terminology and categories have been generalized. The primary career pillar is **Work**, supporting corporate, entrepreneurial, medical, legal, and creative activities.

**Q: Where is my data stored?**  
A: By default, LIFECRAFT connects to local MongoDB (`127.0.0.1:27017/lifecraft`) or a MongoDB Atlas cluster defined in `MONGODB_URI`. If MongoDB is not running locally, it falls back to an in-memory MongoDB database.

**Q: What happens if I miss a day?**  
A: Your streak resets to 1, but you retain all earned Level progression, Gold, attribute points, and completed quest history.
