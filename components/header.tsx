"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ShoppingCart, UserCircle, Menu, X, LogOut, User } from "lucide-react"
import { useState, type FormEvent } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context" // NOVO
import { useCart } from "@/contexts/cart-context" // NOVO
import { useRouter } from "next/navigation" // NOVO
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // NOVO

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("") // NOVO
  const { user, logout } = useAuth() // NOVO
  const { getItemCount } = useCart() // NOVO
  const router = useRouter() // NOVO

  const navLinks = [
    { href: "/products?category=masculino", label: "Masculino" },
    { href: "/products?category=feminino", label: "Feminino" },
    { href: "/collections", label: "Coleções" },
    { href: "/sale", label: "Promoções" },
  ]

  const handleSearchSubmit = (e: FormEvent) => {
    // NOVO
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className="bg-sant-dark/80 backdrop-blur-md sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="SANT Logo" width={40} height={40} className="filter invert brightness-0" />
          <span className="text-2xl font-bold text-sant-light">SANT</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sant-light hover:text-sant-accent transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="hidden md:flex relative">
            {" "}
            {/* NOVO */}
            <Input
              type="search"
              placeholder="Buscar relógios..."
              className="pr-10 bg-gray-800 border-gray-700 text-sant-light focus:border-sant-accent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sant-accent"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>

          {/* NOVO: Dropdown de Usuário */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sant-light hover:text-sant-accent hover:bg-transparent"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl || "/placeholder.svg"}
                      alt={user.fullName || "User Avatar"}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <UserCircle className="h-6 w-6" />
                  )}
                  <span className="sr-only">Perfil do Usuário</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-sant-card border-gray-700 text-sant-light">
                <DropdownMenuLabel>Olá, {user.fullName?.split(" ")[0] || "Usuário"}!</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild className="cursor-pointer hover:!bg-gray-700">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Meu Perfil</span>
                  </Link>
                </DropdownMenuItem>
                {/* Adicionar mais itens como "Meus Pedidos" aqui */}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem onClick={logout} className="cursor-pointer hover:!bg-gray-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="text-sant-light hover:text-sant-accent hover:bg-transparent"
            >
              <Link href="/login">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">Login</span>
              </Link>
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-sant-light hover:text-sant-accent hover:bg-transparent relative"
          >
            <Link href="/cart">
              <ShoppingCart className="h-6 w-6" />
              <span className="sr-only">Carrinho</span>
              {getItemCount() > 0 && ( // NOVO
                <span className="absolute -top-1 -right-1 bg-sant-accent text-sant-dark text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {getItemCount()}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-sant-light hover:text-sant-accent hover:bg-transparent"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-sant-dark border-t border-gray-700">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <form onSubmit={handleSearchSubmit} className="flex relative">
              {" "}
              {/* NOVO */}
              <Input
                type="search"
                placeholder="Buscar relógios..."
                className="pr-10 bg-gray-800 border-gray-700 text-sant-light focus:border-sant-accent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sant-accent"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sant-light hover:text-sant-accent transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
