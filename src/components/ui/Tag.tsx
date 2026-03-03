interface TagProps {
  label: string
  active?: boolean
  onClick?: () => void
}

const tagColors: Record<string, string> = {
  Kotlin: '#6C63FF',
  TypeScript: '#43E6FC',
  'Next.js': '#E8E8F0',
  React: '#43FCAA',
  Docker: '#43E6FC',
  'Spring Boot': '#43FCAA',
  Claude: '#FF6584',
  AI: '#FF6584',
  Zellij: '#6C63FF',
  'Tailwind CSS': '#43E6FC',
  'GitHub Pages': '#9999B3',
  'CI/CD': '#FF6584',
  default: '#6C63FF',
}

export default function Tag({ label, active = false, onClick }: TagProps) {
  const color = tagColors[label] ?? tagColors.default

  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 500,
        fontFamily: 'JetBrains Mono, monospace',
        backgroundColor: active ? `${color}33` : 'rgba(232, 232, 240, 0.06)',
        color: active ? color : '#9999B3',
        border: `1px solid ${active ? color + '66' : 'rgba(232,232,240,0.12)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        userSelect: 'none',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          const el = e.currentTarget
          el.style.backgroundColor = `${color}22`
          el.style.color = color
        }
      }}
      onMouseLeave={(e) => {
        if (onClick && !active) {
          const el = e.currentTarget
          el.style.backgroundColor = 'rgba(232, 232, 240, 0.06)'
          el.style.color = '#9999B3'
        }
      }}
    >
      {label}
    </span>
  )
}
