import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ClientProviders from "@/components/ClientProviders";

// 与 noomoagency / meech213 外壳统一的字体（next/font 自动感知 basePath）
const druk = localFont({
  src: "../../public/fonts/DrukMedium.otf",
  variable: "--font-druk",
  display: "swap",
});
const plex = localFont({
  src: "../../public/fonts/IBMPlexMono-Medium.ttf",
  variable: "--font-plex",
  display: "swap",
});
const sauce = localFont({
  src: [
    { path: "../../public/fonts/OpenSauceOne-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/OpenSauceOne-SemiBold.ttf", weight: "600", style: "normal" },
  ],
  variable: "--font-sauce",
  display: "swap",
});

export const metadata: Metadata = {
  title: "邢亚凯 — Forge Eternity",
  description: "X 是无限可能，Y 是内心坐标，K 是永恒印记。我是邢亚凯，在有限里创造无限。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={`${druk.variable} ${plex.variable} ${sauce.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="grain" aria-hidden="true" />
        <ClientProviders />
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
