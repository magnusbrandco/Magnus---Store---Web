import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useSEO } from '@/hooks/useSEO'

export default function FAQ() {
  useSEO({ title: 'Preguntas Frecuentes | Magnus' })

  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: '¿Cómo realizo una compra en Magnus?',
      answer: 'Para comprar, simplemente navega por nuestro catálogo, selecciona los productos que deseas, agrégalos al carrito y procede a checkout. Si no tienes cuenta, puedes crear una o continuar como invitado. Luego completa el formulario de envío y recibirás un link a WhatsApp para confirmar tu pago.'
    },
    {
      question: '¿Cuáles son los métodos de pago disponibles?',
      answer: 'Actualmente, procesamos pagos a través de WhatsApp mientras configuramos nuestros sistemas de pago directo. Enviaremos un enlace a WhatsApp donde podrás completar tu transacción de forma segura.'
    },
    {
      question: '¿Cuánto tiempo tarda la entrega?',
      answer: 'Dependiendo de la opción de envío seleccionada: Envío Estándar (3-5 días hábiles en Bogotá), Envío Express (1-2 días), Envío Mismo Día (mismo día si ordenas antes de las 12 PM). Consulta nuestra página de Envío para más detalles.'
    },
    {
      question: '¿Ofrecen devoluciones?',
      answer: 'Sí, ofrecemos una garantía de devolución de 30 días. Si no estás satisfecho, puedes devolver el producto en condición original dentro de 30 días para obtener un reembolso completo. Consulta nuestra Política de Devoluciones para más información.'
    },
    {
      question: '¿Cómo rastreo mi pedido?',
      answer: 'Una vez tu pedido sea despachado, recibirás un correo electrónico con el número de seguimiento. Podrás rastrear tu paquete en tiempo real a través del sitio web utilizando este número.'
    },
    {
      question: '¿Qué pasa si mi producto llega dañado?',
      answer: 'Si recibes un producto dañado o defectuoso, contáctanos inmediatamente por WhatsApp (+573216209183) con fotos del daño. Reemplazaremos el producto o procesaremos un reembolso completo sin costo de envío.'
    },
    {
      question: '¿Tienen tienda física?',
      answer: 'Magnus Store opera principalmente en línea. Sin embargo, puedes contactarnos por WhatsApp para consultas sobre disponibilidad de productos o entregas personalizadas en Bogotá.'
    },
    {
      question: '¿Ofrecen envíos internacionales?',
      answer: 'Actualmente enviamos solo dentro de Colombia. Para consultas sobre envíos especiales o internacionales, contáctanos por WhatsApp al +573216209183.'
    },
    {
      question: '¿Cómo cambio mi contraseña?',
      answer: 'Si ya tienes una cuenta, puedes cambiar tu contraseña desde la sección "Configuración" en tu perfil. Si olvidaste tu contraseña, haz clic en "Olvidé mi contraseña" en la página de login.'
    },
    {
      question: '¿Cómo me comunico con soporte?',
      answer: 'Puedes contactarnos de varias formas: envía un mensaje por WhatsApp al +573216209183, usa nuestro formulario de contacto en el sitio, o envía un correo a magnusstore02@gmail.com. Respondemos rápidamente.'
    }
  ]

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-2xl">
        <h1 className="font-display text-display-lg text-white mb-8">Preguntas Frecuentes</h1>
        
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden bg-bg-3"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-6 flex items-center justify-between hover:bg-bg-2 transition-colors text-left"
              >
                <h3 className="font-body text-sm font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  size={20}
                  className={`text-lime flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 border-t border-border">
                  <p className="font-body text-sm text-muted mt-4">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-bg-3 border border-border rounded-lg">
          <h2 className="font-display text-display-sm text-white mb-2">¿No encuentras lo que buscas?</h2>
          <p className="font-body text-muted mb-4">
            Contáctanos directamente y nuestro equipo te ayudará lo antes posible.
          </p>
          <a
            href="https://wa.me/573216209183?text=Hola%20Magnus%2C%20tengo%20una%20pregunta"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2 bg-lime text-bg rounded-lg font-body text-sm font-semibold hover:bg-opacity-90 transition-all"
          >
            Contáctanos por WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
