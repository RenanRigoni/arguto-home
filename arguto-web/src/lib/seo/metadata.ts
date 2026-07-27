import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://arguto.com.br";

export const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arguto — Distribuidora de alimentos, bebidas e limpeza",
    template: "%s | Arguto",
  },
  description:
    "Portfólio das principais indústrias em alimentos, bebidas, limpeza, cuidados pessoais, bazar e pet. Compra B2B com entrega gratuita.",
};

export const homeMetadata: Metadata = {
  title: "Arguto — Distribuidora de alimentos, bebidas e limpeza",
  description:
    "Portfólio das principais indústrias em alimentos, bebidas, limpeza, cuidados pessoais, bazar e pet. Compra B2B com entrega gratuita.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: SITE_URL,
    siteName: "Arguto",
    title: "Arguto — Distribuidora de alimentos, bebidas e limpeza",
    description:
      "Portfólio das principais indústrias em alimentos, bebidas, limpeza, cuidados pessoais, bazar e pet.",
  },
};
