import "./globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PTK Schedule Viewer",
  description: "Check the school schedule for PathumThepWittayakarn School",
  openGraph: {
    title: "PTK Schedule Viewer",
    description: "Check the school schedule for PathumThepWittayakarn School",
    url: "https://ptk-schedule-viewer.vercel.app", // Replace with your real domain
    siteName: "PTK Schedule Viewer",
    images: [
      {
        url: "/preview-image.png", // Replace with the actual image URL
        width: 1200,
        height: 630,
        alt: "PTK Schedule Viewer Preview",
      },
    ],
    type: "website",
    locale: "th_TH",
  },
  twitter: {
    card: "summary_large_image",
    title: "PTK Schedule Viewer",
    description: "Check the school schedule for PathumThepWittayakarn School",
    images: ["/preview-image.png"], // Replace with the actual image URL
  },
};

const anakotmaiFont = localFont({
  src: [
    {
      path: "/fonts/anakotmai-light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "/fonts/anakotmai-medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "/fonts/anakotmai-bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={anakotmaiFont.className}>
      <body className="bg-[#191919] text-white min-h-screen">
        <div className="fixed inset-0 bg-grid-white/25 pointer-events-none"></div>
        <main className="container mx-auto min-h-screen flex flex-col bg-transparent relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
