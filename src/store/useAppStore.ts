import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

export interface User {
    email: string;
    name: string;
    avatar: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'completed';
    createdAt: string;
}

interface AppState {
    // User State
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;

    // Task State
    tasks: Task[];
    isLoading: boolean;
    error: string | null;

    // Task Actions
    fetchTasks: () => Promise<void>;
    addTask: (title: string, description?: string, status?: Task['status']) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;
    setTaskStatus: (id: string, status: Task['status']) => void;

    
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // User Init
            user: null,

            setUser: (user) => {
                set({ user });
                toast.success(`Welcome back, ${user?.name}!`);
            },

            logout: () => {
                set({ user: null });
                toast.success('Logged out successfully');
            },

            // Task Init
            tasks: [],
            isLoading: false,
            error: null,

            fetchTasks: async () => {
                if (get().tasks.length > 0) return;

                set({ isLoading: true, error: null });
                try {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/todos?_limit=10');
                  
                    const apiTasks: Task[] = response.data.map((t: any) => ({
                        id: t.id.toString(),
                        title: t.title,
                        description: '',
                        status: t.completed ? 'completed' : 'todo',
                        createdAt: new Date().toISOString(),
                    }));
                    set({ tasks: apiTasks, isLoading: false });
                } catch (err) {
                    set({ error: 'Failed to fetch tasks', isLoading: false });
                    toast.error('Failed to load tasks');
                }
            },




            addTask: (title, description, status = 'todo') => {
                const newTask: Task = {
                    id: crypto.randomUUID(),
                    title,
                    description,
                    status,
                    createdAt: new Date().toISOString(),
                };
                set((state) => ({ tasks: [newTask, ...state.tasks] }));
                toast.success('Task created successfully');
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
                }));
                toast.success('Task updated');
            },

            deleteTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((t) => t.id !== id),
                }));
                toast.success('Task deleted');
            },

            setTaskStatus: (id, status) => {
                set((state) => ({
                    tasks: state.tasks.map((t) => (t.id === id ? { ...t, status } : t)),
                }));
                // Optional: toast.success(`Moved to ${status}`); // Can be noisy
            },
        }),
        {
            name: 'app-storage', // Unifies persistence
        }
    )
);


