import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserCircleIcon, BellIcon, SwatchIcon } from '@heroicons/react/24/outline';

export const SettingsPage = () => {
    const { user, setUser } = useAppStore();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [theme, setTheme] = useState<'light' | 'dark'>(
        (localStorage.getItem('theme') as 'light' | 'dark') || 'light'
    );

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (user) {
            setUser({ ...user, name, email });
            // toast.success('Profile updated'); // setUser already toasts
        }
    };

    const toggleTheme = (newTheme: 'light' | 'dark') => {
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-10">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage your account preferences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Profile Section */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                                <UserCircleIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                        </div>

                        <form onSubmit={handleSaveProfile} className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                <img
                                    src={user?.avatar}
                                    alt="Avatar"
                                    className="w-20 h-20 rounded-full ring-4 ring-gray-100 dark:ring-gray-700"
                                />
                                <div className="flex-1 space-y-4 w-full">
                                    <Input
                                        label="Display Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <Input
                                        label="Email Address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <Button type="submit">Save Changes</Button>
                            </div>
                        </form>
                    </div>

                    {/* Notifications Section */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                <BellIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h2>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates about your tasks</p>
                            </div>
                            <button
                                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${notificationsEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                                <SwatchIcon className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={() => toggleTheme('light')}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${theme === 'light' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <div className="w-6 h-6 rounded-full bg-white border border-gray-300"></div>
                                <span className="font-medium text-gray-900 dark:text-white">Light Mode</span>
                            </button>
                            <button
                                onClick={() => toggleTheme('dark')}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${theme === 'dark' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-600' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <div className="w-6 h-6 rounded-full bg-gray-900 border border-gray-700"></div>
                                <span className="font-medium text-gray-900 dark:text-white">Dark Mode</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
