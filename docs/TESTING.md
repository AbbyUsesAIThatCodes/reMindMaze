# Validation

## Local logic checks

Run `npm test` with Node.js 20 or newer. The suite checks:

- 108 valid source-linked questions, unique IDs and choices, and tier/subject coverage.
- 100 seeded mazes: all rooms reachable, every passage reciprocal and adjacent, reachable stairs, reproducibility.
- Locked doors, correct answers, free backtracking, and prevention of duplicate awards.
- Wrong attempts, repeated-click protection, explanations, and non-negative scoring.
- Speed bonuses, research pace, and study mode.
- Five-torch limit and valid route construction.
- Floor progression, score-gated ending, and a complete simulated campaign.
- Subject/tier filtering, exhaustion before repeats, and no immediate repeat at pool reset.
- Save round trips and rejection of malformed imports.

## Browser checks

The `Test game logic` workflow also runs Chromium interaction checks using Playwright. Screenshots and an exported test journey are uploaded as the `browser-checks` artifact, including on failure.

To run locally, install the development-only browser tooling:

```sh
npm install --no-save --package-lock=false playwright@1.51.1
npx playwright install chromium
npm run build:portable
npm run test:browser
```

Do not have another server listening on port 4173 when starting this test. The test launches and stops its own localhost server.

The browser suite covers setup, desktop rendering, pending-question reload, scoring and backtracking, failed challenges, torches, journal export, mobile overflow, ending presentation, and the portable file. Wikipedia success and failure are tested with deterministic HTTP fixtures; they do not prove that Wikipedia is reachable on any particular user network.

## Current local environment limitation

The authoring workspace could run the Node suite but could not install a local Chromium binary. The available cloud browser rejected localhost and local file URLs. Browser execution therefore belongs to the repository workflow; check its actual status before treating the browser suite as passed. No visual or live Wikipedia success is implied by the logic tests.
