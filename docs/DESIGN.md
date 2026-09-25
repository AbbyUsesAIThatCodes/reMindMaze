# Lanternlight design notes

The aim is to recover MindMaze’s castle-and-encyclopedia experience: a world behind the page, a resident behind a question, and the permission to wander into an article just because it is interesting.

## Preserved mechanics

- Fixed first-person rooms connected by a 10×10 floor plan.
- Questions unlock passages. Cleared passages can be retraced freely.
- Multiple-choice questions; higher tiers can yield more points.
- A time-dependent reward, not a hard failure countdown.
- Subject selection, four difficulty tiers, and five limited map hints.
- Characters, readable objects, and encyclopedia detours.
- A 20,000-point target; the ending happens on taking the stairs.

## Deliberate differences and limits

- Original artwork, original inhabitants and story, and Wikipedia references replace Encarta’s assets and database.
- This is a lightweight browser game with Canvas scenes, not a freely moving 3D world or a reproduction of the Windows 98 shell.
- Scoring values, 12-second hint duration, maze algorithm, subject taxonomy, and room layout are our own implementation choices. They have not been measured against the user's Encarta 98 installation.
- The view always faces north, making map navigation explicit. South is an on-screen doorway label and a navigation button.
- The starter pack contains 108 questions over 27 topics, not an encyclopedia-sized live question generator. The same selected pool repeats after exhaustion.
- Reading removes only the speed bonus. Study mode and a shorter 5,000-point journey are optional additions.
- The original’s post-floor word-game interludes, original voice performances, and exact character behavior are not recreated.

## Expansion order

1. Broaden the curated question bank and add source revision records during content review.
2. Add more room variants and object-specific reading discoveries.
3. Add richer inhabitant encounters and optional accessible narration.
4. Compare visual details and behavior with Encarta 98 screenshots supplied by the owner.
5. Add a pack-authoring interface with validation and review; avoid turning arbitrary prose into unreviewed quiz answers.

## Encarta reference workflow

The user’s Downloads folder is on their own computer and was not accessible from the development workspace. The downloaded Encarta installation was not inspected or uploaded. Small screenshots of the title screen, room view, question screen, map, and settings would be enough to refine fidelity later. The game does not need the disc image to run.
