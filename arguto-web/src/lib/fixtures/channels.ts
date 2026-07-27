import type { Channel } from "@/lib/schemas/channel";

/** Canais com rota confirmada na home real (§2.5). */
export const channelsFixture: Channel[] = [
  { id: "1", nome: "VAREJO ALIMENTAR", slug: "varejo-alimentar", rota: "/Canais/varejo-alimentar/1/" },
  { id: "3", nome: "FARMA", slug: "farma", rota: "/Canais/farma/3/" },
];
