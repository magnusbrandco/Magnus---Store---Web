import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const body = await req.json()
  const { event, data } = body

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  if (event === 'transaction.updated') {
    const tx = data.transaction
    const orderId = tx.reference

    const statusMap: Record<string, string> = {
      APPROVED: 'approved',
      DECLINED: 'declined',
      VOIDED: 'voided',
      ERROR: 'error',
    }

    const paymentStatus = statusMap[tx.status] || 'pending'
    const orderStatus = paymentStatus === 'approved' ? 'processing' : 'cancelled'

    await supabase.from('orders').update({
      payment_status: paymentStatus,
      status: orderStatus,
      wompi_tx_id: tx.id,
      payment_method: tx.payment_method_type,
    }).eq('id', orderId)

    if (paymentStatus === 'approved') {
      const { data: items } = await supabase
        .from('order_items')
        .select('variant_id, quantity')
        .eq('order_id', orderId)

      for (const item of (items || [])) {
        await supabase.rpc('decrement_stock', {
          p_variant_id: item.variant_id,
          p_quantity: item.quantity
        })
      }

      await fetch(`${Deno.env.get('N8N_WEBHOOK_BASE_URL')}/payment-confirmed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-N8N-Secret': Deno.env.get('N8N_WEBHOOK_SECRET')!
        },
        body: JSON.stringify({ order_id: orderId }),
      }).catch(console.error)
    }
  }

  return new Response('OK')
})
