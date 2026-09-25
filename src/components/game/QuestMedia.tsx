import { useEffect, useRef, useState } from 'react'
import { ImagePlus, Trash2 } from 'lucide-react'
import { ApiError } from '@/api/chatApi'
import { deleteMedia, fetchMediaPreview, getMyMedia, uploadQuestMedia, type MediaAsset } from '@/api/mediaApi'
import { useApp } from '@/context/AppContext'

export function QuestMedia({ questId }: { questId: string }) {
  const { language } = useApp()
  const english = language === 'en'
  const inputRef = useRef<HTMLInputElement>(null)
  const [assets, setAssets] = useState<MediaAsset[]>([])
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const refresh = async () => setAssets((await getMyMedia()).filter((asset) => asset.quest_id === questId))

  useEffect(() => {
    let alive = true
    getMyMedia().then((items) => alive && setAssets(items.filter((asset) => asset.quest_id === questId)))
      .catch((reason: unknown) => alive && setError(reason instanceof ApiError ? reason.message : (english ? 'Could not load your media.' : 'Не удалось загрузить медиатеку.')))
    return () => { alive = false }
  }, [questId, english])

  useEffect(() => {
    let alive = true
    const created: string[] = []
    Promise.all(assets.map(async (asset) => {
      try {
        const url = URL.createObjectURL(await fetchMediaPreview(asset))
        created.push(url)
        return [asset.id, url] as const
      } catch { return null }
    })).then((entries) => {
      if (alive) setPreviewUrls(Object.fromEntries(entries.filter((entry): entry is readonly [string, string] => entry !== null)))
      else created.forEach(URL.revokeObjectURL)
    })
    return () => { alive = false; created.forEach(URL.revokeObjectURL) }
  }, [assets])

  const upload = async (file?: File) => {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      await uploadQuestMedia(questId, file)
      await refresh()
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : (english ? 'Upload failed.' : 'Не удалось загрузить снимок.'))
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = async (assetId: string) => {
    setBusy(true)
    setError('')
    try { await deleteMedia(assetId); await refresh() }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : (english ? 'Delete failed.' : 'Не удалось удалить снимок.')) }
    finally { setBusy(false) }
  }

  return <section className="mt-4 border-t border-hairline pt-4" aria-label={english ? 'Private quest media' : 'Личные фото квеста'}>
    <div className="flex items-center justify-between gap-3">
      <div><h4 className="font-sans text-sm font-semibold text-text">{english ? 'My photos' : 'Мои фото'}</h4>
        <p className="mt-1 text-xs text-text-muted">{english ? 'Private to you · EXIF removed · JPEG, PNG or WebP · up to 10 MB' : 'Видны только вам · EXIF удаляется · JPEG, PNG или WebP · до 10 МБ'}</p></div>
      <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-text-secondary hover:bg-panel-2 disabled:opacity-50"><ImagePlus className="h-4 w-4" />{english ? 'Add photo' : 'Добавить'}</button>
      <input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => void upload(event.target.files?.[0])} />
    </div>
    {assets.length > 0 && <div className="mt-3 grid grid-cols-3 gap-2">{assets.map((asset) => <figure key={asset.id} className="relative overflow-hidden rounded-md bg-panel-2">
      {previewUrls[asset.id] ? <img src={previewUrls[asset.id]} alt={english ? 'Private quest photo' : 'Личное фото квеста'} className="aspect-square w-full object-cover" /> : <div className="aspect-square animate-pulse" />}
      <button type="button" disabled={busy} onClick={() => void remove(asset.id)} aria-label={english ? 'Delete photo' : 'Удалить фото'} className="absolute right-1 top-1 rounded bg-black/60 p-1.5 text-white disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
    </figure>)}</div>}
    {error && <p role="alert" className="mt-2 text-xs text-error">{error}</p>}
  </section>
}
