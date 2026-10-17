"use client";

import { useState } from "react";
import { useGame } from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UpgradePage() {
  const { profile, setPro } = useGame();
  const [name, setName] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [message, setMessage] = useState("");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const digits = card.replace(/\D/g, "");
    if (digits.length < 16) {
      setMessage("Use any 16 digits. Nothing is charged and nothing is stored.");
      return;
    }
    if (!name.trim() || exp.trim().length < 4 || cvc.trim().length < 3) {
      setMessage("Fill the mock form. The digits are thrown away in this browser.");
      return;
    }
    setCard("");
    setCvc("");
    setPro(true);
    setMessage("Pro preview is on. No charge. The card number was discarded. Stripe is the later path, not this form.");
  }

  return (
    <div className="mx-auto max-w-lg space-y-5">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">Pro · $6 a month</p>
        <h1 className="mt-2 font-display text-5xl leading-none tracking-wide">Stay past February.</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Full careers, historical teams, advanced stat lines, and private leagues. Free keeps the daily challenge and one
          single season. This checkout is a mock. It does not talk to a card network.
        </p>
      </header>
      <ul className="space-y-2 text-sm">
        {[
          "Multi-season career with aging, expiring deals, and a new draft each year",
          "Hired, fired, and hired again, with a legacy score and a Hall of Fame line",
          "An auto-written GM Wikipedia page when you retire",
          "1985 Bears, 1993 Cowboys, 1999 Rams, 2007 Patriots, 2013 Seahawks, 1989 49ers",
          "Private leagues by pasting share cards",
        ].map((item) => (
          <li key={item} className="rounded-lg border border-white/10 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
      {profile.pro ? (
        <div className="space-y-3 rounded-xl border border-emerald-400/40 bg-emerald-400/10 p-4 text-sm">
          <p>Pro preview is already on for this browser.</p>
          <Button variant="outline" onClick={() => setPro(false)}>
            Drop back to free
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3 rounded-2xl border border-white/10 bg-card p-4">
          <label className="block text-sm">
            Name on the card
            <Input className="mt-1 !h-11" value={name} onChange={(event) => setName(event.target.value)} autoComplete="off" />
          </label>
          <label className="block text-sm">
            Card number
            <Input
              className="mt-1 !h-11"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              value={card}
              onChange={(event) => setCard(event.target.value)}
              autoComplete="off"
            />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input className="!h-11" placeholder="MM/YY" value={exp} onChange={(event) => setExp(event.target.value)} autoComplete="off" />
            <Input className="!h-11" placeholder="CVC" value={cvc} onChange={(event) => setCvc(event.target.value)} autoComplete="off" />
          </div>
          <Button type="submit" className="!h-12 w-full">
            Start Pro preview
          </Button>
          <p className="text-xs text-muted-foreground">
            Do not enter a real card. The field is cleared and never written to storage. A later version can replace this
            screen with Stripe Checkout and a real account.
          </p>
        </form>
      )}
      {message ? <p className="text-sm">{message}</p> : null}
    </div>
  );
}
