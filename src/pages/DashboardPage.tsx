import { useState, useEffect } from 'react';
import { useAppStore, type Task } from '../store/useAppStore';
// import { TaskColumn } from '../components/board/TaskColumn';
import { Board } from '../components/board/Board';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { useDebounce } from '../hooks/useDebounce';
import { PlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export const DashboardPage = () => {
    const { tasks, fetchTasks, isLoading, error, addTask, updateTask } = useAppStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDesc, setNewTaskDesc] = useState('');

    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');
    const [filterStatus, setFilterStatus] = useState<Task['status'] | 'all'>('all');

    const debouncedSearch = useDebounce(searchQuery, 300);

    // Derived state for filtering
    const filteredTasks = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(debouncedSearch.toLowerCase());
        const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleSubmitTask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        if (editingTask) {
            updateTask(editingTask.id, {
                title: newTaskTitle,
                description: newTaskDesc,
                status: newTaskStatus
            });
        } else {
            addTask(newTaskTitle, newTaskDesc, newTaskStatus);
        }

        closeModal();
    };

    const openAddModal = () => {
        setEditingTask(null);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskStatus('todo');
        setIsModalOpen(true);
    };

    const openEditModal = (task: Task) => {
        setEditingTask(task);
        setNewTaskTitle(task.title);
        setNewTaskDesc(task.description || '');
        setNewTaskStatus(task.status);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTask(null);
        setNewTaskTitle('');
        setNewTaskDesc('');
        setNewTaskStatus('todo');
    };

    // const todoTasks = filteredTasks.filter(t => t.status === 'todo'); // Removed as Board component will handle
    // const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress'); // Removed as Board component will handle
    // const completedTasks = filteredTasks.filter(t => t.status === 'completed'); // Removed as Board component will handle

    if (isLoading && tasks.length === 0) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-100px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 relative z-0">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 sticky top-0 z-20 bg-white dark:bg-gray-900 py-4 px-2 -mx-2 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Project Board</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your tasks and track progress</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto flex-wrap">
                    <div className="relative flex-1 sm:w-64 w-full">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                        <Input
                            placeholder="Search tasks..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as Task['status'] | 'all')}
                        className="w-full sm:w-auto rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white h-[42px]"
                    >
                        <option value="all">All Status</option>
                        <option value="todo">To Do</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>

                    <Button onClick={openAddModal} className="shrink-0 w-full sm:w-auto">
                        <PlusIcon className="w-5 h-5 mr-1" />
                        Add Task
                    </Button>
                </div>
            </div>

            {tasks.length === 0 && !isLoading ? (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <PlusIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm">
                        Get started by creating your first task to keep track of your project progress.
                    </p>
                    <Button onClick={openAddModal}>
                        Create First Task
                    </Button>
                </div>
            ) : (
                <Board tasks={filteredTasks} onEditTask={openEditModal} />
            )}

            {/* Add/Edit Task Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingTask ? 'Edit Task' : 'Add New Task'}
            >
                <form onSubmit={handleSubmitTask} className="space-y-4">
                    <Input
                        label="Title"
                        placeholder="What needs to be done?"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        autoFocus
                        required
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                        <select
                            value={newTaskStatus}
                            onChange={(e) => setNewTaskStatus(e.target.value as Task['status'])}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                        >
                            <option value="todo">To Do</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                        <textarea
                            className="w-full flex rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-600 dark:text-white resize-none h-24"
                            placeholder="Add details..."
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
                        <Button type="submit">{editingTask ? 'Save Changes' : 'Create Task'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
