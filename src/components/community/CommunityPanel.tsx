import { useEffect, useState } from 'react'
import { ArrowLeft, Heart, MapPin, Play, Trophy, Medal, UserPlus, Crown, Copy, RotateCw, UserRoundX } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { GlassPanel, Chip, IconButton } from '@/components/ui/glass'
import { Img } from '@/components/ui/Img'
import { cn } from '@/lib/utils'
import { useApp } from '@/context/AppContext'
import { isLoggedIn } from '@/api/authApi'
import { acceptFriendInvite, createFriendInvite, listFriends, removeFriend, type Friend } from '@/api/socialApi'

type CommunityPanelProps = {
  onBack: () => void
}

const starRoutes = [
  {
    id: '1',
    title: 'Тбилиси за 3 дня',
    author: 'Орёл и Решка',
    kind: 'Медиа',
    cover: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&q=80',
    likes: 4210,
    points: 9,
  },
  {
    id: '2',
    title: 'Секретные точки Сочи',
    author: 'Гордей',
    kind: 'Блогер',
    cover: 'https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&q=80',
    likes: 1870,
    points: 6,
  },
  {
    id: '3',
    title: 'Гастротур по Москве',
    author: 'Птушкин',
    kind: 'Блогер',
    cover: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&q=80',
    likes: 2540,
    points: 7,
  },
  {
    id: '4',
    title: 'Выходные в Питере',
    author: 'Аня Ковалёва, подруга',
    kind: 'Друг',
    cover: 'https://images.unsplash.com/photo-1556610961-2fecc5927173?w=800&q=80',
    likes: 96,
    points: 5,
  },
]

const leaderboard = [
  { rank: 1, name: 'Максим Терентьев', countries: 14, avatar: '' },
  { rank: 2, name: 'Ирина Власова', countries: 11, avatar: '' },
  { rank: 3, name: 'Вы', countries: 9, avatar: '', isMe: true },
  { rank: 4, name: 'Данила Панов', countries: 8, avatar: '' },
  { rank: 5, name: 'Соня Рахимова', countries: 7, avatar: '' },
]

