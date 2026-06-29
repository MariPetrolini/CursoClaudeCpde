'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { createLead, type CreateLeadInput } from '../_actions/create-lead'
import { ServiceType } from '@/types/database'
import { SERVICES } from '@/lib/content/services'

const schema = z.object({
  name:           z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  phone:          z.string().regex(/^[0-9]{10,11}$/, 'Informe um telefone válido com DDD'),
  email:          z.string().email('E-mail inválido').optional().or(z.literal('')),
  service:        z.enum(['banho_tosa', 'spa', 'hotelaria', 'day_care', 'taxi_dog', 'boutique']),
  preferred_date: z.string().optional(),
  message:        z.string().max(500).optional(),
  consent:        z.literal(true, { error: () => ({ message: 'Você precisa aceitar o uso dos dados para continuar' }) }),
})

type FormValues = z.infer<typeof schema>

type BookingFormProps = {
  defaultService?: ServiceType
  onSuccess?: () => void
}

export function BookingForm({ defaultService, onSuccess }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      service: defaultService ?? 'banho_tosa',
      preferred_date: '',
      message: '',
      consent: undefined,
    },
  })

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    try {
      const result = await createLead(data as CreateLeadInput)
      if (result.success) {
        toast.success(result.message)
        form.reset()
        onSuccess?.()
      } else {
        toast.error(result.message)
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as keyof FormValues, { message: messages[0] })
            }
          })
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">Nome completo *</FormLabel>
            <FormControl>
              <Input placeholder="Seu nome" {...field} className="border-line" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">WhatsApp / Telefone *</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="11988775522" {...field} className="border-line" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">E-mail <span className="text-ink-muted">(opcional)</span></FormLabel>
            <FormControl>
              <Input type="email" placeholder="seu@email.com" {...field} className="border-line" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="service" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">Serviço de interesse *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="border-line">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {SERVICES.map((s) => (
                  <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="preferred_date" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">Data preferida <span className="text-ink-muted">(opcional)</span></FormLabel>
            <FormControl>
              <Input type="date" min={today} {...field} className="border-line" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem>
            <FormLabel className="text-ink">Mensagem <span className="text-ink-muted">(opcional)</span></FormLabel>
            <FormControl>
              <Textarea placeholder="Conte-nos sobre seu pet ou alguma necessidade especial..." maxLength={500} {...field} className="border-line resize-none" rows={3} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="consent" render={({ field }) => (
          <FormItem className="flex items-start gap-3">
            <FormControl>
              <Checkbox
                checked={field.value === true}
                onCheckedChange={(checked) => field.onChange(checked ? true : undefined)}
                className="mt-0.5"
              />
            </FormControl>
            <div>
              <FormLabel className="text-sm text-ink-muted font-normal leading-snug cursor-pointer">
                Concordo com o uso dos meus dados para fins de agendamento, conforme a LGPD.
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )} />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-primary-deep text-white hover:bg-brand-primary transition-colors"
        >
          {isLoading ? 'Enviando...' : 'Solicitar agendamento'}
        </Button>
      </form>
    </Form>
  )
}
