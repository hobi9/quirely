package com.quirely.backend.service;

import com.quirely.backend.dto.task.TaskCreationRequest;
import com.quirely.backend.dto.task.TaskReorderRequest;
import com.quirely.backend.dto.task.TaskUpdateRequest;
import com.quirely.backend.entity.Activity;
import com.quirely.backend.entity.Task;
import com.quirely.backend.entity.TaskList;
import com.quirely.backend.entity.User;
import com.quirely.backend.enums.ActivityAction;
import com.quirely.backend.enums.ActivityEntityType;
import com.quirely.backend.exception.types.TaskNotFoundException;
import com.quirely.backend.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final TaskListService taskListService;
    private final ActivityService activityService;

    public Task createTask(TaskCreationRequest request, Long taskListId, User user) {
        TaskList taskList = taskListService.getTaskList(taskListId, user.getId());

        Task createdTask = taskRepository.save(
                Task.builder()
                        .title(request.title().trim())
                        .list(taskList)
                        .description(request.description())
                        .order(taskRepository.countTasksByListId(taskList.getId()))
                        .build()
        );

        activityService.createActivity(taskList.getBoard().getWorkspace(), ActivityAction.CREATE, ActivityEntityType.TASK, user, createdTask.getTitle(), createdTask.getId());
        return createdTask;
    }

    @Transactional
    public Task reorderTask(TaskReorderRequest request, Long taskId, Long userId) {
        Long newTaskListId = request.taskListId();
        TaskList taskList = taskListService.getTaskList(newTaskListId, userId);
        Task task = taskRepository.findTaskByIdAndMember(taskId, userId)
                .orElseThrow(TaskNotFoundException::new);

        Long oldTaskListId = task.getList().getId();
        int oldOrder = task.getOrder();
        int newOrder;

        var affectedTasks = new LinkedList<Task>();
        affectedTasks.add(task);

        if (oldTaskListId.equals(newTaskListId) && task.getOrder() != request.order()) {
            // Reorder within the same list
            int numberOfTasksInTaskList = taskRepository.countTasksByListId(taskList.getId());
            newOrder = Math.min(request.order(), numberOfTasksInTaskList - 1);

            if (newOrder > oldOrder) {
                List<Task> taskListsForLeftShift = taskRepository.getTasksForLeftShift(taskId, oldTaskListId, oldOrder, newOrder);
                taskListsForLeftShift.forEach(taskListForLeftShift -> taskListForLeftShift.setOrder(taskListForLeftShift.getOrder() - 1));
                affectedTasks.addAll(taskListsForLeftShift);
            } else {
                List<Task> taskListsForRightShift = taskRepository.getTasksForRightShift(taskId, oldTaskListId, oldOrder, newOrder);
                taskListsForRightShift.forEach(taskListForRightShift -> taskListForRightShift.setOrder(taskListForRightShift.getOrder() + 1));
                affectedTasks.addAll(taskListsForRightShift);
            }

            task.setOrder(newOrder);
        } else if (!oldTaskListId.equals(newTaskListId)) {
            //Move to a different list
            int numberOfTasksInNewTaskList = taskRepository.countTasksByListId(newTaskListId);
            int numberOfTasksInOldTaskList = taskRepository.countTasksByListId(oldTaskListId);
            newOrder = Math.min(request.order(), numberOfTasksInNewTaskList);

            List<Task> taskListsForRightShift = taskRepository.getTasksForRightShift(taskId, newTaskListId, numberOfTasksInNewTaskList, newOrder);
            taskListsForRightShift.forEach(taskListForRightShift -> taskListForRightShift.setOrder(taskListForRightShift.getOrder() + 1));

            List<Task> taskListsForLeftShift = taskRepository.getTasksForLeftShift(taskId, oldTaskListId, oldOrder, numberOfTasksInOldTaskList - 1);
            taskListsForLeftShift.forEach(taskListForLeftShift -> taskListForLeftShift.setOrder(taskListForLeftShift.getOrder() - 1));

            affectedTasks.addAll(taskListsForLeftShift);
            affectedTasks.addAll(taskListsForRightShift);
            task.setList(taskList);
            task.setOrder(newOrder);
        }

        taskRepository.saveAll(affectedTasks);
        return task;
    }

    public Task updateTask(TaskUpdateRequest request, Long taskId, User user) {
        Task task = taskRepository.findTaskByIdAndMember(taskId, user.getId())
                .orElseThrow(TaskNotFoundException::new);

        task.setTitle(request.title().trim());
        task.setDescription(request.description());


        Task updatedTask = taskRepository.save(task);
        activityService.createActivity(updatedTask.getList().getBoard().getWorkspace(), ActivityAction.UPDATE, ActivityEntityType.TASK, user, updatedTask.getTitle(), updatedTask.getId());
        return updatedTask;
    }

    @Transactional
    public void deleteTask(Long taskId, User user) {
        Task task = taskRepository.findTaskByIdAndMember(taskId, user.getId())
                .orElseThrow(TaskNotFoundException::new);
        Long taskListId = task.getList().getId();


        int numberOfTasksInTaskList = taskRepository.countTasksByListId(task.getList().getId());

        List<Task> taskListsForRightShift = taskRepository.getTasksForRightShift(taskId, taskListId, task.getOrder(), numberOfTasksInTaskList);
        taskListsForRightShift.forEach(tl -> tl.setOrder(numberOfTasksInTaskList - 1));


        taskRepository.delete(task);
        taskRepository.saveAll(taskListsForRightShift);
        activityService.createActivity(task.getList().getBoard().getWorkspace(), ActivityAction.DELETE, ActivityEntityType.TASK, user, task.getTitle(), task.getId());
    }

    public Task duplicateTask(Long taskId, User user) {
        Task task = taskRepository.findTaskByIdAndMember(taskId, user.getId())
                .orElseThrow(TaskNotFoundException::new);

        int numberOfTasksInTaskList = taskRepository.countTasksByListId(task.getList().getId());

        var clone = new Task();
        BeanUtils.copyProperties(task, clone);

        clone.setId(null);
        task.setOrder(numberOfTasksInTaskList);
        task.setUpdatedAt(null);

        Task clonedTask = taskRepository.save(clone);
        activityService.createActivity(task.getList().getBoard().getWorkspace(), ActivityAction.CREATE, ActivityEntityType.TASK, user, clonedTask.getTitle(), clonedTask.getId());
        return clonedTask;
    }

    public List<Activity> getTaskActivities(Long taskId, User user) {
        Task task = taskRepository.findTaskByIdAndMember(taskId, user.getId())
                .orElseThrow(TaskNotFoundException::new);


        return activityService.findByEntityIdAndEntityType(task.getId(), ActivityEntityType.TASK, 3);
    }

}
