import fs from 'fs'
import path from 'path'

export interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  thumbnail: string
  github: string | null
  demo: string | null
  featured: boolean
}

const projectsDir = path.join(process.cwd(), 'content/projects')

export function getAllProjects(): Project[] {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith('.json'))
  return files
    .map((file) => {
      const raw = fs.readFileSync(path.join(projectsDir, file), 'utf-8')
      return JSON.parse(raw) as Project
    })
    .sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured)
}

export function getProjectById(id: string): Project | undefined {
  return getAllProjects().find((p) => p.id === id)
}
