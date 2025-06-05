import type { Product, Category, User } from "./types"

export const mockUser: User = {
  id: "user-123",
  email: "comprador@sant.com",
  fullName: "João Silva",
  role: "BUYER",
  avatarUrl: "/default-avatar.png",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockCategories: Category[] = [
  { id: 1, name: "Esportivos", slug: "esportivos", imageUrl: "/placeholder.svg?width=300&height=200" },
  { id: 2, name: "Clássicos", slug: "classicos", imageUrl: "/placeholder.svg?width=300&height=200" },
  { id: 3, name: "Smartwatches", slug: "smartwatches", imageUrl: "/smartwatch-category.png" },
  { id: 4, name: "Luxo", slug: "luxo", imageUrl: "/luxury-watch-category.png" },
  { id: 5, name: "Femininos", slug: "femininos", imageUrl: "/placeholder.svg?width=300&height=200" },
  { id: 6, name: "Masculinos", slug: "masculinos", imageUrl: "/placeholder.svg?width=300&height=200" },
]

export const mockProducts: Product[] = [
  {
    id: "1",
    sellerId: "seller1",
    name: "Cronógrafo Aviador Pro",
    description:
      "Um relógio robusto e elegante para o aventureiro moderno. Caixa de aço inoxidável, pulseira de couro genuíno e movimento de quartzo suíço.",
    price: 1250.9,
    imageUrls: [
      "/placeholder-z7g1p.png",
      "/placeholder.svg?width=600&height=600",
      "/placeholder.svg?width=600&height=600",
    ],
    brand: "SANT Pilot",
    stockQuantity: 10,
    categories: [mockCategories[0], mockCategories[5]],
    model: "AV-4058",
    caseMaterial: "Aço Inoxidável",
    strapMaterial: "Couro Genuíno",
    waterResistance: "10 ATM",
  },
  {
    id: "2",
    sellerId: "seller2",
    name: "Mergulhador Profissional 300M",
    description:
      "Projetado para as profundezas, este relógio de mergulho combina funcionalidade e estilo. Válvula de escape de hélio e bezel giratório unidirecional.",
    price: 2300.0,
    imageUrls: ["/placeholder.svg?width=400&height=300", "/placeholder.svg?width=600&height=600"],
    brand: "SANT DeepSea",
    stockQuantity: 5,
    categories: [mockCategories[0], mockCategories[5]],
    model: "DS-300",
    caseMaterial: "Titânio",
    strapMaterial: "Borracha",
    waterResistance: "30 ATM",
  },
  {
    id: "3",
    sellerId: "seller1",
    name: "Elegance Slim Clássico",
    description:
      "Um design minimalista e atemporal, perfeito para ocasiões formais. Mostrador limpo e pulseira de malha de aço.",
    price: 899.5,
    imageUrls: ["/placeholder.svg?width=400&height=300", "/placeholder.svg?width=600&height=600"],
    brand: "SANT Classic",
    stockQuantity: 15,
    categories: [mockCategories[1], mockCategories[5]],
    model: "CL-1020",
    caseMaterial: "Aço Inoxidável Polido",
    strapMaterial: "Malha de Aço",
    waterResistance: "5 ATM",
  },
  {
    id: "4",
    sellerId: "seller3",
    name: "TechMaster X1 Smartwatch",
    description:
      "O futuro no seu pulso. GPS, monitoramento cardíaco, NFC para pagamentos e uma vasta gama de aplicativos.",
    price: 1750.0,
    imageUrls: ["/placeholder.svg?width=400&height=300", "/placeholder.svg?width=600&height=600"],
    brand: "SANT Tech",
    stockQuantity: 8,
    categories: [mockCategories[2]],
    model: "TM-X1",
    caseMaterial: "Alumínio Aeroespacial",
    strapMaterial: "Silicone",
    waterResistance: "IP68",
  },
  {
    id: "5",
    sellerId: "seller2",
    name: "Vintage Gold Edição Limitada",
    description:
      "Uma peça de colecionador, banhada a ouro 18k com movimento automático suíço. Apenas 100 unidades produzidas.",
    price: 7100.75,
    imageUrls: ["/placeholder.svg?width=400&height=300", "/placeholder.svg?width=600&height=600"],
    brand: "SANT Heritage",
    stockQuantity: 3,
    categories: [mockCategories[3], mockCategories[1]],
    model: "HG-18K",
    caseMaterial: "Aço Banhado a Ouro 18k",
    strapMaterial: "Couro de Crocodilo",
    waterResistance: "3 ATM",
  },
  {
    id: "6",
    sellerId: "seller1",
    name: "Urban Explorer Feminino",
    description: "Estilo e funcionalidade para a mulher moderna. Design elegante com toques esportivos.",
    price: 950.0,
    imageUrls: ["/placeholder.svg?width=400&height=300", "/placeholder.svg?width=600&height=600"],
    brand: "SANT Urban",
    stockQuantity: 12,
    categories: [mockCategories[0], mockCategories[4]],
    model: "UE-F20",
    caseMaterial: "Aço Rosé Gold",
    strapMaterial: "Nylon Balístico",
    waterResistance: "10 ATM",
  },
]

export const findProductById = (id: string): Product | undefined => {
  return mockProducts.find((p) => p.id === id)
}

export const searchProducts = (query: string): Product[] => {
  if (!query) return mockProducts.slice(0, 6) // Return some products if query is empty
  const lowerCaseQuery = query.toLowerCase()
  return mockProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(lowerCaseQuery) ||
      (product.brand && product.brand.toLowerCase().includes(lowerCaseQuery)) ||
      (product.description && product.description.toLowerCase().includes(lowerCaseQuery)),
  )
}
