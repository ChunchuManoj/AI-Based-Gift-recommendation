"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
// ❌ This will fail in 0.2.1

export function ThemeProvider({
  children,
  ...props
}: React.PropsWithChildren<any>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
