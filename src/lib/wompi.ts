export function initWompiWidget(orderId: string, amount: number, signature: string) {
  const script = document.createElement('script')
  script.src = 'https://checkout.wompi.co/widget.js'
  script.setAttribute('data-render', 'button')
  script.setAttribute('data-public-key', import.meta.env.VITE_WOMPI_PUBLIC_KEY || '')
  script.setAttribute('data-currency', 'COP')
  script.setAttribute('data-amount-in-cents', String(amount * 100))
  script.setAttribute('data-reference', orderId)
  script.setAttribute('data-signature:integrity', signature)
  script.setAttribute(
    'data-redirect-url',
    `${import.meta.env.VITE_APP_URL || 'http://localhost:5173'}/confirmacion/${orderId}`
  )
  const container = document.getElementById('wompi-container')
  if (container) {
    container.innerHTML = ''
    container.appendChild(script)
  }
}
