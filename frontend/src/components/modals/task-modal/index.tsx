import { DialogContent, Dialog } from '@/components/ui/dialog';
import { useTaskModal } from '@/hooks/useTaskModal';
import TaskModalHeader from './TaskModalHeader';
import TaskModalDescription from './TaskModalDescription';
import TaskModalActions from './TaskModalActions';

const TaskModal = () => {
  const task = useTaskModal((state) => state.task);
  const list = useTaskModal((state) => state.list);
  const isOpen = useTaskModal((state) => state.isOpen);
  const closeModal = useTaskModal((state) => state.close);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        {task && list && (
          <>
            <TaskModalHeader task={task} list={list} />
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              <div className="col-span-3">
                <div className="w-full space-y-6">
                  <TaskModalDescription task={task} />
                </div>
              </div>
              <TaskModalActions task={task} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal;
