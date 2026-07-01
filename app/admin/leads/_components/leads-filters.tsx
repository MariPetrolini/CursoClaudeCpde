'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { SERVICE_LABELS, STATUS_LABELS, LeadStatus, ServiceType } from '@/types/database'

export function LeadsFilters() {
  const router = useRouter()
  const params = useSearchParams()

  function update(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (value && value !== 'all') { p.set(key, value) } else { p.delete(key) }
    p.delete('page')
    router.push(`/admin/leads?${p.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <Select
        defaultValue={params.get('status') ?? 'all'}
        onValueChange={(v: string | null) => update('status', v ?? '')}
      >
        <SelectTrigger className="w-40 border-line text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          {(Object.entries(STATUS_LABELS) as [LeadStatus, string][]).map(([v, l]) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        defaultValue={params.get('service') ?? 'all'}
        onValueChange={(v: string | null) => update('service', v ?? '')}
      >
        <SelectTrigger className="w-48 border-line text-sm">
          <SelectValue placeholder="Serviço" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os serviços</SelectItem>
          {(Object.entries(SERVICE_LABELS) as [ServiceType, string][]).map(([v, l]) => (
            <SelectItem key={v} value={v}>{l}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex gap-2 items-center">
        <Input
          type="date"
          defaultValue={params.get('date_from') ?? ''}
          onChange={(e) => update('date_from', e.target.value)}
          className="border-line text-sm w-36"
        />
        <span className="text-ink-muted text-sm">até</span>
        <Input
          type="date"
          defaultValue={params.get('date_to') ?? ''}
          onChange={(e) => update('date_to', e.target.value)}
          className="border-line text-sm w-36"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => router.push('/admin/leads')}
        className="border-line text-ink-muted hover:text-ink text-sm"
      >
        Limpar filtros
      </Button>
    </div>
  )
}