function FriendsSection({ language }: { language: 'ru' | 'en' }) {
  const en = language === 'en'
  const [friends, setFriends] = useState<Friend[]>([])
  const [loading, setLoading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [inviteLink, setInviteLink] = useState<string | null>(null)
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const signedIn = isLoggedIn()

  const refreshFriends = async () => {
    if (!signedIn) return
    setLoading(true)
    setError(null)
    try {
      setFriends(await listFriends())
    } catch {
      setError(en ? 'Could not load your friends.' : 'Не удалось загрузить список друзей.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const code = new URLSearchParams(window.location.hash.replace(/^#/, '')).get('friend-invite')
    setInviteCode(code)
    void refreshFriends()
  }, [signedIn])

  const createInvite = async () => {
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      const invite = await createFriendInvite()
      const url = new URL(window.location.href)
      url.hash = new URLSearchParams({ 'friend-invite': invite.invite_code }).toString()
      setInviteLink(url.toString())
      setNotice(en ? 'Invite link created. It expires in 7 days.' : 'Ссылка-приглашение создана и действует 7 дней.')
    } catch {
      setError(en ? 'Could not create an invite. Try again later.' : 'Не удалось создать приглашение. Попробуйте позже.')
    } finally {
      setBusy(false)
    }
  }

  const acceptInvite = async () => {
    if (!inviteCode) return
    setBusy(true)
    setError(null)
    setNotice(null)
    try {
      await acceptFriendInvite(inviteCode)
      setInviteCode(null)
      setInviteLink(null)
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)
      setNotice(en ? 'Friend added.' : 'Друг добавлен.')
      await refreshFriends()
    } catch {
      setError(en ? 'This invite is invalid, expired, or already used.' : 'Приглашение недействительно, истекло или уже использовано.')
    } finally {
      setBusy(false)
    }
  }

  const copyInvite = async () => {
    if (!inviteLink) return
    try {
      await navigator.clipboard.writeText(inviteLink)
      setNotice(en ? 'Invite link copied.' : 'Ссылка скопирована.')
    } catch {
      setNotice(en ? 'Copy the link from the field above.' : 'Скопируйте ссылку из поля выше.')
    }
  }

  const onRemoveFriend = async (friend: Friend) => {
    setBusy(true)
    setError(null)
    try {
      await removeFriend(friend.id)
      setFriends((items) => items.filter((item) => item.id !== friend.id))
      setNotice(en ? 'Friend removed.' : 'Друг удалён.')
    } catch {
      setError(en ? 'Could not remove this friend.' : 'Не удалось удалить друга.')
    } finally {
      setBusy(false)
    }
  }

  if (!signedIn) {
    return <GlassPanel className="p-5 text-sm text-text-secondary">{en ? 'Sign in to manage friends and invitations.' : 'Войдите, чтобы управлять друзьями и приглашениями.'}</GlassPanel>
  }

  return (
    <div className="space-y-3">
      {inviteCode && (
        <GlassPanel className="space-y-3 border-primary/25 p-4">
          <p className="font-sans text-sm text-text">{en ? 'You have a friend invitation.' : 'Вас пригласили в друзья.'}</p>
          <Button size="sm" onClick={() => void acceptInvite()} disabled={busy}>
            <UserPlus />{en ? 'Accept invitation' : 'Принять приглашение'}
          </Button>
        </GlassPanel>
      )}

      <GlassPanel className="space-y-3 p-4">
        <div>
          <h2 className="font-sans text-sm font-semibold text-text">{en ? 'Invite a friend' : 'Пригласить друга'}</h2>
          <p className="mt-1 font-sans text-xs text-text-muted">{en ? 'Invite links expire after 7 days and can be used once.' : 'Ссылка действует 7 дней и принимается только один раз.'}</p>
        </div>
        <Button size="sm" variant="secondary" onClick={() => void createInvite()} disabled={busy}>
          <UserPlus />{busy ? (en ? 'Please wait…' : 'Подождите…') : (en ? 'Create invite link' : 'Создать ссылку-приглашение')}
        </Button>
        {inviteLink && <div className="flex flex-col gap-2 sm:flex-row">
          <input aria-label={en ? 'Friend invite link' : 'Ссылка-приглашение'} readOnly value={inviteLink} className="h-10 min-w-0 flex-1 rounded-md border border-hairline bg-panel px-3 font-sans text-xs text-text" />
          <Button size="sm" variant="ghost" onClick={() => void copyInvite()}><Copy />{en ? 'Copy' : 'Скопировать'}</Button>
        </div>}
      </GlassPanel>

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-sm font-semibold text-text">{en ? 'Your friends' : 'Ваши друзья'}</h2>
        <Button size="sm" variant="ghost" onClick={() => void refreshFriends()} disabled={loading}><RotateCw />{en ? 'Refresh' : 'Обновить'}</Button>
      </div>
      {loading && <p role="status" className="text-sm text-text-muted">{en ? 'Loading friends…' : 'Загружаем друзей…'}</p>}
      {error && <div className="flex items-center justify-between gap-3"><p role="alert" className="text-sm text-error">{error}</p><Button size="sm" variant="ghost" onClick={() => void refreshFriends()}>{en ? 'Retry' : 'Повторить'}</Button></div>}
      {!loading && !error && friends.length === 0 && <GlassPanel className="p-5 text-sm text-text-muted">{en ? 'No friends yet. Create a link to invite someone.' : 'Пока друзей нет. Создайте ссылку, чтобы пригласить знакомого.'}</GlassPanel>}
      {friends.map((friend) => (
        <GlassPanel key={friend.id} className="flex items-center gap-3 p-4">
          <Avatar className="h-10 w-10 border border-hairline"><AvatarFallback className="bg-panel-2 text-sm text-text-secondary">{(friend.name || 'C').slice(0, 2)}</AvatarFallback></Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate font-sans text-sm font-semibold text-text">{friend.name || (en ? 'Crista traveler' : 'Путешественник Crista')}</p>
            <p className="font-sans text-xs text-text-muted">{en ? 'Friend since' : 'В друзьях с'} {new Date(friend.friends_since).toLocaleDateString(en ? 'en' : 'ru')}</p>
          </div>
          <IconButton label={en ? `Remove ${friend.name || 'friend'}` : `Удалить ${friend.name || 'друга'}`} variant="ghost" size="sm" disabled={busy} onClick={() => void onRemoveFriend(friend)}><UserRoundX /></IconButton>
        </GlassPanel>
      ))}
      {notice && <p role="status" className="text-sm text-text-secondary">{notice}</p>}
    </div>
  )
}

