import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import { getAllProjects, getProjectById, type Project } from '@/lib/projects'
import type { GetStaticPaths, GetStaticProps } from 'next'

interface ProjectDetailProps {
  project: Project
}

export default function ProjectDetail({ project }: ProjectDetailProps) {
  return (
    <Layout title={project.title} description={project.description}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <Link
          href="/projects"
          style={{ color: '#9999B3', textDecoration: 'none', fontSize: '0.875rem', display: 'block', marginBottom: '2rem' }}
        >
          ← Back to Projects
        </Link>

        {project.featured && (
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontFamily: 'JetBrains Mono, monospace',
              color: '#43FCAA',
              backgroundColor: 'rgba(67, 252, 170, 0.1)',
              border: '1px solid rgba(67, 252, 170, 0.3)',
              borderRadius: '4px',
              padding: '0.1rem 0.4rem',
              marginBottom: '1rem',
            }}
          >
            Featured
          </span>
        )}

        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 700,
            color: '#E8E8F0',
            marginBottom: '1rem',
          }}
        >
          {project.title}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '2rem' }}>
          {project.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>

        <p style={{ color: '#9999B3', lineHeight: 1.8, fontSize: '1.05rem', marginBottom: '2rem' }}>
          {project.description}
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6C63FF, #43E6FC)',
                color: '#0F0F1A',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              View on GitHub →
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(67, 230, 252, 0.5)',
                color: '#43E6FC',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: '0.9rem',
              }}
            >
              Live Demo →
            </a>
          )}
        </div>
      </article>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = getAllProjects()
  return {
    paths: projects.map((p) => ({ params: { id: p.id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<ProjectDetailProps> = async ({ params }) => {
  const project = getProjectById(params!.id as string)
  if (!project) return { notFound: true }
  return { props: { project } }
}
