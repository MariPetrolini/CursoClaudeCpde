'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { DailyStat } from '@/app/admin/_data-access/get-leads-daily-stats'
import { format, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function LeadsAreaChart({ data }: { data: DailyStat[] }) {
  const formatted = data.map((d) => ({
    day:   format(parseISO(d.day), 'dd/MM', { locale: ptBR }),
    total: d.total,
  }))

  return (
    <Card className="border-line bg-bg-base">
      <CardHeader className="pb-2">
        <p className="font-display text-base font-semibold text-ink">Leads por dia</p>
        <p className="text-xs font-sans text-ink-muted">Últimos 30 dias</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={formatted} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradLeads" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#E8862E" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E8862E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E7DDD0" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6E665E' }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 11, fill: '#6E665E' }} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ background: '#FBF7F1', border: '1px solid #E7DDD0', borderRadius: 8, fontSize: 12 }}
              formatter={(v) => [v, 'Leads']}
            />
            <Area type="monotone" dataKey="total" stroke="#E8862E" strokeWidth={2} fill="url(#gradLeads)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
