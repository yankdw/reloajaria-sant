import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context" // NOVO
import { CartProvider } from "@/contexts/cart-context" // NOVO
import { Toaster } from "@/components/ui/toaster" // NOVO

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SANT Relógios",
  description: "Sua loja de relógios premium.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {" "}
            {/* NOVO */}
            <CartProvider>
              {" "}
              {/* NOVO */}
              <div className="flex flex-col min-h-screen bg-sant-dark text-sant-light">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
                <Footer />
                <Toaster /> {/* NOVO */}
              </div>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
