"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Mail } from "lucide-react";
import { HOTEL } from "@/lib/hotel";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  function buildMailto(fd: FormData): string {
    const name = (fd.get("name") ?? "").toString().trim();
    const phone = (fd.get("phone") ?? "").toString().trim();
    const email = (fd.get("email") ?? "").toString().trim();
    const subject = (fd.get("subject") ?? "Website enquiry").toString().trim();
    const body = (fd.get("body") ?? "").toString().trim();

    const lines = [
      `Name: ${name || "—"}`,
      `Phone: ${phone || "—"}`,
      `Email: ${email || "—"}`,
      "",
      body,
    ];
    const to = HOTEL.contact.email;
    return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not send your message");
      }
      setState("done");
    } catch (err: any) {
      // Backend unavailable (not wired yet on Vercel, or network error) —
      // gracefully fall back to a mailto: link so the form is never a dead end.
      const mailto = buildMailto(fd);
      try {
        window.location.href = mailto;
        setState("done");
        return;
      } catch {
        // If even mailto fails, surface the error.
        setError(err.message ?? "Something went wrong");
        setState("error");
        return;
      }
    }
  }

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-coal/10 p-10 text-center"
      >
        <Check className="mx-auto text-ember" size={32} />
        <h3 className="mt-5 font-serif text-2xl text-coal">Message received.</h3>
        <p className="mt-3 text-coal/70 max-w-sm mx-auto">
          Thank you. The team will get back to you shortly — usually within the hour.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Full name" name="name" required />
        <Field label="Phone" name="phone" type="tel" />
      </div>
      <Field label="Email" name="email" type="email" required />
      <Field label="Subject" name="subject" placeholder="Reservation, event, feedback…" />
      <div>
        <label className="eyebrow block mb-2">Message</label>
        <textarea
          name="body"
          required
          rows={5}
          className="w-full bg-transparent border-b border-coal/30 focus:border-coal outline-none py-3 transition-colors resize-none"
          placeholder="Tell us a little about your stay, your event, or your question."
        />
      </div>

      {error && <div className="text-sm text-ember">{error}</div>}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="btn-primary disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send message"}
          <Send size={16} />
        </button>
        <a
          href={`mailto:${HOTEL.contact.email}`}
          className="inline-flex items-center gap-2 text-eyebrow uppercase tracking-widest text-ash hover:text-ember"
        >
          <Mail size={14} /> Or email us directly
        </a>
      </div>
      <div className="text-eyebrow uppercase tracking-widest text-ash">
        We reply within an hour.
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="eyebrow block mb-2">
        {label} {required && <span className="text-ember">*</span>}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-coal/30 focus:border-coal outline-none py-3 transition-colors"
      />
    </div>
  );
}