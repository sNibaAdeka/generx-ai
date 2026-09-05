import type { Metadata } from "next";
import "./globals.css";
import "./clinic.css";
import "./more.css";
import "./state.css";
import "./auth-state.css";

export const metadata: Metadata = {
  title: "GenerX — Clinical decision support",
  description: "Pharmacogenomics made legible for clinical teams.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
