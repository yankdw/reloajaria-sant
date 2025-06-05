import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-sant-light mb-10 text-center">Entre em Contato</h1>

      <div className="grid md:grid-cols-2 gap-10 mb-12">
        <Card className="bg-sant-card border-gray-700">
          <CardHeader>
            <CardTitle className="text-xl text-sant-light">Envie uma Mensagem</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sant-light">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
                className="bg-gray-800 border-gray-600 text-sant-light focus:border-sant-accent"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-sant-light">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="bg-gray-800 border-gray-600 text-sant-light focus:border-sant-accent"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-sant-light">
                Mensagem
              </Label>
              <Textarea
                id="message"
                placeholder="Sua mensagem..."
                rows={5}
                className="bg-gray-800 border-gray-600 text-sant-light focus:border-sant-accent"
              />
            </div>
            <Button className="w-full bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark">
              Enviar Mensagem
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-sant-light">Informações de Contato</h2>
          <div className="flex items-start space-x-3">
            <Mail className="h-6 w-6 text-sant-accent mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sant-light">Email</h3>
              <p className="text-gray-400 hover:text-sant-accent cursor-pointer">contato@santrelogios.com</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Phone className="h-6 w-6 text-sant-accent mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sant-light">Telefone</h3>
              <p className="text-gray-400 hover:text-sant-accent cursor-pointer">+55 (XX) XXXXX-XXXX</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="h-6 w-6 text-sant-accent mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-sant-light">Endereço</h3>
              <p className="text-gray-400">
                Rua dos Relógios, 123, Centro
                <br />
                Cidade Elegante, UF - Brasil
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <Link href="/">
          <Button
            size="lg"
            variant="outline"
            className="border-sant-accent text-sant-accent hover:bg-sant-accent hover:text-sant-dark"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Voltar para Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
