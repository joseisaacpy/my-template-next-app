/** Health check público (sem sessão, sem banco): para balanceador e uptime. */
export function GET(): Response {
  return Response.json({ ok: true });
}
