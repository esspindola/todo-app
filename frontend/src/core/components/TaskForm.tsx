import React, { useState } from "react";
import Input from "./ui/Input";
import Button from "./ui/Button";
import Modal from "./ui/Modal";
import styles from "../styles/TaskForm.module.scss";

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
  title?: string;
  description?: string;
  submitLabel?: string;
  modalTitle?: string;
}

const TaskForm: React.FC<TaskFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title: initialTitle = "",
  description: initialDescription = "",
  submitLabel = "Add Task",
  modalTitle = "Add New Task",
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit(title, description);
    setTitle("");
    setDescription("");
    onClose();
  };

  const handleClose = () => {
    setTitle(initialTitle);
    setDescription(initialDescription);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={modalTitle}>
      <form onSubmit={handleSubmit} className={styles.TaskForm}>
        <Input
          label="Task Title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
        />

        <div className={styles.TextareaGroup}>
          <label className={styles.Label}>Description</label>
          <textarea
            className={styles.Textarea}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description (optional)"
            rows={4}
          />
        </div>

        <div className={styles.FormActions}>
          <Button
            type="button"
            onClick={handleClose}
            className={styles.CancelButton}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={!title.trim()}>
            {submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskForm;
