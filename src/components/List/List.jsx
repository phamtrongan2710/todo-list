import { useState } from 'react';
import Task from './Task/Task';

export default function List() {
  const localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  const [tasks, setTasks] = useState(localTasks);

  const [taskName, setTaskName] = useState('');

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(i =>
      i.id === taskId
        ? { ...i, isCompleted: !i.isCompleted }
        : i
    );
    updateListState(updatedTasks);
  };

  const addTask = (event) => {
    event.preventDefault();
    const newTask = {
      id: tasks.length,
      name: taskName ? taskName : 'New Task',
      isCompleted: false,
    }
    const updatedTasks = [...tasks, newTask];

    updateListState(updatedTasks);
    setTaskName('')
  }

  const editTask = (taskId, newName) => {
    const updatedTasks = tasks.map(i =>
      i.id === taskId
        ? { ...i, name: newName }
        : i
    );
    updateListState(updatedTasks);
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(i => i.id !== taskId);
    updateListState(updatedTasks);
  }

  const updateListState = (tasks) => {
    setTasks(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  return (
    <div style={{ width: "50%", margin: "0 auto", alignItems: "center", justifyContent: "center" }}>
      <h1>TODO LIST</h1>

      <form onSubmit={addTask}>
        <label htmlFor="task-name">Task name:</label>
        <input
          type="text"
          id="task-name"
          name="task-name"
          placeholder="New task"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
        />
        <input type="submit" value="Add" />
      </form>

      <div className="flex-container list">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            completeTask={completeTask}
            editTask={editTask}
            removeTask={removeTask}
          />
        ))}
      </div>
    </div >
  )
}