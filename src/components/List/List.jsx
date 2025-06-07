import { useEffect, useState } from 'react';
import Task from './Task/Task';
import { IoSearch } from "react-icons/io5";
import { MdAddCircleOutline } from "react-icons/md";
import { slugify } from '../../utils/formatter';
import Modal from 'react-modal';
import Pagination from '../Pagination/Pagination';

Modal.setAppElement('#root');

const tasksPerPage = 10;

export default function List() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [searchResult, setSearchResult] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
    setTasks(localTasks);
  }, []);

  useEffect(() => {
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const filterResult = tasks.filter(i => i.name.toLowerCase().includes(taskName.toLowerCase()));
    const pagingResult = filterResult.slice(indexOfFirstTask, indexOfLastTask);
    setSearchResult(pagingResult);
  }, [currentPage, taskName, tasks])

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
      isCompleted: false,
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

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(i => i.id !== taskId);
    updateList(updatedTasks);
  }

  const updateList = (tasks) => {
    setTasks(tasks);
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

      <div style={{ display: 'flex', flex: '1', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', marginBottom: '20px', padding: '0px 10px' }}>
        <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label htmlFor="task-name">Find:</label>
          <input
            type="text"
            id="task-name"
            name="task-name"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          {/* <button type="submit" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <IoSearch size={30} />
          </button> */}
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <MdAddCircleOutline size={30} onClick={openModal} />
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

      <Pagination
        itemsPerPage={tasksPerPage}
        totalItems={searchResult.length}
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
      </Modal>
    </div >
  )
}