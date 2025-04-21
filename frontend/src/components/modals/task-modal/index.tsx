import { DialogContent, Dialog } from '@/components/ui/dialog';
import { useTaskModal } from '@/hooks/useTaskModal';
import TaskModalHeader from './TaskModalHeader';
import TaskModalDescription from './TaskModalDescription';
import TaskModalActions from './TaskModalActions';
import { useShallow } from 'zustand/react/shallow';
import useTaskActivities from '@/hooks/useTaskActivities';
import Activity from '@/components/Activity';

const TaskModal = () => {
  const { task, list, isOpen, closeModal } = useTaskModal(
    useShallow((state) => ({
      task: state.task,
      list: state.list,
      isOpen: state.isOpen,
      closeModal: state.close,
    })),
  );

  const shouldRenderContent = task && list;

  const { data: activities } = useTaskActivities(task?.id);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        {shouldRenderContent && (
          <>
            <TaskModalHeader task={task} list={list} />
            <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
              <div className="col-span-3">
                <div className="w-full space-y-6">
                  <TaskModalDescription task={task} />
                  {!activities ? (
                    <Activity.Skeleton />
                  ) : (
                    <Activity items={activities} />
                  )}
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
