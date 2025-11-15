'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft } from 'lucide-react'
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
import { productFormSchema, ProductFormValues } from '@/lib/schemas'
import { mockProducts } from '@/lib/mock-data'
import { NotificationAlert } from '@/components/notification-alert'


export default function CreateProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error'
    title: string
    description?: string
  } | null>(null)

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      price: 0,
      stock: 0,
      description: '',
      active: true,
    },
  })

  const onSubmit = async (data: ProductFormValues) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check for duplicate SKU
      if (mockProducts.some((p) => p.sku === data.sku.toUpperCase())) {
        form.setError('sku', { message: 'SKU must be unique' })
        setIsSubmitting(false)
        return
      }

      setNotification({
        type: 'success',
        title: 'Success',
        description: 'Product created successfully',
      })

      setTimeout(() => {
        router.push('/dashboard/products')
      }, 1500)
    } catch (error) {
      setNotification({
        type: 'error',
        title: 'Error',
        description: 'Failed to create product',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
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

      <Link href="/dashboard/products">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Product</h1>
        <p className="text-muted-foreground mt-1">Add a new product to your catalog</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
              <CardDescription>Enter product name and SKU</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Product Name</label>
                <Input
                  placeholder="e.g., Wireless Headphones"
                  {...form.register('name')}
                  className={form.formState.errors.name ? 'border-red-500' : ''}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">SKU</label>
                <Input
                  placeholder="e.g., TECH-001"
                  {...form.register('sku')}
                  className={form.formState.errors.sku ? 'border-red-500' : ''}
                />
                {form.formState.errors.sku && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.sku.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Category & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category & Pricing</CardTitle>
              <CardDescription>Select category and set price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={form.watch('category')}
                  onValueChange={(value) => form.setValue('category', value)}
                >
                  <SelectTrigger className={form.formState.errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Clothing">Clothing</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Price ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  {...form.register('price')}
                  className={form.formState.errors.price ? 'border-red-500' : ''}
                />
                {form.formState.errors.price && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.price.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Inventory</CardTitle>
              <CardDescription>Manage stock quantity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Stock Quantity</label>
                <Input
                  type="number"
                  placeholder="0"
                  {...form.register('stock')}
                  className={form.formState.errors.stock ? 'border-red-500' : ''}
                />
                {form.formState.errors.stock && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.stock.message}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Description</CardTitle>
              <CardDescription>Add product details (optional)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Description</label>
                <Textarea
                  placeholder="Enter product description..."
                  {...form.register('description')}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Active</label>
                <input
                  type="checkbox"
                  checked={form.watch('active')}
                  onChange={(e) => form.setValue('active', e.target.checked)}
                  className="rounded w-4 h-4"
                />
              </div>
              {form.watch('active') && (
                <Badge className="w-full justify-center bg-green-100 text-green-800">Active</Badge>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Product Name:</span>
                <span className="font-medium">{form.watch('name') || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">SKU:</span>
                <span className="font-medium">{form.watch('sku').toUpperCase() || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-medium">${(Number(form.watch('price')) || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Stock:</span>
                <span className="font-medium">{form.watch('stock') || 'N/A'}</span>
              </div>
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
              {isSubmitting ? 'Creating...' : 'Create Product'}
            </Button>
            <Link href="/dashboard/products">
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
