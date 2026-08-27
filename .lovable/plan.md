# Video tile + mobile/laptop polish

## 1. Swap the Carhartt duffel photo for your video

The first gallery tile (The Floor Company duffel bag) becomes a looping video tile.

- You upload the video file in chat; it gets hosted on the CDN like the photos, so the repo stays light.
- Plays automatically, muted, on loop, no controls — reads like a moving photo in the grid.
- Same square frame, same caption bar ("The Floor Company / Carhartt duffel, logo print") so the grid stays even.
- Respects phone data and battery: `playsinline` so iPhones don't force fullscreen, `preload="metadata"`, and a still poster frame shown until the video is ready.
- If a browser blocks autoplay, the poster frame stays visible — the tile never looks broken.

## 2. Mobile + laptop pass

Review every section at phone width and at laptop width, and fix what breaks:

- **Header**: keep the wordmark and the "Get a price" button on one line on small screens; nav links stay hidden on phone as they are now.
- **Hero**: headline sizing so it doesn't overflow on a 375px screen; buttons stack full-width on phone.
- **Gallery**: one column on phone, two on tablet, three on laptop (already close — verify the video tile behaves the same).
- **Estimator**: this is the piece with the most controls. Check the option cards, quantity input, placement pickers and the live price panel at phone width; the price summary should sit under the form on phone and beside it on laptop, and stay readable without horizontal scrolling.
- **FAQ / How it works / Footer**: tap targets at least 44px, no cramped text, contact links easy to hit with a thumb.

No content or pricing changes — layout and the one media swap only.

## Technical notes

- Video uploaded via `lovable-assets`, referenced through a `.asset.json` pointer in `src/routes/index.tsx`, same as the current images.
- Gallery items get an optional `type: "video"` field so the grid renders `<video>` or `<img>` per tile without duplicating markup.
- Responsive work is Tailwind breakpoint adjustments in `src/routes/index.tsx` and `src/components/Estimator.tsx`; verified with real 390px and 1440px browser screenshots before I call it done.
