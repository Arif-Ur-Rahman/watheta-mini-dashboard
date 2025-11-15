import { Package, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface EmptyStateProps {
  title: string
  description: string
  icon: 'products' | 'orders'
  action?: {
    label: string
    href: string
  }
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  const Icon = icon === 'products' ? Package : ShoppingCart

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Icon className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      {action && (
        <Link href={action.href}>
          <Button className="mt-4">{action.label}</Button>
        </Link>
      )}
    </div>
  )
}
