import { createFileRoute } from "@tanstack/react-router";

import { Estimator } from "@/components/Estimator";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Toaster } from "@/components/ui/sonner";
import { PRICING } from "@/lib/pricing";
import duffelVideo from "@/assets/duffel.mp4.asset.json";
import duffelPoster from "@/assets/duffel-poster.jpg.asset.json";
import teeTfc from "@/assets/Sample2.webp.asset.json";
import capeVault from "@/assets/Sample3.webp.asset.json";
import pressGainables from "@/assets/Sample4.webp.asset.json";
import hoodieBulldogs from "@/assets/Sample5.webp.asset.json";
import teeFloorCo from "@/assets/Sample6.webp.asset.json";

const TITLE = "Hot Stuff Custom Printing | Custom T-Shirt Printing in Ottawa";
const DESCRIPTION =
  "Custom DTF apparel printing in Ottawa. Tees, hoodies, workwear and team gear with personalised names. Get an instant price estimate — 6 business day turnaround.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const CLIENTS = [
  "Construction wear",
  "Barbershops",
  "Sports teams",
  "Summer camps",
  "Fitness brands",
];

const GALLERY: {
  src: string;
  video?: boolean;
  poster?: string;
  client: string;
  caption: string;
  alt: string;
}[] = [
  {
    src: duffelVideo.url,
    video: true,
    poster: duffelPoster.url,
    client: "The Floor Company",
    caption: "Carhartt duffel, logo print",
    alt: "Video of a black Carhartt duffel bag printed with The Floor Company logo",
  },
  {
    src: teeTfc.url,
    client: "The Floor Company",
    caption: "Left chest, two-colour",
    alt: "Close-up of a black t-shirt with a red and white TFC left chest print",
  },
  {
    src: capeVault.url,
    client: "The Vault Barbershop",
    caption: "Barber cape, back crest",
    alt: "Grey barber cape printed with The Vault Barbershop crest logo",
  },
  {
    src: pressGainables.url,
    client: "Gainables",
    caption: "Pressed at 305°F",
    alt: "Heat press set to 305 degrees closing over a black garment with large white lettering",
  },
  {
    src: hoodieBulldogs.url,
    client: "Nepean Bulldogs",
    caption: "Team crest + player name",
    alt: "Black hoodie with a Nepean Bulldogs hockey crest and a personalised player name print",
  },
  {
    src: teeFloorCo.url,
    client: "The Floor Company",
    caption: "Chest logo, printed neck label",
    alt: "Grey t-shirt with The Floor Company chest logo and a custom Hot Stuff printed neck label",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Send your artwork",
    body: "Email or DM us your artwork with your garment, quantity, size and where the print goes.",
  },
  {
    n: "02",
    title: "Approve the quote",
    body: "We confirm the final price and mock up placement so there are no surprises.",
  },
  {
    n: "03",
    title: "We source and press",
    body: "Blanks ordered, gang sheet printed, every piece pressed and checked by hand.",
  },
  {
    n: "04",
    title: "Pick up in Ottawa",
    body: `Ready in ${PRICING.turnaroundBusinessDays} business days from artwork approval.`,
  },
];

