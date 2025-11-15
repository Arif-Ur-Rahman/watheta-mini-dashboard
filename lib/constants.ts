export const CATEGORIES = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Sports']

export const PAYMENT_STATUSES = ['Paid', 'Pending', 'Refunded'] as const

export const DELIVERY_STATUSES = ['Pending', 'Shipped', 'Delivered', 'Canceled'] as const

export const CUSTOMER_FEEDBACK = ['happy', 'neutral', 'unhappy'] as const

export const STATUS_COLORS = {
  paid: { bg: 'bg-green-100', text: 'text-green-800' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  refunded: { bg: 'bg-red-100', text: 'text-red-800' },
  active: { bg: 'bg-green-100', text: 'text-green-800' },
  inactive: { bg: 'bg-gray-100', text: 'text-gray-800' },
}

export const ITEMS_PER_PAGE = 10
