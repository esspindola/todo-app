import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useSnapshot } from "valtio";
import { authStore } from "../store/authStore";
import { api } from "../utils/api.service";
import styles from "../styles/Tasks.module.scss";
import Card from "./ui/Card";
import Searchbar, { type FilterState } from "./ui/Searchbar";
import Button from "./ui/Button";
import TaskForm from "./TaskForm";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({});
  const [authError, setAuthError] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const queryParams = useMemo(() => {
    const params: any = {};

    if (searchTerm) {
      params.search = searchTerm;
    }

    if (filters.done !== undefined && filters.done !== null) {
      params.done = filters.done;
    }

    if (filters.created_at_after) {
      params.created_at_after = filters.created_at_after;
    }

    if (filters.created_at_before) {
      params.created_at_before = filters.created_at_before;
    }

    return params;
  }, [searchTerm, filters]);

  const fetchTasks = useCallback(async () => {
    if (!snap.access) {
      setAuthError(true);
      setTasks([]);
      return;
    }
    setLoading(true);
    setAuthError(false);
    try {
      const response = await api.getTasks(queryParams);
      if (response.results) {
        setTasks(response.results);
      }
    } catch (error: any) {
      setAuthError(true);
      setTasks([]);
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [queryParams, snap.access]);

  const createTask = async (title: string, description: string) => {
    if (!snap.access) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    try {
      const response = await api.createTask({
        title,
        description,
      });
      if (response.id) {
        setTasks((prev) => [...prev, response]);
      }
    } catch (error: any) {
      setAuthError(true);
      console.error("Error creating task:", error);
    }
  };

  const updateTask = async (title: string, description: string) => {
    if (!editingTask || !snap.access) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    try {
      const response = await api.updateTask(editingTask.id, {
        title,
        description,
      });
      if (response.id) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === editingTask.id ? { ...task, title, description } : task
          )
        );
        setEditingTask(null);
      }
    } catch (error: any) {
      setAuthError(true);
      console.error("Error updating task:", error);
    }
  };

  const toggleTask = async (taskId: number, currentDone: boolean) => {
    if (!snap.access) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    try {
      const response = await api.updateTask(taskId, { done: !currentDone });
      if (response.id) {
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, done: !currentDone } : task
          )
        );
      }
    } catch (error: any) {
      setAuthError(true);
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    if (!snap.access) {
      setAuthError(true);
      return;
    }
    setAuthError(false);
    try {
      await api.deleteTask(taskId);
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error: any) {
      setAuthError(true);
      console.error("Error deleting task:", error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditForm(true);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setLoading(true);
    }, 800);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setLoading(true);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      authStore.loadFromCookies();
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.Tasks}>
      {authError ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <p>Debe iniciar sesión para ver y gestionar sus tareas.</p>
        </div>
      ) : (
        <>
          <Searchbar
            onSearch={handleSearch}
            onFilterChange={handleFilterChange}
            filters={filters}
          />

          <div style={{ marginBottom: "2rem" }}>
            <Button onClick={() => setShowAddForm(true)}>Add New Task</Button>
          </div>

          <TaskForm
            isOpen={showAddForm}
            onClose={() => setShowAddForm(false)}
            onSubmit={createTask}
            modalTitle="Add New Task"
            submitLabel="Add Task"
          />

          <TaskForm
            isOpen={showEditForm}
            onClose={() => {
              setShowEditForm(false);
              setEditingTask(null);
            }}
            onSubmit={updateTask}
            title={editingTask?.title}
            description={editingTask?.description}
            modalTitle="Edit Task"
            submitLabel="Update Task"
          />

          <div className={styles.CardsGrid}>
            {loading ? (
              <div className={styles.SpinnerContainer}>
                <span>Cargando...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div
                style={{ textAlign: "center", width: "100%", padding: "2rem" }}
              >
                <p>No hay tareas para mostrar.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <Card
                  key={task.id}
                  title={task.title}
                  description={task.description}
                  status={task.done ? "completado" : "en curso"}
                  createdAt={task.created_at}
                  onDelete={() => deleteTask(task.id)}
                  onComplete={() => toggleTask(task.id, task.done)}
                  onEdit={() => handleEditTask(task)}
                />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
