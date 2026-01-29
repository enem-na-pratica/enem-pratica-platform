import { ThemeProvider } from "./theme-provider";
import { Toaster } from "react-hot-toast";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <Toaster position="top-right" reverseOrder={false} />
      {children}
    </ThemeProvider>
  );
}
