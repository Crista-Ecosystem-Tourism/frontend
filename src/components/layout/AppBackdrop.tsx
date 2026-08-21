import { useEffect, useState } from 'react'

/**
 * Фон приложения: размытый снимок под всем интерфейсом.
 * Без него стеклянные панели преломляют пустоту и читаются как обычные
 * полупрозрачные блоки. Кадр меняется под выбранную страну.
 */

const backdrops: Record<string, string> = {
  RU: 'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?w=1600&q=60',
  GE: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=1600&q=60',
  TR: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1600&q=60',
  BE: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=1600&q=60',
}

const DEFAULT_BACKDROP = backdrops.RU

interface AppBackdropProps {
  /** ISO выбранной страны: кадр подстраивается под неё */
  countryIso?: string
}

export function AppBackdrop({ countryIso }: AppBackdropProps) {
  const src = (countryIso && backdrops[countryIso]) || DEFAULT_BACKDROP
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    const img = new Image()
    img.src = src
    img.onload = () => setLoaded(true)
    return () => {
      img.onload = null
    }
  }, [src])

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Снимок: сильно размыт и приглушён, работает как среда за стеклом */}
      <div
        className="absolute inset-[-8%] bg-cover bg-center transition-opacity duration-[900ms] ease-out"
        style={{
          backgroundImage: `url(${src})`,
          filter: 'blur(64px) saturate(1.15)',
          opacity: loaded ? 0.42 : 0,
        }}
      />

      {/* Плотность у краёв, чтобы центр оставался светлее и стекло играло */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_40%,transparent_0%,rgb(var(--scrim-rgb))_100%)]" />

      {/* Фирменная атмосфера поверх снимка */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(107,91,255,0.16),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(59,168,184,0.1),transparent_55%)]" />

      {/* Ровная подложка: гарантирует контраст текста на любом кадре */}
      <div className="absolute inset-0 bg-[rgb(var(--scrim-rgb))] opacity-[0.55]" />
    </div>
  )
}
