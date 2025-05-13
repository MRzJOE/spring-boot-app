package com.example.backend.controller;

import com.example.backend.model.Task;
import com.example.backend.model.Priority;
import com.example.backend.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
// Remove the @CrossOrigin annotation here since we're configuring CORS globally
public class TaskController {

    private final TaskRepository repo;

    public TaskController(TaskRepository repo) {
        this.repo = repo;
    }

    // 🔹 Get all tasks (ordered)
    @GetMapping
    public List<Task> getAll() {
        return repo.findAllByOrderByOrderAsc();
    }

    // 🔹 Get task by ID
    @GetMapping("/{id}")
    public Task getById(@PathVariable Long id) {
        return repo.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    // 🔹 Create a new task
    @PostMapping
    public Task create(@RequestBody Task task) {
        return repo.save(task);
    }

    // 🔹 Update task by ID
    @PutMapping("/{id}")
    public Task update(@PathVariable Long id, @RequestBody Task updated) {
        return repo.findById(id).map(task -> {
            task.setTitle(updated.getTitle());
            task.setDescription(updated.getDescription());
            task.setDueDate(updated.getDueDate());
            task.setCompleted(updated.isCompleted());
            task.setPriority(updated.getPriority());
            task.setTags(updated.getTags());
            task.setParent(updated.getParent());
            task.setProject(updated.getProject());
            task.setOrder(updated.getOrder());
            return repo.save(task);
        }).orElseThrow(() -> new RuntimeException("Task not found with id: " + id));
    }

    // 🔹 Delete task by ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // 🔹 Reorder tasks by list of IDs
    @PutMapping("/reorder")
    public void reorder(@RequestBody List<Long> orderedIds) {
        for (int i = 0; i < orderedIds.size(); i++) {
            final int orderIndex = i;
            final Long taskId = orderedIds.get(i);

            repo.findById(taskId).ifPresent(task -> {
                task.setOrder(orderIndex);
                repo.save(task);
            });
        }
    }
    // 🔹 Search by keyword (title or description)
    @GetMapping("/search")
    public List<Task> search(@RequestParam String keyword) {
        return repo.searchByKeyword(keyword);
    }

    // 🔹 Filter by completion status
    @GetMapping("/filter/status")
    public List<Task> filterByStatus(@RequestParam boolean completed) {
        return repo.findByCompleted(completed);
    }

    // 🔹 Filter by priority
    @GetMapping("/filter/priority")
    public List<Task> filterByPriority(@RequestParam Priority priority) {
        return repo.findByPriority(priority);
    }

    // 🔹 Filter by due today
    @GetMapping("/filter/date/today")
    public List<Task> dueToday() {
        return repo.findByDueDate(LocalDate.now());
    }

    // 🔹 Filter by overdue
    @GetMapping("/filter/date/overdue")
    public List<Task> overdue() {
        return repo.findByDueDateBefore(LocalDate.now());
    }

    // 🔹 Filter by upcoming
    @GetMapping("/filter/date/upcoming")
    public List<Task> upcoming() {
        return repo.findByDueDateAfter(LocalDate.now());
    }

    // 🔹 Filter by project
    @GetMapping("/filter/project")
    public List<Task> byProject(@RequestParam Long projectId) {
        return repo.findByProjectId(projectId);
    }

    // 🔹 Filter by tag
    @GetMapping("/filter/tag")
    public List<Task> byTag(@RequestParam Long tagId) {
        return repo.findByTagId(tagId);
    }
}
