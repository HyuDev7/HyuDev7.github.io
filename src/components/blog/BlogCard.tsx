import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import type { PostMeta } from '@/lib/posts'

interface BlogCardProps {
  post: PostMeta
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      style={{
        display: 'block',
        backgroundColor: '#1A1A2E',
        border: '1px solid rgba(232, 232, 240, 0.08)',
        borderRadius: '12px',
        padding: '1.5rem',
        textDecoration: 'none',
        transition: 'border-color 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(108, 99, 255, 0.4)'
        e.currentTarget.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(232, 232, 240, 0.08)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
        <h2
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: '#E8E8F0',
            margin: 0,
            lineHeight: 1.4,
          }}
        >
          {post.title}
        </h2>
        <span
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.72rem',
            color: '#9999B3',
            whiteSpace: 'nowrap',
            paddingTop: '0.15rem',
          }}
        >
          {post.date}
        </span>
      </div>

      <p
        style={{
          color: '#9999B3',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          margin: '0 0 1rem',
        }}
      >
        {post.summary}
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
        {post.tags.map((tag) => (
          <Tag key={tag} label={tag} />
        ))}
      </div>
    </Link>
  )
}
