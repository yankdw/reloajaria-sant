"use client"

import type React from "react"

import { useState, useEffect, type ChangeEvent } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Camera, Save } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ProfilePage() {
  const { user, updateUserProfile, logout } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [fullName, setFullName] = useState(user?.fullName || "")
  const [email, setEmail] = useState(user?.email || "")
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "/default-avatar.png")
  // const [avatarFile, setAvatarFile] = useState<File | null>(null); // Para upload real

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setFullName(user.fullName || "")
      setEmail(user.email || "")
      setAvatarPreview(user.avatarUrl || "/default-avatar.png")
    }
  }, [user, router])

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      // setAvatarFile(file); // Para upload real
      setAvatarPreview(URL.createObjectURL(file)) // Preview local
      // Simular atualização no contexto (em app real, seria após upload)
      // Para este exemplo, vamos apenas atualizar a URL no contexto com a URL do blob local
      // Isso não persistirá de verdade a imagem, apenas o caminho temporário.
      updateUserProfile({ avatarUrl: URL.createObjectURL(file) })
      toast({ title: "Prévia da foto atualizada!", description: "Salve as alterações para confirmar." })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      updateUserProfile({ fullName, email /*, avatarUrl: (se o upload fosse real, a URL retornada) */ })
      toast({ title: "Perfil Atualizado!", description: "Suas informações foram salvas." })
    }
  }

  if (!user) {
    return null // ou um loader
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-sant-card border-gray-700">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-sant-light">Meu Perfil</CardTitle>
          <CardDescription className="text-gray-400">Gerencie suas informações pessoais.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Image
                  src={avatarPreview || "/placeholder.svg"}
                  alt="Avatar do Usuário"
                  width={128}
                  height={128}
                  className="rounded-full object-cover border-2 border-sant-accent"
                />
                <Label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-sant-accent text-sant-dark p-2 rounded-full cursor-pointer hover:bg-sant-secondary-accent"
                >
                  <Camera className="h-5 w-5" />
                  <span className="sr-only">Mudar foto</span>
                </Label>
                <Input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sant-light">
                Nome Completo
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-sant-light focus:border-sant-accent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sant-light">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                // disabled // Geralmente email não é editável ou requer confirmação
                className="bg-gray-800 border-gray-700 text-sant-light focus:border-sant-accent"
              />
            </div>

            {/* Adicionar campo para senha antiga e nova senha se quiser permitir mudança */}

            <Button type="submit" className="w-full bg-sant-accent hover:bg-sant-secondary-accent text-sant-dark">
              <Save className="mr-2 h-4 w-4" /> Salvar Alterações
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
