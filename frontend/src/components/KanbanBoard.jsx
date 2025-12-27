import { useEffect, useState } from "react";
import { DndContext } from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import api from "../api/api";
import toast from "react-hot-toast";

const STATUSES = ["new", "in_progress", "repaired", "scrap"];

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/maintenance").then(res => setTasks(res.data));
  }, []);

  const onDragEnd = async (event) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    try {
      await api.patch(`/maintenance/${taskId}/status`, {
        status: newStatus
      });

      setTasks(tasks =>
        tasks.map(t =>
          t.id === taskId ? { ...t, status: newStatus } : t
        )
      );

      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Update failed");
    }
  };

  return (
    <DndContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-4 gap-4 p-6">
        {STATUSES.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks.filter(t => t.status === status)}
          />
        ))}
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
