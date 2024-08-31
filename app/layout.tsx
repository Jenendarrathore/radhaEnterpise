// app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";
import { GlobalProvider } from "./GlobalProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
          <header>
            <nav>
              <a href="/clients">Clients</a>
              <a href="/invoices">Invoices</a>
              <a href="/auth/login">Login</a>
            </nav>
          </header>
          <main>{children}</main>
        </GlobalProvider>
      </body>
    </html>
  );
}
