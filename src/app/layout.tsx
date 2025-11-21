import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ESportBet - Mobile Esport Betting Platform",
  description: "Bet on your favorite esport matches, track stats, and win amazing goodies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-black text-white font-sans">
        <AuthProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 lg:ml-64">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
