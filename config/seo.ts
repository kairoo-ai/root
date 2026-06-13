import type { Metadata } from "next";
import { site } from "./site";

export const defaultMetadata: Metadata = {
  title: {
    default: "Kairoo",
    template: "%s — Kairoo",
  },
  description: site.description,
};
