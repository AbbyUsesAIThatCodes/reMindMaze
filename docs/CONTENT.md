# Adding questions

`src/questions.js` currently groups questions by source article. Each source group has four rows, assigned levels 1–4. Each row contains:

1. A question in original wording.
2. Four answer choices separated by `|`, with the correct answer first in the source data. The game shuffles them before display.
3. A short explanatory note.

The group supplies the subject ID and Wikipedia article title. The builder adds a stable question ID, source URL, and review date.

Do not reorder or insert existing groups without preserving their question IDs: saved journeys refer to them. For substantial future packs, move to explicit IDs and migrate the save version when needed. Append new groups for compatible additions to this version.

Use one defensible answer and three plausible, clearly incorrect distractors. Avoid questions about disputed facts, current officeholders, changing records, ambiguous superlatives, or language-dependent conventions unless the wording specifies the necessary context. Read the relevant article section and its references. The introductory extract alone may not support every detail.

Difficulty is editorial and approximate. Keep four tiers per subject, check keyboard-length answer labels, and run the pack validation tests after edits. Update tests intentionally if the total pack size changes.

For new or revised entries, record article URL, exact review date, and preferably a permanent Wikipedia revision URL in a future metadata extension. Preserve CC BY-SA attribution in the pack and UI. Live source pages can change independently of the shipped questions.