export function CommunityPanel({ onBack }: CommunityPanelProps) {
  const { language } = useApp()
  const en = language === 'en'
  return (
    <div className="h-full overflow-y-auto">
      <div className="relative z-10">
        <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-5 pb-2 pt-6 sm:px-6">
          <IconButton label={en ? 'Back' : 'Назад'} variant="ghost" size="sm" className="-ml-2" onClick={onBack}>
            <ArrowLeft />
          </IconButton>
          <h1 className="font-display text-2xl font-semibold text-text">{en ? 'Community' : 'Сообщество'}</h1>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1100px] px-5 pb-8 pt-4 sm:px-6">
        <Tabs defaultValue="routes" className="w-full">
          <TabsList className="h-auto w-full flex-wrap justify-start gap-1 rounded-md border border-hairline bg-panel p-1 sm:w-fit">
            <TabsTrigger value="routes" className="rounded-sm px-4 py-2">Маршруты звёзд и друзей</TabsTrigger>
            <TabsTrigger value="leaderboard" className="rounded-sm px-4 py-2">Лидерборд</TabsTrigger>
          <TabsTrigger value="friends" className="rounded-sm px-4 py-2">{en ? 'Friends' : 'Друзья'}</TabsTrigger>
          </TabsList>

          {/* Маршруты */}
          <TabsContent value="routes" className="mt-6 outline-none">
            <div className="grid gap-4 sm:grid-cols-2">
              {starRoutes.map((route) => (
                <article
                  key={route.id}
                  className="group overflow-hidden rounded-lg border border-hairline bg-panel transition duration-base ease-standard hover:border-hairline-2 hover:bg-panel-2"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Img
                      src={route.cover}
                      alt={route.title}
                      className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
                    />
                    <div className="photo-scrim absolute inset-0" />
                    <button
                      aria-label={`Открыть маршрут «${route.title}»`}
                      className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-ink-950 opacity-0 transition-opacity duration-base group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Chip size="sm">{route.kind}</Chip>
                      <span className="truncate font-sans text-xs text-text-muted">{route.author}</span>
                    </div>
                    <h3 className="mb-2 font-display text-xl font-semibold leading-tight text-text">
                      {route.title}
                    </h3>
                    <div className="flex items-center justify-between font-sans text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5">
                        <Heart className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span className="tabular">{route.likes.toLocaleString('ru')}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                        <span className="tabular">{route.points} точек</span>
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </TabsContent>

          {/* Лидерборд */}
          <TabsContent value="leaderboard" className="mt-6 outline-none">
            <GlassPanel className="divide-y divide-hairline overflow-hidden p-0">
              {leaderboard.map((row) => (
                <div
                  key={row.rank}
                  className={cn('flex items-center gap-4 px-4 py-3.5', row.isMe && 'bg-primary/[0.07]')}
                >
                  <span
                    className={cn(
                      'flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-sans text-xs font-bold tabular',
                      row.rank <= 3 ? 'bg-primary/15 text-primary' : 'bg-panel-2 text-text-muted'
                    )}
                  >
                    {row.rank <= 3 ? <Medal className="h-3.5 w-3.5" aria-hidden="true" /> : row.rank}
                  </span>
                  <Avatar className="h-9 w-9 border border-hairline">
                    <AvatarImage src={row.avatar} />
                    <AvatarFallback className="bg-panel-2 text-xs text-text-secondary">
                      {row.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className={cn('truncate font-sans text-sm font-semibold text-text', row.isMe && 'text-primary')}>
                      {row.name}
                    </p>
                    <p className="font-sans text-xs tabular text-text-muted">
                      {row.countries} стран закрыто
                    </p>
                  </div>
                  {row.rank === 1 && <Crown className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />}
                </div>
              ))}
            </GlassPanel>
          </TabsContent>

          {/* Друзья */}
          <TabsContent value="friends" className="mt-6 outline-none">
            <FriendsSection language={language} />
          </TabsContent>
        </Tabs>

        <p className="mt-6 flex items-start gap-2 rounded-lg border border-dashed border-hairline-2 p-4 font-sans text-xs leading-relaxed text-text-muted">
          <Trophy className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Публикуйте собственные маршруты как шаблоны. Они попадают в общую ленту наравне с маршрутами звёзд.
        </p>
      </div>
    </div>
  )
}
