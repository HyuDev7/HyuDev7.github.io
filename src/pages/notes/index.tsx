import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Layout from '@/components/layout/Layout'
import Tag from '@/components/ui/Tag'
import { getAllNoteMetas, type NoteMeta } from '@/lib/notes'

interface NotesIndexProps {
  notes: NoteMeta[]
  allTags: string[]
}

export default function NotesIndex({ notes, allTags }: NotesIndexProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return notes.filter((n) => {
      const matchTag = activeTag ? n.tags.includes(activeTag) : true
      const q = search.toLowerCase()
      const matchSearch = q ? n.title.toLowerCase().includes(q) : true
      return matchTag && matchSearch
    })
  }, [notes, activeTag, search])

  return (
    <Layout
      title="Notes"
      description="TIL notes — raw, unpolished learning fragments by Hugh"
    >
      <section style={{ maxWidth: '800px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #43E6FC, #6C63FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}
        >
          Notes
        </h1>

        <p
          style={{
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '0.8rem',
            lineHeight: 1.7,
            color: '#9999B3',
            backgroundColor: 'rgba(108, 99, 255, 0.08)',
            border: '1px solid rgba(108, 99, 255, 0.25)',
            borderRadius: '8px',
            padding: '0.85rem 1.1rem',
            marginBottom: '2rem',
          }}
        >
          ここは学習中の生メモ置き場です。理解が浅いまま・間違いを含んだまま公開しています。
          消化されたものは <Link href="/blog" style={{ color: '#43E6FC' }}>Blog</Link> に昇格します。
        </p>

        {/* Search */}
        <input
          type="text"
          placeholder="Search notes..."
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

        {/* Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map((note) => (
            <NoteCard key={note.slug} note={note} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p style={{ color: '#9999B3', textAlign: 'center', padding: '3rem 0' }}>
            No notes found.
          </p>
        )}
      </section>
    </Layout>
  )
}

function NoteCard({ note }: { note: NoteMeta }) {
  return (
    <motion.div
      whileHover={{ y: -2, borderColor: 'rgba(67, 230, 252, 0.4)' }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        backgroundColor: '#1A1A2E',
        border: '1px solid rgba(232, 232, 240, 0.08)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <Link
        href={`/notes/${note.slug}`}
        style={{ display: 'block', padding: '1.1rem 1.25rem', textDecoration: 'none' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
          <h2
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '1rem',
              fontWeight: 600,
              color: '#E8E8F0',
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {note.title}
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
            {note.date}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {note.tags.map((tag) => (
            <Tag key={tag} label={tag} />
          ))}
        </div>
      </Link>
    </motion.div>
  )
}

export async function getStaticProps() {
  const notes = getAllNoteMetas()
  const allTags = [...new Set(notes.flatMap((n) => n.tags))].sort()
  return { props: { notes, allTags } }
}
