import { useState } from 'react';
import { BiEditAlt } from "react-icons/bi";
import { IoTrashBinSharp } from "react-icons/io5";

export default function Task({ task, completeTask, editTask, removeTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState(task.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    if (editingName.trim() !== '') {
      editTask(task.id, editingName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && editingName.trim() !== '') {
      editTask(task.id, editingName);
      setIsEditing(false);
    }
  };

  return (
    <div className="flex-container task">
      <div className="task-left">
        <input
          type="checkbox" id={task.id}
          checked={task.isCompleted}
          onChange={() => completeTask(task.id)}
        />
        {isEditing ? (
          <input
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          <div style={task.isCompleted ? { textDecoration: 'line-through' } : {}}>
            {task.name}
          </div>
        )}
      </div>

      <div className="task-right">
        <BiEditAlt onClick={handleEdit} />
        <IoTrashBinSharp onClick={() => removeTask(task.id)} />
      </div>
    </div>
  )
}