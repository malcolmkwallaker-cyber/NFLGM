# Graphics and sound review

## Scope

Local branch `local/graphics-sound-2026-11-12` adapts the approved visual direction without changing football simulation rules, saves, entitlements, analytics, or advertising.

- Dark stadium/field atmosphere with orange and purple light accents.
- Metallic inset panels, selector cards, glossy primary and secondary controls, and animated reveal surfaces.
- Applied to the Home hero and mode selectors, team selector, Daily choice/result surfaces, and game desk.
- Existing football logo and team abbreviation marks remain the visual identity. No basketball branding, currency, spins, gambling mechanics, or copied art were added.
- Motion is short and decorative. `prefers-reduced-motion` reduces animation and transition durations to effectively zero.

## Sound

Sound is synthesized in the browser with the Web Audio API. There are no downloaded or paid sound assets and no music.

- Short selection, reveal, and success cues.
- Audio context is created/resumed only from a user click; nothing plays on page load.
- Persistent mute toggle in the header.
- Persistent 0–100% volume control in Settings.
- Legacy saves migrate to sound enabled at 45%; disabling or changing volume survives reload.
- Unsupported browsers fail silently and retain full gameplay.

## Reference limitation

The exact Library video was resolved as `ScreenRecording_11-11-2026 20-42-21_1.mp4`, but this executor's supported Library download helper failed at its hosted-app network step. The implementation is therefore grounded in the parent-verified frame observations: dark stadium court, orange and purple selector reels, metal bevels, position slots, sliding stat sheet, reveal button, result panel, and confetti. It is not claimed to be a pixel recreation.

## Local review artifacts

Generated outside the repository so they cannot enter a release accidentally:

- `/workspace/rtr-qa-artifacts/graphics-sound-2026-11-12/home-desktop.png`
- `/workspace/rtr-qa-artifacts/graphics-sound-2026-11-12/home-mobile.png`
- `/workspace/rtr-qa-artifacts/graphics-sound-2026-11-12/team-picker-mobile.png`
- `/workspace/rtr-qa-artifacts/graphics-sound-2026-11-12/desk-mobile.png`
- `/workspace/rtr-qa-artifacts/graphics-sound-2026-11-12/settings-mobile.png`
- `/workspace/rtr-qa-artifacts/graphics-sound-2026-11-12/browser-report.json`

The automated browser check found no console/page errors, no horizontal mobile overflow at 390px, persisted mute state and 70% volume across storage, and a reduced-motion animation duration of `0.00001s`. An injected Web Audio probe confirmed that one deliberate CTA click created one context, resumed it from the user gesture, and scheduled one oscillator; page load alone did not create audio.
