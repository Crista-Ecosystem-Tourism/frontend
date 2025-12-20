import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthLayout } from './AuthLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { YandexIcon } from '@/components/icons/YandexIcon'

// Resusing icons inline or could extract to a shared component

export function RegisterForm() {
    const [email, setEmail] = useState('')

    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // console.log('Register:', { name, email, password })
    }

    return (
        <AuthLayout
            title="Создать аккаунт"
            subtitle="Присоединяйтесь, чтобы спланировать своё путешествие."
        >
            <div className="grid gap-4">
                {/* Social Login Buttons */}
                <div className="grid gap-3">
                    <Button variant="outline" className="w-full h-12 rounded-full font-medium text-base border-border hover:bg-surface-light">
                        <YandexIcon />
                        Зарегистрироваться через Яндекс
                    </Button>
                </div>

                <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-text-muted">
                            Или зарегистрироваться с email
                        </span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-4">
                    <div className="grid gap-2">
                        <Input
                            id="name"
                            placeholder="Полное имя"
                            type="text"
                            autoComplete="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-12 rounded-xl"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="email"
                            placeholder="email@example.com"
                            type="email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="h-12 rounded-xl"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Input
                            id="password"
                            placeholder="Придумайте пароль"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 rounded-xl"
                        />
                    </div>
                    <Button type="submit" className="w-full h-12 rounded-full text-base font-semibold shadow-lg shadow-primary/20">
                        Создать аккаунт
                    </Button>
                </form>

                <div className="text-center text-sm text-text-secondary mt-4">
                    Уже есть аккаунт?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-primary hover:text-primary-hover underline-offset-4 hover:underline"
                    >
                        Войти
                    </Link>
                </div>

                <p className="px-8 text-center text-xs text-text-muted mt-4">
                    Нажимая «Создать аккаунт», вы соглашаетесь с{' '}
                    <Link to="/terms" className="underline underline-offset-4 hover:text-primary">
                        Условиями использования
                    </Link>{' '}
                    и{' '}
                    <Link to="/privacy" className="underline underline-offset-4 hover:text-primary">
                        Политикой конфиденциальности
                    </Link>
                    .
                </p>
            </div>
        </AuthLayout>
    )
}
