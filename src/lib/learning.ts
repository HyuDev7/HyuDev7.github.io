import { getAllPostMetas, type PostMeta } from './posts'
import { getAllNoteMetas, type NoteMeta } from './notes'

export interface TopicPipeline {
  tag: string
  noteCount: number
  postCount: number
  lastActivity: string
  promotable: boolean
}

export interface RecentActivityItem {
  type: 'note' | 'post'
  slug: string
  title: string
  date: string
  tags: string[]
}

export interface LearningStats {
  totalNotes: number
  totalPosts: number
  notesThisMonth: number
  postsThisMonth: number
  pipelines: TopicPipeline[]
  recentActivity: RecentActivityItem[]
}

function isThisMonth(date: string, now: Date): boolean {
  if (!date) return false
  const [y, m] = date.split('-').map(Number)
  return y === now.getFullYear() && m === now.getMonth() + 1
}

export function computeTopicPipelines(posts: PostMeta[], notes: NoteMeta[]): TopicPipeline[] {
  const allTags = new Set<string>([...posts.flatMap((p) => p.tags), ...notes.flatMap((n) => n.tags)])

  return [...allTags]
    .map((tag) => {
      const tagPosts = posts.filter((p) => p.tags.includes(tag))
      const tagNotes = notes.filter((n) => n.tags.includes(tag))

      const lastPostDate = tagPosts.reduce<string>((max, p) => (p.date > max ? p.date : max), '')
      const notesSinceLastPost = lastPostDate
        ? tagNotes.filter((n) => n.date > lastPostDate)
        : tagNotes

      const promotable =
        (tagPosts.length === 0 && tagNotes.length >= 3) ||
        (tagPosts.length > 0 && notesSinceLastPost.length >= 3)

      const lastActivity = [...tagPosts.map((p) => p.date), ...tagNotes.map((n) => n.date)].reduce<string>(
        (max, d) => (d > max ? d : max),
        ''
      )

      return {
        tag,
        noteCount: tagNotes.length,
        postCount: tagPosts.length,
        lastActivity,
        promotable,
      }
    })
    .sort((a, b) => (a.lastActivity < b.lastActivity ? 1 : -1))
}

export function getLearningStats(): LearningStats {
  const posts = getAllPostMetas()
  const notes = getAllNoteMetas()
  const now = new Date()

  const recentActivity: RecentActivityItem[] = [
    ...posts.map((p) => ({ type: 'post' as const, slug: p.slug, title: p.title, date: p.date, tags: p.tags })),
    ...notes.map((n) => ({ type: 'note' as const, slug: n.slug, title: n.title, date: n.date, tags: n.tags })),
  ]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 10)

  return {
    totalNotes: notes.length,
    totalPosts: posts.length,
    notesThisMonth: notes.filter((n) => isThisMonth(n.date, now)).length,
    postsThisMonth: posts.filter((p) => isThisMonth(p.date, now)).length,
    pipelines: computeTopicPipelines(posts, notes),
    recentActivity,
  }
}
