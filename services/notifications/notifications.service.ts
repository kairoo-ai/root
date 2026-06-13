/**
 * Outbound user notifications (email / in-app).
 *
 * Reserved skeleton — typed stubs only. No network calls at module scope.
 */

export type NotificationChannel = "email" | "in_app";

/** A single notification to dispatch to one user. */
export interface Notification {
  userId: string;
  channel: NotificationChannel;
  /** Template / event identifier, e.g. "budget.exhausted". */
  templateId: string;
  /** Template variables, kept string-keyed for serializability. */
  data: Record<string, string>;
}

/** Default channel used when a caller does not specify one. */
export const defaultChannel = "in_app" as const satisfies NotificationChannel;

export type DefaultChannel = typeof defaultChannel;

/** Dispatch a single notification through its channel. */
export async function sendNotification(_notification: Notification): Promise<void> {
  // TODO: route to an email/in-app transport once one is wired
  throw new Error("Not implemented");
}
