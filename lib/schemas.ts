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
  productIds: z.array(z.string()).min(1, 'Select at least one product'),
  quantities: z.array(z.coerce.number().positive()).min(1),
  paymentStatus: z.enum(['Paid', 'Pending', 'Refunded']),
  deliveryStatus: z.enum(['Pending', 'Shipped', 'Delivered', 'Canceled']),
  expectedDeliveryDate: z.coerce.date(),
  deliveryAddress: z.string().min(5, 'Address is required'),
})

export type OrderFormValues = z.infer<typeof orderFormSchema>
