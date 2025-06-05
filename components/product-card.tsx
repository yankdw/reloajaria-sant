"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"
import type { Product } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/contexts/cart-context" // NOVO
import { useToast } from "@/components/ui/use-toast" // NOVO

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart() // NOVO
  const { toast } = useToast() // NOVO

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const handleAddToCart = () => {
    // NOVO
    if (product.stockQuantity > 0) {
      addToCart(product, 1)
    } else {
      toast({
        title: "Produto Esgotado",
        description: `${product.name} não está disponível em estoque.`,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-sant-accent/20 hover:shadow-xl group flex flex-col">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-full h-64 md:h-72">
          <Image
            src={product.imageUrls[0] || "/placeholder.svg?width=400&height=300&query=watch"}
            alt={product.name}
            fill // Changed from layout="fill" objectFit="cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {product.stockQuantity < 5 && product.stockQuantity > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2">
              Poucas Unidades!
            </Badge>
          )}
          {product.stockQuantity === 0 && (
            <Badge variant="outline" className="absolute top-2 right-2 bg-black text-white">
              Esgotado
            </Badge>
          )}
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        {product.brand && (
          <span className="text-xs text-sant-accent uppercase font-semibold mb-1">{product.brand}</span>
        )}
        <h3 className="text-lg font-semibold text-sant-light mb-2 truncate group-hover:text-sant-accent">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="text-xl font-bold text-sant-accent mb-3">{formatPrice(product.price)}</p>

        <div className="mt-auto flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            className="flex-1 border-sant-accent text-sant-accent hover:bg-sant-accent hover:text-sant-dark"
            asChild
          >
            <Link href={`/products/${product.id}`}>
              <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
            </Link>
          </Button>
          <Button
            className="flex-1 bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark"
            disabled={product.stockQuantity === 0}
            onClick={handleAddToCart} // NOVO
          >
            <ShoppingCart className="mr-2 h-4 w-4" /> {product.stockQuantity === 0 ? "Esgotado" : "Adicionar"}
          </Button>
        </div>
      </div>
    </div>
  )
}

ProductCard.defaultProps = {
  product: {
    id: "default-product",
    sellerId: "default-seller",
    name: "Relógio Padrão",
    price: 999.99,
    imageUrls: ["/placeholder.svg?width=400&height=300"],
    brand: "SANT Default",
    stockQuantity: 10,
    description: "Descrição padrão do produto.",
    categories: [],
  },
}
