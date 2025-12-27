import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  getKanban,
  updateStatus,
  assignTechnician,
  getOverdue,
} from "../api/maintenance";
import api from "../api/api";

const columns = ["new", "in_progress", "repaired", "scrap"];

function Maintenance() {
  const [board, setBoard] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD DATA ---------------- */

  const loadData = async () => {
    try {
      setLoading(true);
      const [kanban, overdueData] = await Promise.all([
        getKanban(),
        getOverdue(),
      ]);

      setBoard(kanban);
      setOverdue(overdueData.map((o) => o.id));
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    const res = await api.get("/auth/me");
    setCurrentUser(res.data);
  };

  useEffect(() => {
    loadUser();
    loadData();
  }, []);

  /* ---------------- ASSIGN ---------------- */

  const handlePickJob = async (requestId) => {
    try {
      await assignTechnician(requestId, currentUser.id);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to assign job");
    }
  };

  /* ---------------- DRAG DROP ---------------- */

  const onDrop = async (e, status) => {
    const id = e.dataTransfer.getData("id");

    let payload = { status };

    if (status === "repaired") {
      const hours = prompt("Enter hours spent on repair:");
      if (!hours || isNaN(hours)) return;
      payload.duration_hours = Number(hours);
    }

    try {
      await updateStatus(id, payload);
      loadData();
    } catch (err) {
      alert(err.response?.data?.detail || "Status update failed");
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <p className="text-center text-gray-400 py-20">
        Loading maintenance board...
      </p>
    );
  }

  return (
    <motion.div
      className="px-6 py-20 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        Maintenance Board
      </h1>

      <div className="grid md:grid-cols-4 gap-6">
        {columns.map((col) => {
          const column = board.find((b) => b.status === col);

          return (
            <div
              key={col}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, col)}
              className="bg-white/10 backdrop-blur rounded-xl p-4 min-h-[450px]"
            >
              <h2 className="text-center font-semibold text-cyan-300 mb-4 uppercase">
                {col.replace("_", " ")}
              </h2>

              <div className="space-y-4">
                {column?.items.map((item) => {
                  const isAssigned = item.assigned_to?.id === currentUser?.id;

                  return (
                    <div
                      key={item.id}
                      draggable={isAssigned}
                      onDragStart={(e) =>
                        e.dataTransfer.setData("id", item.id)
                      }
                      className={`p-4 rounded-lg bg-black/30 border transition
                        ${
                          overdue.includes(item.id)
                            ? "border-red-500"
                            : "border-transparent"
                        }
                        ${
                          isAssigned
                            ? "cursor-move"
                            : "opacity-60 cursor-not-allowed"
                        }
                      `}
                    >
                      <h3 className="text-cyan-400 font-semibold">
                        {item.subject}
                      </h3>

                      <p className="text-xs text-gray-400">
                        Equipment #{item.equipment_id}
                      </p>

                      {/* ASSIGNMENT */}
                      {item.assigned_to ? (
                        <p className="text-xs text-green-400 mt-1">
                          Assigned to {item.assigned_to.name}
                        </p>
                      ) : (
                        col === "new" &&
                        currentUser && (
                          <button
                            onClick={() => handlePickJob(item.id)}
                            className="mt-3 text-xs bg-cyan-500 px-3 py-1 rounded hover:bg-cyan-400"
                          >
                            Pick Job
                          </button>
                        )
                      )}

                      {overdue.includes(item.id) && (
                        <p className="text-red-400 text-xs mt-1">
                          Overdue
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default Maintenance;
