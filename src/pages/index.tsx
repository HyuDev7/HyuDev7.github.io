import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import ProjectCard from '@/components/projects/ProjectCard'
import { getFeaturedProjects, type Project } from '@/lib/projects'
import { getAllPostMetas, type PostMeta } from '@/lib/posts'

interface HomeProps {
  featuredProjects: Project[]
  recentPosts: PostMeta[]
}

export default function Home({ featuredProjects, recentPosts }: HomeProps) {
  return (
    <Layout
      title="Hugh's Portfolio"
      description="Portfolio & Tech Blog — Full-stack developer"
    >
      {/* Hero */}
      <section
        style={{
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,99,255,0.18) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(67,230,252,0.08) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.875rem',
              color: '#43E6FC',
              marginBottom: '1rem',
              letterSpacing: '0.1em',
            }}
          >
            {'> Hello, World!'}
          </p>

          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(2.5rem, 7vw, 5rem)',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 40%, #43E6FC 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
            }}
          >
            I&apos;m Hugh
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
              color: '#9999B3',
              lineHeight: 1.7,
              maxWidth: '600px',
              margin: '0 auto 2.5rem',
            }}
          >
            Full-stack developer passionate about AI tooling, open-source, and
            clean architecture. I build things with{' '}
            <span style={{ color: '#6C63FF' }}>Kotlin</span>,{' '}
            <span style={{ color: '#43E6FC' }}>TypeScript</span>, and{' '}
            <span style={{ color: '#FF6584' }}>Claude</span>.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/projects"
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6C63FF, #43E6FC)',
                color: '#0F0F1A',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              View Projects
            </Link>
            <Link
              href="/blog"
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '8px',
                border: '1px solid rgba(108, 99, 255, 0.5)',
                color: '#6C63FF',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              Read Blog
            </Link>
          </div>
        </div>
      </section>

      {/* About snippet */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '4rem 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '3rem',
          alignItems: 'center',
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '2rem',
              fontWeight: 700,
              color: '#E8E8F0',
              marginBottom: '1rem',
            }}
          >
            About Me
          </h2>
          <p style={{ color: '#9999B3', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            I&apos;m a software engineer who loves exploring the intersection of AI and developer
            tooling. When I&apos;m not writing code, I&apos;m writing about it.
          </p>
          <Link href="/about" style={{ color: '#43E6FC', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 500 }}>
            More about me →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {[
            { label: 'Languages', value: 'Kotlin, TypeScript, Python' },
            { label: 'Frontend', value: 'React, Next.js, Tailwind' },
            { label: 'Backend', value: 'Spring Boot, Node.js' },
            { label: 'Tools', value: 'Docker, GitHub Actions, Claude' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                backgroundColor: '#1A1A2E',
                border: '1px solid rgba(232, 232, 240, 0.08)',
                borderRadius: '8px',
                padding: '1rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '0.7rem',
                  color: '#6C63FF',
                  marginBottom: '0.25rem',
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </p>
              <p style={{ fontSize: '0.8rem', color: '#E8E8F0', margin: 0 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#E8E8F0' }}>
            Featured Projects
          </h2>
          <Link href="/projects" style={{ color: '#6C63FF', textDecoration: 'none', fontSize: '0.9rem' }}>
            All projects →
          </Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      {/* Recent Blog Posts */}
      {recentPosts.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#E8E8F0' }}>
              Recent Posts
            </h2>
            <Link href="/blog" style={{ color: '#6C63FF', textDecoration: 'none', fontSize: '0.9rem' }}>
              All posts →
            </Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                style={{
                  backgroundColor: '#1A1A2E',
                  border: '1px solid rgba(232, 232, 240, 0.08)',
                  borderRadius: '8px',
                  padding: '1.25rem 1.5rem',
                  textDecoration: 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'border-color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.4)' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(232, 232, 240, 0.08)' }}
              >
                <div>
                  <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1rem', fontWeight: 600, color: '#E8E8F0', marginBottom: '0.25rem' }}>
                    {post.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#9999B3', margin: 0 }}>{post.summary}</p>
                </div>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.75rem', color: '#9999B3', whiteSpace: 'nowrap' }}>
                  {post.date}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 6rem', textAlign: 'center' }}>
        <div
          style={{
            border: '1px solid rgba(108, 99, 255, 0.2)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(67,230,252,0.05) 100%)',
          }}
        >
          <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.75rem', fontWeight: 700, color: '#E8E8F0', marginBottom: '0.75rem' }}>
            Let&apos;s work together
          </h2>
          <p style={{ color: '#9999B3', marginBottom: '1.5rem' }}>Have a project in mind? Feel free to reach out.</p>
          <Link
            href="/contact"
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
              color: '#fff',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.9rem',
            }}
          >
            Get in touch
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const featuredProjects = getFeaturedProjects()
  const recentPosts = getAllPostMetas().slice(0, 3)
  return {
    props: { featuredProjects, recentPosts },
  }
}
