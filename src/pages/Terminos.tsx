import { useSEO } from '@/hooks/useSEO'

export default function Terminos() {
  useSEO({ title: 'Términos y Condiciones | Magnus' })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-2xl">
        <h1 className="font-display text-display-lg text-white mb-8">Términos y Condiciones</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="font-display text-display-md text-white mb-4">1. Aceptación de Términos</h2>
            <p className="font-body text-muted">
              Al acceder y utilizar Magnus Store, aceptas estar vinculado por estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">2. Uso del Sitio</h2>
            <p className="font-body text-muted">
              Te comprometes a utilizar este sitio solo para fines legales y de una manera que no infrinja los derechos de otros ni restrinja su uso y disfrute. La conducta prohibida incluye acosar o causar angustia o inconvenientes, transmitir lenguaje obsceno, ofensivo o incitador, y perturbar el flujo normal de diálogo en Magnus Store.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">3. Licencia de Contenido</h2>
            <p className="font-body text-muted">
              A menos que se indique lo contrario, Magnus Store posee la propiedad intelectual de todo el material en este sitio. Se te otorga una licencia limitada para acceder y usar un único sitio web o móvil en un dispositivo a la vez.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">4. Cuentas de Usuario</h2>
            <p className="font-body text-muted">
              Si creas una cuenta en Magnus Store, eres responsable de mantener la confidencialidad de tu información de cuenta y contraseña. Aceptas toda la responsabilidad de las actividades que ocurran bajo tu cuenta.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">5. Políticas de Devolución</h2>
            <p className="font-body text-muted">
              Consulta nuestra página de Devoluciones para obtener información completa sobre la política de devoluciones de Magnus Store.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">6. Limitación de Responsabilidad</h2>
            <p className="font-body text-muted">
              En ningún caso Magnus Store será responsable de ningún daño directo, indirecto, incidental, especial o consecuente, incluida la pérdida de ganancias o datos, sin importar la causa y bajo cualquier teoría de responsabilidad.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">7. Modificaciones</h2>
            <p className="font-body text-muted">
              Magnus Store se reserva el derecho de modificar estos términos en cualquier momento. El uso continuado del sitio constituye tu aceptación de cualquier cambio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">8. Contacto</h2>
            <p className="font-body text-muted">
              Si tienes preguntas sobre estos Términos y Condiciones, contáctanos a través de nuestro formulario de contacto o envíanos un mensaje por WhatsApp.
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
