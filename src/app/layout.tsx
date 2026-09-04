import type { Metadata } from "next";
import Link from "next/link";
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
  title: "見積書・請求書管理",
  description: "顧客情報・案件データから見積書と請求書をPDFで発行します",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-gray-900">
        <header className="border-b border-gray-200">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-4 text-sm">
            <Link href="/" className="font-bold">
              見積書・請求書管理
            </Link>
            <Link href="/cases" className="text-gray-600 hover:text-gray-900">
              案件
            </Link>
            <Link href="/customers" className="text-gray-600 hover:text-gray-900">
              顧客
            </Link>
            <Link href="/company" className="text-gray-600 hover:text-gray-900">
              会社設定
            </Link>
          </nav>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
