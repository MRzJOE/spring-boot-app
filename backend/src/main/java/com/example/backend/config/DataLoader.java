package com.example.backend.config;

import com.example.backend.model.Priority;
import com.example.backend.model.Project;
import com.example.backend.model.Task;
import com.example.backend.repository.ProjectRepository;
import com.example.backend.repository.TaskRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class DataLoader {

    @Bean
    public CommandLineRunner loadData(TaskRepository taskRepository, ProjectRepository projectRepository) {
        return args -> {
            // Only load data if the repositories are empty
            if (taskRepository.count() == 0 && projectRepository.count() == 0) {
                System.out.println("Seeding initial data...");
                
                // Create a default project
                Project defaultProject = new Project();
                defaultProject.setName("Personal Tasks");
                projectRepository.save(defaultProject);
                
                // Create some sample tasks for today
                LocalDate today = LocalDate.now();
                
                Task task1 = new Task();
                task1.setTitle("Complete Spring Boot app");
                task1.setDescription("Fix remaining issues in the task management app");
                task1.setDueDate(today);
                task1.setPriority(Priority.HIGH);
                task1.setProject(defaultProject);
                task1.setOrder(0);
                taskRepository.save(task1);
                
                Task task2 = new Task();
                task2.setTitle("Test calendar functionality");
                task2.setDescription("Ensure the calendar correctly shows tasks");
                task2.setDueDate(today);
                task2.setPriority(Priority.MEDIUM);
                task2.setProject(defaultProject);
                task2.setOrder(1);
                taskRepository.save(task2);
                
                // Create future tasks
                Task task3 = new Task();
                task3.setTitle("Deploy application");
                task3.setDescription("Prepare and deploy the application to production");
                task3.setDueDate(today.plusDays(2));
                task3.setPriority(Priority.MEDIUM);
                task3.setProject(defaultProject);
                task3.setOrder(2);
                taskRepository.save(task3);
                
                Task task4 = new Task();
                task4.setTitle("Write documentation");
                task4.setDescription("Create user documentation for the app");
                task4.setDueDate(today.plusDays(3));
                task4.setPriority(Priority.LOW);
                task4.setProject(defaultProject);
                task4.setOrder(3);
                taskRepository.save(task4);
                
                System.out.println("Data seeding completed!");
            }
        };
    }
}
