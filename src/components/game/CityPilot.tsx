import { useEffect, useState } from 'react'
import { CheckCircle2, LockKeyhole, MapPin } from 'lucide-react'
import { ApiError } from '@/api/chatApi'
import { answerCityQuest, getCityPath, getCityQuest, type CityPathState, type CityQuestState } from '@/api/gameApi'
import { GlassPanel } from '@/components/ui/glass'

const labels: Record<string, string> = {
  'spb-hermitage': 'Эрмитаж', 'spb-peterhof': 'Петергоф',
  'spb-collection': 'Коллекция Эрмитажа', 'spb-fountains': 'Фонтаны Петергофа', 'spb-peterhof-history': 'Первое упоминание Петергофа',
  'sochi-national-park': 'Сочинский национальный парк', 'sochi-dendrarium': 'Дендрарий',
  'sochi-forest': 'Горные леса', 'sochi-mzymta': 'Река Мзымта', 'sochi-park-area': 'Площадь национального парка',
}

export function CityPilot({ cityId, signedIn, refreshKey, onCompleted }: { cityId: 'st-petersburg' | 'sochi'; signedIn: boolean; refreshKey: number; onCompleted: () => void }) {
  const [path, setPath] = useState<CityPathState | null>(null)
  const [quest, setQuest] = useState<CityQuestState | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [answering, setAnswering] = useState(false)

  useEffect(() => {
    if (!signedIn) return
    getCityPath(cityId).then(setPath).catch(() => setPath(null))
  }, [cityId, refreshKey, signedIn])

  const open = async (questId: string) => {
    try { setQuest(await getCityQuest(cityId, questId)); setMessage(null) }
    catch (error) { setMessage(error instanceof ApiError ? error.message : 'Квест пока недоступен.') }
  }
  const answer = async (answerKey: string) => {
    if (!quest || answering) return
    setAnswering(true)
    try {
      const result = await answerCityQuest(cityId, quest.quest.id, answerKey)
      setMessage(result.correct ? `Верно! +${result.xp_awarded} XP` : 'Почти! Попробуйте ещё раз.')
      if (result.completed) { setQuest(null); onCompleted() }
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : 'Не удалось сохранить ответ. Попробуйте ещё раз.')
    } finally {
      setAnswering(false)
    }
  }
  if (!signedIn || !path) return null
  return <GlassPanel variant="flat" className="p-5">
    <p className="font-sans text-xs uppercase tracking-wide text-text-muted">Контентный пилот · серверный путь</p>
    <h2 className="mt-1 font-display text-xl font-semibold text-text">{path.city.name}</h2>
    <ol className="mt-4 space-y-2">
      {path.nodes.map((node) => <li key={node.id}><button type="button" disabled={!node.unlocked || node.completed} onClick={() => void open(node.id)} className="flex w-full items-center gap-3 rounded-md border border-white/10 bg-panel-2/60 px-4 py-3 text-left disabled:opacity-60">
        {node.completed ? <CheckCircle2 className="h-5 w-5 text-primary" /> : node.unlocked ? <MapPin className="h-5 w-5 text-accent-soft" /> : <LockKeyhole className="h-5 w-5 text-text-muted" />}
        <span className="flex-1 font-sans text-sm text-text">{node.position}. {labels[node.id] ?? node.id}</span>
        <span className="font-sans text-xs text-text-muted">{node.completed ? 'Пройдено' : node.unlocked ? 'Открыто' : 'Закрыто'}</span>
      </button></li>)}
    </ol>
    {path.nodes.length > 0 && path.nodes.every((node) => node.completed) && <p className="mt-4 rounded-md bg-primary/10 p-3 font-sans text-sm text-text-secondary">Маршрут завершён. Все факты сохранены с первоисточниками.</p>}
    {quest && <section className="mt-5 rounded-md border border-primary/20 bg-primary/5 p-4">
      <h3 className="font-display text-lg font-semibold text-text">{quest.content.scene.title}</h3>
      <p className="mt-2 font-sans text-sm text-text-secondary">{quest.content.fact.text}</p>
      <a className="mt-2 inline-block font-sans text-xs text-primary hover:underline" href={quest.content.fact.source_url} target="_blank" rel="noreferrer">Источник: {quest.content.fact.source_label ?? 'открыть'}</a>
      <p className="mt-4 font-sans text-sm font-semibold text-text">{quest.content.question.text}</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-3">{quest.content.question.options.map((option) => <button key={option.id} type="button" disabled={answering} onClick={() => void answer(option.id)} className="rounded-md border border-white/10 bg-panel-2 px-3 py-2 text-left font-sans text-sm text-text disabled:opacity-60">{option.label}</button>)}</div>
    </section>}
    {message && <p className="mt-3 font-sans text-sm text-text-secondary">{message}</p>}
  </GlassPanel>
}
