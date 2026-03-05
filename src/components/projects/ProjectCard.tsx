import { motion } from 'framer-motion'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import type { Project } from '@/lib/projects'

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, boxShadow: '0 0 32px rgba(108, 99, 255, 0.28)' }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        backgroundColor: '#1A1A2E',
        border: '1px solid rgba(232, 232, 240, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
    >
      {project.featured && (
        <span
          style={{
            alignSelf: 'flex-start',
            fontSize: '0.7rem',
            fontFamily: 'JetBrains Mono, monospace',
            color: '#43FCAA',
            backgroundColor: 'rgba(67, 252, 170, 0.1)',
            border: '1px solid rgba(67, 252, 170, 0.3)',
            borderRadius: '4px',
            padding: '0.1rem 0.4rem',
          }}
        >
          Featured
        </span>
      )}

      <h3
        style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '1.125rem',
          fontWeight: 600,
          color: '#E8E8F0',
          margin: 0,
        }}
      >
        {project.title}
      </h3>

      <p
        style={{
          color: '#9999B3',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          margin: 0,
          flex: 1,
        }}
      >
        {project.description}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {project.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.8rem',
              color: '#6C63FF',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            GitHub →
          </a>
        )}
        {project.demo && (
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: '0.8rem',
              color: '#43E6FC',
              textDecoration: 'none',
            }}
          >
            Demo →
          </a>
        )}
        <Link
          href={`/projects/${project.id}`}
          style={{
            fontSize: '0.8rem',
            color: '#9999B3',
            textDecoration: 'none',
            marginLeft: 'auto',
          }}
        >
          Details →
        </Link>
      </div>
    </motion.div>
  )
}
