'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/lib/axios';
import { isTokenExpired } from '@/lib/jwt';

interface User {
    id: string;
    name: string;
    email: string;
    description?: string;
    industry?: string;
    size?: string;
    website?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: RegisterData) => Promise<{ success: boolean; message: string }>;
    logout: () => void;
    isAuthenticated: boolean;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
    description: string;
    industry: string;
    size: string;
    website: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}



export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                // Check if token is expired
                if (isTokenExpired(token)) {
                    console.log('Token expired, logging out user');
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('user');
                    setUser(null);
                } else {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);
                }
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('authToken');
                localStorage.removeItem('user');
                setUser(null);
            }
        } else {
            setUser(null);
        }

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/company/login', { email, password });
            const { access_token } = response.data;
            localStorage.setItem('authToken', access_token);

            // Fetch user profile from /me endpoint
            const meResponse = await api.get('/auth/company/me', {
                headers: { Authorization: `Bearer ${access_token}` }
            });
            const userData = meResponse.data;

            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error: any) {
            // handle error
        } finally {
            setLoading(false);
        }
    };


    const register = async (userData: RegisterData) => {
        try {
            setLoading(true);
            const response = await api.post('/auth/company/register', userData);
            return { success: true, message: 'Registration successful! Please login.', autoLogin: false };
        } catch (error: any) {
            console.error('Register error:', error);
            throw new Error(error.response?.data?.detail || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 