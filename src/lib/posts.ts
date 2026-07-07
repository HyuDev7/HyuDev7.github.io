import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Lang } from './i18n'

export interface PostMeta {
  slug: string
  title: string
  date: string
  tags: string[]
  summary: string
  thumbnail: string
  hasEn: boolean
}

export interface Post extends PostMeta {
  content: string
}

const postsDir = path.join(process.cwd(), 'content/blog')
const enPostsDir = path.join(process.cwd(), 'content/blog/en')

function parseFile(filePath: string, slug: string, hasEn: boolean): PostMeta {
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data } = matter(raw)
  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    summary: data.summary ?? '',
    thumbnail: data.thumbnail ?? '',
    hasEn,
  }
}

export function getAllPostMetas(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return []
  const enSlugs = new Set(
    fs.existsSync(enPostsDir)
      ? fs.readdirSync(enPostsDir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
      : []
  )
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '')
      return parseFile(path.join(postsDir, file), slug, enSlugs.has(slug))
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPostBySlug(slug: string, lang: Lang = 'ja'): Post {
  const enPath = path.join(enPostsDir, `${slug}.md`)
  const jaPath = path.join(postsDir, `${slug}.md`)

  // 英語が要求されて翻訳ファイルがあれば英語を返す、なければ日本語にフォールバック
  const filePath = lang === 'en' && fs.existsSync(enPath) ? enPath : jaPath

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  const hasEn = fs.existsSync(enPath)

  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    tags: data.tags ?? [],
    summary: data.summary ?? '',
    thumbnail: data.thumbnail ?? '',
    hasEn,
    content,
  }
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDir)) return []
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}
