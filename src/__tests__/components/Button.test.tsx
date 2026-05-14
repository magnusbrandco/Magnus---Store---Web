import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should render with different variants', () => {
    const { container } = render(
      <Button variant="primary">Primary</Button>
    )
    expect(container.querySelector('button')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>)
    const button = screen.getByText('Disabled Button') as HTMLButtonElement
    expect(button.disabled).toBe(true)
  })

  it('should handle click events', () => {
    let clicked = false
    render(
      <Button onClick={() => { clicked = true }}>
        Click me
      </Button>
    )
    const button = screen.getByText('Click me')
    button.click()
    expect(clicked).toBe(true)
  })
})
