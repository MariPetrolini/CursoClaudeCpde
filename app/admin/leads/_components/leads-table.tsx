import { Badge } from '@/components/ui/badge'
import { Lead, SERVICE_LABELS, STATUS_LABELS } from '@/types/database'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const STATUS_COLORS: Record<string, string> = {
  pendente:   'bg-brand-primary-soft text-brand-primary-deep',
  confirmado: 'bg-brand-primary/20 text-brand-primary-deep',
  concluido:  'bg-[#5C7A5A]/20 text-[#5C7A5A]',
  cancelado:  'bg-[#B23B2E]/20 text-[#B23B2E]',
}

export function LeadsTable({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="font-sans text-ink-muted">Nenhum lead encontrado com esses filtros.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-bg-base">
      <table className="w-full text-sm font-sans">
        <thead>
          <tr className="border-b border-line bg-bg-warm">
            {['Nome', 'Telefone', 'Serviço', 'Data preferida', 'Status', 'Recebido em', ''].map((h) => (
              <th key={h} className="text-left px-4 py-3 text-xs text-ink-muted font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-bg-warm transition-colors">
              <td className="px-4 py-3 text-ink font-medium">{lead.name}</td>
              <td className="px-4 py-3 text-ink-muted">{lead.phone}</td>
              <td className="px-4 py-3 text-ink-muted">{SERVICE_LABELS[lead.service]}</td>
              <td className="px-4 py-3 text-ink-muted">
                {lead.preferred_date
                  ? format(new Date(lead.preferred_date + 'T12:00:00'), "dd 'de' MMM", { locale: ptBR })
                  : '—'}
              </td>
              <td className="px-4 py-3">
                <Badge className={`${STATUS_COLORS[lead.status] ?? ''} border-0 text-xs`}>
                  {STATUS_LABELS[lead.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-ink-muted">
                {format(new Date(lead.created_at), 'dd/MM/yy HH:mm', { locale: ptBR })}
              </td>
              <td className="px-4 py-3">
                <a href={`/admin/leads/${lead.id}`} className="text-xs text-brand-primary-deep hover:underline">Ver</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
