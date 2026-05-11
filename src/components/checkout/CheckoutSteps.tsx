interface CheckoutStepsProps {
  currentStep: number
  steps: string[]
}

export function CheckoutSteps({ currentStep, steps }: CheckoutStepsProps) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 ${i <= currentStep ? 'text-lime' : 'text-muted'}`}>
            <span className={`w-6 h-6 flex items-center justify-center font-mono text-micro border ${
              i <= currentStep ? 'border-lime bg-lime text-bg' : 'border-muted'
            }`}>
              {i + 1}
            </span>
            <span className="font-mono text-micro uppercase hidden md:block">{step}</span>
          </div>
          {i < steps.length - 1 && <div className={`w-8 h-px ${i < currentStep ? 'bg-lime' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  )
}
