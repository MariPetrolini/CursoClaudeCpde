export type LeadStatus  = 'pendente' | 'confirmado' | 'concluido' | 'cancelado'
export type ServiceType = 'banho_tosa' | 'spa' | 'hotelaria' | 'day_care' | 'taxi_dog' | 'boutique'

export type Lead = {
  id:             string
  name:           string
  phone:          string
  email:          string | null
  service:        ServiceType
  preferred_date: string | null
  message:        string | null
  status:         LeadStatus
  source:         string
  created_at:     string
  updated_at:     string
}

export type DashboardMetrics = {
  total_leads:       number
  leads_today:       number
  confirmation_rate: number
  top_service:       ServiceType | null
  by_service:        Array<{ service: ServiceType; total: number }>
  by_status:         Array<{ status: LeadStatus; total: number }>
}

export type LeadsPage = {
  data:  Lead[]
  total: number
  page:  number
  pages: number
}

export const SERVICE_LABELS: Record<ServiceType, string> = {
  banho_tosa: 'Banho & Tosa Premium',
  spa:        'Spa & Estética',
  hotelaria:  'Hotelaria',
  day_care:   'Day Care',
  taxi_dog:   'Taxi-Dog',
  boutique:   'Boutique',
}

export const STATUS_LABELS: Record<LeadStatus, string> = {
  pendente:   'Pendente',
  confirmado: 'Confirmado',
  concluido:  'Concluído',
  cancelado:  'Cancelado',
}
