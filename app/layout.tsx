import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Priscila & Montanha | Casamento",
  description:
    "Site do casamento de Priscila e Montanha, em 26 de setembro de 2026.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
