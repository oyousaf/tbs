"use client";

import { useState } from "react";
import { business } from "@/lib/site";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  if (sent) {
    return (
      <div role="status" className="mt-6 rounded-3xl bg-panel p-6">
        <p className="font-display text-2xl text-accent">Thanks, that all looks good.</p>
        <p className="mt-2">
          This site is a preview, so your message hasn&rsquo;t been sent. To reach the salon today, call{" "}
          <a href={business.phoneHref} className="font-semibold underline underline-offset-4">{business.phone}</a>.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-line mt-4">Write another</button>
      </div>
    );
  }
  return (
    <form
      className="mt-6 space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div>
        <label htmlFor="c-name" className="mb-1 block font-semibold">Your name</label>
        <input id="c-name" name="name" required autoComplete="name" className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="c-email" className="mb-1 block font-semibold">Email</label>
          <input id="c-email" name="email" type="email" required autoComplete="email" className="field" />
        </div>
        <div>
          <label htmlFor="c-phone" className="mb-1 block font-semibold">Phone <span className="font-normal text-muted">(optional)</span></label>
          <input id="c-phone" name="phone" type="tel" autoComplete="tel" className="field" />
        </div>
      </div>
      <div>
        <label htmlFor="c-msg" className="mb-1 block font-semibold">Your message</label>
        <textarea id="c-msg" name="message" required rows={5} className="field" />
      </div>
      <button type="submit" className="btn btn-plum">Send message</button>
      <p className="text-sm text-muted">Preview only: messages aren&rsquo;t sent or stored.</p>
    </form>
  );
}
