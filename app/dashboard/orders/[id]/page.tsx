'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { mockOrders, mockProducts } from '@/lib/mock-data'

interface OrderDetailsPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const order = mockOrders.find((o) => o.id === params.id)

  if (!order) {
    return (
      <div className="space-y-6">
        <Link href="/dashboard/orders">
          <Button variant="ghost" className="gap-2 -ml-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Orders
          </Button>
        </Link>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Order not found</h2>
        </div>
      </div>
    )
  }

  const initials = order.clientName.split(' ').map((n) => n[0]).join('').toUpperCase()
  const products = order.productIds.map((id, index) => ({
    product: mockProducts.find((p) => p.id === id),
    quantity: order.quantities[index],
  }))

  return (
    <div className="space-y-6">
      <Link href="/dashboard/orders">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Button>
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order {order.id}</h1>
          <p className="text-muted-foreground mt-1">Created {order.createdAt.toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Order Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order ID</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{order.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge
                    className={
                      order.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : order.paymentStatus === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Status</p>
                  <Badge className="bg-blue-100 text-blue-800">{order.deliveryStatus}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <CardTitle>Client Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-100 text-blue-800">{initials}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Client Name</p>
                    <p className="font-medium">{order.clientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Delivery Address</p>
                    <p className="font-medium">{order.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>{products.length} product(s) in this order</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.product?.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">x{item.quantity}</p>
                      <p className="text-sm text-muted-foreground">${(item.product?.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Total */}
          <Card>
            <CardHeader>
              <CardTitle>Order Total</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${(order.totalAmount || 0).toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>${(order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Expected Date</p>
                <p className="font-medium">{order.expectedDeliveryDate.toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Progress</p>
                <p className="font-medium">{order.deliveryProgress}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Feedback</p>
                <p className="text-lg">
                  {order.customerFeedback === 'happy' ? '😊' : order.customerFeedback === 'neutral' ? '😐' : '😞'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
