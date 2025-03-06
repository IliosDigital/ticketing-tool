package com.example.sampleticket.service;

import com.example.sampleticket.model.Task;
import com.example.sampleticket.repo.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;


    @Autowired
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }


    public List<Task> getTasksByAssignedName(String assignedName) {
        return taskRepository.findByAssignedName(assignedName);
    }


    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }


    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }


    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }


    public Task updateTask(Long id, Task updatedTask) {
        return taskRepository.findById(id)
                .map(existingTask -> {
                    // Only update the fields that are provided in updatedTask
                    if (updatedTask.getDescription() != null) {
                        existingTask.setDescription(updatedTask.getDescription());
                    }
                    if (updatedTask.getAssignedName() != null) {
                        existingTask.setAssignedName(updatedTask.getAssignedName());
                    }
                    if (updatedTask.getStatus() != null) {
                        existingTask.setStatus(updatedTask.getStatus());
                    }
                    if (updatedTask.getDate() != null) {
                        existingTask.setDate(updatedTask.getDate());
                    }
                    if (updatedTask.getTier() != null) {
                        existingTask.setTier(updatedTask.getTier());
                    }
                    if (updatedTask.getTaskName() != null) {
                        existingTask.setTaskName(updatedTask.getTier());
                    }
                    // Save and return the updated task
                    return taskRepository.save(existingTask);
                })
                .orElseThrow(() -> new RuntimeException("Task not found with ID: " + id));
    }


    public String deleteTask(Long taskId) {
        if (taskRepository.existsById(taskId)) {
            taskRepository.deleteById(taskId);
            return "Task deleted successfully";
        }
        throw new RuntimeException("Task with ID " + taskId + " not found");
    }
}
