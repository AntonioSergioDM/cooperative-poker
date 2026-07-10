# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev            # Next dev server on port 80 via env-cmd -f .env.dev (port 80 usually needs elevated privileges)
npm run build          # next build (output: 'standalone')
npm start              # next start (production)
npm test               # jest (ts-jest, node env) — only src/shared/__tests__ currently
npm run errors:types   # tsc --noEmit type check
npm run errors:lint    # eslint src (airbnb-typescript) with --fix
npm run errors         # types + lint
```

Run a single test: `npx jest src/shared/__tests__/poker.test.ts -t "Royal Flush"`.

`npm run dev` loads env from `.env.dev`; copy `.env.example` to `.env` for Docker (`docker compose up -d --build`). Required env vars (validated at startup in `next.config.js` and read in `src/globals.ts`): `NODE_ENV`, `NEXT_PUBLIC_URL`. `ADMIN_USERNAME`/`ADMIN_PASSWORD` are optional and enable the Socket.IO admin UI at `/admin`.

## Architecture

Next.js **Pages Router** app where **all game logic is server-authoritative** and runs over **Socket.IO**, not HTTP. The client sends intent events and renders state pushed back from the server; it never computes results.

### Socket bootstrapping (important gotcha)
The Socket.IO server is lazily attached to Next's HTTP server the first time `GET /api/socket` is hit. `src/pages/api/socket.ts` re-exports `src/server/socket.ts`, whose default handler creates the `io` singleton (guarded so it only initializes once) and wires every `socket.on(...)` handler. Client code (`src/client/tools/useSocket.ts`) connects to `SiteRoute.Socket` (`/api/socket`). If sockets aren't working, the API route hasn't been pinged yet. Socket recovery is enabled (`connectionStateRecovery`, 2 min) and handlers are only re-bound on non-recovered connections.

### Server layer (`src/server/`)
- `lobbies.ts` — thin socket event handlers (`joinLobby`, `createLobby`, `stealChip`, `playerReady`, `message`, etc.). Each is a `(socket) => (args, callback) => ...` factory that validates `socket.data.{lobbyHash, playerId}`, looks up the `Lobby`, and delegates. Keep business logic out of here.
- `classes/Lobby.ts` — one per game room. Holds `players` (active) vs `viewers` (joined mid-game, promoted to players on reset), owns a `Game`, and is the only thing that emits to clients (`emitGameChange`, `emitLobbyUpdate`, `emitMessage`). `Lobby.lobbies` is a static in-memory `Map` — **state is not persisted; a server restart drops all games.** Lobby hashes are numeric in dev, random word-triples in prod.
- `classes/Game.ts` — the actual cooperative-poker engine (see rules below). Pure state + mutation methods; never touches sockets.
- `classes/Player.ts` — wraps the socket + name/ready/id.

### Shared layer (`src/shared/`)
Imported by both client and server via `@/shared/*` path aliases (see `tsconfig.json` — also `@/client/*`, `@/server/*`, `@/globals`). Contains the domain model and the contract between them: `SocketTypes.ts` (typed `ClientToServerEvents`/`ServerToClientEvents` — the source of truth for every socket message), `GameTypes.ts`, `Card.ts`, `Chip.ts`, `poker.ts`, `Message.ts`, `Routes.ts`.

### Client layer (`src/client/`)
`containers/` are page-level screens (Home, CreateLobby, JoinLobby, Game, Error404) mapped from `src/pages/`. `components/` includes the Framer Motion table/animation stack (`FramerGame/`, `AnimatedCard/`, `Players/`). `tools/` holds hooks (`useSocket`, `useSound`, `useTheme`, `useInput`). Styling is a deliberate hybrid — Tailwind for layout, MUI for components, CSS Modules for complex animations; see `STYLING_GUIDE.md` before adding UI.

## Game domain model

"Cooperative Poker": players collectively try to rank their hands correctly. Each player has a hidden 2-card hand (`Game.decks[i]`) plus shared community cards (`table`: flop/turn/river). Betting rounds are represented by **chip colors** progressing `white → yellow → orange → red`, each round having `numPlayers` numbered chips. On `stealChip`, players grab/swap chips to express their guessed ranking order. When all `tableChips` are claimed (`canGo2NextPhase`), a 3s timeout advances `nextPhase()` and reveals the next community card(s). At the end (`Game.end()`), the server compares the order implied by each player's highest chip against the real poker-hand ordering (`compareRank` in `poker.ts`); the round is a **win** only if they match. `gameScore` is `[losses, wins]`.

Key subtleties:
- **`GameOption` enum ordering is load-bearing.** `randomChallenge` must stay the last challenge and `randomAdvantage` the last advantage; `Game.start()`/`removeRandomOptions()` and `getOptionDescription()` (a positional array) rely on the exact indices. Add new challenges before `randomChallenge` and new advantages before `randomAdvantage`, and add a matching description string at the same position.
- Options include hand-switching effects (`HAND_SWITCH_OPTIONS`), chip reversal, phase skipping, and info advantages (`howManyFigures`, `handValue`) that conditionally enrich `getState()`.
- **Card value encoding is quirky:** `getFullDeck()` stores values 1–13, but `cardName`/`cardShortName` in `Card.ts` treat `13` (and `0`) as Ace, `12` King, `11` Queen, `10` Jack, else `value + 1`. The Ace-as-low-in-straight logic in `poker.ts` also special-cases value `0`/`13`. Be careful with off-by-one when touching card math.
- `poker.ts` `getRank()` returns a `CalculatedRank` (`[PokerRank, ...tiebreakers]`); `compareRank(a, b)` returns negative when **a wins**.
