import { useState, useMemo } from 'react'
import Layout from '@/components/layout/Layout'
import BlogCard from '@/components/blog/BlogCard'
import Tag from '@/components/ui/Tag'
import { getAllPostMetas, type PostMeta } from '@/lib/posts'

interface BlogIndexProps {
  posts: PostMeta[]
  allTags: string[]
}

export default function BlogIndex({ posts, allTags }: BlogIndexProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchTag = activeTag ? p.tags.includes(activeTag) : true
      const q = search.toLowerCase()
      const matchSearch = q
        ? p.title.toLowerCase().includes(q) || p.summary.toLowerCase().includes(q)
        : true
      return matchTag && matchSearch
    })
  }, [posts, activeTag, search])

  return (
    <Layout title="Blog" description="Tech blog by Hugh — Kotlin, TypeScript, AI tooling and more">
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #FF6584, #6C63FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '2rem',
          }}
        >
          Blog
        </h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search posts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 1rem',
            backgroundColor: '#1A1A2E',
            border: '1px solid rgba(232, 232, 240, 0.12)',
            borderRadius: '8px',
            color: '#E8E8F0',
            fontSize: '0.9rem',
            outline: 'none',
            marginBottom: '1.5rem',
            boxSizing: 'border-box',
            fontFamily: 'Inter, sans-serif',
          }}
        />

        {/* Tag filter */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2.5rem' }}>
          <Tag label="All" active={activeTag === null} onClick={() => setActiveTag(null)} />
          {allTags.map((tag) => (
            <Tag
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
            />
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filtered.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: '#9999B3', textAlign: 'center', padding: '3rem 0' }}>
            No posts found.
          </p>
        )}
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPostMetas()
  const allTags = [...new Set(posts.flatMap((p) => p.tags))].sort()
  return { props: { posts, allTags } }
}
