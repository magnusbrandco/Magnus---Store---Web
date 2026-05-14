import { useSEO } from '@/hooks/useSEO'

export default function Privacidad() {
  useSEO({ title: 'Política de Privacidad | Magnus' })

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-2xl">
        <h1 className="font-display text-display-lg text-white mb-8">Política de Privacidad</h1>
        
        <div className="prose prose-invert max-w-none space-y-6">
          <section>
            <h2 className="font-display text-display-md text-white mb-4">1. Introducción</h2>
            <p className="font-body text-muted">
              En Magnus Store, protegemos tu privacidad y nos comprometemos a ser transparente sobre cómo recopilamos, usamos y compartimos tus datos personales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">2. Información que Recopilamos</h2>
            <p className="font-body text-muted mb-3">Recopilamos información de varias formas:</p>
            <ul className="list-disc list-inside space-y-2 font-body text-muted">
              <li>Información de registro: nombre, correo electrónico, teléfono, dirección</li>
              <li>Información de compra: productos, precios, fecha de transacción</li>
              <li>Información del dispositivo: dirección IP, navegador, tipo de dispositivo</li>
              <li>Información de comportamiento: páginas visitadas, productos vistos, carrito</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">3. Cómo Usamos Tu Información</h2>
            <p className="font-body text-muted mb-3">Usamos tu información para:</p>
            <ul className="list-disc list-inside space-y-2 font-body text-muted">
              <li>Procesar y entregar tus pedidos</li>
              <li>Crear y mantener tu cuenta</li>
              <li>Enviar confirmaciones de pedidos y actualizaciones de envío</li>
              <li>Responder a tus consultas y proporcionar soporte al cliente</li>
              <li>Mejorar nuestro sitio web y servicios</li>
              <li>Personalizar tu experiencia de compra</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">4. Compartición de Información</h2>
            <p className="font-body text-muted">
              No vendemos ni compartimos tu información personal con terceros, excepto cuando es necesario para:
            </p>
            <ul className="list-disc list-inside space-y-2 font-body text-muted mt-3">
              <li>Cumplir con proveedores de servicios (logística, pagos)</li>
              <li>Cumplir con requisitos legales</li>
              <li>Proteger nuestros derechos y tu seguridad</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">5. Seguridad de Datos</h2>
            <p className="font-body text-muted">
              Implementamos medidas de seguridad técnicas y organizacionales para proteger tu información personal contra acceso, alteración, divulgación o destrucción no autorizados.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">6. Tus Derechos</h2>
            <p className="font-body text-muted mb-3">Tienes derecho a:</p>
            <ul className="list-disc list-inside space-y-2 font-body text-muted">
              <li>Acceder a tus datos personales</li>
              <li>Corregir datos incorrectos</li>
              <li>Eliminar tu información</li>
              <li>Objetar el procesamiento de datos</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">7. Cookies</h2>
            <p className="font-body text-muted">
              Magnus Store utiliza cookies para mejorar tu experiencia. Las cookies son pequeños archivos que se guardan en tu dispositivo. Puedes controlar las cookies a través de la configuración de tu navegador.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">8. Cambios a Esta Política</h2>
            <p className="font-body text-muted">
              Nos reservamos el derecho de modificar esta política en cualquier momento. Los cambios serán efectivos cuando se publiquen en esta página.
            </p>
          </section>

          <section>
            <h2 className="font-display text-display-md text-white mb-4">9. Contacto</h2>
            <p className="font-body text-muted">
              Si tienes preguntas sobre esta Política de Privacidad, contáctanos a través de nuestro formulario de contacto.
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
