'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DashboardMetrics, SERVICE_LABELS } from '@/types/database'

export function LeadsBarChart({ data }: { data: DashboardMetrics['by_service'] }) {
  const formatted = (data ?? []).map((d) => ({
    service: SERVICE_LABELS[d.service],
    total:   d.total,
  }))

  return (
    <Card className="border-line bg-bg-base">
      <CardHeader className="pb-2">
        <p className="font-display text-base font-semibold text-ink">Leads por serviço</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={formatted} layout="vertical" margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DDD0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: '#6E665E' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis type="category" dataKey="service" tick={{ fontSize: 11, fill: '#6E665E' }} tickLine={false} axisLine={false} width={120} />
            <Tooltip
              contentStyle={{ background: '#FBF7F1', border: '1px solid #E7DDD0', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [v, 'Leads']}
            />
            <Bar dataKey="total" fill="#C9A24B" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
