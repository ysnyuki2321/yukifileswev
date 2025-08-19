import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface StatCardProps {
  title: string
  value: string
  subtext?: string
  accentClassName?: string
  children?: React.ReactNode
}

export default function StatCard({ title, value, subtext, accentClassName, children }: StatCardProps) {
  return (
    <Card className="bg-black/40 border-purple-500/20 premium-float">
      <CardHeader>
        <CardTitle className="text-sm text-gray-400">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <div className={`text-3xl font-bold text-white ${accentClassName || ""}`}>{value}</div>
            {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
          </div>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}

