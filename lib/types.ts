export type UserRole = "ADMIN" | "BUYER" | "SELLER"

export interface User {
  id: string // UUID
  email: string
  fullName?: string
  role: UserRole
  avatarUrl?: string // NOVO
  // passwordHash should not be exposed to client
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
}

export interface Category {
  id: number // Serial
  name: string
  slug: string
  imageUrl?: string
  createdAt?: string // ISO Date string
}

export interface Product {
  id: string // UUID
  sellerId: string // User ID of the seller (User with SELLER role)
  name: string
  description?: string
  price: number // Decimal
  stockQuantity: number
  brand?: string
  model?: string
  caseMaterial?: string
  strapMaterial?: string
  waterResistance?: string
  imageUrls: string[] // Array of image URLs
  categories?: Pick<Category, "id" | "name" | "slug">[] // Populated if needed
  createdAt?: string // ISO Date string
  updatedAt?: string // ISO Date string
}

export interface SellerProfile {
  userId: string // Foreign Key to users.id
  storeName: string
  storeDescription?: string
  storeLogoUrl?: string
  createdAt?: string // ISO Date string
  updatedAt?: string // ISO Date string
}

export interface Order {
  id: string // UUID
  buyerId: string // User ID of the buyer (User with BUYER role)
  totalAmount: number // Decimal
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
  shippingAddress: any // JSONB, define more strictly later
  billingAddress: any // JSONB, define more strictly later
  createdAt: string // ISO Date string
  updatedAt: string // ISO Date string
  items?: OrderItem[] // Populated if needed
}

export interface OrderItem {
  id: number // Serial
  orderId: string // Foreign Key to orders.id
  productId: string // Foreign Key to products.id
  quantity: number
  priceAtPurchase: number // Decimal (price of product at the time of order)
  productSnapshot?: Pick<Product, "name" | "brand" | "imageUrls"> // Denormalized for easier display in order history
}

// NOVO
export interface CartItem extends Product {
  quantity: number
}
