import { useEffect, useState } from 'react'
import { ApiError } from '@/api/chatApi'
import {
  completeTripForMiniSite,
  getTripMiniSite,
  publishTripMiniSite,
  revokeTripMiniSite,
  type TripMiniSiteState,
} from '@/api/suitcaseApi'

export function TripMiniSiteControls({ tripId }: { tripId: string }) {
  const [site, setSite] = useState<TripMiniSiteState | null>(null)
  const [visibility, setVisibility] = useState<'public' | 'link'>('link')
  const [consent, setConsent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setSite(null)
    setError('')
    getTripMiniSite(tripId)
      .then((current) => { if (active) { setSite(current); if (current.visibility) setVisibility(current.visibility) } })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof ApiError ? reason.detail : 'Не удалось загрузить настройки публикации')
      })
    return () => { active = false }
  }, [tripId])

  const publish = async () => {
    if (!consent) return
    setBusy(true)
    setError('')
    try {
      setSite(await publishTripMiniSite(tripId, visibility))
      setConsent(false)
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.detail : 'Не удалось опубликовать страницу')
    } finally { setBusy(false) }
  }

  const complete = async () => {
    setBusy(true)
    setError('')
    try { setSite(await completeTripForMiniSite(tripId)) }
    catch (reason) {
      setError(reason instanceof ApiError ? reason.detail : 'Не удалось подготовить черновик поездки')
    } finally { setBusy(false) }
  }

  const revoke = async () => {
    if (!window.confirm('Отозвать публикацию? Ссылка сразу перестанет открываться.')) return
    setBusy(true)
    setError('')
    try {
      await revokeTripMiniSite(tripId)
      setSite({ published: false, draft_ready: false, slug: null, visibility: null, consented_at: null })
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.detail : 'Не удалось отозвать публикацию')
    } finally { setBusy(false) }
  }

  const url = site?.published && site.slug ? `${window.location.origin}/t/${encodeURIComponent(site.slug)}` : null
  const copy = async () => {
    if (!url) return
    try { await navigator.clipboard.writeText(url); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }
    catch { setError('Не удалось скопировать ссылку') }
  }

  return <section aria-label="Мини-сайт поездки" className="rounded-2xl border border-border bg-surface-light p-4 space-y-3">
    <div>
      <h2 className="text-sm font-semibold text-text">Мини-сайт поездки</h2>
      <p className="mt-1 text-xs leading-relaxed text-text-muted">
        Публикация создаёт отдельный snapshot. Он включает город и даты, заметки, координаты и названия точек,
        фотографии по HTTPS и счётчики дней/мест/дистанции. Расходы и данные аккаунта не публикуются.
        Повторная публикация обновит snapshot и заменит прежнюю ссылку.
      </p>
    </div>

    {url ? <div className="space-y-2">
      <p className="text-xs text-text-secondary">Доступ: {site?.visibility === 'public' ? 'публичная страница' : 'только по секретной ссылке'}</p>
      <div className="flex gap-2">
        <a className="min-w-0 flex-1 truncate self-center text-xs text-primary underline" href={url}>{url}</a>
        <button type="button" onClick={() => void copy()} className="rounded-lg border border-border px-3 py-2 text-xs text-text">{copied ? 'Скопировано' : 'Копировать'}</button>
      </div>
      <button type="button" disabled={busy} onClick={() => void revoke()} className="rounded-lg px-3 py-2 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50">
        {busy ? 'Сохраняю…' : 'Отозвать публикацию'}
      </button>
    </div> : <>
      {site?.draft_ready ? <div className="rounded-lg bg-surface p-3 text-xs text-text-secondary">
        <p className="font-medium text-text">Черновик подготовлен и виден только вам</p>
        <p className="mt-1">{site.draft_snapshot?.points.length ?? 0} точек · {site.draft_snapshot?.photos.length ?? 0} фото. Публикации ещё нет — сначала выберите доступ и подтвердите согласие.</p>
      </div> : !site?.completed_at ? <div className="space-y-2 rounded-lg bg-surface p-3">
        <p className="text-xs text-text-secondary">Завершение подготовит приватный черновик. Само по себе оно не создаёт публичную страницу.</p>
        <button type="button" disabled={busy} onClick={() => void complete()} className="rounded-lg border border-border px-3 py-2 text-xs text-text disabled:opacity-50">
          {busy ? 'Готовлю черновик…' : 'Завершить поездку и подготовить черновик'}
        </button>
      </div> : null}
      <label className="flex items-start gap-2 text-xs text-text-secondary">
        <input type="radio" name={`trip-visibility-${tripId}`} checked={visibility === 'link'} onChange={() => setVisibility('link')} />
        Доступ только по непредсказуемой ссылке
      </label>
      <label className="flex items-start gap-2 text-xs text-text-secondary">
        <input type="radio" name={`trip-visibility-${tripId}`} checked={visibility === 'public'} onChange={() => setVisibility('public')} />
        Публично: страницу смогут открыть все, у кого есть URL; поисковики могут её индексировать
      </label>
      <label className="flex items-start gap-2 rounded-lg bg-surface p-3 text-xs leading-relaxed text-text-secondary">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        Я согласен(на) опубликовать перечисленные выше данные. Посетители смогут сохранить страницу и фотографии; внешние HTTPS-фото загружаются с указанных сайтов.
      </label>
      <button type="button" disabled={busy || !consent} onClick={() => void publish()} className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white disabled:opacity-50">
        {busy ? 'Публикую…' : 'Опубликовать snapshot'}
      </button>
    </>}
    {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
  </section>
}
