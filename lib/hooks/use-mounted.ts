import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * `false` no servidor e no primeiro render do cliente, `true` depois — sem
 * `useEffect` nem set-state. Use para adiar UI que depende de APIs do browser
 * (ex.: tema resolvido do next-themes) e evitar mismatch de hidratação.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}
