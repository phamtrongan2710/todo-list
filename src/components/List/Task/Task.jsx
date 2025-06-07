import { useState } from 'react';
import { BiEditAlt } from "react-icons/bi";
import { IoTrashBinSharp } from "react-icons/io5";
import { FaRegArrowAltCircleRight } from "react-icons/fa";
import { Link } from 'react-router';

export default function Task({ task, completeTask, editTask, removeTask, assignTask, members }) {
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
            style={{ width: '100%' }}
          />
        ) : (
          <div style={task.isCompleted
            ? {
              textDecoration: 'line-through',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }
            : {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              width: '100%'
            }}>
            {task.name}
          </div>
        )}
      </div>



      <div className="task-right">
        <div style={{ display: 'flex', gap: 2 }}>
          <div>Assign to: </div>
          <select
            onChange={(e) => assignTask(task.id, e.target.value)}
            value={task.assignTo}
            className='filter-dropdown-menu'
          >
            {members.map(i => <option value={i}>{i}</option>)}
          </select>
        </div>
        <BiEditAlt onClick={handleEdit} />
        <IoTrashBinSharp onClick={() => removeTask(task.id)} />
        <Link to={`/${task.id}`} state={{ task }} >
          <FaRegArrowAltCircleRight style={{ color: "black" }} />
        </Link>
      </div>
    </div >
  )
}