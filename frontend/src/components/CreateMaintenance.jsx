import { useState } from "react";
import { motion } from "framer-motion";
import { createMaintenance } from "../api/maintenance";

function CreateMaintenance({ equipmentId, onSuccess }) {
  const [form, setForm] = useState({
    subject: "",
    request_type: "corrective",
    scheduled_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    await createMaintenance({
      subject: form.subject,
      request_type: form.request_type,
      equipment_id: equipmentId,
      scheduled_date:
        form.request_type === "preventive"
          ? form.scheduled_date
          : null,
    });

    onSuccess();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur p-4 rounded-xl mt-4"
    >
      <h3 className="text-cyan-400 font-semibold mb-3">
        Create Maintenance Request
      </h3>

      <input
        required
        placeholder="Issue subject (e.g. Oil leakage)"
        className="w-full p-2 rounded bg-black/30 mb-3"
        onChange={(e) =>
          setForm({ ...form, subject: e.target.value })
        }
      />

      <select
        className="w-full p-2 rounded bg-black/30 mb-3"
        onChange={(e) =>
          setForm({ ...form, request_type: e.target.value })
        }
      >
        <option value="corrective">Corrective</option>
        <option value="preventive">Preventive</option>
      </select>

      {form.request_type === "preventive" && (
        <input
          type="date"
          className="w-full p-2 rounded bg-black/30 mb-3"
          onChange={(e) =>
            setForm({ ...form, scheduled_date: e.target.value })
          }
        />
      )}

      <button className="bg-cyan-500 px-4 py-2 rounded hover:bg-cyan-400">
        Create
      </button>
    </motion.form>
  );
}

export default CreateMaintenance;
