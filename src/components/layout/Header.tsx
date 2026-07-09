import Link from 'next/link'
import { useState, useSyncExternalStore } from 'react'
import { useLang } from '@/lib/i18n'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/notes', label: 'Notes' },
  { href: '/learning', label: 'Learning' },
  { href: '/contact', label: 'Contact' },
]

const MOBILE_QUERY = '(max-width: 768px)'

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY)
  mq.addEventListener('change', callback)
  return () => mq.removeEventListener('change', callback)
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
    () => false // SSR時はデスクトップ表示で描画し、ハイドレーション後に実測値へ
  )
  const { lang, setLang } = useLang()

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backgroundColor: 'rgba(15, 15, 26, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(232, 232, 240, 0.08)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6C63FF, #43E6FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textDecoration: 'none',
          }}
        >
          {'<Hugh />'}
        </Link>

        {/* Desktop nav + lang toggle */}
        {!isMobile && (
          <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: '#9999B3',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = '#E8E8F0' }}
                onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = '#9999B3' }}
              >
                {link.label}
              </Link>
            ))}
            <LangToggle lang={lang} setLang={setLang} />
          </nav>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#E8E8F0',
              fontSize: '1.5rem',
              padding: '0.25rem',
            }}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && menuOpen && (
        <div
          style={{
            backgroundColor: '#1A1A2E',
            borderTop: '1px solid rgba(232, 232, 240, 0.08)',
            padding: '0.5rem 1.5rem 1rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                color: '#9999B3',
                textDecoration: 'none',
                borderBottom: '1px solid rgba(232, 232, 240, 0.05)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <div style={{ padding: '0.75rem 0' }}>
            <LangToggle lang={lang} setLang={setLang} />
          </div>
        </div>
      )}
    </header>
  )
}

function LangToggle({ lang, setLang }: { lang: 'ja' | 'en'; setLang: (l: 'ja' | 'en') => void }) {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: 'rgba(232, 232, 240, 0.06)',
        border: '1px solid rgba(232, 232, 240, 0.12)',
        borderRadius: '6px',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {(['ja', 'en'] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          style={{
            padding: '0.25rem 0.65rem',
            fontSize: '0.75rem',
            fontFamily: 'JetBrains Mono, monospace',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
            backgroundColor: lang === l ? '#6C63FF' : 'transparent',
            color: lang === l ? '#fff' : '#9999B3',
            letterSpacing: '0.05em',
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
