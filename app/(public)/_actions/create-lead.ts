'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const CreateLeadSchema = z.object({
  name:           z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  phone:          z.string().regex(/^[0-9]{10,11}$/, 'Informe um telefone válido com DDD'),
  email:          z.string().email('E-mail inválido').optional().or(z.literal('')),
  service:        z.enum(['banho_tosa', 'spa', 'hotelaria', 'day_care', 'taxi_dog', 'boutique']),
  preferred_date: z.string().optional(),
  message:        z.string().max(500).optional(),
  consent:        z.literal(true, { error: () => ({ message: 'Você precisa aceitar o uso dos dados para continuar' }) }),
})

export type CreateLeadInput = z.infer<typeof CreateLeadSchema>
export type CreateLeadResult = {
  success: boolean
  message: string
  errors?: Partial<Record<keyof CreateLeadInput, string[]>>
}

export async function createLead(input: CreateLeadInput): Promise<CreateLeadResult> {
  const validation = CreateLeadSchema.safeParse(input)
  if (!validation.success) {
    return {
      success: false,
      message: 'Verifique os campos e tente novamente.',
      errors: validation.error.flatten().fieldErrors as Partial<Record<keyof CreateLeadInput, string[]>>,
    }
  }
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('leads').insert({
      name:           validation.data.name,
      phone:          validation.data.phone,
      email:          validation.data.email || null,
      service:        validation.data.service,
      preferred_date: validation.data.preferred_date || null,
      message:        validation.data.message || null,
      status:         'pendente' as const,
    })
    if (error) throw error
    return { success: true, message: 'Agendamento solicitado! Nossa equipe entrará em contato em até 24h.' }
  } catch {
    return { success: false, message: 'Não foi possível enviar. Tente pelo WhatsApp: (11) 98877-5522.' }
  }
}
