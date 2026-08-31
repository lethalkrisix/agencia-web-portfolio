import type { Metadata } from "next";
import { Space_Grotesk, Sora } from "next/font/google";
import Cursor from "@/components/cursor";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// NOTE: anclora.dev is a placeholder domain (matched to the contact email,
// hola@anclora.dev) — swap for the real production domain before launch.
const SITE_URL = "https://anclora.dev";
const SITE_TITLE = "Anclora — Mantenimiento web con IA";
const SITE_DESCRIPTION =
  "Anclora mantiene y hace crecer tu web con IA: siempre al día, siempre rindiendo, sin sorpresas.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "Anclora",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${sora.variable} h-full antialiased`}>
      <body
        className="bg-background text-foreground flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="bg-accent sr-only rounded-full px-4 py-2 text-sm font-semibold text-[#0a0a0f] focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100]"
        >
          Saltar al contenido
        </a>
        <Cursor />
        {children}
      </body>
    </html>
  );
}
