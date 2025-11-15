// src/lib/mock-data.ts
import { z } from 'zod'
import { productFormSchema } from '@/lib/schemas'
import type { Order, OrderItem } from '@/lib/schemas'

/* --------------------------- PRODUCT TYPE --------------------------- */
export type Product = z.infer<typeof productFormSchema> & {
  id: string
  createdAt: Date
  image?: string
}

/* --------------------------- PRODUCT MOCKS -------------------------- */
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    sku: 'TECH-001',
    category: 'Electronics',
    price: 129.99,
    stock: 45,
    description: 'High-quality wireless headphones with noise cancellation',
    active: true,
    createdAt: new Date('2024-10-01'),
    image: '/wireless-headphones.png',
  },
  {
    id: '2',
    name: 'Office Chair',
    sku: 'FURN-001',
    category: 'Furniture',
    price: 249.99,
    stock: 8,
    description: 'Ergonomic office chair with lumbar support',
    active: true,
    createdAt: new Date('2024-10-02'),
    image: '/ergonomic-office-chair.png',
  },
  {
    id: '3',
    name: 'Cotton T-Shirt',
    sku: 'CLOTH-001',
    category: 'Clothing',
    price: 29.99,
    stock: 150,
    description: '100% organic cotton t-shirt',
    active: true,
    createdAt: new Date('2024-10-03'),
    image: '/cotton-t-shirt.jpg',
  },
]

/* --------------------------- ORDER MOCKS ---------------------------- */
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    clientName: 'John Doe',
    orderItems: [{ productId: '1', quantity: 2 }],
    totalAmount: 259.98,
    paymentStatus: 'Paid',
    deliveryStatus: 'Delivered',
    deliveryProgress: 100,
    expectedDeliveryDate: new Date('2024-10-15'),
    deliveryAddress: '123 Main St, City, Country',
    customerFeedback: 'happy',
    createdAt: new Date('2024-10-01'),
  },
  {
    id: 'ORD-002',
    clientName: 'Jane Smith',
    orderItems: [{ productId: '2', quantity: 1 }],
    totalAmount: 249.99,
    paymentStatus: 'Pending',
    deliveryStatus: 'Shipped',
    deliveryProgress: 65,
    expectedDeliveryDate: new Date('2024-10-22'),
    deliveryAddress: '456 Oak Ave, City, Country',
    customerFeedback: 'neutral',
    createdAt: new Date('2024-10-05'),
  },
  {
    id: 'ORD-003',
    clientName: 'Mike Johnson',
    orderItems: [
      { productId: '1', quantity: 1 },
      { productId: '3', quantity: 3 },
    ],
    totalAmount: 219.96,
    paymentStatus: 'Paid',
    deliveryStatus: 'Shipped',
    deliveryProgress: 45,
    expectedDeliveryDate: new Date('2024-10-25'),
    deliveryAddress: '789 Pine Rd, City, Country',
    customerFeedback: 'happy',
    createdAt: new Date('2024-10-08'),
  },
  {
    id: 'ORD-004',
    clientName: 'Sarah Williams',
    orderItems: [{ productId: '2', quantity: 2 }],
    totalAmount: 499.98,
    paymentStatus: 'Refunded',
    deliveryStatus: 'Canceled',
    deliveryProgress: 0,
    expectedDeliveryDate: new Date('2024-10-20'),
    deliveryAddress: '321 Elm St, City, Country',
    customerFeedback: 'unhappy',
    createdAt: new Date('2024-10-10'),
  },
]