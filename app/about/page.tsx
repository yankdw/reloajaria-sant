import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Info } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <Info className="mx-auto h-20 w-20 text-sant-accent mb-6" />
      <h1 className="text-4xl font-bold text-sant-light mb-6">Sobre a SANT Relógios</h1>
      <p className="text-lg text-gray-300 mb-4 leading-relaxed">
        Na SANT, acreditamos que um relógio é mais do que um simples acessório – é uma declaração de estilo, uma marca
        de precisão e um companheiro para a vida. Fundada com a paixão pela horologia e um compromisso com a excelência,
        nossa missão é oferecer relógios que combinam design atemporal com tecnologia de ponta.
      </p>
      <p className="text-lg text-gray-300 mb-8 leading-relaxed">
        Cada peça em nossa coleção é cuidadosamente selecionada ou projetada, refletindo nossa dedicação à qualidade,
        durabilidade e estética sofisticada. Seja você um aventureiro, um profissional ou um entusiasta da moda, temos o
        relógio perfeito para cada momento da sua jornada.
      </p>
      <Link href="/">
        <Button size="lg" className="bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark">
          <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Home
        </Button>
      </Link>
    </div>
  )
}
