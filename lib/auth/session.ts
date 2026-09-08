import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";

import { auth } from "@/lib/auth/auth";

/**
 * DAL (Data Access Layer) de autenticação. Todo Server Component ou action
 * que precisa saber quem é o usuário passa por aqui — nunca leia o cookie na
 * mão.
 *
 * `cache()` do React memoiza dentro de UM request: se três componentes
 * chamarem `getSession()` na mesma renderização, o better-auth roda uma vez.
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

/**
 * Exige uma sessão válida. Redireciona para `/login` quando não há —
 * o `redirect()` interrompe a renderização, então o retorno é sempre válido.
 */
export const requireSession = cache(async () => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return session;
});

/** Atalho para `(await requireSession()).user`. */
export const requireUser = cache(async () => {
  const { user } = await requireSession();
  return user;
});
