# Build Identity

## Preserved Legacy Release

Version 0.1.0 and codename Lanternlight are established in the existing README and game. The October 9 Pages promotion reuses `dist/reMindMaze.html` byte for byte as `site/index.html`. See [Pages Release](../deployment/RELEASE.md) and the SHA-256 inventory for source provenance. Reuse consumes no new build ordinal.

## Surface Inventory

- Visible version: existing portable game; preserved.
- Public artifact: `site/index.html`; exact existing HTML, verified by hash.
- Publication console and workflow: `deployment/verify.mjs` prints the preserved version label and validates the original source SHA plus payload hashes.
- Current report: `deployment/RELEASE.md` and `deployment/LOCAL_VALIDATION.json`.
- Original build UTC, PR/local ordinal, embedded full source manifest: absent from the legacy artifact and not fabricated.
- New artifact-producing builds: full manifest/allocator/visible identity retrofit pending before the next gameplay build. Existing `scripts/build-portable.mjs` is legacy and was not invoked for this publication.
