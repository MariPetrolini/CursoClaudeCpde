-- ============================================================
-- Aurè Pet Atelier — Schema inicial
-- 0001_init_leads.sql
-- ============================================================

-- Enums
CREATE TYPE lead_status AS ENUM (
  'pendente',
  'confirmado',
  'concluido',
  'cancelado'
);

CREATE TYPE service_type AS ENUM (
  'banho_tosa',
  'spa',
  'hotelaria',
  'day_care',
  'taxi_dog',
  'boutique'
);

-- Trigger function: atualiza updated_at automaticamente
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Tabela principal de leads/agendamentos
CREATE TABLE public.leads (
  id             UUID         DEFAULT gen_random_uuid() PRIMARY KEY,
  name           TEXT         NOT NULL CHECK (length(trim(name)) >= 3),
  phone          TEXT         NOT NULL CHECK (phone ~ '^[0-9]{10,11}$'),
  email          TEXT         CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  service        service_type NOT NULL,
  preferred_date DATE,
  message        TEXT         CHECK (length(message) <= 500),
  status         lead_status  DEFAULT 'pendente' NOT NULL,
  source         TEXT         DEFAULT 'website',
  created_at     TIMESTAMPTZ  DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ  DEFAULT NOW() NOT NULL
);

-- Trigger de updated_at
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Índices para as queries de analytics
CREATE INDEX leads_created_at_idx ON public.leads (created_at DESC);
CREATE INDEX leads_status_idx     ON public.leads (status);
CREATE INDEX leads_service_idx    ON public.leads (service);

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Anônimo só pode inserir; status deve ser 'pendente'
CREATE POLICY "anon_insert_leads"
  ON public.leads
  FOR INSERT
  TO anon
  WITH CHECK (status = 'pendente');

-- Usuário autenticado pode ler todos os leads
CREATE POLICY "auth_select_leads"
  ON public.leads
  FOR SELECT
  TO authenticated
  USING (true);

-- Usuário autenticado pode atualizar todos os leads
CREATE POLICY "auth_update_leads"
  ON public.leads
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- View: série temporal para o gráfico de área (últimos 30 dias)
-- ============================================================
CREATE OR REPLACE VIEW leads_daily_stats
  WITH (security_invoker = true)
AS
SELECT
  DATE(created_at AT TIME ZONE 'America/Sao_Paulo') AS day,
  COUNT(*)                                            AS total
FROM public.leads
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;

-- ============================================================
-- RPC: métricas consolidadas para o dashboard admin
-- ============================================================
CREATE OR REPLACE FUNCTION get_dashboard_metrics()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_leads',
    (SELECT COUNT(*) FROM leads),

    'leads_today',
    (SELECT COUNT(*) FROM leads
     WHERE DATE(created_at AT TIME ZONE 'America/Sao_Paulo') = CURRENT_DATE),

    'confirmation_rate',
    ROUND(
      (SELECT COUNT(*) FROM leads WHERE status = 'confirmado')::numeric /
      NULLIF((SELECT COUNT(*) FROM leads), 0) * 100,
      1
    ),

    'top_service',
    (SELECT service FROM leads
     GROUP BY service
     ORDER BY COUNT(*) DESC
     LIMIT 1),

    'by_service',
    (SELECT json_agg(row_to_json(t))
     FROM (
       SELECT service, COUNT(*) AS total
       FROM leads GROUP BY service ORDER BY total DESC
     ) t),

    'by_status',
    (SELECT json_agg(row_to_json(t))
     FROM (
       SELECT status, COUNT(*) AS total
       FROM leads GROUP BY status
     ) t)
  ) INTO result;

  RETURN result;
END;
$$;

-- Permissão para usuários autenticados chamarem a RPC
GRANT EXECUTE ON FUNCTION get_dashboard_metrics() TO authenticated;
