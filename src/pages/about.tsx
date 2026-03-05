import Layout from '@/components/layout/Layout'
import Tag from '@/components/ui/Tag'
import FadeIn from '@/components/ui/FadeIn'

const skills = {
  Languages: ['Kotlin', 'TypeScript', 'Python', 'Go'],
  Frontend: ['React', 'Next.js', 'Tailwind CSS', 'Framer Motion'],
  Backend: ['Spring Boot', 'Node.js', 'PostgreSQL', 'Redis'],
  DevOps: ['Docker', 'GitHub Actions', 'Kubernetes', 'Terraform'],
  AI: ['Claude', 'LangChain', 'Prompt Engineering'],
}

const timeline = [
  { year: '2024 —', title: 'Building AI-powered developer tools', desc: 'Exploring multi-agent systems with Claude Code and open-source contributions.' },
  { year: '2022 —', title: 'Full-stack engineer at a startup', desc: 'Led backend architecture migration to Kotlin/Spring Boot, reduced API latency by 40%.' },
  { year: '2020 —', title: 'Graduated in Computer Science', desc: 'Focused on distributed systems and machine learning.' },
]

export default function About() {
  return (
    <Layout title="About" description="About Hugh — Full-stack developer & tech blogger">
      {/* Hero */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '5rem 1.5rem 3rem',
        }}
      >
        <FadeIn>
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6C63FF, #43E6FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1.5rem',
          }}
        >
          About Me
        </h1>
        </FadeIn>

        <FadeIn delay={0.1}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          <div>
            <p style={{ color: '#9999B3', lineHeight: 1.8, marginBottom: '1rem' }}>
              Hi! I&apos;m Hugh, a full-stack developer with a passion for building tools that make developers more productive. I&apos;m especially interested in AI-assisted coding, open-source software, and clean architecture.
            </p>
            <p style={{ color: '#9999B3', lineHeight: 1.8, marginBottom: '1rem' }}>
              I primarily write in <span style={{ color: '#6C63FF' }}>Kotlin</span> for backend services and <span style={{ color: '#43E6FC' }}>TypeScript</span> for frontend — but I&apos;m always picking up new languages for fun.
            </p>
            <p style={{ color: '#9999B3', lineHeight: 1.8 }}>
              This blog is where I share what I&apos;m learning, building, and thinking about.
            </p>
          </div>

          {/* Avatar placeholder */}
          <div
            style={{
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6C63FF, #FF6584, #43E6FC)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '5rem',
              margin: '0 auto',
              flexShrink: 0,
            }}
          >
            👨‍💻
          </div>
        </div>
        </FadeIn>
      </section>

      {/* Skills */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#E8E8F0',
            marginBottom: '1.5rem',
          }}
        >
          Skills & Tools
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {Object.entries(skills).map(([category, tags]) => (
            <div key={category} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: '#6C63FF',
                  minWidth: '90px',
                  paddingTop: '0.2rem',
                }}
              >
                {category}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {tags.map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem 6rem' }}>
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.5rem',
            fontWeight: 600,
            color: '#E8E8F0',
            marginBottom: '2rem',
          }}
        >
          Timeline
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {timeline.map((item, i) => (
            <div
              key={i}
              style={{
                display: 'grid',
                gridTemplateColumns: '100px 1fr',
                gap: '1.5rem',
                paddingBottom: '2rem',
                position: 'relative',
              }}
            >
              {/* Line */}
              {i < timeline.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    left: '108px',
                    top: '8px',
                    bottom: 0,
                    width: '1px',
                    backgroundColor: 'rgba(108, 99, 255, 0.3)',
                  }}
                />
              )}

              <span
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.75rem',
                  color: '#6C63FF',
                  paddingTop: '0.1rem',
                }}
              >
                {item.year}
              </span>
              <div>
                {/* Dot */}
                <div
                  style={{
                    position: 'absolute',
                    left: '102px',
                    top: '4px',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: '#6C63FF',
                    border: '2px solid #0F0F1A',
                  }}
                />
                <h3
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#E8E8F0',
                    marginBottom: '0.25rem',
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ color: '#9999B3', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
