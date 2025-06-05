import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CollectionsPage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-sant-light mb-6">Nossas Coleções</h1>
      <p className="text-xl text-gray-400 mb-8">
        Página em construção. Em breve, você poderá explorar nossas coleções exclusivas!
      </p>
      <Link href="/">
        <Button size="lg" className="bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Home
        </Button>
      </Link>
    </div>
  )
}
