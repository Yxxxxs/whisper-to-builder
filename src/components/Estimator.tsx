import { useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  PRICING,
  calculateEstimate,
  money,
  moneyPrecise,
  type ArtworkKey,
  type GarmentKey,
  type PlacementKey,
} from "@/lib/pricing";
import { cn } from "@/lib/utils";

const GARMENTS: {
  key: GarmentKey | "other";
  title: string;
  blurb: string;
}[] = [
  { key: "budgetTee", title: "T-shirt — budget", blurb: "Thinner and softer. Cheapest per piece." },
  { key: "standardTee", title: "T-shirt — standard", blurb: "Thicker, heavier, more durable." },
  { key: "longSleeve", title: "Long sleeve tee", blurb: "Cotton long sleeve, same print options." },
  { key: "hoodie", title: "Hoodie", blurb: "Heavyweight pullover hoodie." },
  { key: "own", title: "I have my own garments", blurb: "Print only. You supply the blanks." },
  { key: "other", title: "Something else", blurb: "Bags, hats, barber capes, workwear." },
];

const PLACEMENTS: { key: PlacementKey; title: string; blurb: string }[] = [
  { key: "fullFront", title: "Full front", blurb: "Large chest print" },
  { key: "fullBack", title: "Full back", blurb: "Large back print" },
  { key: "leftChest", title: "Small left chest", blurb: "Logo size" },
  { key: "sleeve", title: "Sleeve", blurb: "Small side print" },
];

const ARTWORK: { key: ArtworkKey; title: string; blurb: string }[] = [
  { key: "ready", title: "I have a print-ready file", blurb: "300 DPI PNG, transparent background" },
  { key: "cleanup", title: "I have something rough", blurb: "Needs cleaning up before printing" },
  { key: "needed", title: "I need a design made", blurb: "We'll work it out from your idea" },
];

const QUICK_QTY = [5, 10, 25, 50, 100];

const contactSchema = z.object({
  contact_name: z.string().trim().min(2, "Tell us your name").max(80),
  email: z.string().trim().email("That email doesn't look right").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function PlacementDiagram({ placement }: { placement: PlacementKey }) {
  const shirt = (
    <path
      d="M18 10 L28 5 L36 10 L44 5 L54 10 L58 22 L50 25 L50 58 L22 58 L22 25 L14 22 Z"
      className="fill-transparent stroke-current"
      strokeWidth={2}
    />
  );
  const marks: Record<PlacementKey, JSX.Element> = {
    fullFront: <rect x={28} y={22} width={16} height={20} className="fill-primary" />,
    fullBack: <rect x={28} y={20} width={16} height={22} className="fill-primary" opacity={0.55} />,
    leftChest: <rect x={40} y={20} width={7} height={6} className="fill-primary" />,
    sleeve: <rect x={15} y={16} width={5} height={7} className="fill-primary" />,
  };
  return (
    <svg viewBox="0 0 72 64" className="h-14 w-16 text-current" aria-hidden="true">
      {shirt}
      {marks[placement]}
    </svg>
  );
}

function OptionCard({
  selected,
  onClick,
  title,
  blurb,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  blurb?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center gap-3 border p-3 text-left transition-colors",
        selected
          ? "border-primary bg-primary/5 text-foreground"
          : "border-border bg-card hover:border-foreground/40",
      )}
    >
      {children}
      <span className="min-w-0">
        <span className="block font-display text-lg uppercase leading-tight">{title}</span>
        {blurb ? (
          <span className="block text-xs text-muted-foreground leading-snug">{blurb}</span>
        ) : null}
      </span>
      <span
        className={cn(
          "ml-auto size-3 shrink-0 border",
          selected ? "border-primary bg-primary" : "border-input",
        )}
      />
    </button>
  );
}

function StepHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-3 text-xl">
      <span className="flex size-7 items-center justify-center bg-ink font-mono text-xs text-ink-foreground">
        {n}
      </span>
      {children}
    </h3>
  );
}

