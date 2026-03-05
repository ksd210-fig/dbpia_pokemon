import "./globals.css";
import "galmuri/dist/galmuri.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Press_Start_2P } from "next/font/google";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Simple Turn Battle",
  description: "Classic-style turn-based battle demo",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko" className={pressStart2P.className}>
      <body>{children}</body>
    </html>
  );
}
