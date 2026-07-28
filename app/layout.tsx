import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Priscila & Montanha | Casamento",
  description:
    "Site do casamento de Priscila e Montanha, em 18 de setembro de 2027.",
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
