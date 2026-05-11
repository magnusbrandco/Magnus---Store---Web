import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabase.auth.getUser(token)

    if (!user) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })

    const body = await req.json()
    const { items, shipping_address, coupon_code, shipping_cost } = body

    for (const item of items) {
      const { data: variant } = await supabase
        .from('product_variants')
        .select('stock, price, product:products(base_price)')
        .eq('id', item.variant_id)
        .single()

      if (!variant || variant.stock < item.quantity) {
        return new Response(
          JSON.stringify({ error: `Stock insuficiente para variante ${item.variant_id}` }),
          { status: 400 }
        )
      }
    }

    let subtotal = items.reduce((acc: number, item: any) => acc + (item.unit_price * item.quantity), 0)
    let discount = 0

    if (coupon_code) {
      const { data: couponResult } = await supabase.rpc('validate_coupon', {
        p_code: coupon_code,
        p_order_total: subtotal
      })
      if (couponResult?.valid) discount = couponResult.discount
    }

    const total = subtotal - discount + (shipping_cost || 0)

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'payment_pending',
        subtotal,
        discount,
        shipping_cost: shipping_cost || 0,
        total,
        coupon_code,
        shipping_address,
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.product_name,
      variant_info: item.variant_info,
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }))

    await supabase.from('order_items').insert(orderItems)

    await fetch(`${Deno.env.get('N8N_WEBHOOK_BASE_URL')}/order-created`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-Secret': Deno.env.get('N8N_WEBHOOK_SECRET')!
      },
      body: JSON.stringify({ order_id: order.id, user_id: user.id }),
    }).catch(console.error)

    return new Response(JSON.stringify({ order }), {
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
