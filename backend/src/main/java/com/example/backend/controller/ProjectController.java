package com.example.backend.controller;

import com.example.backend.model.Project;
import com.example.backend.repository.ProjectRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectRepository repo;

    public ProjectController(ProjectRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Project> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Project create(@RequestBody Project project) {
        return repo.save(project);
    }

    @PutMapping("/{id}/archive")
    public Project archive(@PathVariable Long id) {
        Project p = repo.findById(id).orElseThrow();
        p.setArchived(true);
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
