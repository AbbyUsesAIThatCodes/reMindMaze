# reMindMaze

**A castle of questions. A world to discover.**

reMindMaze brings the exploratory quiz-adventure loop of Encarta MindMaze to a modern browser, using original castle art, characters, dialogue, and Wikipedia-based questions.

**Version 0.1.0 — Lanternlight** is a complete first playable journey: start, explore, answer, research, save, climb, and reach the ending. It is an independent tribute, not a byte-for-byte reconstruction of Encarta 98.


## Play locally

**Easiest:** download `dist/reMindMaze.html` and double-click it. This portable edition contains the complete game in one file; no installation or local server is needed. Wikipedia reading requires internet, but the castle and question pack work offline.

The options below run the modular source edition.

The game has **no runtime package dependencies**, account requirement, API key, or build step.

### Windows

1. Download or clone this repository. If downloaded as a ZIP, extract it first.
2. Install **Node.js 20+** or **Python 3** if neither is already installed.
3. Double-click **`start-game.bat`**. Keep the terminal window open while playing.
4. Open **http://localhost:4173**. If the browser opened before the server was ready, refresh once.

### Linux / macOS

Run `./start-game.sh`, then open **http://localhost:4173**. Stop the server with Ctrl+C.

Or, with Node:

```sh
npm start
```

Opening the source `index.html` directly with a `file://` URL does not work reliably because browsers restrict JavaScript modules. Use one of the local server options above.

## Publish on GitHub Pages

This repository includes a Pages deployment workflow. After the implementation is merged into `main`:

1. Open **Settings → Pages** in GitHub.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open **Actions → Publish GitHub Pages → Run workflow** on `main`.
4. Open the deployment URL shown by the successful workflow.

For the repository name and account used here, the expected URL is **https://abbyusesaithatcodes.github.io/reMindMaze/**. It is not live merely because this code or README exists. GitHub must complete the deployment. Later pushes to `main` run the workflow automatically.

All asset URLs are relative, so the game works at a repository subpath. The deployment packages only the files needed to play.

## Inside the castle

- Seeded **10 × 10 room mazes**, with alternate paths and a reachable staircase on every floor.
- Clickable first-person chambers, original procedural illustrations, nine inhabitants, and 27 dialogue lines.
- Question-locked doors; unlocked doors stay open in both directions.
- **108 curated questions from 27 Wikipedia articles**, with four editorial difficulty tiers and nine selectable subjects.
- Two attempts per challenge, explanations after resolution, and a new challenge after a second miss.
- **Classic 20,000-point quest**, or a shorter 5,000-point journey. Reach the goal, then take the stairs to finish.
- Five torches per campaign. Each reveals a valid route for 12 seconds.
- Classic speed scoring or a relaxed study mode.
- In-game Wikipedia reading and search, with direct source, contributor-history, and license links.
- A discovery journal, browser autosave, and JSON export/import.
- Optional original synthesized music and chimes. Muted by default.
- Keyboard controls, reduced-motion support, and responsive desktop/mobile layouts.

### Subjects

History · Geography · Natural world · Science · Arts & music · Literature · Sports & games · Inventions · Language

Difficulty includes questions **up to** the selected tier. Questions are shuffled without replacement within the selected pool, then the pool resets. A single subject at the lowest tier contains only three questions; broader selections give more variety.

### Controls

| Action | Control |
| --- | --- |
| Choose a doorway | Click, arrow keys, or WASD |
| Choose an answer | Click or 1–4 |
| Reveal route | T or Light a torch |
| Open journal | J |
| Open library | L |
| Close a panel / leave a question | Escape |
| Talk / read the framed atlas | Click the character, portrait, or atlas |

The room view always faces north. East/west doors are at the sides; south is behind you. The map's stair marker is visible even in unexplored rooms.

### Points and research

Question tiers award 150, 250, 400, or 600 base points. Classic mode adds up to 200 speed points, decreasing by four per active second over 50 seconds. The question remains answerable after the bonus expires. A first wrong attempt reduces the possible award by 50; accumulated points are never deducted.

Opening the source while answering waives the speed bonus. Base points still count. Study mode never uses a speed bonus. Background tabs and reading panels pause the active question clock.

### Saves and offline use

The current journey is stored in this browser on this device, including an unfinished question. Browser data deletion, a different browser, a different port, or a different host does not carry the save over. Export a backup in the journal to transfer progress. Import validates the save before replacing the current journey.

The core game requires no network requests. On HTTPS or localhost, the service worker caches the game after a successful first visit; once installed and controlling the page, it can reload offline. Wikipedia search and live article extracts require internet access. When they cannot be reached, the reader shows local factual notes for starter-pack articles and keeps full-article links available. API failure never blocks movement or questions.

## Wikipedia, accuracy, and attribution

Questions are **curated and bundled**, not generated live from arbitrary articles. Every entry has a source article, source URL, explanation, difficulty, and review date. The reading panel fetches an introductory extract from the MediaWiki Action API and can search the wider English Wikipedia. It does not embed remote HTML or load external scripts.

The initial pack covers stable general knowledge. Wikipedia can change, and editorial question difficulty is approximate. Use source articles and their references when reviewing or extending the pack. See [CREDITS.md](CREDITS.md) and [docs/CONTENT.md](docs/CONTENT.md).

## Development

```sh
npm test
npm run build:portable
npm start
```

Unit tests use Node’s built-in test runner. Browser checks are described in [docs/TESTING.md](docs/TESTING.md).

| File | Responsibility |
| --- | --- |
| `src/engine.js` | Maze generation, navigation, scoring, questions, save validation |
| `src/questions.js` | Source-linked question pack and subject metadata |
| `src/renderer.js` | Original Canvas room art, portraits, map |
| `src/inhabitants.js` | Inhabitants, rooms, dialogue |
| `src/app.js` | Interface, save/resume, keyboard controls, journal |
| `src/wiki.js` | Wikipedia API, timeout, cache, search |
| `src/audio.js` | Optional synthesized sound |
| `scripts/serve.mjs` | Local-only dependency-free development server |

## Fidelity and next steps

This version recreates the recognizable loop: room exploration, timed multiple-choice questions, backtracking, a floor map, five route hints, characters, encyclopedia detours, and a score-gated castle ending. Historical references and deliberate differences are recorded in [docs/DESIGN.md](docs/DESIGN.md).

Future work: larger question packs, broader historical/geographical coverage, richer character encounters, more room dressing, optional narrated dialogue, and comparison against user-provided Encarta 98 screenshots. No original Encarta installation is required.

## License

Code, procedural artwork, and original dialogue: [MIT](LICENSE).

Question pack and adapted factual explanations: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), with attribution to the linked Wikipedia contributors. Live Wikipedia text retains its own attribution and license. No Microsoft artwork, question database, music, executable, or branding assets are included.
