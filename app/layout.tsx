import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UCSF Chatbot Prototype",
  description: "UCSF Chatbot Prototype",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
