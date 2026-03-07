import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import Tag from '@/components/ui/Tag'
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { getAllSlugs, getPostBySlug, type PostMeta } from '@/lib/posts'
import { useLang } from '@/lib/i18n'
import type { GetStaticPaths, GetStaticProps } from 'next'

interface BlogPostProps {
  jaMeta: PostMeta
  enMeta: PostMeta | null
  jaMdx: MDXRemoteSerializeResult
  enMdx: MDXRemoteSerializeResult | null
  jaToc: { id: string; text: string; level: number }[]
  enToc: { id: string; text: string; level: number }[]
}

function extractToc(content: string) {
  const toc: { id: string; text: string; level: number }[] = []
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2]
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    toc.push({ id, text, level })
  }
  return toc
}

export default function BlogPost({ jaMeta, enMeta, jaMdx, enMdx, jaToc, enToc }: BlogPostProps) {
  const { lang } = useLang()

  const useEn = lang === 'en' && enMeta !== null && enMdx !== null
  const meta = useEn ? enMeta! : jaMeta
  const mdxSource = useEn ? enMdx! : jaMdx
  const toc = useEn ? enToc : jaToc

  return (
    <Layout
      title={meta.title}
      description={meta.summary}
      ogType="article"
      path={`/blog/${meta.slug}`}
      ogImage={meta.thumbnail || undefined}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '5rem 1.5rem 6rem',
          display: 'grid',
          gridTemplateColumns: toc.length > 0 ? '1fr 220px' : '1fr',
          gap: '3rem',
          alignItems: 'start',
        }}
      >
        <article>
          <Link
            href="/blog"
            style={{ color: '#9999B3', textDecoration: 'none', fontSize: '0.875rem', display: 'block', marginBottom: '2rem' }}
          >
            ← Back to Blog
          </Link>

          {/* 翻訳中バナー */}
          {lang === 'en' && !enMeta && (
            <div
              style={{
                backgroundColor: 'rgba(255, 101, 132, 0.08)',
                border: '1px solid rgba(255, 101, 132, 0.25)',
                borderRadius: '8px',
                padding: '0.65rem 1rem',
                fontSize: '0.8rem',
                color: '#FF6584',
                marginBottom: '1.5rem',
                fontFamily: 'JetBrains Mono, monospace',
              }}
            >
              ⚠ English translation not yet available — showing Japanese version.
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {meta.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>

          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: '#E8E8F0',
              lineHeight: 1.25,
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
              marginBottom: '3rem',
            }}
          >
            {meta.date}
          </p>

          <div className="prose-content">
            <MDXRemote {...mdxSource} />
          </div>
        </article>

        {toc.length > 0 && (
          <aside
            style={{
              position: 'sticky',
              top: '84px',
              backgroundColor: '#1A1A2E',
              border: '1px solid rgba(232, 232, 240, 0.08)',
              borderRadius: '10px',
              padding: '1.25rem',
            }}
          >
            <p
              style={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '0.7rem',
                color: '#6C63FF',
                letterSpacing: '0.08em',
                marginBottom: '0.75rem',
              }}
            >
              TABLE OF CONTENTS
            </p>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {toc.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    color: '#9999B3',
                    textDecoration: 'none',
                    fontSize: '0.8rem',
                    lineHeight: 1.4,
                    paddingLeft: item.level === 3 ? '0.75rem' : '0',
                    borderLeft: item.level === 3 ? '1px solid rgba(232,232,240,0.1)' : 'none',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLAnchorElement).style.color = '#E8E8F0' }}
                  onMouseLeave={(e) => { (e.target as HTMLAnchorElement).style.color = '#9999B3' }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}
      </div>

      <style>{`
        .prose-content { color: #C8C8D8; line-height: 1.8; font-size: 1rem; }
        .prose-content h2 { font-family: 'Space Grotesk', sans-serif; font-size: 1.5rem; font-weight: 700; color: #E8E8F0; margin: 2.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid rgba(232, 232, 240, 0.1); }
        .prose-content h3 { font-family: 'Space Grotesk', sans-serif; font-size: 1.2rem; font-weight: 600; color: #E8E8F0; margin: 2rem 0 0.75rem; }
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
  const slugs = getAllSlugs()
  return {
    paths: slugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<BlogPostProps> = async ({ params }) => {
  const slug = params!.slug as string
  const jaPost = getPostBySlug(slug, 'ja')
  const enPost = jaPost.hasEn ? getPostBySlug(slug, 'en') : null

  const [jaMdx, enMdx] = await Promise.all([
    serialize(jaPost.content, {
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight, rehypeSlug] },
    }),
    enPost
      ? serialize(enPost.content, {
          mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeHighlight, rehypeSlug] },
        })
      : Promise.resolve(null),
  ])

  const toMeta = (p: typeof jaPost): PostMeta => ({
    slug: p.slug, title: p.title, date: p.date,
    tags: p.tags, summary: p.summary, thumbnail: p.thumbnail, hasEn: p.hasEn,
  })

  return {
    props: {
      jaMeta: toMeta(jaPost),
      enMeta: enPost ? toMeta(enPost) : null,
      jaMdx,
      enMdx,
      jaToc: extractToc(jaPost.content),
      enToc: enPost ? extractToc(enPost.content) : [],
    },
  }
}
