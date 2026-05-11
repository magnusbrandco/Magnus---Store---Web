import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface EmailPayload {
  to: string
  subject: string
  html: string
  from?: string
}

serve(async (req) => {
  try {
    const { to, subject, html, from }: EmailPayload = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: from || Deno.env.get('FROM_EMAIL') || 'hola@magnusstore.co',
        to,
        subject,
        html,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
