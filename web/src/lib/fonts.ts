import { Epilogue, JetBrains_Mono, Playfair_Display } from "next/font/google";

const sans = Epilogue({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const serif = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
});

export { sans, mono, serif };
