import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YouTube Stream Automator",
  description: "Schedule and synchronize your YouTube livestreams with single-click YAML, JSON, or Markdown imports.",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2222%22 fill=%22%23ff0000%22/><path d=%22M30 25h40a5 5 0 0 1 5 5v30a5 5 0 0 1-5 5H30a5 5 0 0 1-5-5V30a5 5 0 0 1 5-5z M45 40l15 8-15 8v-16z%22 fill=%22%23ffffff%22/><path d=%22M40 73l5-8M60 73l-5-8%22 stroke=%22%23ffffff%22 stroke-width=%226%22 stroke-linecap=%22round%22/></svg>',
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
