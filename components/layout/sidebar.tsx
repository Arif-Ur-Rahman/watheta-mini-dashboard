'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, ShoppingCart, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SidebarProps {
  open: boolean
  onToggle: () => void
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    {
      label: 'Products',
      href: '/dashboard/products',
      icon: Package,
    },
    {
      label: 'Orders',
      href: '/dashboard/orders',
      icon: ShoppingCart,
    },
  ]

  return (
    <aside
      className={cn(
        'bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
        open ? 'w-64' : 'w-20',
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        <div className={cn('font-bold text-lg text-sidebar-foreground', !open && 'hidden')}>
          Dashboard
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="hover:bg-sidebar-accent"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname.startsWith(item.href)

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-sidebar-primary text-sidebar-primary-foreground',
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn(!open && 'hidden')}>{item.label}</span>
              </Button>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
