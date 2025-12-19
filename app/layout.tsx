import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ave Forge - Game Dashboard",
  description: "Statistics dashboard for Ave Forge crypto game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}

