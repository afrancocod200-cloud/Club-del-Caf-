import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Club del Café | Bogotá",
  description: "Un club para descubrir, comprar y vivir el café colombiano.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Club del Café | Bogotá",
    description: "Un club para descubrir, comprar y vivir el café colombiano.",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es"><body>{children}</body></html>;
}
