import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getAllNoteSlugs, getNoteBySlug, type NoteMeta } from '@/lib/notes'
import type { GetStaticPaths, GetStaticProps } from 'next'

interface NotePageProps {
  meta: NoteMeta
  mdx: MDXRemoteSerializeResult
}

export default function NotePage({ meta, mdx }: NotePageProps) {
  return (
    <Layout
      title={meta.title}
      description={meta.title}
      ogType="article"
      path={`/notes/${meta.slug}`}
    >
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <article>
          <Link
            href="/notes"
            style={{ color: '#9999B3', textDecoration: 'none', fontSize: '0.875rem', display: 'block', marginBottom: '2rem' }}
          >
            ← Back to Notes
          </Link>

          <div
            style={{
              backgroundColor: 'rgba(108, 99, 255, 0.08)',
              border: '1px solid rgba(108, 99, 255, 0.25)',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              fontSize: '0.75rem',
              color: '#9999B3',
              marginBottom: '1.5rem',
              fontFamily: 'JetBrains Mono, monospace',
            }}
          >
            🌱 学習中の生メモです。間違いを含む可能性があります。
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {meta.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
              fontWeight: 700,
              color: '#E8E8F0',
              lineHeight: 1.3,
              marginBottom: '0.75rem',
            }}
          >
            {meta.title}
          </h1>

          <p
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.8rem',
              color: '#9999B3',
              marginBottom: meta.source ? '0.5rem' : '2.5rem',
            }}
          >
            {meta.date}
          </p>

          {meta.source && (
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.8rem',
                color: '#43E6FC',
                marginBottom: '2.5rem',
              }}
            >
              出典: {meta.source}
            </p>
          )}

          <div className="prose-content">
            <MDXRemote {...mdx} />
          </div>
        </article>
      </div>

      <style>{`
        .prose-content { color: #C8C8D8; line-height: 1.8; font-size: 1rem; }
        .prose-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.3rem; font-weight: 700; color: #E8E8F0; margin: 2rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(232, 232, 240, 0.1); }
        .prose-content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.1rem; font-weight: 600; color: #E8E8F0; margin: 1.5rem 0 0.75rem; }
        .prose-content p { margin: 0 0 1.25rem; }
        .prose-content a { color: #6C63FF; text-decoration: underline; text-underline-offset: 3px; }
        .prose-content ul, .prose-content ol { margin: 0 0 1.25rem 1.5rem; }
        .prose-content li { margin-bottom: 0.4rem; }
        .prose-content code:not(pre code) { font-family: 'JetBrains Mono', monospace; font-size: 0.85em; background: rgba(108, 99, 255, 0.15); color: #43E6FC; padding: 0.15em 0.4em; border-radius: 4px; }
        .prose-content pre { background: #12121f; border: 1px solid rgba(232, 232, 240, 0.08); border-radius: 8px; padding: 1.25rem; overflow-x: auto; margin: 0 0 1.5rem; font-family: 'JetBrains Mono', monospace; font-size: 0.875rem; line-height: 1.7; }
        .prose-content pre code { background: none; color: inherit; padding: 0; }
        .prose-content blockquote { border-left: 3px solid #6C63FF; margin: 0 0 1.25rem; padding: 0.5rem 0 0.5rem 1.25rem; color: #9999B3; font-style: italic; }
        .hljs-keyword { color: #FF6584; }
        .hljs-string { color: #43FCAA; }
        .hljs-comment { color: #666688; font-style: italic; }
        .hljs-number { color: #43E6FC; }
        .hljs-function { color: #6C63FF; }
        .hljs-title { color: #E8E8F0; }
        .hljs-type { color: #43E6FC; }
        .hljs-built_in { color: #FF6584; }
        .hljs-attr { color: #43E6FC; }
        .hljs-variable { color: #E8E8F0; }
        .hljs-literal { color: #43E6FC; }
      `}</style>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = getAllNoteSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<NotePageProps> = async ({ params }) => {
  const slug = params!.slug as string
  const note = getNoteBySlug(slug)

  const mdx = await serialize(note.content, {
    mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight, rehypeSlug] },
  })

  const meta: NoteMeta = {
    slug: note.slug,
    title: note.title,
    date: note.date,
    tags: note.tags,
    source: note.source,
  }

  return { props: { meta, mdx } }
}
