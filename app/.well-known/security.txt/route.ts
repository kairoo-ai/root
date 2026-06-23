export async function GET() {
  const content = `Contact: mailto:security@kairoo.com
Expires: 2027-06-24T00:00:00.000Z
Preferred-Languages: en
Canonical: https://kairoo.com/.well-known/security.txt
Policy: https://kairoo.com/security
`;

  return new Response(content, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