const FAQ = [
  {
    q: "How long does an order take?",
    a: `${PRICING.turnaroundBusinessDays} business days from the moment artwork is approved. Rush jobs are sometimes possible — ask.`,
  },
  {
    q: "How do I wash printed garments?",
    a: "Inside out, cold wash, tumble dry low or hang dry. No ironing directly on the print. Treated this way the print outlasts the garment.",
  },
  {
    q: "Do you take a deposit?",
    a: "On larger orders yes — we order your blanks up front, so we take a deposit to cover them and the balance on pick-up.",
  },
  {
    q: "Can I get a refund?",
    a: "Custom printed work can't be resold, so printed orders aren't refundable. If we made a mistake on our end, we reprint it — no argument.",
  },
  {
    q: "Can you print any logo?",
    a: "Not licensed or copyrighted artwork we don't have permission for — no pro team logos, no brand knock-offs. Your own logo, your team, your design: absolutely.",
  },
  {
    q: "Do you print on things other than shirts?",
    a: "Yes — bags, hats, barber capes and workwear are all regular jobs. Those get priced by conversation rather than the estimator.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      <header className="sticky top-0 z-40 border-b border-line-dark bg-ink text-ink-foreground">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <a href="#top" className="flex items-baseline gap-2">
            <span className="font-display text-2xl uppercase leading-none tracking-tight">
              Hot<span className="text-primary">Stuff</span>
            </span>
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-steel-foreground sm:inline">
              Custom Printing
            </span>
          </a>
          <nav className="ml-auto hidden items-center gap-6 text-xs uppercase tracking-widest sm:flex">
            <a href="#work" className="hover:text-primary">
              Work
            </a>
            <a href="#how" className="hover:text-primary">
              How it works
            </a>
            <a href="#faq" className="hover:text-primary">
              FAQ
            </a>
            <a href="#contact" className="hover:text-primary">
              Contact
            </a>
          </nav>
          <Button asChild size="sm" className="ml-auto sm:ml-0">
            <a href="#estimator">Get a price</a>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative overflow-hidden bg-ink text-ink-foreground">
        <img
          src={pressGainables.url}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 size-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="eyebrow text-primary">Ottawa, Ontario</p>
          <h1 className="mt-4 max-w-3xl text-5xl leading-[0.95] sm:text-7xl">
            Custom apparel printing,
            <br />
            <span className="text-primary">pressed by hand</span> in Ottawa
          </h1>
          <p className="mt-6 max-w-xl text-base text-steel-foreground sm:text-lg">
            DTF printing on tees, hoodies, workwear, bags and team gear — including personalised
            names and numbers. Minimum {PRICING.minimumQuantity} pieces, ready in{" "}
            {PRICING.turnaroundBusinessDays} business days from artwork approval.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="#estimator">Estimate my order</a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-line-dark bg-transparent">
              <a href="#work">See past work</a>
            </Button>
          </div>
        </div>
      </section>

      {/* CLIENT STRIP */}
      <section aria-label="Clients" className="border-b border-border bg-bone">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-8 gap-y-3 px-4 py-5 sm:px-6">
          <span className="eyebrow text-muted-foreground">Printed for</span>
          {CLIENTS.map((c) => (
            <span key={c} className="font-display text-lg uppercase text-foreground/80">
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow text-primary">Past work</p>
        <h2 className="mt-2 text-4xl sm:text-5xl">Real jobs, real garments</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GALLERY.map((item) => (
            <figure key={item.src} className="group border border-border bg-card">
              <div className="aspect-square overflow-hidden bg-secondary">
                {item.video ? (
                  <video
                    src={item.src}
                    poster={item.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-label={item.alt}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <figcaption className="border-t border-border px-4 py-3">
                <span className="block font-display text-lg uppercase leading-tight">
                  {item.client}
                </span>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  {item.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ESTIMATOR */}
      <section id="estimator" className="bg-bone py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <Estimator />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow text-primary">How it works</p>
        <h2 className="mt-2 text-4xl sm:text-5xl">Four steps, no guesswork</h2>
        <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-card p-6">
              <span className="font-mono text-xs text-primary">{s.n}</span>
              <h3 className="mt-3 text-xl">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 border-l-2 border-primary bg-secondary p-5">
          <h3 className="text-lg">What I need from you</h3>
          <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
            <li>Your artwork — I can print virtually any picture or logo you send</li>
            <li>The size you want it printed</li>
            <li>Where it goes — full front, full back, left chest, sleeve, etc.</li>
            <li>Any add-ons like names, numbers, or special placements</li>
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-bone py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <p className="eyebrow text-primary">FAQ</p>
          <h2 className="mt-2 text-4xl sm:text-5xl">Questions we get asked</h2>
          <Accordion type="single" collapsible className="mt-6 border-t border-border">
            {FAQ.map((item) => (
              <AccordionItem key={item.q} value={item.q}>
                <AccordionTrigger className="text-left font-display text-lg uppercase">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CONTACT */}
      <footer id="contact" className="bg-ink text-ink-foreground">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow text-primary">Contact</p>
          <h2 className="mt-2 text-4xl sm:text-5xl">Let's press something</h2>
          <div className="mt-8 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-lg text-primary">Text or WhatsApp</h3>
              <a className="mt-1 block hover:underline" href="https://wa.me/16132526457">
                613 252 6457
              </a>
            </div>
            <div>
              <h3 className="text-lg text-primary">Email</h3>
              <a className="mt-1 block hover:underline" href="mailto:hotstuffprints@gmail.com">
                hotstuffprints@gmail.com
              </a>
            </div>
            <div>
              <h3 className="text-lg text-primary">Instagram</h3>
              <a
                className="mt-1 block hover:underline"
                href="https://instagram.com/hotstuffprints"
                target="_blank"
                rel="noreferrer"
              >
                @hotstuffprints
              </a>
            </div>
          </div>
          <p className="mt-10 border-t border-line-dark pt-6 font-mono text-[11px] uppercase tracking-wider text-steel-foreground">
            Hot Stuff Custom Printing — Ottawa, Ontario — DTF apparel printing
          </p>
        </div>
      </footer>
    </div>
  );
}
