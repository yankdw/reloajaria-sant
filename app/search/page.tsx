"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import ProductCard from "@/components/product-card"
import type { Product } from "@/lib/types"
import { searchProducts } from "@/lib/mock-data"
import { Frown } from "lucide-react"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query")
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    if (query) {
      // Simula uma busca assíncrona
      setTimeout(() => {
        setResults(searchProducts(query))
        setIsLoading(false)
      }, 500)
    } else {
      setResults([])
      setIsLoading(false)
    }
  }, [query])

  return (
    <div>
      {query && <h1 className="text-3xl font-bold text-sant-light mb-8">Resultados para: "{query}"</h1>}

      {isLoading && <p className="text-center text-xl text-gray-400 py-10">Buscando relógios...</p>}

      {!isLoading && results.length === 0 && query && (
        <div className="text-center py-20">
          <Frown className="mx-auto h-24 w-24 text-gray-500 mb-6" />
          <h2 className="text-2xl font-semibold text-sant-light mb-4">Nenhum resultado encontrado</h2>
          <p className="text-gray-400">Tente refinar sua busca ou explorar nossas categorias.</p>
        </div>
      )}

      {!isLoading && results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      {!isLoading && !query && (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold text-sant-light mb-4">O que você está procurando?</h2>
          <p className="text-gray-400">Use a barra de busca no topo para encontrar seu próximo relógio SANT.</p>
        </div>
      )}
    </div>
  )
}
