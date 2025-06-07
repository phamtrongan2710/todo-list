import { useEffect, useState } from 'react';
import Task from './Task/Task';
import { IoSearch } from "react-icons/io5";
import { MdAddCircleOutline } from "react-icons/md";
import Modal from 'react-modal';
import Pagination from '../Pagination/Pagination';
import { v4 as uuidv4 } from 'uuid';

Modal.setAppElement('#root');

const tasksPerPage = 10;

const MEMBERS = ['An', 'Bat', 'Sup', 'Messi', 'CR7']

export default function List() {
  const [tasks, setTasks] = useState([]);

  const [searchResult, setSearchResult] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filteredResultLength, setFilteredResultLength] = useState(0);
  const [statusFilter, setStatusFilter] = useState(null);
  const [memberFilter, setMemberFilter] = useState(null);

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editingMember, setEditingMember] = useState(MEMBERS[0]);

  useEffect(() => {
    const localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    setTasks(localTasks);
  }, []);

  useEffect(() => {
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const filterResult = tasks
      .filter(i => i.name.toLowerCase().includes(taskName.toLowerCase()))
      .filter(i => {
        if (statusFilter === null) return true;
        return statusFilter === i.isCompleted;
      })
      .filter(i => {
        if (memberFilter === null) return true;
        return memberFilter === i.assignTo;
      })
    const pagingResult = filterResult.slice(indexOfFirstTask, indexOfLastTask);
    setSearchResult(pagingResult);
    setFilteredResultLength(filterResult.length);
  }, [currentPage, taskName, tasks, statusFilter, memberFilter])

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
      id: uuidv4(),
      name: taskName ? taskName : 'New Task',
      description: taskDescription,
      isCompleted: false,
      assignTo: editingMember,
    }
    const updatedTasks = [newTask, ...tasks];

    updateList(updatedTasks);
    setTaskName('');
    closeModal();
  }

  const editTask = (taskId, newName) => {
    const updatedTasks = tasks.map(i =>
      i.id === taskId
        ? { ...i, name: newName }
        : i
    );
    updateList(updatedTasks);
  };

  const assignTask = (taskId, member) => {
    const updatedTasks = tasks.map(i =>
      i.id === taskId
        ? { ...i, assignTo: member }
        : i
    );
    updateList(updatedTasks);
  }

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(i => i.id !== taskId);
    updateList(updatedTasks);
  }

  const updateList = (tasks) => {
    setTasks(tasks);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  const openModal = () => {
    setModalIsOpen(true);
  }

  const closeModal = () => {
    setModalIsOpen(false);
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div style={{ width: "50%", margin: "0 auto", alignItems: "center", justifyContent: "center" }}>
      <h1>TODO LIST</h1>

      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px', padding: '0px 10px' }}>
        <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label htmlFor="task-name">
            <IoSearch size={30} />
          </label>
          <input
            type="text"
            id="task-name"
            name="task-name"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          ></input>

        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <MdAddCircleOutline size={30} onClick={openModal} />
        </button>
      </div >

      <div style={{ display: 'flex', marginBottom: '20px', gap: '20px' }}>
        {/** Filter status */}
        <div style={{ display: 'flex', gap: 2 }}>
          <div>Status: </div>
          <select
            onChange={(e) => setStatusFilter(e.target.value === 'null' ? null : e.target.value === 'true')}
            value={statusFilter === null ? 'null' : statusFilter.toString()}
            className='filter-dropdown-menu'
          >
            <option value="null">All</option>
            <option value="false">Active</option>
            <option value="true">Completed</option>
          </select>
        </div>

        {/** Filter user */}
        <div style={{ display: 'flex', gap: 2 }}>
          <div>Assign to: </div>
          <select
            onChange={(e) => setMemberFilter(e.target.value === 'null' ? null : e.target.value)}
            value={memberFilter === null ? 'null' : memberFilter.toString()}
            className='filter-dropdown-menu'
          >
            <option value='null'>All</option>
            {MEMBERS.map(i => <option value={i}>{i}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-container list">
        {searchResult.map((task) => (
          <Task
            key={task.id}
            task={task}
            completeTask={completeTask}
            editTask={editTask}
            removeTask={removeTask}
            assignTask={assignTask}
            members={MEMBERS}
          />
        ))}
      </div>

      <Pagination
        itemsPerPage={tasksPerPage}
        totalItems={filteredResultLength}
        currentPage={currentPage}
        paginate={paginate}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
          },
          borderRadius: '10px'
        }}
        contentLabel="Add new task"
      >
        <form className="add-task-modal" onSubmit={addTask}>
          <div className="form-group">
            <label htmlFor="task-name">Task name:</label>
            <input
              type="text"
              id="task-name"
              name="task-name"
              placeholder="New task"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)} // ???
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Task description:</label>
            <textarea
              id="task-description"
              name="task-description"
              placeholder="Describe your task"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)} // ???
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-assignment">Assign to:</label>
            <select
              name='task-assignment'
              onChange={(e) => setEditingMember(e.target.value)}
              value={editingMember}
              className='filter-dropdown-menu'
            >
              {MEMBERS.map(i => <option value={i}>{i}</option>)}
            </select>
          </div>

          <input type="submit" value="Add" />
        </form>
      </Modal>
    </div >
  )
}