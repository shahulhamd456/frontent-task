import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const setUser = useAppStore((state) => state.setUser);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const name = email.split('@')[0];
        const mockUser = {
            email,
            name: name.charAt(0).toUpperCase() + name.slice(1),
            avatar: `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff`,
        };

        setUser(mockUser);
        setIsLoading(false);
        navigate('/');
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 w-full space-y-6">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Enter your credentials to access your workspace
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <EnvelopeIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    <Input
                        type="email"
                        placeholder="Email address"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="relative">
                    <LockClosedIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                    <Input
                        type="password"
                        placeholder="Password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <Button
                    className="w-full shadow-lg shadow-primary-500/30 transition-all hover:scale-[1.02]"
                    size="lg"
                    isLoading={isLoading}
                >
                    Sign In
                </Button>
            </form>

            <div className="text-center text-xs text-gray-400">
                <p>Use any email/password to login</p>
            </div>
        </div>
    );
};
