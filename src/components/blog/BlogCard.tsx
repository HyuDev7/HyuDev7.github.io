import { motion } from 'framer-motion'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import type { PostMeta } from '@/lib/posts'

interface BlogCardProps {
  post: PostMeta
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ y: -3, borderColor: 'rgba(108, 99, 255, 0.4)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        backgroundColor: '#1A1A2E',
        border: '1px solid rgba(232, 232, 240, 0.08)',
        borderRadius: '12px',
        overflow: 'hidden',
      }}
    >
      <Link
        href={`/blog/${post.slug}`}
        style={{
          display: 'block',
          padding: '1.5rem',
          textDecoration: 'none',
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
    </motion.div>
  )
}
