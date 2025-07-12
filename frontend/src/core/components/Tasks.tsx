import { useState, useEffect } from "react";
import { useSnapshot } from "valtio";
import { authStore } from "../store/authStore";
import { api } from "../utils/api.service";
import styles from "../styles/Tasks.module.scss";
import Card from "./ui/Card";
import Searchbar from "./ui/Searchbar";
import Button from "./ui/Button";

interface Task {
  id: number;
  title: string;
  description: string;
  done: boolean;
  created_at: string;
}

export default function Tasks() {
  const snap = useSnapshot(authStore);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const fetchTasks = async () => {
    if (!snap.access) return;

    setLoading(true);
    try {
      const response = await api.getTasks();
      if (response.results) {
        setTasks(response.results);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async () => {
    if (!newTaskTitle.trim() || !snap.access) return;

    try {
      const response = await api.createTask({
        title: newTaskTitle,
        description: newTaskDescription,
      });
      if (response.id) {
        setTasks((prev) => [...prev, response]);
        setNewTaskTitle("");
        setNewTaskDescription("");
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const toggleTask = async (taskId: number, currentDone: boolean) => {
    try {
      const response = await api.updateTask(taskId, { done: !currentDone });
      if (response.id) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, done: !currentDone } : task
          )
        );
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [snap.access]);

  if (!snap.access) {
    return (
      <div className={styles.Tasks}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Please log in to see your tasks</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.Tasks}>
      <Searchbar />

      <div style={{ marginBottom: "2rem" }}>
        <input
          type="text"
          placeholder="Task title"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <input
          type="text"
          placeholder="Task description"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          style={{ marginRight: "1rem", padding: "0.5rem" }}
        />
        <Button onClick={createTask} disabled={!newTaskTitle.trim()}>
          Add Task
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center" }}>Loading tasks...</div>
      ) : (
        <div className={styles.CardsGrid}>
          {tasks.map((task) => (
            <Card
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.done ? "completado" : "en curso"}
              onDelete={() => deleteTask(task.id)}
              onComplete={() => toggleTask(task.id, task.done)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
