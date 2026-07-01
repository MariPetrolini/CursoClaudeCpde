'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const SignInSchema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})

export type SignInResult = { success: boolean; message: string }

export async function signIn(input: { email: string; password: string }): Promise<SignInResult> {
  const validation = SignInSchema.safeParse(input)
  if (!validation.success) {
    return { success: false, message: validation.error.issues[0].message }
  }
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email:    validation.data.email,
    password: validation.data.password,
  })
  if (error) return { success: false, message: 'E-mail ou senha incorretos.' }
  redirect('/admin')
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
