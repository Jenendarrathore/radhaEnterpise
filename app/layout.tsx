// app/layout.tsx
import { ReactNode } from "react";
import "./globals.css";
import { GlobalProvider } from "./GlobalProvider";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <GlobalProvider>
         
          <main>{children}</main>
        </GlobalProvider>
      </body>
    </html>
  );
}
