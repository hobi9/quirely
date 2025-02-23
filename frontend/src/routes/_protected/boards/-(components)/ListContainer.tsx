import { List } from '@/types/list';
import ListForm from './ListForm';
import ListItem from './ListItem';
import { useEffect, useState } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { updateList } from '@/services/listService';
import { updateTask } from '@/services/taskService';

const reorder = <T extends unknown>(
  list: T[],
  startIndex: number,
  endIndex: number,
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed!);
  return result;
};

const ListContainer: React.FC<{ lists: List[] }> = ({ lists }) => {
  const [orderedLists, setOrderedLists] = useState(lists);

  useEffect(() => {
    setOrderedLists(lists);
  }, [lists]);

  const onDragEnd = async (result: any) => {
    const { source, destination, type } = result;

    if (!destination) return;

    //if dropped in the same position
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    //user moves a list
    if (type === 'list') {
      const newLists = reorder(
        orderedLists,
        source.index,
        destination.index,
      ).map((list, index) => ({ ...list, order: index }));
      setOrderedLists(newLists);
      const list = orderedLists[source.index]!;
      await updateList(list.id, {
        title: list.title,
        order: destination.index,
      });
    }

    //user moves a task
    if (type === 'card') {
      let newOrderedData = [...orderedLists];

      //Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id.toString() === source.droppableId,
      );

      const destinationList = newOrderedData.find(
        (list) => list.id.toString() === destination.droppableId,
      );

      if (!sourceList || !destinationList) return;

      // Check if cards exist on the source list
      if (!sourceList.tasks) {
        sourceList.tasks = [];
      }

      //check if cards exist on the destList
      if (!destinationList.tasks) {
        destinationList.tasks = [];
      }

      // moving the card in the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.tasks,
          source.index,
          destination.index,
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.tasks = reorderedCards;
        setOrderedLists(newOrderedData);
        const task = sourceList.tasks[destination.index]!;
        await updateTask(task.id, {
          title: task.title,
          description: task.description,
          order: destination.index,
          taskListId: sourceList.id,
        });
      } else {
        // moving the card to another list
        const [removed] = sourceList.tasks.splice(source.index, 1);

        destinationList.tasks.splice(destination.index, 0, removed!);

        sourceList.tasks.forEach((card, index) => {
          card.order = index;
        });

        // Update the order for each card in the destination list
        destinationList.tasks.forEach((card, index) => {
          card.order = index;
        });
        setOrderedLists(newOrderedData);
        const task = destinationList.tasks[destination.index]!;
        await updateTask(task.id, {
          title: task.title,
          description: task.description,
          order: destination.index,
          taskListId: destinationList.id,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="list" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex h-full gap-x-3"
          >
            {orderedLists.map((list, index) => (
              <ListItem key={list.id} list={list} index={index} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="w-1 shrink-0" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};
export default ListContainer;
