'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { ChevronLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lead, LeadStatus, SERVICE_LABELS, STATUS_LABELS } from '@/types/database'
import { updateLeadStatus } from '../../_actions/update-lead-status'

const STATUS_COLORS: Record<LeadStatus, string> = {
  pendente:   'bg-brand-primary-soft text-brand-primary-deep',
  confirmado: 'bg-brand-primary/20 text-brand-primary-deep',
  concluido:  'bg-[#5C7A5A]/20 text-[#5C7A5A]',
  cancelado:  'bg-[#B23B2E]/20 text-[#B23B2E]',
}

export function LeadDetail({ lead }: { lead: Lead }) {
  const router = useRouter()
  const [status, setStatus] = useState<LeadStatus>(lead.status)
  const [isUpdating, setIsUpdating] = useState(false)

  async function handleStatusChange(newStatus: string | null) {
    if (!newStatus) return
    setIsUpdating(true)
    try {
      const result = await updateLeadStatus({ id: lead.id, status: newStatus })
      if (result.success) {
        setStatus(newStatus as LeadStatus)
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="p-8 max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/leads" className="text-ink-muted hover:text-ink transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{lead.name}</h1>
          <p className="font-sans text-sm text-ink-muted mt-0.5">
            Recebido em {format(new Date(lead.created_at), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
          </p>
        </div>
      </div>

      <Card className="border-line bg-bg-base">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg font-semibold text-ink">Dados do solicitante</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 text-sm font-sans">
          <div>
            <p className="text-xs text-ink-muted mb-1">Nome</p>
            <p className="text-ink">{lead.name}</p>
          </div>
          <div>
            <p className="text-xs text-ink-muted mb-1">Telefone</p>
            <p className="text-ink">{lead.phone}</p>
          </div>
          {lead.email && (
            <div>
              <p className="text-xs text-ink-muted mb-1">E-mail</p>
              <p className="text-ink">{lead.email}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-ink-muted mb-1">Serviço</p>
            <p className="text-ink">{SERVICE_LABELS[lead.service]}</p>
          </div>
          {lead.preferred_date && (
            <div>
              <p className="text-xs text-ink-muted mb-1">Data preferida</p>
              <p className="text-ink">
                {format(new Date(lead.preferred_date + 'T12:00:00'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </p>
            </div>
          )}
          {lead.message && (
            <div className="sm:col-span-2">
              <p className="text-xs text-ink-muted mb-1">Mensagem</p>
              <p className="text-ink whitespace-pre-wrap">{lead.message}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-line bg-bg-base">
        <CardHeader className="pb-3">
          <CardTitle className="font-display text-lg font-semibold text-ink">Status do atendimento</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Badge className={`${STATUS_COLORS[status]} border-0`}>{STATUS_LABELS[status]}</Badge>
          <Select value={status} onValueChange={handleStatusChange} disabled={isUpdating}>
            <SelectTrigger className="w-44 border-line text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isUpdating && <span className="text-xs text-ink-muted">Atualizando...</span>}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          variant="outline"
          className="border-line text-ink-muted hover:text-ink"
          render={<Link href="/admin/leads" />}
        >
          Voltar para lista
        </Button>
      </div>
    </div>
  )
}
