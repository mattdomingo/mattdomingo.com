"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { ArrowUpRight } from "lucide-react";
import { profile } from "@/lib/profile";

const COOLDOWN_KEY = "contactFormCooldownEnd";
const COOLDOWN_MS = 10 * 60 * 1000;
const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
const configured = Boolean(serviceId && templateId && publicKey);

export function ContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);
  const [remaining, setRemaining] = useState(0);
  const cooldownEnd = useRef(0);
  const inFlight = useRef(false);

  useEffect(() => {
    function update() {
      try {
        const stored = Number(localStorage.getItem(COOLDOWN_KEY));
        if (Number.isFinite(stored) && stored > Date.now())
          cooldownEnd.current = Math.max(cooldownEnd.current, stored);
      } catch {
        /* The in-memory cooldown still works without storage. */
      }
      const seconds = Math.max(
        0,
        Math.ceil((cooldownEnd.current - Date.now()) / 1000),
      );
      setRemaining(seconds);
    }
    update();
    const interval = window.setInterval(update, 1000);
    window.addEventListener("storage", update);
    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", update);
    };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !configured) return;
    if (cooldownEnd.current > Date.now()) {
      setStatus({
        kind: "error",
        message: "Please wait for the cooldown before sending another message.",
      });
      return;
    }
    const name = fields.name.trim();
    const message = fields.message.trim();
    const email = fields.email.trim();
    if (!name || !message) {
      setStatus({
        kind: "error",
        message: "Please enter your name and a message.",
      });
      return;
    }
    inFlight.current = true;
    setSending(true);
    setStatus(null);
    try {
      // Retain the site's legacy retired-feature response before normal email delivery.
      try {
        const response = await fetch("/api/auth", {
          signal: AbortSignal.timeout(5000),
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, message }),
        });
        if (response.ok && (await response.json()).success) {
          setStatus({
            kind: "error",
            message: "This feature is no longer available.",
          });
          return;
        }
      } catch {
        /* A failed optional legacy check must not block contact. */
      }
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setStatus({
          kind: "error",
          message: "Please enter a valid email address so I can reply.",
        });
        return;
      }
      await emailjs.send(
        serviceId!,
        templateId!,
        { name, email, message, time: new Date().toLocaleString() },
        publicKey!,
      );
      cooldownEnd.current = Date.now() + COOLDOWN_MS;
      setRemaining(600);
      // Persistence failure must never turn a delivered message into a delivery error.
      try {
        localStorage.setItem(COOLDOWN_KEY, String(cooldownEnd.current));
      } catch {
        /* Keep the cooldown in memory. */
      }
      setFields({ name: "", email: "", message: "" });
      setStatus({
        kind: "success",
        message:
          "Message sent. Thanks for reaching out! You can send another message in 10 minutes.",
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Your message couldn’t be sent. Please try again or email me directly.",
      });
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  return (
    <form
      className="contact-form"
      onSubmit={submit}
      aria-label="Send Matt a message"
    >
      <div className="form-heading">
        <span className="mono">A NEW CONVERSATION</span>
        <span aria-hidden="true">↗</span>
      </div>
      <div className="form-field">
        <label htmlFor="contact-name">Your name</label>
        <input
          id="contact-name"
          name="name"
          autoComplete="name"
          required
          maxLength={100}
          value={fields.name}
          onChange={(event) => {
            setFields({ ...fields, name: event.target.value });
            setStatus(null);
          }}
          placeholder="Alex Morgan"
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-email">Email address</label>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          value={fields.email}
          onChange={(event) => {
            setFields({ ...fields, email: event.target.value });
            setStatus(null);
          }}
          placeholder="alex@company.com"
        />
      </div>
      <div className="form-field">
        <label htmlFor="contact-message">What’s on your mind?</label>
        <textarea
          id="contact-message"
          name="message"
          required
          maxLength={5000}
          rows={5}
          value={fields.message}
          onChange={(event) => {
            setFields({ ...fields, message: event.target.value });
            setStatus(null);
          }}
          placeholder="Tell me about the role, the team, or what you’re building."
        />
      </div>
      {!configured && (
        <p className="form-notice">
          The message form is unavailable right now.{" "}
          <a href={`mailto:${profile.email}`}>
            Email me directly <ArrowUpRight size={14} />
          </a>
        </p>
      )}
      <button
        className="button button-accent"
        type="submit"
        disabled={sending || remaining > 0 || !configured}
      >
        {sending
          ? "Sending…"
          : remaining > 0
            ? `Send again in ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
            : "Send message"}
        <ArrowUpRight size={18} />
      </button>
      {status && (
        <p
          className={`form-status ${status.kind}`}
          role={status.kind === "error" ? "alert" : "status"}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
