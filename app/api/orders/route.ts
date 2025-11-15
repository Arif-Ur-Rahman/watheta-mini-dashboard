import { NextResponse } from 'next/server'
import { mockOrders } from '@/lib/mock-data'

export async function GET() {
  try {
    await new Promise((resolve) => setTimeout(resolve, 300))
    return NextResponse.json(mockOrders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    await new Promise((resolve) => setTimeout(resolve, 500))
    return NextResponse.json({ id: Math.random().toString(), ...body }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
