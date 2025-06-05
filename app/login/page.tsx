"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const success = await login(email, password)
    setIsLoading(false)
    if (success) {
      toast({ title: "Login bem-sucedido!", description: "Bem-vindo de volta!" })
      router.push("/") // Redireciona para a home ou dashboard
    } else {
      toast({
        title: "Falha no Login",
        description: "Email ou senha incorretos. Tente 'comprador@sant.com' e 'password123'.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-md bg-sant-card border-gray-700">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-sant-light">Login SANT</CardTitle>
          <CardDescription className="text-gray-400">Acesse sua conta para continuar.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sant-light">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-sant-light focus:border-sant-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sant-light">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-sant-light focus:border-sant-accent"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Link href="/forgot-password">
            <Button variant="link" className="text-sm text-sant-accent hover:text-sant-light">
              Esqueceu sua senha?
            </Button>
          </Link>
          <p className="text-sm text-gray-400">
            Não tem uma conta?{" "}
            <Link href="/register" className="font-medium text-sant-accent hover:text-sant-light">
              Cadastre-se
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
