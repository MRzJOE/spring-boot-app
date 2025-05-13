package com.example.backend.repository;

import com.example.backend.model.Task;
import com.example.backend.model.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByOrderByOrderAsc();

    List<Task> findByCompleted(boolean completed);

    List<Task> findByPriority(Priority priority);

    List<Task> findByDueDate(LocalDate dueDate);

    List<Task> findByDueDateBefore(LocalDate date);

    List<Task> findByDueDateAfter(LocalDate date);

    List<Task> findByProjectId(Long projectId);

    @Query("SELECT t FROM Task t JOIN t.tags tag WHERE tag.id = :tagId")
    List<Task> findByTagId(@Param("tagId") Long tagId);

    @Query("SELECT t FROM Task t WHERE LOWER(t.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(t.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Task> searchByKeyword(@Param("keyword") String keyword);
}
