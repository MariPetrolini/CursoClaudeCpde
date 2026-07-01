'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const schema = z.object({
  id:     z.string().uuid(),
  status: z.enum(['pendente', 'confirmado', 'concluido', 'cancelado']),
})

export type UpdateLeadStatusResult = { success: boolean; message: string }

export async function updateLeadStatus(input: { id: string; status: string }): Promise<UpdateLeadStatusResult> {
  const validation = schema.safeParse(input)
  if (!validation.success) return { success: false, message: 'Dados inválidos.' }

  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('leads')
      .update({ status: validation.data.status })
      .eq('id', validation.data.id)
    if (error) throw error

    revalidatePath('/admin/leads')
    revalidatePath(`/admin/leads/${validation.data.id}`)
    revalidatePath('/admin')
    return { success: true, message: 'Status atualizado com sucesso.' }
  } catch {
    return { success: false, message: 'Erro ao atualizar status.' }
  }
}
