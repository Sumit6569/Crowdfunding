
CREATE OR REPLACE FUNCTION public.increment_campaign_amount(p_campaign_id UUID, p_amount NUMERIC)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.campaigns
  SET current_amount = current_amount + p_amount
  WHERE id = p_campaign_id;
END;
$$;
