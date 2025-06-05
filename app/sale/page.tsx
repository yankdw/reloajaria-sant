import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Percent } from "lucide-react"

export default function SalePage() {
  return (
    <div className="text-center py-20">
      <Percent className="mx-auto h-24 w-24 text-sant-accent mb-6" />
      <h1 className="text-4xl font-bold text-sant-light mb-6">Promoções Imperdíveis!</h1>
      <p className="text-xl text-gray-400 mb-8">Página em construção. Fique de olho nas nossas ofertas especiais!</p>
      <Link href="/">
        <Button size="lg" className="bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Home
        </Button>
      </Link>
    </div>
  )
}
