import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';

function TaskList({ tasks, onTaskUpdate }) {
  const toggleComplete = async (task) => {
    await fetch(`https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    onTaskUpdate();
  };

  const deleteTask = async (id) => {
    await fetch(`https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks/${id}`, {
      method: 'DELETE'
    });
    onTaskUpdate();
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const reordered = Array.from(tasks);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    const orderedIds = reordered.map(task => task.id);
    await fetch('https://symmetrical-xylophone-px74r4p7rqg27vp6-8080.app.github.dev/api/tasks/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderedIds),
    });

    onTaskUpdate();
  };

  return (
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
                        <button onClick={() => toggleComplete(task)}>
                          {task.completed ? 'Undo' : 'Complete'}
                        </button>
                        <button onClick={() => deleteTask(task.id)}>❌</button>
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
  );
}

export default TaskList;
