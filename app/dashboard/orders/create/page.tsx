'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { orderFormSchema, OrderFormValues } from '@/lib/schemas'
import { mockProducts } from '@/lib/mock-data'
import { NotificationAlert } from '@/components/notification-alert'

export default function CreateOrderPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    title: string
    description?: string
  } | null>(null)

  // ----------------------------
  // FORM SETUP
  // ----------------------------
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      clientName: '',
      productIds: [''],
      quantities: [1],
      paymentStatus: 'Pending',
      deliveryStatus: 'Pending',
      expectedDeliveryDate: new Date(),
      deliveryAddress: '',
    },
  })

  // ----------------------------
  // FIELD ARRAYS
  // ----------------------------
  const {
    fields: productFields,
    append: appendProduct,
    remove: removeProduct,
  } = useFieldArray({
    control: form.control,
    name: 'productIds',
  })

  const {
    fields: quantityFields,
    append: appendQuantity,
    remove: removeQuantity,
  } = useFieldArray({
    control: form.control,
    name: 'quantities',
  })

  // Keep arrays in sync
  const addProductRow = () => {
    appendProduct('')
    appendQuantity(1)
  }

  const removeProductRow = (index: number) => {
    removeProduct(index)
    removeQuantity(index)
  }

  // WATCH FORM FIELDS
  const selectedProducts = form.watch('productIds')
  const quantities = form.watch('quantities')

  // ----------------------------
  // CALCULATIONS
  // ----------------------------
  const totalAmount = selectedProducts.reduce((sum, productId, index) => {
    const product = mockProducts.find((p) => p.id === productId)
    return sum + (product?.price || 0) * (quantities[index] || 1)
  }, 0)

  const orderId = `ORD-${String(Math.floor(Math.random() * 100000)).padStart(6, '0')}`

  // ----------------------------
  // SUBMIT HANDLER
  // ----------------------------
  const onSubmit = async (data: OrderFormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setNotification({
        type: 'success',
        title: 'Success',
        description: 'Order created successfully',
      })

      setTimeout(() => {
        router.push('/dashboard/orders')
      }, 1500)
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to create order',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <NotificationAlert
          type={notification.type}
          title={notification.title}
          description={notification.description}
          onClose={() => setNotification(null)}
         autoClose={notification.type === 'success'}
          duration={notification.type === 'success' ? 1500 : 4000}
        />
      )}

      {/* Back Button */}
      <Link href="/dashboard/orders">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Order</h1>
        <p className="text-muted-foreground mt-1">Create a new customer order</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
              <CardDescription>Basic order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order ID */}
              <div>
                <label className="text-sm font-medium mb-2 block">Order ID</label>
                <Input value={orderId} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">Auto-generated</p>
              </div>

              {/* Client Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">Client Name</label>
                <Input
                  placeholder="e.g., John Doe"
                  {...form.register('clientName')}
                  className={form.formState.errors.clientName ? 'border-red-500' : ''}
                />
                {form.formState.errors.clientName && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.clientName.message}
                  </p>
                )}
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-sm font-medium mb-2 block">Delivery Address</label>
                <Textarea
                  placeholder="Enter delivery address..."
                  {...form.register('deliveryAddress')}
                  rows={3}
                  className={form.formState.errors.deliveryAddress ? 'border-red-500' : ''}
                />
                {form.formState.errors.deliveryAddress && (
                  <p className="text-xs text-red-500 mt-1">
                    {form.formState.errors.deliveryAddress.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* PRODUCTS */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Products</CardTitle>
              <CardDescription>Select products and quantities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {productFields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  {/* Product Select */}
                  <div className="flex-1">
                    <label className="text-sm font-medium mb-1 block">Product</label>
                    <Select
                      value={form.watch(`productIds.${index}`)}
                      onValueChange={(value) => form.setValue(`productIds.${index}`, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} (${product.price.toFixed(2)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="w-24">
                    <label className="text-sm font-medium mb-1 block">Qty</label>
                    <Input
                      type="number"
                      min="1"
                      {...form.register(`quantities.${index}`, { valueAsNumber: true })}
                    />
                  </div>

                  {/* Remove Row */}
                  {productFields.length > 1 && (
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProductRow(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}

              {/* Add Product Button */}
              <Button
                type="button"
                variant="outline"
                onClick={addProductRow}
                className="w-full gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </CardContent>
          </Card>

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
              <CardDescription>Set payment and delivery status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Payment Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">Payment Status</label>
                <Select
                  value={form.watch('paymentStatus')}
                  onValueChange={(value) => form.setValue('paymentStatus', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Delivery Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">Delivery Status</label>
                <Select
                  value={form.watch('deliveryStatus')}
                  onValueChange={(value) => form.setValue('deliveryStatus', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Expected Delivery Date */}
              <div>
                <label className="text-sm font-medium mb-2 block">Expected Delivery Date</label>
                <Input
                  type="date"
                  {...form.register('expectedDeliveryDate')}
                  className={
                    form.formState.errors.expectedDeliveryDate ? 'border-red-500' : ''
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                {selectedProducts.map((productId, index) => {
                  const product = mockProducts.find((p) => p.id === productId)
                  if (!product) return null

                  return (
                    <div key={index} className="flex justify-between">
                      <span className="text-muted-foreground">
                        {product.name} x{quantities[index]}
                      </span>
                      <span className="font-medium">
                        ${(product.price * quantities[index]).toFixed(2)}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Badge className="w-full justify-center">
                {selectedProducts.length} product(s)
              </Badge>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? 'Creating...' : 'Create Order'}
            </Button>
            <Link href="/dashboard/orders">
              <Button variant="outline" className="w-full" size="lg">
                Cancel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
