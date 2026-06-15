"use client";

import { useId, useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/Alert";
import { Stack } from "@/components/layout/Stack";

/** Minimal client-side validity check - real submission is wired to a TODO handler. */
type Status = "idle" | "submitting" | "success" | "error";

/**
 * ContactForm - accessible, token-only contact form.
 *
 * NOTE (non-functional): this form does NOT currently send anything. On submit
 * it runs a placeholder handler (`submitContact`) that resolves locally and
 * shows a success Alert. Wire it to a real endpoint / server action before
 * launch - see the `// TODO` below.
 */
export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const messageHintId = useId();
  const statusId = useId();

  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    try {
      // TODO(contact): replace this placeholder with a real submission - a Next.js
      // server action, an API route (e.g. POST /api/contact), or an email/CRM
      // integration. Currently this only simulates a successful round-trip so
      // the UI can be reviewed; no data leaves the browser.
      await submitContact(new FormData(event.currentTarget));
      setStatus("success");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
    }
  }

  const isSubmitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate aria-describedby={statusId}>
      <Stack gap={5}>
        {/* Live region for submission feedback - announced to assistive tech. */}
        <div id={statusId} aria-live="polite">
          {status === "success" ? (
            <Alert variant="success">
              <AlertTitle>Thanks - your message is ready to send.</AlertTitle>
              <AlertDescription>
                This demo form is not yet connected to a backend, so nothing was
                actually delivered. For anything urgent, email us directly using
                the address in the panel beside this form.
              </AlertDescription>
            </Alert>
          ) : null}

          {status === "error" ? (
            <Alert variant="error">
              <AlertTitle>Something went wrong.</AlertTitle>
              <AlertDescription>
                Please try again, or reach us directly by email.
              </AlertDescription>
            </Alert>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={nameId} required>
            Name
          </Label>
          <Input
            id={nameId}
            name="name"
            type="text"
            autoComplete="name"
            required
            placeholder="Ada Lovelace"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={emailId} required>
            Email
          </Label>
          <Input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            disabled={isSubmitting}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor={messageId} required>
            Message
          </Label>
          <Textarea
            id={messageId}
            name="message"
            required
            rows={6}
            aria-describedby={messageHintId}
            placeholder="Tell us what you're working on, your team size, and what you'd like to see in a demo."
            disabled={isSubmitting}
          />
          <p id={messageHintId} className="text-body-sm text-muted-foreground">
            Include your team size and goals so we can tailor a demo.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button type="submit" size="lg" isLoading={isSubmitting}>
            {isSubmitting ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <Send aria-hidden className="size-4" />
            )}
            Send message
          </Button>
          <p className="text-body-sm text-muted-foreground">
            We typically reply within one business day.
          </p>
        </div>
      </Stack>
    </form>
  );
}

/**
 * Placeholder submission handler. Resolves after a short delay to mimic a
 * network round-trip. Replace with a real action/endpoint (see TODO above).
 */
async function submitContact(_formData: FormData): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 600));
}

export default ContactForm;
