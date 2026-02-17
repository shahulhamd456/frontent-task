import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { cn } from '../utils/cn';

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-300">
            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                isMobileOpen={isMobileOpen}
                closeMobile={() => setIsMobileOpen(false)}
            />

            <div
                className={cn(
                    "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
                    sidebarOpen ? "xl:ml-64" : "xl:ml-20",
                    "ml-0" // Always 0 margin on mobile
                )}
            >
                <Navbar onMenuClick={() => setIsMobileOpen(true)} />
                <main className="p-4 md:p-6 flex-1 w-full">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
