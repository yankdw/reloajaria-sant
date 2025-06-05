import CategoryCard from "@/components/category-card"
import ProductCard from "@/components/product-card"
import type { Category, Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// Mock data - substitua pela busca de dados reais
const mockCategories: Category[] = [
  { id: 1, name: "Esportivos", slug: "esportivos", imageUrl: "/placeholder-024f5.png" },
  { id: 2, name: "Clássicos", slug: "classicos", imageUrl: "/placeholder-ojrxf.png" },
  { id: 3, name: "Smartwatches", slug: "smartwatches", imageUrl: "/smartwatch-category.png" },
  { id: 4, name: "Luxo", slug: "luxo", imageUrl: "/luxury-watch-category.png" },
]

const mockFeaturedProducts: Product[] = [
  {
    id: "1",
    sellerId: "seller1",
    name: "Cronógrafo Aviador",
    price: 1250.9,
    imageUrls: ["/placeholder-z7g1p.png"],
    brand: "SANT",
    stockQuantity: 10,
  },
  {
    id: "2",
    sellerId: "seller2",
    name: "Mergulhador Profissional",
    price: 2300.0,
    imageUrls: ["/placeholder.svg?width=400&height=300"],
    brand: "SANT Pro",
    stockQuantity: 5,
  },
  {
    id: "3",
    sellerId: "seller1",
    name: "Elegance Slim",
    price: 899.5,
    imageUrls: ["/placeholder.svg?width=400&height=300"],
    brand: "SANT",
    stockQuantity: 15,
  },
]

const mockNewArrivals: Product[] = [
  {
    id: "4",
    sellerId: "seller3",
    name: "TechMaster X1",
    price: 1750.0,
    imageUrls: ["/placeholder.svg?width=400&height=300"],
    brand: "SANT Tech",
    stockQuantity: 8,
  },
  {
    id: "5",
    sellerId: "seller2",
    name: "Vintage Gold",
    price: 3100.75,
    imageUrls: ["/placeholder.svg?width=400&height=300"],
    brand: "SANT Heritage",
    stockQuantity: 3,
  },
  {
    id: "6",
    sellerId: "seller1",
    name: "Urban Explorer",
    price: 950.0,
    imageUrls: ["/placeholder.svg?width=400&height=300"],
    brand: "SANT",
    stockQuantity: 12,
  },
]

export default function HomePage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[500px] rounded-lg overflow-hidden">
        <img
          src="/placeholder.svg?width=1200&height=500"
          alt="Banner principal SANT Relógios"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">SANT Relógios</h1>
          <p className="text-lg md:text-2xl text-gray-200 mt-4 mb-8 drop-shadow-md">
            Descubra a precisão e o estilo atemporal.
          </p>
          <Button size="lg" className="bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark font-semibold">
            Ver Coleções <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-3xl font-semibold mb-6 text-sant-light">Navegue por Categorias</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {mockCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-sant-light">Relógios em Destaque</h2>
          <Link href="/products?filter=featured">
            <Button
              variant="outline"
              className="border-sant-accent text-sant-accent hover:bg-sant-accent hover:text-sant-dark"
            >
              Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockFeaturedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-sant-light">Novidades</h2>
          <Link href="/products?filter=new">
            <Button
              variant="outline"
              className="border-sant-accent text-sant-accent hover:bg-sant-accent hover:text-sant-dark"
            >
              Ver Todos <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {mockNewArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  )
}
