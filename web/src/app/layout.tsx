import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { sans } from "@/lib/fonts";

export const metadata: Metadata = {
  title: "Inventaris Desa",
  description: "Manajemen inventaris desa yang efisien dan terorganisir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sans.variable} ${sans.className} antialiased`}
      >
        <ThemeProvider
          attribute={`class`}
          defaultTheme={"system"}
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
