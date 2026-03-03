import Head from 'next/head'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  ogImage?: string
}

export default function Layout({
  children,
  title = "Hugh's Portfolio",
  description = 'Portfolio & Tech Blog',
  ogImage = '/images/og-default.png',
}: LayoutProps) {
  const fullTitle = title === "Hugh's Portfolio" ? title : `${title} | Hugh's Portfolio`

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0F0F1A',
          color: '#E8E8F0',
        }}
      >
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </>
  )
}
