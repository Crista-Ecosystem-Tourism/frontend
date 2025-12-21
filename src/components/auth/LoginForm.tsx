import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { YandexIcon } from '@/components/icons/YandexIcon'

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
    }

    return (
        <AuthLayout
            title="Войдите в аккаунт"
            subtitle="С возвращением! Введите свои данные."
        >
            <div className="mt-8 grid gap-8">
                {/* Social Login Buttons */}
                <div className="grid gap-4">
                    <Button
                        variant="outline"
                        className="flex h-[3.5rem] w-full items-center justify-center gap-3 rounded-[12px] border border-[#e5e5e5] bg-white px-4 text-[1rem] font-semibold text-[#1a1a1a] transition-all hover:bg-[#f9f9f9] hover:border-[#d1d1d1]"
                    >
                        <YandexIcon />
                        Войти через Яндекс
                    </Button>
                </div>

                {/* Elegant Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-[#f0f0f0]" />
                    </div>
                    <div className="relative flex justify-center text-[0.7rem] font-bold uppercase tracking-[0.2em] text-[#cccccc]">
                        <span className="bg-white px-4">ИЛИ</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-5">
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaaaaa]">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                        <Input
                            id="email"
                            placeholder="Рабочая эл. почта"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-[3.5rem] w-full rounded-[12px] border-[#e5e5e5] bg-white pl-12 pr-4 text-[1rem] placeholder:text-[#bbbbbb] focus:border-[#1a1a1a] focus:ring-0 transition-colors"
                        />
                    </div>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#aaaaaa]">
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <Input
                            id="password"
                            placeholder="Пароль"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-[3.5rem] w-full rounded-[12px] border-[#e5e5e5] bg-white pl-12 pr-4 text-[1rem] placeholder:text-[#bbbbbb] focus:border-[#1a1a1a] focus:ring-0 transition-colors"
                        />
                    </div>

                    <Button
                        type="submit"
                        className="h-[3.5rem] w-full rounded-[12px] bg-[#10a37f] text-[1rem] font-bold text-white transition-all hover:bg-[#0d8a6a]"
                    >
                        Войти через почту
                    </Button>
                </form>

                <div className="text-center text-[0.9rem] md:text-left">
                    <span className="text-[#888888]">Нет аккаунта? </span>
                    <Link
                        to="/signup"
                        className="font-bold text-[#10a37f] hover:underline underline-offset-4"
                    >
                        Зарегистрируйтесь бесплатно
                    </Link>
                </div>
            </div>
        </AuthLayout>
    )
}
