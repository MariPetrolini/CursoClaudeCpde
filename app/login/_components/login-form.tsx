'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { signIn } from '../_actions/auth'

const schema = z.object({
  email:    z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter ao menos 6 caracteres'),
})
type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    setServerError(null)
    const result = await signIn(data)
    if (!result.success) {
      setServerError(result.message)
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <p className="text-sm text-[#B23B2E] bg-[#B23B2E]/10 px-4 py-3 rounded-lg">{serverError}</p>
        )}
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">E-mail</FormLabel>
            <FormControl>
              <Input type="email" placeholder="admin@aure.com.br" {...field} className="border-line" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <FormField control={form.control} name="password" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">Senha</FormLabel>
            <FormControl>
              <Input type="password" placeholder="••••••••" {...field} className="border-line" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />
        <Button type="submit" disabled={isLoading}
          className="w-full bg-brand-primary-deep text-white hover:bg-brand-primary transition-colors">
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Form>
  )
}
