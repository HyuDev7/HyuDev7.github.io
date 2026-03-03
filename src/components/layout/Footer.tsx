import Link from 'next/link'

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'Twitter / X', href: 'https://twitter.com/' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/' },
]

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(232, 232, 240, 0.08)',
        backgroundColor: '#1A1A2E',
        padding: '2rem 1.5rem',
        marginTop: 'auto',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#9999B3',
                textDecoration: 'none',
                fontSize: '0.875rem',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = '#6C63FF' }}
              onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = '#9999B3' }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <p style={{ color: '#9999B3', fontSize: '0.8rem', margin: 0 }}>
          © {new Date().getFullYear()} Hugh. Built with Next.js & ❤️
        </p>
      </div>
    </footer>
  )
}
