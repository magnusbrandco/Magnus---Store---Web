import { useSEO } from '@/hooks/useSEO'

export default function Envio() {
  useSEO({ title: 'Información de Envío | Magnus' })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-2xl">
        <h1 className="font-display text-display-lg text-white mb-8">Información de Envío</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="font-display text-display-md text-white mb-4">Opciones de Envío</h2>
            <p className="font-body text-muted">
              Ofrecemos varias opciones de envío para adaptarse a tus necesidades:
            </p>
          </section>

          <section>
            <div className="bg-bg-3 border border-border p-6 rounded-lg">
              <h3 className="font-display text-display-sm text-lime mb-2">Envío Estándar</h3>
              <p className="font-body text-muted mb-2">Gratis en compras desde $200.000</p>
              <p className="font-body text-muted">Tiempo de entrega: 3-5 días hábiles en Bogotá, 5-7 días en otras ciudades.</p>
            </div>
          </section>

          <section>
            <div className="bg-bg-3 border border-border p-6 rounded-lg">
              <h3 className="font-display text-display-sm text-lime mb-2">Envío Express</h3>
              <p className="font-body text-muted mb-2">$15.000</p>
              <p className="font-body text-muted">Tiempo de entrega: 1-2 días hábiles en Bogotá, 2-3 días en otras ciudades.</p>
            </div>
          </section>

          <section>
            <div className="bg-bg-3 border border-border p-6 rounded-lg">
              <h3 className="font-display text-display-sm text-lime mb-2">Envío Mismo Día</h3>
              <p className="font-body text-muted mb-2">$25.000</p>
              <p className="font-body text-muted">Tiempo de entrega: Mismo día si la orden se realiza antes de las 12:00 PM en Bogotá.</p>
            </div>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Áreas de Cobertura</h2>
            <p className="font-body text-muted mb-3">
              Actualmente enviamos a todas las ciudades principales de Colombia:
            </p>
            <ul className="list-disc list-inside space-y-2 font-body text-muted">
              <li>Bogotá D.C.</li>
              <li>Medellín</li>
              <li>Cali</li>
              <li>Barranquilla</li>
              <li>Cartagena</li>
              <li>Bucaramanga</li>
              <li>Santa Marta</li>
              <li>Y más ciudades en todo el país</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Seguimiento de Envío</h2>
            <p className="font-body text-muted">
              Una vez tu pedido haya sido despachado, recibirás un correo electrónico con el número de seguimiento. Podrás rastrear tu paquete en tiempo real a través de nuestro sitio web.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Empaque</h2>
            <p className="font-body text-muted">
              Todos nuestros productos se empacan cuidadosamente con materiales de protección de calidad para garantizar que lleguen a ti en perfecto estado. Utilizamos cajas reciclables y empaques seguros.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Costos Adicionales</h2>
            <p className="font-body text-muted">
              Los costos de envío que se muestran al momento de pagar incluyen todos los gastos de envío. No hay costos ocultos.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Problemas con el Envío</h2>
            <p className="font-body text-muted">
              Si experimentas algún problema con tu envío, comunícate con nosotros a través de WhatsApp al +573216209183 o utiliza nuestro formulario de contacto. Estamos aquí para ayudarte.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
