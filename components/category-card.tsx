import Link from "next/link"
import Image from "next/image"
import type { Category } from "@/lib/types"

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/products?category=${category.slug}`} className="group block">
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden shadow-md transition-all hover:shadow-sant-accent/30 hover:shadow-lg">
        <Image
          src={category.imageUrl || "/placeholder.svg?width=300&height=200&query=watch+category"}
          alt={category.name}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center p-2">
          <h3 className="text-xl font-semibold text-white text-center drop-shadow-md">{category.name}</h3>
        </div>
      </div>
    </Link>
  )
}

// Default props for Next.js
CategoryCard.defaultProps = {
  category: {
    id: 0,
    name: "Categoria Padrão",
    slug: "categoria-padrao",
    imageUrl: "/placeholder.svg?width=300&height=200",
  },
}
