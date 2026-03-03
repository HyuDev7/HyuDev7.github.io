import Layout from '@/components/layout/Layout'

export default function Home() {
  return (
    <Layout
      title="Hugh's Portfolio"
      description="Portfolio & Tech Blog — Full-stack developer"
    >
      <div
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6C63FF, #43E6FC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '1rem',
            }}
          >
            Hi, I&apos;m Hugh 👋
          </h1>
          <p
            style={{
              color: '#9999B3',
              fontSize: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            Full-stack developer · Open-source enthusiast
          </p>
          <p
            style={{
              color: '#43FCAA',
              fontSize: '0.875rem',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            🚧 Phase 1: Foundation — coming soon...
          </p>
        </div>
      </div>
    </Layout>
  )
}
