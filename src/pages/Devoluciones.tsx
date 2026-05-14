import { useSEO } from '@/hooks/useSEO'

export default function Devoluciones() {
  useSEO({ title: 'Política de Devoluciones | Magnus' })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-2xl">
        <h1 className="font-display text-display-lg text-white mb-8">Política de Devoluciones</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="font-display text-display-md text-white mb-4">Garantía de Devolución</h2>
            <p className="font-body text-muted">
              En Magnus Store, queremos que estés completamente satisfecho con tu compra. Si no lo estás, ofrecemos una garantía de devolución de 30 días sin hacer preguntas.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Condiciones para Devolución</h2>
            <p className="font-body text-muted mb-3">Para ser elegible para una devolución, el producto debe:</p>
            <ul className="list-disc list-inside space-y-2 font-body text-muted">
              <li>Estar sin usar y en condición original</li>
              <li>Tener todas las etiquetas originales adjuntas</li>
              <li>Estar en su empaques original</li>
              <li>Incluir todos los accesorios y componentes originales</li>
              <li>Ser devuelto dentro de 30 días desde la compra</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Proceso de Devolución</h2>
            <p className="font-body text-muted mb-3">Para iniciar una devolución:</p>
            <ol className="list-decimal list-inside space-y-2 font-body text-muted">
              <li>Contáctanos a través de WhatsApp (+573216209183) o nuestro formulario de contacto</li>
              <li>Proporciona el número de pedido y el motivo de la devolución</li>
              <li>Espera la autorización de devolución y las instrucciones de envío</li>
              <li>Envía el producto en condición original</li>
              <li>Una vez recibamos y verificamos el producto, procesaremos tu reembolso</li>
            </ol>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Costos de Envío</h2>
            <p className="font-body text-muted">
              Magnus Store cubre el costo de envío para devoluciones válidas. Si el producto está dañado o defectuoso, nosotros pagamos el retorno. Si la devolución es por cambio de opinión del cliente, te proporcionaremos una etiqueta de envío prepagada.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Reembolsos</h2>
            <p className="font-body text-muted">
              Una vez que recibimos tu devolución, la inspeccionamos para asegurar que cumpla con nuestras condiciones. Los reembolsos se procesarán dentro de 5-10 días hábiles después de la aprobación. El reembolso se acreditará a tu método de pago original.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Cambios</h2>
            <p className="font-body text-muted">
              Si necesitas cambiar el tamaño o color, puedes iniciar un cambio en lugar de una devolución. Los cambios se procesarán rápidamente sin costo adicional si está disponible el artículo requerido.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Artículos No Elegibles</h2>
            <p className="font-body text-muted mb-3">Los siguientes artículos NO son elegibles para devolución:</p>
            <ul className="list-disc list-inside space-y-2 font-body text-muted">
              <li>Productos personalizados o grabados</li>
              <li>Artículos marcados como "Final Sale"</li>
              <li>Productos dañados por mal uso del cliente</li>
              <li>Artículos sin la etiqueta de seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">Contacto</h2>
            <p className="font-body text-muted">
              ¿Preguntas sobre devoluciones? Contáctanos por WhatsApp (+573216209183) y nuestro equipo te ayudará rápidamente.
            </p>
          </section>
        </div>

        <p className="font-body text-xs text-muted mt-12">
          Última actualización: {new Date().toLocaleDateString('es-CO')}
        </p>
      </div>
    </div>
  )
}
