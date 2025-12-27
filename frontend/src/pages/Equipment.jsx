import { useEffect, useState } from "react";
import api from "../api/api";

function Equipment() {
    const [equipment, setEquipment] = useState([]);

    useEffect(() => {
        api.get("/equipment").then(res => {
            setEquipment(res.data);
        });
    }, []);

    return (
        <div>
            <h2>Equipment List</h2>

            <ul>
                {equipment.length === 0 ? (
                    <p className="text-gray-400 italic">
                        No equipment added yet.
                    </p>
                ) : (
                    equipment.map(eq => (
                        <div key={eq.id}>{eq.name}</div>
                    ))
                )}

            </ul>
        </div>
    );
}

export default Equipment;
