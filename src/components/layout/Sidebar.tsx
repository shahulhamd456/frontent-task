import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useAppStore } from '../../store/useAppStore';
import {
    Squares2X2Icon,
    Cog6ToothIcon,
    RectangleStackIcon,
    XMarkIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    isMobileOpen: boolean;
    closeMobile: () => void;
}

export const Sidebar = ({ isOpen, toggleSidebar, isMobileOpen, closeMobile }: SidebarProps) => {
    const { user, logout } = useAppStore();
    const navItems = [
        { label: 'Dashboard', path: '/', icon: Squares2X2Icon },
        { label: 'My Tasks', path: '/tasks', icon: RectangleStackIcon },
        { label: 'Settings', path: '/settings', icon: Cog6ToothIcon },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 xl:hidden"
                    onClick={closeMobile}
                />
            )}

            <aside
                className={cn(
                    "fixed left-0 top-0 bottom-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out flex flex-col",
                    // Desktop styles
                    isOpen ? "xl:w-64" : "xl:w-20",
                    // Mobile styles (off-canvas)
                    "w-64 transform xl:translate-x-0",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between p-4 h-16 border-b border-gray-100 dark:border-gray-700 shrink-0">
                    <div className={cn("flex items-center gap-3 overflow-hidden transition-all", isOpen ? "w-auto" : "xl:w-0")}>
                        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center text-white font-bold shrink-0">
                            S
                        </div>
                        <span className="font-bold text-xl text-gray-800 dark:text-white truncate">Store</span>
                    </div>

                    {/* Desktop Toggle */}
                    <button
                        onClick={toggleSidebar}
                        className="hidden xl:block p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        {isOpen ? (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                        )}
                    </button>

                    {/* Mobile Close Button */}
                    <button
                        onClick={closeMobile}
                        className="xl:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-3 space-y-1 mt-4 flex-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeMobile} // Close sidebar on nav click on mobile
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 p-3 rounded-lg transition-colors group relative",
                                isActive
                                    ? "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                            )}
                        >
                            <item.icon className="w-5 h-5 shrink-0" />
                            <span className={cn(
                                "font-medium transition-opacity duration-200",
                                isOpen ? "opacity-100 block" : "xl:opacity-0 xl:hidden block opacity-100" // Always show text in mobile drawer
                            )}>
                                {item.label}
                            </span>
                            {/* Tooltip only for collapsed desktop sidebar */}
                            {!isOpen && (
                                <div className="hidden xl:block absolute left-full ml-2 w-max px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* User Profile Footer - Visible on Mobile and Desktop */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:hidden shrink-0">
                    <div className={cn("flex items-center gap-3 transition-all", isOpen ? "justify-start" : "justify-center")}>
                        <img
                            src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
                            alt="User"
                            className="w-10 h-10 rounded-full ring-2 ring-gray-100 dark:ring-gray-700 shrink-0"
                        />
                        <div className={cn("overflow-hidden transition-all duration-300", isOpen ? "w-auto opacity-100" : "w-0 opacity-0 hidden")}>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name || 'Guest'}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'guest@example.com'}</p>
                        </div>
                        {isOpen && (
                            <button
                                onClick={logout}
                                className="ml-auto p-2 text-gray-400 hover:text-red-500 transition-colors"
                                title="Logout"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
};
