"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Check, Mail } from "lucide-react";
import { HOTEL } from "@/lib/hotel";

export default function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

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
    return `mailto:${HOTEL.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    // Opens the visitor's mail client with the form contents pre-filled.
    // Backend is intentionally not in the loop — when it ships later,
    // swap this for a fetch to /api/contact.
    try {
      window.location.href = buildMailto(new FormData(e.currentTarget));
      setState("done");
    } catch {
      setState("error");
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
        <h3 className="mt-5 font-serif text-2xl text-coal">Message ready to send.</h3>
        <p className="mt-3 text-coal/70 max-w-sm mx-auto">
          Your mail client should have opened with the message pre-filled. If not, write to us directly at{" "}
          <a href={`mailto:${HOTEL.contact.email}`} className="text-ember underline-offset-2 hover:underline">
            {HOTEL.contact.email}
          </a>
          .
        </p>
      </motion.div>
    );
  }

  if (state === "error") {
    return (
      <div className="border border-ember/30 bg-ember/5 p-10 text-center">
        <h3 className="font-serif text-2xl text-coal">Couldn't open your mail client.</h3>
        <p className="mt-3 text-coal/70 max-w-sm mx-auto">
          Please write to us directly at{" "}
          <a href={`mailto:${HOTEL.contact.email}`} className="text-ember underline-offset-2 hover:underline">
            {HOTEL.contact.email}
          </a>
          .
        </p>
      </div>
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

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="btn-primary disabled:opacity-60"
        >
          {state === "sending" ? "Opening mail…" : "Send message"}
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