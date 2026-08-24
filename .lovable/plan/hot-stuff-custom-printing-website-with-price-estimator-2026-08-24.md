# Hot Stuff Custom Printing — website with price estimator

Build the site your Claude conversation specced out, on this React/TanStack stack. Everything below comes from decisions you already made in that chat; the code from it is reference only.

## The site

Single page, mobile-first, "Industrial" style (charcoal + red #C6282C, condensed uppercase headings, square corners) — the direction you picked. Logo sits in a dark bar so its near-white "CUSTOM PRINTING" line stays visible.

Sections in order:

1. **Hero** — Hot Stuff Custom Printing, Ottawa, DTF custom apparel, 6 business day turnaround, button to the estimator.
2. **Client strip** — MYO Camp, The Floor Company, The Vault Barbershop, Nepean Bulldogs, Certy Jerky.
3. **Past work gallery** — your uploaded photos, minus the hi-vis floor company shot and the second crew member shirt. Captions name the client. The Certy Jerky piece is labelled "design mockup".
4. **Price estimator** — the centrepiece (below).
5. **How it works** — 4 steps: send artwork → approve quote → we source and press → pick up in Ottawa. Includes file requirements (300 DPI PNG, transparent background, real dimensions).
6. **FAQ** — turnaround, artwork requirements, wash and care, deposit on larger orders, no refunds on printed custom work, no licensed/copyrighted logos, yes to bags/capes/workwear by conversation.
7. **Contact** — Instagram @hotstuffprints, WhatsApp/text 613 252 6457, email hotstuffprints@gmail.com. City only, no home address. Your personal name stays off the site.

## The estimator

One question per screen on mobile, all visible on desktop, with a live price range at the bottom that updates as they change options. Minimum 5 pieces; below that a line pointing them to message you directly, and a note that print-only on your own garments starts around $25.

Steps:

1. **What are we printing on?** Budget tee (thinner, softer, cheapest) / Standard tee (thicker, more durable) / Long sleeve / Hoodie / I have my own garments / Something else (bags, hats, barber capes, workwear).
2. **How many?** Number input plus quick buttons 5, 10, 25, 50, 100, with per-piece price visibly dropping as it climbs.
3. **Where does the print go?** Full front / Full back / Small left chest / Sleeve / Personalised names or numbers — with simple garment diagrams. Personalised asks how many pieces get a name.
4. **Design ready?** Print-ready file / rough idea, needs cleanup / need one made. Widens the range; no hourly rate ever shown.
5. **Result** — spec breakdown with your margin already inside each line (e.g. "42 × Long sleeve tee … $520"), never your costs, hours, or multiplier. Total shown as a range with per-piece and total, plus "6 business days from artwork approval" and "final price confirmed once we see the artwork".
6. **Send it** — name, email, preferred contact, notes. Button reads "Get this quote confirmed".

Picking "Something else" hides the calculator and opens a short open-ended inquiry form with no number attached.

## Lead capture

Every submitted estimate is saved to a database (Lovable Cloud) with the full spec, and an email alert goes to hotstuffprints@gmail.com so you can follow up. No Google Sheets, no Formspree, no customer autoresponder. A WhatsApp fallback link stays visible in case someone would rather message.

## Pricing engine (technical)

All numbers live in one editable file so you can update them yourself when blanks prices move.

Per order: `(landed blanks + print cost + labour) × markup`

- **Blanks** (landed, +5-6% cushion for 2XL and colour variance): ATC1000 $2.99, Gildan 5000 $3.48, Gildan 2400 long sleeve $9.75, Gildan 18500 hoodie $13.49. Customer-supplied garments = $0.
- **Shipping**: $30 added when the blanks subtotal is under $299, $0 above it. 13% HST on blanks.
- **Prints** (gang sheet at $7.50 per 12 in of 22.5 in width, +8% for gutters): full front or back $2.00, custom name $0.68, left chest $0.20, sleeve $0.40.
- **Labour** at $23.50/hr: setup minutes = 25 + 9 × √qty; plus 2 min per repeat placement, 6 min per personalised placement, 1 min per garment handling.
- **Markup** slides continuously from 1.50 at small quantities to ~1.32 at 100+ (no tier cliffs).
- **Output range** = markup low to markup +12%, widened further when design help is needed.

Validation targets from your real jobs: MYO 1 (42 mixed, 42 fronts + 29 names) ≈ $950; MYO 2 (55 ATC1000, fronts) ≈ $600-626; 25 hoodies front+back ≈ $847; 1 tee is out of scope under the 5-piece minimum.

Head metadata, alt text on every gallery image, and semantic structure included for search.

## What I need from you

- The logo and the gallery photos (upload them and I'll wire them in).
- A wide, high-res shot of a finished batch if you have one, for the hero.

## Not in this build

Domain purchase (hotstuffprints.ca — buy it at a registrar), size selection in the estimator (a note says 2XL and up slightly higher), tax display, and delivery/shipping to the customer.
