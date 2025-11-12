import "./globals.css";
import { ReactNode } from "react";
import { NavBar } from "../components/NavBar";
import { Providers } from "../components/Providers";
import Footer from "../components/Footer";

export const metadata = {
  title: "Community Q&A Platform",
  description: "Collaborate, learn, and share knowledge with the community."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased" suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <NavBar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}

