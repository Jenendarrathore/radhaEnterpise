"use client";

import { store } from "@/redux/store";
import { SessionProvider } from "next-auth/react";
import { Provider } from "react-redux";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const theme = createTheme();

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />

        <CssBaseline />
        <Provider store={store}>
          <SessionProvider>{children}</SessionProvider>
        </Provider>
      </ThemeProvider>
    </>
  );
}
