import { type Task } from '../../store/useAppStore';
import { TaskCard } from './TaskCard';
import { Droppable } from '@hello-pangea/dnd';

interface TaskColumnProps {
    title: string;
    count: number;
    tasks: Task[];
    status: Task['status'];
    onEditTask: (task: Task) => void;
}

export const TaskColumn = ({ title, count, tasks, status, onEditTask }: TaskColumnProps) => {
    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800 w-full">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-semibold text-gray-700 dark:text-gray-200">{title}</h2>
                    <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-0.5 rounded-full font-medium">
                        {count}
                    </span>
                </div>
            </div>

            <Droppable droppableId={status}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex flex-col gap-3 flex-1 overflow-y-auto min-h-[150px] md:min-h-[500px] transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''
                            }`}
                    >
                        {tasks.map((task, index) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onEdit={onEditTask}
                            />
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </div>
    );
};
