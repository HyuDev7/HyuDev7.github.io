import Layout from '@/components/layout/Layout'
import { useState } from 'react'

const socialLinks = [
  { label: 'GitHub', url: 'https://github.com/', color: '#E8E8F0', desc: '@username' },
  { label: 'Twitter / X', url: 'https://twitter.com/', color: '#43E6FC', desc: '@username' },
  { label: 'LinkedIn', url: 'https://linkedin.com/in/', color: '#6C63FF', desc: 'Hugh' },
]

export default function Contact() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      })
      if (res.ok) {
        setStatus('success')
        form.reset()
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <Layout title="Contact" description="Get in touch with Hugh">
      <section style={{ maxWidth: '700px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}
        >
          Get in touch
        </h1>
        <p style={{ color: '#9999B3', lineHeight: 1.7, marginBottom: '3rem' }}>
          Have a question, project idea, or just want to say hi? Drop me a message below or find me on social media.
        </p>

        {/* Social links */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(232, 232, 240, 0.08)',
                borderRadius: '8px',
                padding: '0.75rem 1.25rem',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem',
                transition: 'border-color 0.2s',
                minWidth: '130px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = link.color + '66' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(232, 232, 240, 0.08)' }}
            >
              <span style={{ color: link.color, fontWeight: 600, fontSize: '0.9rem' }}>{link.label}</span>
              <span style={{ color: '#9999B3', fontSize: '0.75rem', fontFamily: 'JetBrains Mono, monospace' }}>
                {link.desc}
              </span>
            </a>
          ))}
        </div>

        {/* Contact form */}
        <div
          style={{
            backgroundColor: '#1A1A2E',
            border: '1px solid rgba(232, 232, 240, 0.08)',
            borderRadius: '12px',
            padding: '2rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#E8E8F0',
              marginBottom: '1.5rem',
            }}
          >
            Send a message
          </h2>

          {status === 'success' ? (
            <div style={{ color: '#43FCAA', textAlign: 'center', padding: '2rem 0' }}>
              ✅ Message sent! I&apos;ll get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
                { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    style={{ display: 'block', color: '#9999B3', fontSize: '0.85rem', marginBottom: '0.35rem' }}
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    placeholder={field.placeholder}
                    required
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.875rem',
                      backgroundColor: '#0F0F1A',
                      border: '1px solid rgba(232, 232, 240, 0.12)',
                      borderRadius: '6px',
                      color: '#E8E8F0',
                      fontSize: '0.9rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ))}
              <div>
                <label
                  htmlFor="message"
                  style={{ display: 'block', color: '#9999B3', fontSize: '0.85rem', marginBottom: '0.35rem' }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  placeholder="What's on your mind?"
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.875rem',
                    backgroundColor: '#0F0F1A',
                    border: '1px solid rgba(232, 232, 240, 0.12)',
                    borderRadius: '6px',
                    color: '#E8E8F0',
                    fontSize: '0.9rem',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'Inter, sans-serif',
                  }}
                />
              </div>

              {status === 'error' && (
                <p style={{ color: '#FF6584', fontSize: '0.85rem' }}>
                  Something went wrong. Please try again or email me directly.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
                  color: '#fff',
                  fontWeight: 600,
                  border: 'none',
                  cursor: status === 'submitting' ? 'wait' : 'pointer',
                  fontSize: '0.9rem',
                  opacity: status === 'submitting' ? 0.7 : 1,
                  alignSelf: 'flex-start',
                }}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </Layout>
  )
}
