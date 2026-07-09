import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Lang = 'ja' | 'en'

interface LangContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextValue>({
  lang: 'ja',
  setLang: () => {},
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ja')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    // SSGでは初回レンダリングを'ja'固定にし、ハイドレーション後に保存値へ切り替える
    // 意図的なパターン(サーバー出力とのミスマッチ回避のため effect 内で行う必要がある)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === 'en' || saved === 'ja') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
