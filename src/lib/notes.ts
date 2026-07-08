import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface NoteMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  source: string
}

export interface Note extends NoteMeta {
  content: string
}

const notesDir = path.join(process.cwd(), 'content/notes')

function parseFile(filePath: string, slug: string): NoteMeta {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    source: data.source ?? '',
  }
}

export function getAllNoteMetas(): NoteMeta[] {
  if (!fs.existsSync(notesDir)) return []
  return fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      return parseFile(path.join(notesDir, file), slug)
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getNoteBySlug(slug: string): Note {
  const filePath = path.join(notesDir, `${slug}.md`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    source: data.source ?? '',
    content,
  }
}

export function getAllNoteSlugs(): string[] {
  if (!fs.existsSync(notesDir)) return []
  return fs
    .readdirSync(notesDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}
