'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function LeadsPagination({ page, pages, total }: { page: number; pages: number; total: number }) {
  const router = useRouter()
  const params = useSearchParams()

  function goTo(p: number) {
    const sp = new URLSearchParams(params.toString())
    sp.set('page', String(p))
    router.push(`/admin/leads?${sp.toString()}`)
  }

  if (pages <= 1) return null

  return (
    <div className="flex items-center justify-between pt-4">
      <p className="text-sm font-sans text-ink-muted">{total} leads no total</p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" disabled={page <= 1}
          onClick={() => goTo(page - 1)} className="border-line h-8 w-8">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-sans text-ink">{page} / {pages}</span>
        <Button variant="outline" size="icon" disabled={page >= pages}
          onClick={() => goTo(page + 1)} className="border-line h-8 w-8">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
