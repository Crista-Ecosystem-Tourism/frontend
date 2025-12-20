import React from 'react'
import { motion } from 'framer-motion'
import PixelPlanet from '@/components/canvas/PixelPlanet'

interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full bg-background">
            {/* Left side - content */}
            <div className="flex w-full flex-col justify-center px-4 md:w-1/2 lg:w-[45%] xl:w-[40%]">
                <div className="mx-auto w-full max-w-md">
                    {/* Logo or Brand mark could go here */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h1 className="mb-2 text-3xl font-bold tracking-tight text-text md:text-4xl">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="mb-8 text-lg text-text-secondary">{subtitle}</p>
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>

            {/* Right side - branding/visual */}
            <div className="relative hidden w-0 flex-1 md:block bg-black">
                <div className="absolute inset-0 overflow-hidden">
                    <PixelPlanet />

                    {/* Overlay content */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-end p-12 pb-24 text-center z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.5 }}
                        >
                            <div className="glass-effect rounded-2xl p-6 backdrop-blur-md bg-black/30 border border-white/10 shadow-2xl max-w-md mx-auto">
                                <h2 className="text-2xl font-bold text-white mb-2">Исследуйте мир</h2>
                                <p className="text-gray-200">
                                    Откройте для себя новые горизонты с нашим AI-планировщиком.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}
