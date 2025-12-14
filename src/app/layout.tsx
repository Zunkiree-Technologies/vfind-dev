import type { Metadata } from "next";
import { Inter, Montserrat, Open_Sans } from "next/font/google";
import "./globals.css";
import ThemeWrapper from "./ThemeWrapper";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "VFind | Nursing Jobs Australia - Get Discovered by Healthcare Employers",
  description: "Join Australia's nursing talent network. Create your free profile and let top healthcare employers find you. Visa sponsorship opportunities for international nurses. Hospitals, aged care & clinics hiring now.",
  keywords: "nursing jobs Australia, healthcare jobs, nurse recruitment, visa sponsorship nursing, international nurses Australia, aged care jobs, hospital jobs, AHPRA registered nurses",
  openGraph: {
    title: "VFind | Nursing Jobs Australia - Get Discovered by Healthcare Employers",
    description: "Create your free profile and let Australia's top healthcare recruiters find you. Visa sponsorship opportunities available.",
    type: "website",
    locale: "en_AU",
    siteName: "VFind",
  },
  twitter: {
    card: "summary_large_image",
    title: "VFind | Nursing Jobs Australia",
    description: "Get discovered by top healthcare employers. Free profile for nurses.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${montserrat.variable} ${openSans.variable} antialiased font-sans`}
        style={{ fontFamily: "var(--font-inter), var(--font-open-sans), system-ui, sans-serif" }}
      >
        <AuthProvider>
          <ThemeWrapper>{children}</ThemeWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
