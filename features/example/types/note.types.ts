/**
 * DTO de Nota: o formato que sai do `service` e chega no client. Não expõe
 * `userId` nem nada interno do Prisma.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
