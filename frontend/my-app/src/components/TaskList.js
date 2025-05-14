import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import { API_ENDPOINTS, handleApiError } from '../config';

function TaskList({ tasks, onTaskUpdate }) {
  const [actionInProgress, setActionInProgress] = useState(false);
  const [error, setError] = useState(null);

  const toggleComplete = async (task) => {
    try {
      setActionInProgress(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.TASK_BY_ID(task.id), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: !task.completed }),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      onTaskUpdate();
    } catch (err) {
      setError('Failed to update task status');
      handleApiError(err);
    } finally {
      setActionInProgress(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      setActionInProgress(true);
      setError(null);
      
      const response = await fetch(API_ENDPOINTS.TASK_BY_ID(id), {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      onTaskUpdate();
    } catch (err) {
      setError('Failed to delete task');
      handleApiError(err);
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    
    try {
      setActionInProgress(true);
      setError(null);
      
      const reordered = Array.from(tasks);
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);

      const orderedIds = reordered.map(task => task.id);
      const response = await fetch(API_ENDPOINTS.REORDER_TASKS, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderedIds),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      onTaskUpdate();
    } catch (err) {
      setError('Failed to reorder tasks');
      handleApiError(err);
    } finally {
      setActionInProgress(false);
    }
  };

  return (
    <>
      {error && <p className="error-message">{error}</p>}
      {actionInProgress && <p className="action-message">Processing...</p>}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="taskList">
          {(provided) => (
            <ul
              className="task-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <AnimatePresence>
                {tasks.map((task, index) => (
                  <Draggable
                    key={task.id}
                    draggableId={task.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <motion.li
                        className={`task ${task.completed ? 'done' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          ...provided.draggableProps.style,
                          background: snapshot.isDragging ? '#d3e3fc' : '',
                        }}
                      >
                        <div>
                          <strong>{task.title}</strong><br />
                          <span>{task.description}</span><br />
                          <small>📅 {task.dueDate} | ⚡ {task.priority}</small>
                        </div>
                        <div className="actions">
                          <button 
                            onClick={() => toggleComplete(task)}
                            disabled={actionInProgress}
                          >
                            {task.completed ? 'Undo' : 'Complete'}
                          </button>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            disabled={actionInProgress}
                          >❌</button>
                        </div>
                      </motion.li>
                    )}
                  </Draggable>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}

export default TaskList;
