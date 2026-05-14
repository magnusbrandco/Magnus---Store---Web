import { useState } from 'react'
import { useSEO } from '@/hooks/useSEO'
import { Button } from '@/components/ui/Button'

export default function Contacto() {
  useSEO({ title: 'Contacto | Magnus' })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const message = encodeURIComponent(
      `Hola Magnus,\n\nNombre: ${formData.name}\nCorreo: ${formData.email}\nAsunto: ${formData.subject}\n\nMensaje:\n${formData.message}`
    )
    
    window.open(`https://wa.me/573216209183?text=${message}`, '_blank')
    
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="pt-24 pb-16">
      <div className="container-wide max-w-2xl">
        <h1 className="font-display text-display-lg text-white mb-2">Contacto</h1>
        <p className="font-body text-muted mb-12">
          Estamos aquí para ayudarte. Puedes contactarnos a través del formulario a continuación o directamente por WhatsApp.
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="space-y-6">
            <div className="bg-bg-3 border border-border p-6 rounded-lg">
              <h3 className="font-display text-display-sm text-lime mb-2">WhatsApp</h3>
              <p className="font-body text-muted mb-4">La forma más rápida de contactarnos</p>
              <a
                href="https://wa.me/573216209183"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-2 bg-lime text-bg rounded-lg font-body text-sm font-semibold hover:bg-opacity-90 transition-all"
              >
                Enviar WhatsApp
              </a>
            </div>

            <div className="bg-bg-3 border border-border p-6 rounded-lg">
              <h3 className="font-display text-display-sm text-lime mb-2">Correo Electrónico</h3>
              <p className="font-body text-muted mb-4">Responderemos en 24 horas</p>
              <a
                href="mailto:magnusstore02@gmail.com"
                className="font-body text-sm text-white hover:text-lime transition-colors"
              >
                magnusstore02@gmail.com
              </a>
            </div>

            <div className="bg-bg-3 border border-border p-6 rounded-lg">
              <h3 className="font-display text-display-sm text-lime mb-2">Horario</h3>
              <p className="font-body text-muted mb-2">
                Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                Sábados: 10:00 AM - 4:00 PM<br />
                Domingos: Cerrado
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-body text-sm text-muted mb-2">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-bg-3 border border-border rounded-lg font-body text-sm text-white placeholder-muted focus:outline-none focus:border-lime transition-colors"
                placeholder="Tu nombre"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-muted mb-2">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-bg-3 border border-border rounded-lg font-body text-sm text-white placeholder-muted focus:outline-none focus:border-lime transition-colors"
                placeholder="tu@correo.com"
              />
            </div>

            <div>
              <label className="block font-body text-sm text-muted mb-2">Asunto</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-bg-3 border border-border rounded-lg font-body text-sm text-white focus:outline-none focus:border-lime transition-colors"
              >
                <option value="">Selecciona un asunto</option>
                <option value="Pregunta general">Pregunta general</option>
                <option value="Problema con pedido">Problema con pedido</option>
                <option value="Devolución">Devolución</option>
                <option value="Colaboración">Colaboración</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block font-body text-sm text-muted mb-2">Mensaje</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 bg-bg-3 border border-border rounded-lg font-body text-sm text-white placeholder-muted focus:outline-none focus:border-lime transition-colors resize-none"
                placeholder="Tu mensaje aquí..."
              />
            </div>

            <Button variant="primary" size="lg" className="w-full" type="submit">
              Enviar por WhatsApp
            </Button>
          </form>
        </div>

        <div className="bg-bg-3 border border-border p-8 rounded-lg">
          <h2 className="font-display text-display-sm text-white mb-4">¿Preguntas Frecuentes?</h2>
          <p className="font-body text-muted mb-4">
            Consulta nuestra sección de preguntas frecuentes para encontrar respuestas rápidas a tus dudas.
          </p>
          <a href="/faq" className="inline-block px-4 py-2 bg-lime text-bg rounded-lg font-body text-sm font-semibold hover:bg-opacity-90 transition-all">
            Ver FAQ
          </a>
        </div>
      </div>
    </div>
  )
}
