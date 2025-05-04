
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PAYPAL_API_URL = 'https://api-m.sandbox.paypal.com' // Use 'https://api-m.paypal.com' for production
const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')
const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')

async function getPayPalAccessToken() {
  const auth = btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    body: 'grant_type=client_credentials'
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('Failed to get PayPal access token:', data)
    throw new Error('Failed to get PayPal access token')
  }
  
  return data.access_token
}

async function createOrder(amount: number, campaignId: string) {
  const accessToken = await getPayPalAccessToken()
  
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        },
        description: `Donation to campaign: ${campaignId}`,
        custom_id: campaignId
      }]
    })
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('Failed to create PayPal order:', data)
    throw new Error('Failed to create PayPal order')
  }
  
  return data
}

async function capturePayment(orderId: string) {
  const accessToken = await getPayPalAccessToken()
  
  const response = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    }
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    console.error('Failed to capture PayPal payment:', data)
    throw new Error('Failed to capture PayPal payment')
  }
  
  return data
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }
  
  try {
    const url = new URL(req.url)
    const path = url.pathname.split('/').pop()
    
    if (req.method === 'POST') {
      const { amount, campaignId, orderId, userId } = await req.json()
      
      if (path === 'create-order') {
        if (!amount || !campaignId) {
          return new Response(
            JSON.stringify({ error: 'Amount and campaignId are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const order = await createOrder(amount, campaignId)
        
        return new Response(
          JSON.stringify(order),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      
      if (path === 'capture-payment') {
        if (!orderId || !campaignId || !userId) {
          return new Response(
            JSON.stringify({ error: 'OrderId, campaignId, and userId are required' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        const captureData = await capturePayment(orderId)
        
        // Here we would update our database with the donation details
        // This would typically involve inserting a record into the donations table
        // and updating the campaign's current_amount
        
        return new Response(
          JSON.stringify(captureData),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }
    
    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing request:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
