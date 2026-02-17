import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import { useAppStore, type Task } from '../../store/useAppStore';
import { TaskColumn } from './TaskColumn';

interface BoardProps {
    tasks: Task[];
    onEditTask: (task: Task) => void;
}

export const Board = ({ tasks, onEditTask }: BoardProps) => {
    const { setTaskStatus } = useAppStore();

    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const newStatus = destination.droppableId as Task['status'];
        setTaskStatus(draggableId, newStatus);
    };

    const todoTasks = tasks.filter(t => t.status === 'todo');
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
    const completedTasks = tasks.filter(t => t.status === 'completed');

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 items-start h-full md:min-h-[calc(100vh-140px)] w-full max-w-full">
                <div className="flex-shrink-0 w-full md:w-[320px]">
                    <TaskColumn
                        title="To Do"
                        count={todoTasks.length}
                        tasks={todoTasks}
                        status="todo"
                        onEditTask={onEditTask}
                    />
                </div>
                <div className="flex-shrink-0 w-full md:w-[320px]">
                    <TaskColumn
                        title="In Progress"
                        count={inProgressTasks.length}
                        tasks={inProgressTasks}
                        status="in-progress"
                        onEditTask={onEditTask}
                    />
                </div>
                <div className="flex-shrink-0 w-full md:w-[320px]">
                    <TaskColumn
                        title="Completed"
                        count={completedTasks.length}
                        tasks={completedTasks}
                        status="completed"
                        onEditTask={onEditTask}
                    />
                </div>
            </div>
        </DragDropContext>
    );
};
