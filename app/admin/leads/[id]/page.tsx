import { notFound } from 'next/navigation'
import { Toaster } from 'sonner'
import { getLeadById } from '@/app/admin/_data-access/get-lead-by-id'
import { LeadDetail } from './_components/lead-detail'

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = await getLeadById(id)
  if (!lead) notFound()

  return (
    <>
      <LeadDetail lead={lead} />
      <Toaster richColors position="top-right" />
    </>
  )
}
