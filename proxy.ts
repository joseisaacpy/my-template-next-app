import { getSessionCookie } from "better-auth/cookies";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Checagem otimista de sessão: só verifica a presença do cookie, sem hit no
 * banco (o Proxy roda antes do cache e não serve para I/O lento). A validação
 * real da sessão acontece nos layouts / server actions da área privada
 * (ver `lib/auth/session.ts`).
 *
 * Mantenha estas listas em sincronia com as rotas de `nav.config.ts`. Não
 * importamos o config aqui para não inflar o bundle do Proxy.
 */
const PRIVATE_PREFIXES = ["/dashboard", "/notes"];
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const isPrivate = PRIVATE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isPrivate && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Já logado não vê tela de login/cadastro.
  if (sessionCookie && AUTH_ROUTES.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Roda em tudo, menos assets estáticos e as rotas internas do Next / API.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
