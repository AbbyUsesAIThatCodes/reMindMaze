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

## Browser environment

The authoring workspace runs the Node suite. Chromium interaction checks run in GitHub Actions, where their screenshots are retained as artifacts. The first run exercised the full suite and caught a keyboard-focus selector error after retrying a failed challenge; the implementation was corrected before release. Check the latest workflow status for the current commit.

Wikipedia API success and outage behaviors use fixtures in the browser suite. Live Wikipedia availability was not independently verified from the authoring environment.
