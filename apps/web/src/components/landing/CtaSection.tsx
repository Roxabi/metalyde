import { useState } from 'react'
import { m } from '@/paraglide/messages'

export function CtaSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section
      id="access"
      aria-label="Request access"
      className="border-b border-border bg-background px-7 py-20 text-center md:px-14"
    >
      <h2 className="mx-auto max-w-[18ch] font-display text-3xl font-bold tracking-tight [text-wrap:balance] sm:text-4xl">
        {m.landing_cta_title_a()}
        <span className="text-brand">{m.landing_cta_title_em()}</span>
        {m.landing_cta_title_b()}
      </h2>
      <p className="mx-auto mt-4 max-w-[44ch] text-muted-foreground">{m.landing_cta_sub()}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          setSubmitted(true)
        }}
        className="mx-auto mt-8 flex max-w-[460px] border border-border bg-card focus-within:ring-1 focus-within:ring-brand"
      >
        <input
          type="email"
          required
          disabled={submitted}
          aria-label={m.landing_cta_email_label()}
          placeholder={m.landing_cta_placeholder()}
          className="flex-1 border-none bg-transparent px-4.5 py-3.5 font-mono text-sm text-foreground outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitted}
          className="cursor-pointer border-none bg-primary px-6 font-mono text-xs font-bold uppercase tracking-wider text-primary-foreground transition-colors duration-normal ease-control hover:bg-brand disabled:cursor-default"
        >
          {submitted ? m.landing_cta_submitted() : m.landing_cta_button()}
        </button>
      </form>
      <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground/70">
        {m.landing_cta_micro()}
      </p>
    </section>
  )
}
