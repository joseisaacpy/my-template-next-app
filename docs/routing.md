# Rotas, Navegação e Metadata

Toda rota de página tem um **nome** e uma **descrição** registrados num único
lugar: `nav.config.ts` (raiz do projeto). Esse arquivo alimenta:

- o `<title>` / `<meta name="description">` de cada página (`lib/metadata.ts`);
- o menu do `<Header />` (`components/layout/Header.tsx`).

## Criar uma rota nova

1. **Registrar a rota** em `nav.config.ts`:
   - adicione a chave em `RouteKey`;
   - adicione a entrada em `routes` com `path`, `label` (o nome) e `description`.

   ```ts
   export type RouteKey = /* ... */ | "settings";

   export const routes: Record<RouteKey, RouteMeta> = {
     // ...
     settings: {
       path: "/settings",
       label: "Configurações",
       description: "Ajuste as preferências da sua conta.",
       auth: true,
     },
   };
   ```

2. **Criar a página** com a metadata pré-pronta. Copie este esqueleto:

   ```tsx
   // app/(private)/settings/page.tsx
   import { createMetadata } from "@/lib/metadata";

   export const metadata = createMetadata({ route: "settings" });

   export default function SettingsPage() {
     return <h1>Configurações</h1>;
   }
   ```

3. **(Opcional) Mostrar no menu**: inclua a chave em `nav.header` (ou `nav.footer`)
   dentro de `nav.config.ts`. Itens com `auth: true` só aparecem quando o
   `<Header />` recebe `authenticated`.

## `createMetadata()`

| Campo         | Efeito                                                              |
| ------------- | ----------------------------------------------------------------- |
| `route`       | Puxa `title` e `description` do registro em `nav.config.ts`.       |
| `title`       | Sobrescreve o título.                                              |
| `description` | Sobrescreve a descrição.                                           |
| `path`        | Canônico. Default: `routes[route].path`.                           |
| `noIndex`     | `true` remove a página dos buscadores.                             |
| `overrides`   | Mescla qualquer campo extra do objeto `Metadata` do Next.          |

O sufixo `%s · Meu Template` no `<title>` vem do template definido em
`app/layout.tsx` (`rootMetadata`).

### Rota dinâmica

Use `generateMetadata` + `createMetadata` sem `route`:

```tsx
// app/(public)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { createMetadata } from "@/lib/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${slug}`,
  });
}
```

## Header

`components/layout/Header.tsx` renderiza `nav.header`. Já está montado em
`app/(private)/layout.tsx`. Para usá-lo em outra área:

```tsx
import { Header } from "@/components/layout";

// dentro de um layout Server Component
<Header authenticated={hasSession} />;
```

Para mudar o menu, edite as listas em `nav.config.ts` — não o componente.

## Imagem OG

`site.ogImage` em `nav.config.ts` começa `undefined`. Ao adicionar
`public/og.png`, aponte `ogImage: "/og.png"` e ela entra em todas as páginas.
