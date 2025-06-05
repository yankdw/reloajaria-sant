"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/contexts/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart, getItemCount } = useCart()

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  if (getItemCount() === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingBag className="mx-auto h-24 w-24 text-gray-500 mb-6" />
        <h1 className="text-3xl font-semibold text-sant-light mb-4">Seu carrinho está vazio</h1>
        <p className="text-gray-400 mb-8">
          Parece que você ainda não adicionou nenhum relógio incrível ao seu carrinho.
        </p>
        <Link href="/">
          <Button size="lg" className="bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark">
            <ArrowLeft className="mr-2 h-5 w-5" /> Explorar Relógios
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-sant-light mb-8">
        Seu Carrinho ({getItemCount()} {getItemCount() > 1 ? "itens" : "item"})
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col sm:flex-row items-center p-4 gap-4 bg-sant-card border-gray-700"
            >
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={item.imageUrls[0] || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <Link href={`/products/${item.id}`}>
                  <h2 className="text-lg font-semibold text-sant-light hover:text-sant-accent">{item.name}</h2>
                </Link>
                <p className="text-sm text-gray-400">{item.brand}</p>
                <p className="text-md font-semibold text-sant-accent mt-1">{formatPrice(item.price)}</p>
              </div>
              <div className="flex items-center space-x-2 sm:ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="hover:bg-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value))}
                  min="1"
                  max={item.stockQuantity}
                  className="w-16 text-center bg-gray-800 border-gray-600 text-sant-light"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-400 hover:bg-gray-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </Card>
          ))}
          <Button
            variant="outline"
            onClick={clearCart}
            className="border-red-500 text-red-500 hover:bg-red-500 hover:text-sant-dark mt-4"
          >
            Limpar Carrinho
          </Button>
        </div>

        <div className="md:col-span-1">
          <Card className="bg-sant-card border-gray-700 sticky top-24">
            <CardHeader>
              <CardTitle className="text-xl text-sant-light">Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Frete</span>
                <span>Grátis</span> {/* Mocked */}
              </div>
              <hr className="border-gray-600" />
              <div className="flex justify-between text-xl font-bold text-sant-light">
                <span>Total</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark">
                Finalizar Compra
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
