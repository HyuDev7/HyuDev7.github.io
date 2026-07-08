import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import Tag from '@/components/ui/Tag'
import { getLearningStats, type LearningStats, type TopicPipeline, type RecentActivityItem } from '@/lib/learning'

interface LearningPageProps {
  stats: LearningStats
}

export default function LearningPage({ stats }: LearningPageProps) {
  return (
    <Layout
      title="Learning"
      description="学習パイプライン — 捕獲したノートと公開した記事の在庫状況"
    >
      <section style={{ maxWidth: '900px', margin: '0 auto', padding: '5rem 1.5rem 6rem' }}>
        <h1
          style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #43FCAA, #6C63FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem',
          }}
        >
          Learning
        </h1>

        <p style={{ color: '#9999B3', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          🌱 <Link href="/notes" style={{ color: '#43E6FC' }}>捕獲</Link> → 消化 →
          {' '}<Link href="/blog" style={{ color: '#43E6FC' }}>公開</Link> のサイクルを可視化したもの。
          タグごとにノートが溜まると「記事化候補」として浮かび上がる。
        </p>

        {/* サマリ数値 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.75rem',
            marginBottom: '3rem',
          }}
        >
          <StatCard label="Total Notes" value={stats.totalNotes} color="#43E6FC" />
          <StatCard label="Total Posts" value={stats.totalPosts} color="#6C63FF" />
          <StatCard label="Notes / Month" value={stats.notesThisMonth} color="#43FCAA" />
          <StatCard label="Posts / Month" value={stats.postsThisMonth} color="#FF6584" />
        </div>

        {/* タグ別パイプライン */}
        <h2 style={sectionHeading}>Topic Pipelines</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '3rem' }}>
          {stats.pipelines.map((p) => (
            <PipelineRow key={p.tag} pipeline={p} />
          ))}
          {stats.pipelines.length === 0 && (
            <p style={{ color: '#9999B3', fontSize: '0.85rem' }}>まだデータがありません。</p>
          )}
        </div>

        {/* 直近の活動 */}
        <h2 style={sectionHeading}>Recent Activity</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stats.recentActivity.map((item) => (
            <ActivityRow key={`${item.type}-${item.slug}`} item={item} />
          ))}
          {stats.recentActivity.length === 0 && (
            <p style={{ color: '#9999B3', fontSize: '0.85rem' }}>まだデータがありません。</p>
          )}
        </div>
      </section>
    </Layout>
  )
}

const sectionHeading: React.CSSProperties = {
  fontFamily: 'Space Grotesk, sans-serif',
  fontSize: '1.25rem',
  fontWeight: 700,
  color: '#E8E8F0',
  marginBottom: '1rem',
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        backgroundColor: '#1A1A2E',
        border: '1px solid rgba(232, 232, 240, 0.08)',
        borderRadius: '10px',
        padding: '1rem 1.1rem',
      }}
    >
      <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '1.6rem', fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.7rem', color: '#9999B3', marginTop: '0.2rem' }}>
        {label}
      </div>
    </div>
  )
}

function PipelineRow({ pipeline }: { pipeline: TopicPipeline }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        backgroundColor: '#1A1A2E',
        border: '1px solid rgba(232, 232, 240, 0.08)',
        borderRadius: '10px',
        padding: '0.75rem 1rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <Tag label={pipeline.tag} />
        {pipeline.promotable && (
          <span
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.7rem',
              color: '#FF6584',
              backgroundColor: 'rgba(255, 101, 132, 0.1)',
              border: '1px solid rgba(255, 101, 132, 0.3)',
              borderRadius: '9999px',
              padding: '0.15rem 0.6rem',
            }}
          >
            📝 記事化候補
          </span>
        )}
      </div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.78rem', color: '#9999B3', whiteSpace: 'nowrap' }}>
        📓 {pipeline.noteCount} &nbsp;/&nbsp; 📄 {pipeline.postCount}
      </div>
    </div>
  )
}

function ActivityRow({ item }: { item: RecentActivityItem }) {
  const href = item.type === 'note' ? `/notes/${item.slug}` : `/blog/${item.slug}`
  const icon = item.type === 'note' ? '📓' : '📄'
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        padding: '0.6rem 0.25rem',
        textDecoration: 'none',
        borderBottom: '1px solid rgba(232, 232, 240, 0.06)',
      }}
    >
      <span style={{ color: '#C8C8D8', fontSize: '0.88rem' }}>
        {icon} {item.title}
      </span>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.72rem', color: '#9999B3', whiteSpace: 'nowrap' }}>
        {item.date}
      </span>
    </Link>
  )
}

export async function getStaticProps() {
  const stats = getLearningStats()
  return { props: { stats } }
}
