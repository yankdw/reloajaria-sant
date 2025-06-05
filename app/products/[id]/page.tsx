"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import { findProductById } from "@/lib/mock-data"
import type { Product } from "@/lib/types"
import { ArrowLeft, ShoppingCart, Star, Minus, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import ProductCard from "@/components/product-card" // Para produtos relacionados
import { mockProducts } from "@/lib/mock-data" // Para produtos relacionados

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchedProduct = findProductById(params.id)
    if (fetchedProduct) {
      setProduct(fetchedProduct)
      setSelectedImage(fetchedProduct.imageUrls[0])
    }
  }, [params.id])

  if (!product) {
    return (
      <div className="text-center py-10">
        <p className="text-xl">Produto não encontrado.</p>
        <Link href="/" className="mt-4 inline-block">
          <Button
            variant="outline"
            className="border-sant-accent text-sant-accent hover:bg-sant-accent hover:text-sant-dark"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Home
          </Button>
        </Link>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (quantity > product.stockQuantity) {
      toast({
        title: "Estoque Insuficiente",
        description: `Apenas ${product.stockQuantity} unidades de ${product.name} disponíveis.`,
        variant: "destructive",
      })
      setQuantity(product.stockQuantity)
      return
    }
    if (quantity > 0) {
      addToCart(product, quantity)
    }
  }

  const relatedProducts = mockProducts
    .filter(
      (p) =>
        p.id !== product.id && p.categories?.some((cat) => product.categories?.map((pc) => pc.slug).includes(cat.slug)),
    )
    .slice(0, 3)

  return (
    <div className="space-y-12">
      <div className="mb-4">
        <Link href="/" className="inline-flex items-center text-sant-accent hover:text-sant-light">
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para Loja
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-700">
            <Image
              src={selectedImage || "/placeholder.svg?width=600&height=600&query=watch"}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
              priority
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {product.imageUrls.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(imgUrl)}
                className={`relative aspect-square rounded-md overflow-hidden border-2 ${selectedImage === imgUrl ? "border-sant-accent" : "border-gray-700 hover:border-gray-500"}`}
              >
                <Image
                  src={imgUrl || "/placeholder.svg"}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {product.brand && <span className="text-sm text-sant-accent uppercase font-semibold">{product.brand}</span>}
          <h1 className="text-3xl lg:text-4xl font-bold text-sant-light">{product.name}</h1>

          <div className="flex items-center space-x-2">
            <div className="flex text-sant-accent">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? "fill-current" : ""}`} />
              ))}
            </div>
            <span className="text-gray-400 text-sm">(123 avaliações)</span> {/* Mocked */}
          </div>

          <p className="text-3xl font-extrabold text-sant-accent">
            {product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </p>

          {product.stockQuantity > 0 ? (
            <Badge variant="default" className="bg-green-600 text-white">
              Em Estoque ({product.stockQuantity} unidades)
            </Badge>
          ) : (
            <Badge variant="destructive">Esgotado</Badge>
          )}

          <p className="text-gray-300 leading-relaxed">{product.description}</p>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-400">Detalhes:</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1">
              {product.model && <li>Modelo: {product.model}</li>}
              {product.caseMaterial && <li>Material da Caixa: {product.caseMaterial}</li>}
              {product.strapMaterial && <li>Material da Pulseira: {product.strapMaterial}</li>}
              {product.waterResistance && <li>Resistência à Água: {product.waterResistance}</li>}
            </ul>
          </div>

          {product.stockQuantity > 0 && (
            <div className="flex items-center space-x-4 pt-4">
              <div className="flex items-center border border-gray-700 rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="hover:bg-gray-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-sant-light">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  className="hover:bg-gray-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1 bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Adicionar ao Carrinho
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-12">
          <h2 className="text-2xl font-semibold mb-6 text-sant-light">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
