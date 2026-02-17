import { Draggable } from '@hello-pangea/dnd';
import { useAppStore, type Task } from '../../store/useAppStore';
import { PencilSquareIcon, TrashIcon, ClockIcon } from '@heroicons/react/24/outline';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
    task: Task;
    index: number;
    onEdit: (task: Task) => void;
}

export const TaskCard = ({ task, index, onEdit }: TaskCardProps) => {
    const { deleteTask } = useAppStore();

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this task?')) {
            deleteTask(task.id);
        }
    };

    return (
        <Draggable draggableId={task.id} index={index}>
            {(provided, snapshot) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                    }}
                    className={`bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group ${snapshot.isDragging ? 'shadow-xl ring-2 ring-primary-500 rotate-2' : ''}`}
                >
                    <div className="flex justify-between items-start mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${task.status === 'todo' ? 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' :
                            task.status === 'in-progress' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
                                'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                            {task.status === 'todo' ? 'To Do' : task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                        </span>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => onEdit(task)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-400"
                                title="Edit"
                            >
                                <PencilSquareIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleDelete}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                title="Delete"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">{task.title}</h3>

                    {task.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                            {task.description}
                        </p>
                    )}

                    <div className="flex items-center text-xs text-gray-400 dark:text-gray-500 mt-2">
                        <ClockIcon className="w-3.5 h-3.5 mr-1" />
                        {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                    </div>

                    {/* Quick Status Actions */}
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-2 justify-end">
                        {task.status === 'todo' && (
                            <button
                                onClick={() => useAppStore.getState().setTaskStatus(task.id, 'in-progress')}
                                className="text-xs px-2 py-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors"
                            >
                                Start →
                            </button>
                        )}
                        {task.status === 'in-progress' && (
                            <>
                                <button
                                    onClick={() => useAppStore.getState().setTaskStatus(task.id, 'todo')}
                                    className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                                >
                                    ← Todo
                                </button>
                                <button
                                    onClick={() => useAppStore.getState().setTaskStatus(task.id, 'completed')}
                                    className="text-xs px-2 py-1 rounded bg-green-50 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors"
                                >
                                    Done ✓
                                </button>
                            </>
                        )}
                        {task.status === 'completed' && (
                            <button
                                onClick={() => useAppStore.getState().setTaskStatus(task.id, 'in-progress')}
                                className="text-xs px-2 py-1 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                            >
                                ← Reopen
                            </button>
                        )}
                    </div>
                </div>
            )}
        </Draggable>
    );
};
