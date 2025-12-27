import { useDroppable } from "@dnd-kit/core";
import { useDraggable } from "@dnd-kit/core";

function TaskCard({ task }) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task.id
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="bg-white/10 p-3 rounded mb-3 cursor-move hover:bg-white/20 transition"
    >
      <h4 className="font-semibold">{task.subject}</h4>
      <p className="text-sm text-gray-300">{task.request_type}</p>
    </div>
  );
}

function KanbanColumn({ status, tasks }) {
  const { setNodeRef } = useDroppable({
    id: status
  });

  return (
    <div
      ref={setNodeRef}
      className="bg-black/30 rounded-xl p-4 min-h-[400px]"
    >
      <h3 className="text-lg font-bold capitalize mb-4">
        {status.replace("_", " ")}
      </h3>

      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

export default KanbanColumn;
