// src/lib/schemas.ts
import { z } from 'zod'

export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').min(3, 'Name must be at least 3 characters'),
  sku: z.string().min(1, 'SKU is required').toUpperCase(),
  category: z.string().min(1, 'Category is required'),
  price: z.coerce.number().positive('Price must be positive'),
  stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
  description: z.string().optional(),
  active: z.boolean().default(true),
})

export type ProductFormValues = z.infer<typeof productFormSchema>

export const orderFormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  orderItems: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product is required'),
        quantity: z.coerce.number().positive('Quantity must be at least 1'),
      })
    )
    .min(1, 'Select at least one product'),
  paymentStatus: z.enum(['Paid', 'Pending', 'Refunded']),
  deliveryStatus: z.enum(['Pending', 'Shipped', 'Delivered', 'Canceled']),
  expectedDeliveryDate: z.coerce.date(),
  deliveryAddress: z.string().min(5, 'Address is required'),
})

export type OrderFormValues = z.infer<typeof orderFormSchema>

export interface OrderItem {
  productId: string
  quantity: number
}

export interface Order extends Omit<OrderFormValues, 'orderItems'> {
  id: string
  orderItems: OrderItem[]
  totalAmount: number
  deliveryProgress: number
  customerFeedback: 'happy' | 'neutral' | 'unhappy'
  createdAt: Date
}