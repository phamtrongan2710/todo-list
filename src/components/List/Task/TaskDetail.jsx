import { useParams, useNavigate } from "react-router"
import NotFound from "../../NotFound/NotFound.jsx";
import { useState, useEffect } from "react";

const MEMBERS = ['An', 'Bat', 'Sup', 'Messi', 'CR7']

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);

  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    const task = localTasks.find(task => task.id == id);
    setTasks(localTasks);
    setCurrentTask(task);

    if (task) {
      setEditName(task.name);
      setEditDescription(task.description);
    }
  }, []);

  if (!currentTask) {
    return <NotFound />;
  }

  const updateList = (tasks) => {
    setTasks(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  const updateTask = (field, value) => {
    const updatedTasks = tasks.map(task =>
      task.id === currentTask.id
        ? { ...task, [field]: value }
        : task
    );
    updateList(updatedTasks);

    const updatedTask = updatedTasks.find(t => t.id === currentTask.id);
    setCurrentTask(updatedTask);

    if (field === 'name') setEditName(value);
    else if (field === 'description') setEditDescription(value);
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(i => i.id !== taskId);
    updateList(updatedTasks);
    navigate('/');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: "50%", margin: 'auto', gap: 16 }}>
      {isEditingName
        ? (
          <input
            type="text"
            value={editName}
            onChange={e => setEditName(e.target.value)}
            autoFocus // ???
            onBlur={() => {
              updateTask('name', editName.trim() || currentTask.name);
              setIsEditingName(false);
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.target.blur();
              }
            }}
            style={{
              fontSize: '2em',
              fontWeight: 'bold',
              width: '100%',
              padding: '4px 8px',
              boxSizing: 'border-box',
              margin: 0,
            }}
          />
        )
        : (
          <h1
            onClick={() => setIsEditingName(true)}
            style={{ flexGrow: 1, cursor: 'pointer' }}
          >
            {currentTask.name}
          </h1>
        )
      }

      <div style={{ display: 'flex', flexDirection: 'column' }}>

        <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
          <div style={{ minWidth: 90, fontWeight: 'bold', marginBottom: 4 }}>Assign to:</div>
          <select
            name='task-assignment'
            onChange={(e) => updateTask('assignTo', e.target.value)}
            value={currentTask.assignTo}
            className='filter-dropdown-menu'
          >
            {MEMBERS.map(i => <option value={i}>{i}</option>)}
          </select>
        </div>

        <div style={{ minWidth: 90, fontWeight: 'bold', marginBottom: 4 }}>Description:</div>
        {isEditingDescription
          ? (
            <textarea
              value={editDescription}
              onChange={e => setEditDescription(e.target.value)}
              autoFocus // ???
              onBlur={() => {
                updateTask('description', editDescription.trim() || currentTask.description);
                setIsEditingDescription(false);
              }}
              rows={3}
              style={{
                fontSize: 16,
                padding: 4,
                resize: 'vertical',
                border: 'none',
                outline: 'none',
              }}
            />
          )
          : (
            <span
              onClick={() => setIsEditingDescription(true)}
              style={{
                fontSize: 16,
                cursor: 'pointer',
                minHeight: 48,
                padding: '4px',
                display: 'inline-block'
              }}
            >
              {currentTask.description || <i>(No description)</i>}
            </span>
          )
        }
      </div>
      <div style={{ textAlign: 'right' }}>
        <button
          style={{
            padding: '8px',
            backgroundColor: 'red',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
          onClick={() => removeTask(currentTask.id)}
        >
          Delete
        </button>
      </div>
    </div >
  );
}
