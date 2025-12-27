import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCalendar } from "../api/maintenance";

/* ---------------- HELPERS ---------------- */

const getMonthRange = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const format = (d) => d.toISOString().split("T")[0];

  return {
    start: format(start),
    end: format(end),
  };
};

const daysInMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

/* ---------------- PAGE ---------------- */

function MaintenanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});

  const loadCalendar = async () => {
    const { start, end } = getMonthRange(currentDate);
    const data = await getCalendar(start, end);

    // group by date
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.scheduled_date]) {
        grouped[item.scheduled_date] = [];
      }
      grouped[item.scheduled_date].push(item);
    });

    setEvents(grouped);
  };

  useEffect(() => {
    loadCalendar();
  }, [currentDate]);

  const days = daysInMonth(currentDate);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const changeMonth = (offset) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), month + offset, 1)
    );
  };

  return (
    <motion.div
      className="px-6 py-20 max-w-6xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">
        Preventive Maintenance Calendar
      </h1>

      {/* MONTH HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className="bg-white/10 px-4 py-2 rounded hover:bg-white/20"
        >
          ◀
        </button>

        <h2 className="text-xl text-cyan-300 font-semibold">
          {currentDate.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={() => changeMonth(1)}
          className="bg-white/10 px-4 py-2 rounded hover:bg-white/20"
        >
          ▶
        </button>
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-4">
        {[...Array(days)].map((_, i) => {
          const day = i + 1;
          const dateKey = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          return (
            <div
              key={day}
              className="bg-white/10 backdrop-blur rounded-xl p-3 min-h-[120px]"
            >
              <div className="text-sm text-gray-300 mb-2">
                {day}
              </div>

              <div className="space-y-1">
                {events[dateKey]?.map((e) => (
                  <div
                    key={e.id}
                    className="text-xs bg-cyan-500/20 text-cyan-300 p-1 rounded"
                  >
                    {e.subject}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default MaintenanceCalendar;
