package com.example.sampleticket.controller;

import com.example.sampleticket.model.User;
import com.example.sampleticket.model.Task;
import com.example.sampleticket.service.UserService;
import com.example.sampleticket.service.TaskService;
import com.example.sampleticket.repo.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private TaskService taskService;
    @Autowired
    private TaskRepository TaskRepository;

    @PostMapping("/tasks/add")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        Task savedTask = taskService.saveTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedTask);
    }

    @GetMapping("/tasks/all")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {

        Optional<Task> optionalTask = taskService.getTaskById(id);


        if (!optionalTask.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }


        Task task = optionalTask.get();


        if ("Completed".equals(updatedTask.getStatus())) {
            if ("PRICING".equals(task.getTier())) {
                task.setTier("SOW");
                task.setStatus("Open");
            } else if ("SOW".equals(task.getTier())) {
                task.setTier("IMPLEMENTATION");
                task.setStatus("Open");
            }
            else if ("POC".equals(task.getTier())) {
                task.setStatus("Completed");
            }
            else if ("TENDER".equals(task.getTier())) {
                task.setStatus("Completed");
            }
            else if ("IMPLEMENTATION".equals(task.getTier())) {
                task.setStatus("Completed");
            }
        } else {
            
            task.setStatus(updatedTask.getStatus());
        }

        task.setTaskName(updatedTask.getTaskName());
        task.setDescription(updatedTask.getDescription());
        task.setDate(updatedTask.getDate()); // Ensure date is properly updated
        task.setAssignedName(updatedTask.getAssignedName());
        task.setRemarks(updatedTask.getRemarks());



        Task savedTask = taskService.saveTask(task);
        return ResponseEntity.ok(task);
    }




    @GetMapping("/tasks/user/{assignedName}")
    public ResponseEntity<List<Task>> getTasksByUser(@PathVariable String assignedName) {
        List<Task> tasks = taskService.getTasksByAssignedName(assignedName);
        tasks.forEach(task -> {
            if (task.getCategory() == null || task.getCategory().isEmpty()) {
                task.updateCategoryBasedOnStatus();
            }
        });
        return ResponseEntity.ok(tasks);
    }
    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Map<String, String>> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Task deleted successfully");

        return ResponseEntity.ok(response);
    }

    @PutMapping("/tasks/{id}/remarks")
    public ResponseEntity<Task> updateTaskRemarks(@PathVariable Long id, @RequestBody String remarks) {
        Optional<Task> taskOpt = TaskRepository.findById(id);
        if (taskOpt.isPresent()) {
            Task task = taskOpt.get();


            task.setRemarks(remarks);

            TaskRepository.save(task);
            return ResponseEntity.ok(task);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "Request body cannot be null");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        if (userService.findByEmail(user.getEmail()) != null) {
            response.put("error", "Email already exists");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        userService.registerUser(user);
        response.put("message", "User registered successfully");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();
        if (user == null) {
            response.put("error", "Request body cannot be null");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        User foundUser = userService.findByEmail(user.getEmail());
        if (foundUser == null) {
            response.put("error", "User not found");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        if (!user.getPassword().equals(foundUser.getPassword())) {
            response.put("error", "Invalid password");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        response.put("message", "Login successful");
        response.put("role", foundUser.getRole().name());
        response.put("level", foundUser.getLevel());
        response.put("email", foundUser.getEmail());
        response.put("password", foundUser.getPassword());
        response.put("name", foundUser.getName());
        return ResponseEntity.ok(response);
    }
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> allUsers = userService.getAllUsers();
        List<User> employees = allUsers.stream()
                .filter(user -> !user.getLevel().equals("Team Lead") && !user.getLevel().equals("Team Head"))
                .collect(Collectors.toList());
        return ResponseEntity.ok(employees);
    }
}
