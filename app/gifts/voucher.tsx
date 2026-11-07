"use client";

import { useState } from "react";
import { business } from "@/lib/site";

const amounts = [25, 50, 75, 100, 150];

export function VoucherBuilder() {
  const [amount, setAmount] = useState(50);
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("");
  return (
    <section className="wrap-page grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
      <div>
        <h2 className="font-display text-5xl text-accent sm:text-6xl">Gift vouchers</h2>
        <p className="mt-3 max-w-lg text-lg text-muted">Sent to your email, or straight to theirs. Every voucher lasts 12 months from the date of purchase.</p>
        <fieldset className="mt-8">
          <legend className="font-semibold">How much?</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {amounts.map((a) => (
              <label key={a} className={`btn cursor-pointer has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent ${amount === a ? "btn-plum" : "btn-line"}`}>
                <input type="radio" name="amount" className="sr-only" checked={amount === a} onChange={() => setAmount(a)} />
                £{a}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="v-to" className="mb-1 block font-semibold">Who&rsquo;s it for?</label>
            <input id="v-to" value={to} onChange={(e) => setTo(e.target.value)} className="field" autoComplete="off" />
          </div>
          <div>
            <label htmlFor="v-msg" className="mb-1 block font-semibold">A short message</label>
            <input id="v-msg" value={message} maxLength={60} onChange={(e) => setMessage(e.target.value)} className="field" autoComplete="off" />
          </div>
        </div>
        <a href={business.vouchers} target="_blank" rel="noopener" className="btn btn-plum mt-6">
          Continue to the salon&rsquo;s voucher shop<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <p className="mt-3 max-w-md text-sm text-muted">
          Vouchers are bought through the salon&rsquo;s existing voucher shop, in a new tab. Your choices here are only a preview and aren&rsquo;t passed on.
        </p>
      </div>
      <div aria-label={`Preview of a £${amount} voucher`} role="img" className="on-dark relative mx-auto aspect-[1.6] w-full max-w-xl rotate-2 rounded-3xl bg-plum p-7 text-porcelain shadow-2xl sm:p-10">
        <span aria-hidden className="absolute top-7 right-7 size-14 rounded-full bg-champagne sm:top-10 sm:right-10 sm:size-20" />
        <p className="font-display text-6xl sm:text-8xl">£{amount}</p>
        <p className="mt-2 text-lg font-medium wrap-break-word">{to ? `For ${to}` : "For someone lovely"}</p>
        <p className="wrap-break-word text-porcelain/90">{message || "Pampering from head to toe"}</p>
        <p className="absolute bottom-6 left-7 font-display text-xl sm:bottom-9 sm:left-10">the beauty spot</p>
      </div>
    </section>
  );
}
