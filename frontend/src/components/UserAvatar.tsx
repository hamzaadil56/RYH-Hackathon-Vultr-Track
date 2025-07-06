'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';

export const UserAvatar = () => {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1E293B] px-3 py-2 rounded-full border border-gray-200 dark:border-gray-600">
                <div className="w-8 h-8 bg-gradient-to-r from-[#3887F6] to-[#3AC7A7] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user.name}
                </span>
            </div>
            <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
            >
                <LogOut className="w-4 h-4" />
                Logout
            </Button>
        </div>
    );
}; 