export function Estimator() {
  const [garment, setGarment] = useState<GarmentKey | "other" | null>(null);
  const [quantity, setQuantity] = useState<number>(25);
  const [placements, setPlacements] = useState<PlacementKey[]>(["fullFront"]);
  const [personalised, setPersonalised] = useState(false);
  const [personalisedCount, setPersonalisedCount] = useState<number>(0);
  const [artwork, setArtwork] = useState<ArtworkKey>("ready");
  const [form, setForm] = useState({ contact_name: "", email: "", phone: "", notes: "" });
  const [preferred, setPreferred] = useState<"email" | "text" | "instagram">("email");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const isOther = garment === "other";
  const belowMinimum = !isOther && quantity < PRICING.minimumQuantity;

  const estimate = useMemo(() => {
    if (!garment || isOther || belowMinimum) return null;
    if (placements.length === 0 && !personalised) return null;
    return calculateEstimate({
      garment: garment as GarmentKey,
      quantity,
      placements,
      personalised,
      personalisedCount,
      artwork,
    });
  }, [garment, isOther, belowMinimum, quantity, placements, personalised, personalisedCount, artwork]);

  const specSummary = useMemo(() => {
    if (isOther || !garment) return "";
    const g = PRICING.garments[garment as GarmentKey];
    const parts = [
      `${quantity} x ${g.label} (${g.sku})`,
      placements.map((p) => PRICING.prints[p].label).join(", ") || "no repeat placement",
    ];
    if (personalised) parts.push(`${personalisedCount} personalised names/numbers`);
    parts.push(ARTWORK.find((a) => a.key === artwork)?.title ?? "");
    if (estimate) parts.push(`Estimate ${money(estimate.low)}–${money(estimate.high)}`);
    return parts.filter(Boolean).join(" | ");
  }, [isOther, garment, quantity, placements, personalised, personalisedCount, artwork, estimate]);

  function togglePlacement(key: PlacementKey) {
    setPlacements((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );
  }

  async function submit() {
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check your details");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("quote_requests").insert({
      request_type: isOther ? "inquiry" : "estimate",
      contact_name: parsed.data.contact_name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      preferred_contact: preferred,
      notes: parsed.data.notes || null,
      garment: garment ?? null,
      quantity: isOther ? null : quantity,
      placements: isOther ? null : placements,
      personalised_count: personalised ? personalisedCount : 0,
      artwork_status: isOther ? null : artwork,
      estimate_low: estimate?.low ?? null,
      estimate_high: estimate?.high ?? null,
      spec_summary: specSummary || null,
    });
    setSubmitting(false);
    if (error) {
      toast.error("That didn't send. Message us on WhatsApp and we'll sort it.");
      return;
    }
    setSent(true);
    toast.success("Got it — we'll come back with a confirmed price.");
  }

  const whatsappText = encodeURIComponent(
    isOther
      ? "Hi Hot Stuff — I'd like a quote on something custom."
      : `Hi Hot Stuff — quote request: ${specSummary}`,
  );

  return (
    <div className="border border-border bg-card">
      <div className="border-b border-border bg-ink px-5 py-6 text-ink-foreground sm:px-8">
        <p className="eyebrow text-primary">Price estimator</p>
        <h2 className="mt-2 text-3xl sm:text-4xl">Build your order, see the price</h2>
        <p className="mt-2 max-w-xl text-sm text-steel-foreground">
          Real numbers, not a contact form. Minimum {PRICING.minimumQuantity} pieces.
        </p>
      </div>

      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-9">
          {/* 1. Garment */}
          <section>
            <StepHeading n={1}>What are we printing on?</StepHeading>
            <div className="grid gap-2 sm:grid-cols-2">
              {GARMENTS.map((g) => (
                <OptionCard
                  key={g.key}
                  selected={garment === g.key}
                  onClick={() => setGarment(g.key)}
                  title={g.title}
                  blurb={g.blurb}
                />
              ))}
            </div>
          </section>

          {isOther ? (
            <section className="border-l-2 border-primary bg-secondary p-4">
              <h3 className="text-xl">Tell us what you've got</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Bags, hats, capes and workwear all press differently, so we price these by
                conversation. Send the details below and we'll come back with a number.
              </p>
            </section>
          ) : (
            garment && (
              <>
                {/* 2. Quantity */}
                <section>
                  <StepHeading n={2}>How many?</StepHeading>
                  <div className="flex flex-wrap items-center gap-2">
                    {QUICK_QTY.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setQuantity(q)}
                        className={cn(
                          "border px-4 py-2 font-display text-lg uppercase transition-colors",
                          quantity === q
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-foreground/40",
                        )}
                      >
                        {q}
                      </button>
                    ))}
                    <Input
                      type="number"
                      min={1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-24"
                      aria-label="Quantity"
                    />
                  </div>
                  {belowMinimum ? (
                    <p className="mt-3 border-l-2 border-primary bg-secondary p-3 text-sm">
                      Under {PRICING.minimumQuantity} pieces we quote by message — one-offs on your
                      own garment start around ${PRICING.printOnlyStartsAt}.{" "}
                      <a className="underline" href="#contact">
                        Message us
                      </a>
                      .
                    </p>
                  ) : estimate ? (
                    <p className="mt-3 font-mono text-xs text-muted-foreground">
                      {moneyPrecise(estimate.perPieceLow)} – {moneyPrecise(estimate.perPieceHigh)}{" "}
                      per piece at this quantity. It drops as the count goes up.
                    </p>
                  ) : null}
                </section>

                {/* 3. Placement */}
                <section>
                  <StepHeading n={3}>Where does the print go?</StepHeading>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {PLACEMENTS.map((p) => (
                      <OptionCard
                        key={p.key}
                        selected={placements.includes(p.key)}
                        onClick={() => togglePlacement(p.key)}
                        title={p.title}
                        blurb={p.blurb}
                      >
                        <PlacementDiagram placement={p.key} />
                      </OptionCard>
                    ))}
                    <OptionCard
                      selected={personalised}
                      onClick={() => {
                        setPersonalised(!personalised);
                        if (!personalised && personalisedCount === 0) setPersonalisedCount(quantity);
                      }}
                      title="Personalised names or numbers"
                      blurb="Each piece pressed individually"
                    />
                  </div>
                  {personalised ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <Label htmlFor="names" className="text-sm">
                        How many pieces get a name?
                      </Label>
                      <Input
                        id="names"
                        type="number"
                        min={0}
                        max={quantity}
                        value={personalisedCount}
                        onChange={(e) => setPersonalisedCount(Number(e.target.value))}
                        className="w-24"
                      />
                    </div>
                  ) : null}
                </section>

                {/* 4. Artwork */}
                <section>
                  <StepHeading n={4}>Is your design ready?</StepHeading>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {ARTWORK.map((a) => (
                      <OptionCard
                        key={a.key}
                        selected={artwork === a.key}
                        onClick={() => setArtwork(a.key)}
                        title={a.title}
                        blurb={a.blurb}
                      />
                    ))}
                  </div>
                </section>
              </>
            )
          )}

          {/* 5. Send it */}
          {garment ? (
            <section id="quote-form">
              <StepHeading n={isOther ? 2 : 5}>Send it over</StepHeading>
              {sent ? (
                <div className="border-l-2 border-primary bg-secondary p-4">
                  <h4 className="text-xl">Received</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll confirm the final price once we've seen the artwork — usually same day.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.contact_name}
                      maxLength={80}
                      onChange={(e) => setForm({ ...form, contact_name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      maxLength={255}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone or Instagram (optional)</Label>
                    <Input
                      id="phone"
                      value={form.phone}
                      maxLength={30}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Best way to reach you</Label>
                    <div className="mt-1 flex gap-1">
                      {(["email", "text", "instagram"] as const).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setPreferred(c)}
                          className={cn(
                            "flex-1 border px-2 py-2 text-xs uppercase tracking-wide transition-colors",
                            preferred === c
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border hover:border-foreground/40",
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">
                      {isOther ? "What are we printing on, and how many?" : "Anything else?"}
                    </Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      maxLength={1000}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
                    <Button size="lg" onClick={submit} disabled={submitting}>
                      {submitting
                        ? "Sending…"
                        : isOther
                          ? "Send my inquiry"
                          : "Get this quote confirmed"}
                    </Button>
                    <a
                      className="text-sm underline underline-offset-4"
                      href={`https://wa.me/16132526457?text=${whatsappText}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      or send it on WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </section>
          ) : null}
        </div>

        {/* Live price panel */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="border border-line-dark bg-ink p-5 text-ink-foreground">
            <p className="eyebrow text-primary">Your estimate</p>
            {estimate ? (
              <>
                <p className="mt-2 font-display text-4xl uppercase leading-none">
                  {money(estimate.low)} – {money(estimate.high)}
                </p>
                <p className="mt-1 font-mono text-xs text-steel-foreground">
                  {moneyPrecise(estimate.perPieceLow)} – {moneyPrecise(estimate.perPieceHigh)} per
                  piece
                </p>
                <ul className="mt-5 space-y-2 border-t border-line-dark pt-4 text-sm">
                  {estimate.lines.map((line) => (
                    <li key={line.label} className="flex justify-between gap-3">
                      <span>
                        <span className="block">{line.label}</span>
                        <span className="block text-xs text-steel-foreground">{line.detail}</span>
                      </span>
                      <span className="font-mono text-xs whitespace-nowrap pt-0.5">
                        {line.amount > 0 ? money(line.amount) : "included"}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 border-t border-line-dark pt-4 text-xs text-steel-foreground">
                  {PRICING.turnaroundBusinessDays} business days from artwork approval. Final price
                  confirmed once we see the artwork. 2XL and up is slightly higher.
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-steel-foreground">
                {isOther
                  ? "Custom items are quoted by conversation — fill in the details and we'll price it."
                  : belowMinimum
                    ? `Estimator starts at ${PRICING.minimumQuantity} pieces.`
                    : "Pick a garment, a quantity and a print placement — the price appears here and updates as you change it."}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
