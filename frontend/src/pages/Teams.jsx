import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getTeams, createTeam, addMember } from "../api/teams";

function Teams() {
  const [teams, setTeams] = useState([]);
  const [teamName, setTeamName] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [error, setError] = useState("");

  const loadTeams = async () => {
    const data = await getTeams();
    setTeams(data);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createTeam(teamName);
      setTeamName("");
      loadTeams();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create team");
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await addMember(selectedTeam, userId);
      setUserId("");
      setSelectedTeam("");
      alert("User added to team");
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add member");
    }
  };

  return (
    <motion.div
      className="px-6 py-20 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">
        Maintenance Teams
      </h1>

      {error && (
        <p className="mb-4 text-red-400 bg-red-500/10 p-2 rounded">
          {error}
        </p>
      )}

      <form
        onSubmit={handleCreateTeam}
        className="bg-white/10 backdrop-blur p-6 rounded-xl mb-10"
      >
        <h2 className="text-xl text-cyan-300 mb-4">Create Team</h2>
        <div className="flex gap-4">
          <input
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team Name (e.g. Mechanics)"
            className="flex-1 p-3 rounded bg-black/30"
          />
          <button className="bg-cyan-500 px-6 rounded hover:bg-cyan-400">
            Create
          </button>
        </div>
      </form>


      <form
        onSubmit={handleAddMember}
        className="bg-white/10 backdrop-blur p-6 rounded-xl mb-10"
      >
        <h2 className="text-xl text-cyan-300 mb-4">Add User to Team</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="p-3 rounded bg-black/30"
          >
            <option value="">Select Team</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="User ID"
            className="p-3 rounded bg-black/30"
          />

          <button className="bg-cyan-500 rounded hover:bg-cyan-400">
            Add Member
          </button>
        </div>
      </form>

      <div className="grid md:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white/10 backdrop-blur p-4 rounded-xl"
          >
            <h3 className="text-cyan-400 font-semibold">
              {team.name}
            </h3>
            <p className="text-gray-400 text-sm">
              Team ID: {team.id}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default Teams;
