'use client'

import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './ThemeProvider'

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme()

    return (
        <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="relative w-10 h-10 rounded-full bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] hover:from-[#2563eb] hover:to-[#2F80ED] text-white border border-white/20 shadow-lg transition-all duration-300 hover:scale-110"
            aria-label="Toggle theme"
        >
            {theme === 'light' ? (
                <Moon className="h-5 w-5 transition-transform duration-300" />
            ) : (
                <Sun className="h-5 w-5 transition-transform duration-300" />
            )}
        </Button>
    )
} 