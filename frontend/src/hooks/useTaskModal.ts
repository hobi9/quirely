import { List } from '@/types/list';
import { Task } from '@/types/task';
import { create } from 'zustand';

type TaskModalStore = {
  task?: Task;
  list?: List;
  isOpen: boolean;
  open: (task: Task, list: List) => void;
  close: () => void;
};

export const useTaskModal = create<TaskModalStore>((set) => ({
  task: undefined,
  list: undefined,
  isOpen: false,
  open: (task, list) => set({ task, list, isOpen: true }),
  close: () => set({ isOpen: false, task: undefined, list: undefined }),
}));
