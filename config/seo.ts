import type { Metadata } from "next";
import { site } from "./site";

export const defaultMetadata: Metadata = {
  title: {
    default: `${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
    template: `%s - ${process.env.NEXT_PUBLIC_APP_NAME || "Kairoo"}`,
  },
  description: site.description,
};
