'use client'

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DashboardMetrics, STATUS_LABELS } from '@/types/database'

const STATUS_COLORS: Record<string, string> = {
  pendente:   '#C9A24B',
  confirmado: '#E8862E',
  concluido:  '#5C7A5A',
  cancelado:  '#B23B2E',
}

export function LeadsDonutChart({ data }: { data: DashboardMetrics['by_status'] }) {
  const formatted = (data ?? []).map((d) => ({
    name:  STATUS_LABELS[d.status],
    value: d.total,
    color: STATUS_COLORS[d.status] ?? '#E7DDD0',
  }))

  return (
    <Card className="border-line bg-bg-base">
      <CardHeader className="pb-2">
        <p className="font-display text-base font-semibold text-ink">Leads por status</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={formatted} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
              {formatted.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#FBF7F1', border: '1px solid #E7DDD0', borderRadius: 8, fontSize: 12 }}
              formatter={(v, name) => [v, name]}
            />
            <Legend iconType="circle" iconSize={8}
              formatter={(v) => <span style={{ fontSize: 11, color: '#6E665E' }}>{v}</span>} />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
