import { z } from "zod";

export const channelSchema = z.object({
  id: z.string(),
  nome: z.string(),
  slug: z.string(),
  rota: z.string(),
});

export type Channel = z.infer<typeof channelSchema>;
