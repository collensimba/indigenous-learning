import type { Metadata } from "next";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./globals.css";
import BootstrapClient from "./components/BootstrapClient";

export const metadata: Metadata = {
  title: "Dandaro - Indigenous Language Learning",
  description: "AI-powered learning support for Zimbabwean indigenous languages",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <BootstrapClient />
      </body>
    </html>
  );
}