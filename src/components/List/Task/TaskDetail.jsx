import { useParams } from "react-router";
import NotFound from "../../NotFound/NotFound.jsx";

export default function TaskDetail() {
  const { slug } = useParams();
  const localTasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
  const task = localTasks.find(task => task.slug === slug);

  if (!task) {
    return <NotFound />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>{task.name}</h1>
      <h2>{task.slug}</h2>
    </div>
  );
}