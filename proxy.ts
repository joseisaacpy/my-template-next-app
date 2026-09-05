import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Checagem otimista de sessão: só verifica a presença do cookie, sem hit no
 * banco (o Proxy roda antes do cache e não serve para I/O lento). A validação
 * real da sessão deve acontecer nos layouts / server actions da área privada.
 *
 * Rotas protegidas: mantenha em sincronia com as rotas `auth: true` de
 * `nav.config.ts`. Não importamos o config aqui para não inflar o bundle do Proxy.
 */
const PRIVATE_PREFIXES = ["/dashboard"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isPrivate) {
    return NextResponse.next();
  }

  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Roda em tudo, menos assets estáticos e as rotas internas do Next / API.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
