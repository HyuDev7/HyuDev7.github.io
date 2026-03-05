import { motion } from 'framer-motion'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import ProjectCard from '@/components/projects/ProjectCard'
import FadeIn from '@/components/ui/FadeIn'
import { getFeaturedProjects, type Project } from '@/lib/projects'
import { getAllPostMetas, type PostMeta } from '@/lib/posts'

interface HomeProps {
  featuredProjects: Project[]
  recentPosts: PostMeta[]
}

const heroVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

export default function Home({ featuredProjects, recentPosts }: HomeProps) {
  return (
    <Layout
      title="Hugh's Portfolio"
      description="Portfolio & Tech Blog — Full-stack developer passionate about AI tooling and open-source."
    >
      {/* ── Hero ── */}
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
        {/* Animated gradient background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(108,99,255,0.2) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 60%, rgba(67,230,252,0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="show"
          style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}
        >
          <motion.p
            variants={heroItem}
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.875rem',
              color: '#43E6FC',
              marginBottom: '1rem',
              letterSpacing: '0.1em',
            }}
          >
            {'> Hello, World!'}
          </motion.p>

          <motion.h1
            variants={heroItem}
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
          </motion.h1>

          <motion.p
            variants={heroItem}
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
          </motion.p>

          <motion.div
            variants={heroItem}
            style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
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
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{ position: 'absolute', bottom: '2rem' }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            style={{ color: '#9999B3', fontSize: '1.25rem' }}
          >
            ↓
          </motion.div>
        </motion.div>
      </section>

      {/* ── About snippet ── */}
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
        <FadeIn direction="right">
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
        </FadeIn>

        <FadeIn direction="left" delay={0.1}>
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
        </FadeIn>
      </section>

      {/* ── Featured Projects ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <FadeIn>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#E8E8F0' }}>
              Featured Projects
            </h2>
            <Link href="/projects" style={{ color: '#6C63FF', textDecoration: 'none', fontSize: '0.9rem' }}>
              All projects →
            </Link>
          </div>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {featuredProjects.map((project, i) => (
            <FadeIn key={project.id} delay={i * 0.1}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ── Recent Blog Posts ── */}
      {recentPosts.length > 0 && (
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
          <FadeIn>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2rem' }}>
              <h2 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '2rem', fontWeight: 700, color: '#E8E8F0' }}>
                Recent Posts
              </h2>
              <Link href="/blog" style={{ color: '#6C63FF', textDecoration: 'none', fontSize: '0.9rem' }}>
                All posts →
              </Link>
            </div>
          </FadeIn>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 0.08}>
                <Link
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
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* ── Contact CTA ── */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem 6rem', textAlign: 'center' }}>
        <FadeIn>
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
        </FadeIn>
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const featuredProjects = getFeaturedProjects()
  const recentPosts = getAllPostMetas().slice(0, 3)
  return { props: { featuredProjects, recentPosts } }
}
