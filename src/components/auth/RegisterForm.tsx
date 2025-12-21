import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { YandexIcon } from '@/components/icons/YandexIcon'

export function RegisterForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <AuthLayout
            title="Создайте"
            subtitle="бесплатный аккаунт"
        >
            <div className="mt-8 grid gap-6">
                {/* Social Login Buttons */}
                <div className="grid gap-3">
                    <Button
                        variant="outline"
                        className="flex h-[3.5rem] w-full items-center justify-center gap-3 rounded-[12px] border border-[#e5e5e5] bg-white px-4 text-[1rem] font-semibold text-[#1a1a1a] transition-all hover:bg-[#f9f9f9] hover:border-[#d1d1d1]"
                    >
                        <YandexIcon />
                        Зарегистрироваться через Яндекс
                    </Button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#f0f0f0]" />
                    </div>
                    <div className="relative flex justify-center text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#cccccc]">
                        <span className="bg-white px-4">ИЛИ</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <Input
                        id="name"
                        placeholder="Полное имя"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-[3.5rem] w-full rounded-[12px] border-[#e5e5e5] bg-white px-4 text-[1rem] placeholder:text-[#bbbbbb] focus:border-[#1a1a1a] focus:ring-0 transition-colors"
                    />
                    <Input
                        id="email"
                        placeholder="Рабочая эл. почта"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-[3.5rem] w-full rounded-[12px] border-[#e5e5e5] bg-white px-4 text-[1rem] placeholder:text-[#bbbbbb] focus:border-[#1a1a1a] focus:ring-0 transition-colors"
                    />
                    <Input
                        id="password"
                        placeholder="Пароль"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="h-[3.5rem] w-full rounded-[12px] border-[#e5e5e5] bg-white px-4 text-[1rem] placeholder:text-[#bbbbbb] focus:border-[#1a1a1a] focus:ring-0 transition-colors"
                    />
                    <Button
                        type="submit"
                        className="mt-2 h-[3.5rem] w-full rounded-[12px] bg-[#10a37f] text-[1rem] font-bold text-white transition-all hover:bg-[#0d8a6a]"
                    >
                        Создать аккаунт
                    </Button>
                </form>

                <div className="text-center text-[0.9rem] md:text-left">
                    <span className="text-[#888888]">Уже есть аккаунт? </span>
                    <Link
                        to="/login"
                        className="font-bold text-[#10a37f] hover:underline underline-offset-4"
                    >
                        Войти
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}
