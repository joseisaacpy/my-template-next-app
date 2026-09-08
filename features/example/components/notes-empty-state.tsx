import { NotebookPenIcon } from "lucide-react";

/** Estado vazio da lista de notas. */
export function NotesEmptyState() {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-12 text-center">
      <NotebookPenIcon className="text-muted-foreground size-6" />
      <p className="font-medium">Nenhuma nota ainda</p>
      <p className="text-muted-foreground max-w-xs text-sm">
        Use o formulário acima para criar a sua primeira nota.
      </p>
    </div>
  );
}
