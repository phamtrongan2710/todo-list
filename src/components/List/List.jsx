import { useState } from 'react';
import Task from './Task/Task';
import { IoSearch } from "react-icons/io5";
import { MdAddCircleOutline } from "react-icons/md";
import { slugify } from '../../utils/formatter';

export default function List() {
  const localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  const [tasks, setTasks] = useState(localTasks);
  const [taskName, setTaskName] = useState('');
  const [searchResult, setSearchResult] = useState(localTasks);

  const completeTask = (taskId) => {
    const updatedTasks = tasks.map(i =>
      i.id === taskId
        ? { ...i, isCompleted: !i.isCompleted }
        : i
    );
    updateList(updatedTasks);
  };

  const addTask = (event) => {
    event.preventDefault();
    const newTask = {
      id: tasks.length,
      name: taskName ? taskName : 'New Task',
      slug: taskName ? (slugify(taskName + ' ' + Date.now())) : 'new-task-' + Date.now(),
      isCompleted: false,
    }
    const updatedTasks = [...tasks, newTask];

    updateList(updatedTasks);
    setTaskName('')
  }

  const editTask = (taskId, newName) => {
    const updatedTasks = tasks.map(i =>
      i.id === taskId
        ? { ...i, name: newName, slug: slugify(newName + ' ' + Date.now()) }
        : i
    );
    updateList(updatedTasks);
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(i => i.id !== taskId);
    updateList(updatedTasks);
  }

  const updateList = (tasks) => {
    setTasks(tasks);
    setSearchResult(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  const findTask = (event) => {
    event.preventDefault();
    if (!taskName) {
      setSearchResult(tasks);
      return;
    };
    const result = tasks.filter(i => i.name.toLowerCase().includes(taskName.toLowerCase()));
    setSearchResult(result);
  }


  return (
    <div style={{ width: "50%", margin: "0 auto", alignItems: "center", justifyContent: "center" }}>
      <h1>TODO LIST</h1>

      <div style={{ display: 'flex', flex: '1', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px', padding: '0px 10px' }}>
        <form onSubmit={findTask} style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label htmlFor="task-name">Find:</label>
          <input
            type="text"
            id="task-name"
            name="task-name"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <IoSearch size={30} />
          </button>
        </form>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <MdAddCircleOutline size={30} onClick={addTask} />
        </button>
      </div >

      <div className="flex-container list">
        {searchResult.map((task) => (
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