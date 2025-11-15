import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-12 bg-muted rounded-md animate-pulse" />
      ))}
    </div>
  )
}

export function CardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse" />
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
      </CardContent>
    </Card>
  )
}
