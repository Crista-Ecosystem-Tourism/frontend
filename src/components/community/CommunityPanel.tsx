import { ArrowLeft, Users, Heart, MapPin, Play, Trophy, Medal, Flame, UserPlus, Crown } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

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
    cover: 'https://images.unsplash.com/photo-1601918922056-3b3b09b9c7d6?w=800&q=80',
    likes: 1870,
    points: 6,
  },
  {
    id: '3',
    title: 'Гастротур по Казани',
    author: 'Птушкин',
    kind: 'Блогер',
    cover: 'https://images.unsplash.com/photo-1547448415-e9f5b28e570d?w=800&q=80',
    likes: 2540,
    points: 7,
  },
  {
    id: '4',
    title: 'Выходные в Питере',
    author: 'Аня К. · подруга',
    kind: 'Друг',
    cover: 'https://images.unsplash.com/photo-1556610961-ef2c3d9baf7b?w=800&q=80',
    likes: 96,
    points: 5,
  },
]

const leaderboard = [
  { rank: 1, name: 'Максим Т.', countries: 14, avatar: '' },
  { rank: 2, name: 'Ирина В.', countries: 11, avatar: '' },
  { rank: 3, name: 'Вы', countries: 9, avatar: '', isMe: true },
  { rank: 4, name: 'Данила П.', countries: 8, avatar: '' },
  { rank: 5, name: 'Соня Р.', countries: 7, avatar: '' },
]

const friends = [
  { name: 'Аня К.', progress: 62, racing: true },
  { name: 'Пётр С.', progress: 40, racing: false },
  { name: 'Лена М.', progress: 81, racing: true },
]

export function CommunityPanel({ onBack }: CommunityPanelProps) {
  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto">
      <div className="flex-shrink-0 p-4 pb-3 border-b border-border sticky top-0 bg-background/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-text-secondary" />
          </button>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary shrink-0" />
            <h1 className="text-xl font-bold text-text">Сообщество</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-6 max-w-4xl w-full mx-auto min-h-0">
        <Tabs defaultValue="routes" className="w-full">
          <TabsList className="w-full sm:w-fit h-auto flex-wrap justify-start gap-1 bg-surface-light/80 p-1 rounded-xl border border-border/50">
            <TabsTrigger value="routes" className="rounded-lg px-4 py-2">Маршруты звёзд и друзей</TabsTrigger>
            <TabsTrigger value="leaderboard" className="rounded-lg px-4 py-2">Лидерборд</TabsTrigger>
            <TabsTrigger value="friends" className="rounded-lg px-4 py-2">Друзья</TabsTrigger>
          </TabsList>

          <TabsContent value="routes" className="mt-6 outline-none">
            <div className="grid sm:grid-cols-2 gap-4">
              {starRoutes.map(route => (
                <div key={route.id} className="group rounded-2xl border border-border bg-surface-light/40 overflow-hidden hover:border-primary/40 hover:shadow-lg transition-all">
                  <div className="relative h-36">
                    <img src={route.cover} alt={route.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-white/20 backdrop-blur-md rounded-full px-2.5 py-1">
                      {route.kind}
                    </span>
                    <button className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-4 h-4 text-black fill-black" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-text mb-1">{route.title}</h3>
                    <p className="text-xs text-text-muted mb-3">{route.author}</p>
                    <div className="flex items-center justify-between text-xs text-text-secondary">
                      <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {route.likes.toLocaleString('ru')}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {route.points} точек</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="mt-6 outline-none">
            <div className="rounded-2xl border border-border bg-surface-light/40 divide-y divide-border overflow-hidden">
              {leaderboard.map(row => (
                <div
                  key={row.rank}
                  className={cn(
                    'flex items-center gap-4 px-4 py-3.5',
                    row.isMe && 'bg-primary/5'
                  )}
                >
                  <span className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0',
                    row.rank === 1 ? 'bg-amber-400/20 text-amber-500' :
                    row.rank === 2 ? 'bg-slate-300/30 text-slate-400' :
                    row.rank === 3 ? 'bg-orange-400/20 text-orange-500' : 'bg-surface text-text-muted'
                  )}>
                    {row.rank <= 3 ? <Medal className="w-3.5 h-3.5" /> : row.rank}
                  </span>
                  <Avatar className="w-9 h-9 border border-border">
                    <AvatarImage src={row.avatar} />
                    <AvatarFallback className="bg-surface text-text-secondary text-xs">{row.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className={cn('text-sm font-semibold text-text', row.isMe && 'text-primary')}>{row.name}</p>
                    <p className="text-xs text-text-muted">{row.countries} стран закрыто</p>
                  </div>
                  {row.rank === 1 && <Crown className="w-4 h-4 text-amber-500" />}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="friends" className="mt-6 outline-none">
            <div className="space-y-3">
              {friends.map(friend => (
                <div key={friend.name} className="flex items-center gap-4 rounded-2xl border border-border bg-surface-light/40 p-4">
                  <Avatar className="w-10 h-10 border border-border">
                    <AvatarFallback className="bg-surface text-text-secondary text-sm">{friend.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-semibold text-text">{friend.name}</p>
                      {friend.racing && (
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-orange-500">
                          <Flame className="w-3 h-3" /> Гонка
                        </span>
                      )}
                    </div>
                    <div className="h-1.5 rounded-full bg-surface overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${friend.progress}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-text-muted w-9 text-right">{friend.progress}%</span>
                </div>
              ))}
              <button className="w-full flex items-center justify-center gap-2 rounded-2xl border border-dashed border-border p-4 text-sm font-semibold text-text-secondary hover:text-primary hover:border-primary/40 transition-colors">
                <UserPlus className="w-4 h-4" /> Пригласить друга — совместно откроете страну
              </button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex items-center gap-2 mt-6 rounded-xl border border-dashed border-border p-4 text-xs text-text-muted">
          <Trophy className="w-4 h-4 flex-shrink-0" />
          Публикуйте собственные маршруты как шаблоны — они попадают в общую ленту наравне с маршрутами звёзд.
        </div>
      </div>
    </div>
  )
}
