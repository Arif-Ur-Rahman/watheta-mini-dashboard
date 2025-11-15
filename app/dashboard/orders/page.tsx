'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, MoreHorizontal, ChevronDown } from 'lucide-react'
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockOrders, mockProducts } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface Order {
  id: string
  clientName: string
  productIds: string[]
  quantities: number[]
  totalAmount: number
  paymentStatus: 'Paid' | 'Pending' | 'Refunded'
  deliveryStatus: 'Pending' | 'Shipped' | 'Delivered' | 'Canceled'
  deliveryProgress: number
  expectedDeliveryDate: Date
  deliveryAddress: string
  customerFeedback: 'happy' | 'neutral' | 'unhappy'
  createdAt: Date
}

const PaymentStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { color: string; bg: string }> = {
    Paid: { color: 'text-green-800', bg: 'bg-green-100' },
    Pending: { color: 'text-yellow-800', bg: 'bg-yellow-100' },
    Refunded: { color: 'text-red-800', bg: 'bg-red-100' },
  }

  return (
    <Badge className={cn('font-medium', variants[status]?.color, variants[status]?.bg)}>
      {status}
    </Badge>
  )
}

const DeliveryStatusBadge = ({ status }: { status: string }) => {
  const variants: Record<string, { color: string; bg: string }> = {
    Pending: { color: 'text-blue-800', bg: 'bg-blue-100' },
    Shipped: { color: 'text-purple-800', bg: 'bg-purple-100' },
    Delivered: { color: 'text-green-800', bg: 'bg-green-100' },
    Canceled: { color: 'text-red-800', bg: 'bg-red-100' },
  }

  return (
    <Badge className={cn('font-medium', variants[status]?.color, variants[status]?.bg)}>
      {status}
    </Badge>
  )
}

const FeedbackIndicator = ({ feedback }: { feedback: string }) => {
  const indicators: Record<string, string> = {
    happy: '😊',
    neutral: '😐',
    unhappy: '😞',
  }

  return <span className="text-lg">{indicators[feedback] || '😐'}</span>
}

export default function OrdersPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [orders, setOrders] = useState<Order[]>(mockOrders)

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = orders.length
    const delivered = orders.filter((o) => o.deliveryStatus === 'Delivered').length
    const pending = orders.filter((o) => o.deliveryStatus === 'Pending').length
    const avgSatisfaction = (
      orders.reduce((sum, o) => {
        if (o.customerFeedback === 'happy') return sum + 5
        if (o.customerFeedback === 'neutral') return sum + 3
        return sum + 1
      }, 0) / orders.length
    ).toFixed(1)

    return { total, delivered, pending, avgSatisfaction }
  }, [orders])

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'id',
      header: 'Order ID',
      cell: ({ row }) => (
        <Link href={`/dashboard/orders/${row.original.id}`} className="text-blue-600 hover:underline font-medium">
          {row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: 'clientName',
      header: 'Client',
      cell: ({ row }) => {
        const initials = row.original.clientName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-800">{initials}</AvatarFallback>
            </Avatar>
            <span>{row.original.clientName}</span>
          </div>
        )
      },
    },
    {
      accessorKey: 'paymentStatus',
      header: 'Payment',
      cell: ({ row }) => <PaymentStatusBadge status={row.original.paymentStatus} />,
    },
    {
      accessorKey: 'deliveryStatus',
      header: 'Delivery Status',
      cell: ({ row }) => <DeliveryStatusBadge status={row.original.deliveryStatus} />,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Amount',
      cell: ({ row }) => `$${row.original.totalAmount.toFixed(2)}`,
    },
    {
      accessorKey: 'deliveryProgress',
      header: 'Progress',
      cell: ({ row }) => (
        <div className="flex items-center gap-2 w-32">
          <Progress value={row.original.deliveryProgress} className="h-2" />
          <span className="text-xs font-medium text-muted-foreground">{row.original.deliveryProgress}%</span>
        </div>
      ),
    },
    {
      accessorKey: 'customerFeedback',
      header: 'Feedback',
      cell: ({ row }) => <FeedbackIndicator feedback={row.original.customerFeedback} />,
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
      cell: ({ row }) => row.original.createdAt.toLocaleDateString(),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/orders/${row.original.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setOrders(orders.filter((o) => o.id !== row.original.id))
              }}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Orders</h1>
          <p className="text-muted-foreground mt-1">Manage all customer orders</p>
        </div>
        <Link href="/dashboard/orders/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Order
          </Button>
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Delivered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.delivered}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {((metrics.delivered / metrics.total) * 100).toFixed(0)}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{metrics.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgSatisfaction}/5</div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
          <CardDescription>View and manage all orders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="bg-muted/50">
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        onClick={header.column.getToggleSortingHandler()}
                        className={cn(
                          header.column.getCanSort() && 'cursor-pointer hover:bg-muted',
                          'px-4 py-3 text-left font-medium whitespace-nowrap',
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ChevronDown
                              className={cn(
                                'w-4 h-4 transition-transform',
                                header.column.getIsSorted() === false && 'opacity-0',
                                header.column.getIsSorted() === 'desc' && 'rotate-180',
                              )}
                            />
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-4 py-3">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm text-muted-foreground">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                orders.length,
              )}{' '}
              of {orders.length}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
