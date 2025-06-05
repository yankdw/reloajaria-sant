"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { CartItem, Product } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const { toast } = useToast()

  useEffect(() => {
    const storedCart = localStorage.getItem("sant-cart")
    if (storedCart) {
      setCartItems(JSON.parse(storedCart))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("sant-cart", JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = useCallback(
    (product: Product, quantity = 1) => {
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === product.id)
        if (existingItem) {
          if (existingItem.quantity + quantity > product.stockQuantity) {
            toast({
              title: "Estoque Insuficiente",
              description: `Não é possível adicionar mais ${product.name}. Quantidade máxima em estoque atingida.`,
              variant: "destructive",
            })
            return prevItems.map((item) =>
              item.id === product.id ? { ...item, quantity: product.stockQuantity } : item,
            )
          }
          toast({
            title: "Produto Atualizado",
            description: `${product.name} quantidade atualizada no carrinho.`,
          })
          return prevItems.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
          )
        } else {
          if (quantity > product.stockQuantity) {
            toast({
              title: "Estoque Insuficiente",
              description: `Não é possível adicionar ${quantity} unidades de ${product.name}. Apenas ${product.stockQuantity} em estoque.`,
              variant: "destructive",
            })
            return [...prevItems, { ...product, quantity: product.stockQuantity }]
          }
          toast({
            title: "Produto Adicionado",
            description: `${product.name} foi adicionado ao carrinho.`,
          })
          return [...prevItems, { ...product, quantity }]
        }
      })
    },
    [toast],
  )

  const removeFromCart = useCallback(
    (productId: string) => {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
      toast({
        title: "Produto Removido",
        description: "O produto foi removido do carrinho.",
      })
    },
    [toast],
  )

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      setCartItems((prevItems) => {
        const productInCart = prevItems.find((item) => item.id === productId)
        if (productInCart && quantity > productInCart.stockQuantity) {
          toast({
            title: "Estoque Insuficiente",
            description: `Quantidade máxima para ${productInCart.name} é ${productInCart.stockQuantity}.`,
            variant: "destructive",
          })
          return prevItems.map((item) =>
            item.id === productId ? { ...item, quantity: productInCart.stockQuantity } : item,
          )
        }
        return prevItems
          .map((item) => (item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item))
          .filter((item) => item.quantity > 0) // Remove if quantity is 0
      })
    },
    [toast],
  )

  const clearCart = useCallback(() => {
    setCartItems([])
    toast({
      title: "Carrinho Limpo",
      description: "Todos os itens foram removidos do carrinho.",
    })
  }, [toast])

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cartItems])

  const getItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
