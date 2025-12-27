import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getEquipment, createEquipment } from "../api/equipment";
import { createMaintenance } from "../api/maintenance";

function Equipment() {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeEquipment, setActiveEquipment] = useState(null);
  

  const [form, setForm] = useState({
    name: "",
    serial_number: "",
    department: "",
    location: "",
    maintenance_team_id: "",
  });

  const [maintenanceForm, setMaintenanceForm] = useState({
    subject: "",
    request_type: "corrective",
    scheduled_date: "",
  });

  const countOpenRequests = (requests, equipmentId) =>
  requests.filter(
    (r) =>
      r.equipment_id === equipmentId &&
      ["new", "in_progress"].includes(r.status)
  ).length;


  const loadEquipment = async () => {
    try {
      setLoading(true);
      const data = await getEquipment();
      setEquipment(data);
    } catch {
      setError("Failed to load equipment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEquipment();
  }, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createEquipment({
        ...form,
        maintenance_team_id: Number(form.maintenance_team_id),
      });

      setForm({
        name: "",
        serial_number: "",
        department: "",
        location: "",
        maintenance_team_id: "",
      });

      loadEquipment();
    } catch (err) {
      setError(err.response?.data?.detail || "Create failed");
    }
  };


  const handleCreateMaintenance = async (equipmentId) => {
    await createMaintenance({
      subject: maintenanceForm.subject,
      request_type: maintenanceForm.request_type,
      equipment_id: equipmentId,
      scheduled_date:
        maintenanceForm.request_type === "preventive"
          ? maintenanceForm.scheduled_date
          : null,
    });

    setMaintenanceForm({
      subject: "",
      request_type: "corrective",
      scheduled_date: "",
    });

    setActiveEquipment(null);
  };


  return (
    <motion.div
      className="px-6 py-20 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        Equipment
      </h1>

      {/* CREATE EQUIPMENT */}
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur p-6 rounded-xl mb-12 grid gap-4 md:grid-cols-2"
      >
        <input
          name="name"
          placeholder="Equipment Name"
          value={form.name}
          onChange={handleChange}
          className="p-3 rounded bg-black/30"
        />
        <input
          name="serial_number"
          placeholder="Serial Number"
          value={form.serial_number}
          onChange={handleChange}
          className="p-3 rounded bg-black/30"
        />
        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          className="p-3 rounded bg-black/30"
        />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          className="p-3 rounded bg-black/30"
        />
        <input
          name="maintenance_team_id"
          placeholder="Maintenance Team ID"
          value={form.maintenance_team_id}
          onChange={handleChange}
          className="p-3 rounded bg-black/30"
        />

        <button className="col-span-full bg-cyan-500 py-3 rounded hover:bg-cyan-400">
          Add Equipment
        </button>

        {error && (
          <p className="col-span-full text-red-400 text-sm">
            {error}
          </p>
        )}
      </form>

      {/* EQUIPMENT LIST */}
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {equipment.map((eq) => (
            <div
              key={eq.id}
              className="bg-white/10 backdrop-blur rounded-xl p-5"
            >
              <h3 className="text-lg font-semibold text-cyan-400">
                {eq.name}
              </h3>
              <p className="text-gray-300 text-sm">
                Serial: {eq.serial_number}
              </p>
              <p className="text-gray-400 text-sm">
                Dept: {eq.department || "—"}
              </p>
              <p className="text-gray-400 text-sm">
                Location: {eq.location || "—"}
              </p>

              {eq.is_scrapped && (
                <span className="text-red-400 text-xs mt-2 block">
                  Scrapped
                </span>
              )}

              {/* SMART MAINTENANCE BUTTON */}
              {!eq.is_scrapped && (
                <button
                  onClick={() => setActiveEquipment(eq.id)}
                  className="mt-4 text-sm bg-cyan-500 px-3 py-1 rounded hover:bg-cyan-400"
                >
                  Create Maintenance
                </button>
              )}

              {/* INLINE MAINTENANCE FORM */}
              {activeEquipment === eq.id && (
                <div className="mt-4 bg-black/30 p-4 rounded-lg">
                  <input
                    placeholder="Issue subject"
                    className="w-full p-2 rounded bg-black/40 mb-2"
                    onChange={(e) =>
                      setMaintenanceForm({
                        ...maintenanceForm,
                        subject: e.target.value,
                      })
                    }
                  />

                  <select
                    className="w-full p-2 rounded bg-black/40 mb-2"
                    onChange={(e) =>
                      setMaintenanceForm({
                        ...maintenanceForm,
                        request_type: e.target.value,
                      })
                    }
                  >
                    <option value="corrective">
                      Corrective
                    </option>
                    <option value="preventive">
                      Preventive
                    </option>
                  </select>

                  {maintenanceForm.request_type ===
                    "preventive" && (
                    <input
                      type="date"
                      className="w-full p-2 rounded bg-black/40 mb-2"
                      onChange={(e) =>
                        setMaintenanceForm({
                          ...maintenanceForm,
                          scheduled_date: e.target.value,
                        })
                      }
                    />
                  )}

                  <button
                    onClick={() =>
                      handleCreateMaintenance(eq.id)
                    }
                    className="w-full bg-cyan-500 py-2 rounded hover:bg-cyan-400"
                  >
                    Create Request
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Equipment;
