import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import ProjectCard from '@/components/projects/ProjectCard'
import Tag from '@/components/ui/Tag'
import { getAllProjects, type Project } from '@/lib/projects'

interface ProjectsPageProps {
  projects: Project[]
  allTags: string[]
}

export default function Projects({ projects, allTags }: ProjectsPageProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects

  return (
    <Layout title="Projects" description="Projects by Hugh — open-source and personal work">
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #6C63FF, #43E6FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '2rem',
          }}
        >
          Projects
        </h1>

        {/* Tag filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          <Tag
            label="All"
            active={activeTag === null}
            onClick={() => setActiveTag(null)}
          />
          {allTags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {filtered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: '#9999B3', textAlign: 'center', padding: '3rem 0' }}>
            No projects found for this tag.
          </p>
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const projects = getAllProjects()
  const allTags = [...new Set(projects.flatMap((p) => p.tags))].sort()
  return { props: { projects, allTags } }
}
