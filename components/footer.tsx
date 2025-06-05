import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-700">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src="/logo.png" alt="SANT Logo" width={30} height={30} className="filter invert brightness-0" />
              <span className="text-xl font-bold text-sant-light">SANT</span>
            </Link>
            <p className="text-sm">Precisão e estilo para todos os momentos.</p>
          </div>
          <div>
            <h5 className="font-semibold text-sant-light mb-3">Institucional</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-sant-accent">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-sant-accent">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-sant-accent">
                  Carreiras
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-sant-accent">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sant-light mb-3">Ajuda</h5>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/faq" className="hover:text-sant-accent">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-sant-accent">
                  Envio e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-sant-accent">
                  Rastrear Pedido
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-sant-light mb-3">Siga-nos</h5>
            <div className="flex space-x-4">
              <Link href="#" aria-label="Facebook" className="hover:text-sant-accent">
                <Facebook size={20} />
              </Link>
              <Link href="#" aria-label="Instagram" className="hover:text-sant-accent">
                <Instagram size={20} />
              </Link>
              <Link href="#" aria-label="Twitter" className="hover:text-sant-accent">
                <Twitter size={20} />
              </Link>
              <Link href="#" aria-label="Youtube" className="hover:text-sant-accent">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} SANT Relógios. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
