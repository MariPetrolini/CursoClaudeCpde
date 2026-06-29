import { ServiceType } from '@/types/database'

export type ServiceContent = {
  id: ServiceType
  title: string
  description: string
  iconName: string
}

export const SERVICES: ServiceContent[] = [
  { id: 'banho_tosa', title: 'Banho & Tosa Premium', description: 'Produtos importados, técnica especializada e atenção individual para cada pelagem.', iconName: 'Scissors' },
  { id: 'spa', title: 'Spa & Estética', description: 'Tratamentos relaxantes, aromaterapia e cuidados exclusivos para o bem-estar do seu pet.', iconName: 'Sparkles' },
  { id: 'hotelaria', title: 'Hotelaria', description: 'Suítes individuais climatizadas, câmeras 24h e atenção personalizada durante a estadia.', iconName: 'Hotel' },
  { id: 'day_care', title: 'Day Care', description: 'Dia completo de socialização, atividades e cuidados enquanto você trabalha.', iconName: 'Baby' },
  { id: 'taxi_dog', title: 'Taxi-Dog', description: 'Transporte seguro e confortável, com motoristas treinados e veículos adaptados.', iconName: 'Car' },
  { id: 'boutique', title: 'Boutique', description: 'Curadoria de produtos premium: rações, acessórios e cosméticos selecionados.', iconName: 'ShoppingBag' },
]
