// Simple API client for demo purposes
export const apiClient = {
  async getProducts() {
    const res = await fetch('/api/products')
    if (!res.ok) throw new Error('Failed to fetch products')
    return res.json()
  },

  async createProduct(data: any) {
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create product')
    return res.json()
  },

  async getOrders() {
    const res = await fetch('/api/orders')
    if (!res.ok) throw new Error('Failed to fetch orders')
    return res.json()
  },

  async createOrder(data: any) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create order')
    return res.json()
  },
}
