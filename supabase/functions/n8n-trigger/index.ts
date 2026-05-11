import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

interface TriggerPayload {
  workflow: string
  data: Record<string, unknown>
}

serve(async (req) => {
  try {
    const { workflow, data }: TriggerPayload = await req.json()

    const res = await fetch(`${Deno.env.get('N8N_WEBHOOK_BASE_URL')}/${workflow}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-N8N-Secret': Deno.env.get('N8N_WEBHOOK_SECRET') || '',
      },
      body: JSON.stringify(data),
    })

    const result = await res.text()
    return new Response(result, {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
})
