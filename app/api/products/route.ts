import { NextResponse } from 'next/server'
import { mockProducts } from '@/lib/mock-data'

export async function GET() {
  try {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300))
    return NextResponse.json(mockProducts)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 500))
    return NextResponse.json({ id: Math.random().toString(), ...body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
