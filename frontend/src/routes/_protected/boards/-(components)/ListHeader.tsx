import { useToast } from '@/hooks/use-toast';
import { updateList } from '@/services/listService';
import { List } from '@/types/list';
import { useRef, useState } from 'react';
import { useEventListener } from 'usehooks-ts';
import ListOptions from './ListOptions';

const ListHeader: React.FC<{ list: List; handleAddTask: () => void }> = ({
  list,
  handleAddTask,
}) => {
  const [title, setTitle] = useState(list.title);
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      formRef.current?.requestSubmit();
    }
  };

  const handleListUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim().length) {
      return;
    }

    if (list.title === title) {
      return disableEditing();
    }

    await updateList(list.id, { ...list, title });

    toast({
      description: <span>List updated successfully</span>,
    });
    setTitle(title);
    disableEditing();
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  useEventListener('keydown', onKeyDown);

  return (
    <div className="flex items-start justify-between gap-x-2 px-2 pt-2 text-sm font-semibold">
      {isEditing ? (
        <form
          onSubmit={handleListUpdate}
          ref={formRef}
          className="flex-1 px-[2px]"
        >
          <input
            className="hover:border-input focus:border-input h-7 w-full truncate border-transparent bg-transparent px-[7px] py-1 text-sm font-medium transition focus:bg-white"
            id="title"
            ref={inputRef}
            onBlur={onBlur}
            value={title}
            placeholder="Enter list title..."
            onChange={(e) => setTitle(e.target.value)}
          />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="h-7 w-full border-transparent px-2.5 py-1 text-sm font-medium"
        >
          {title}
        </div>
      )}
      <ListOptions list={list} handleAddTask={handleAddTask} />
    </div>
  );
};
export default ListHeader;
