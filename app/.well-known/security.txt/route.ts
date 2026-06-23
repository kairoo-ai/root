import { site } from "@/config/site";

const base = site.baseUrl.replace(/\/$/, "");

export async function GET() {
  const content = `Contact: mailto:security@${site.baseUrl.replace(/^https?:\/\//, "")}
Expires: 2027-06-24T00:00:00.000Z
Preferred-Languages: en
Canonical: ${base}/.well-known/security.txt
Policy: ${base}/security
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
