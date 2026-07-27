import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { addToCart } from "@/lib/legacy/cart";

const bodySchema = z.object({
  codProduto: z.string().min(1),
  quantidade: z.number().int().positive(),
});

export async function POST(request: NextRequest) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ ok: false, erro: "Requisição inválida." }, { status: 400 });
  }

  const result = await addToCart(parsed.data.codProduto, parsed.data.quantidade);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
