import { motion } from "framer-motion";

function About() {
  return (
    <motion.div
      className="p-12 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-4xl font-bold mb-6 text-cyan-400">
        About GearGuard
      </h2>

      <p className="text-gray-300 mb-4">
        GearGuard is a modern Computerized Maintenance Management System (CMMS)
        designed to simplify how organizations manage their assets and
        maintenance operations.
      </p>

      <p className="text-gray-300 mb-4">
        Inspired by real-world platforms such as Odoo Maintenance, GearGuard
        focuses on usability, visual workflows, and automation. The system
        connects equipment, maintenance teams, and service requests into a
        single, unified dashboard.
      </p>

      <p className="text-gray-300">
        Built during a hackathon, GearGuard demonstrates how thoughtful system
        design, clean user experience, and modern web technologies can come
        together to solve practical operational challenges.
      </p>
    </motion.div>
  );
}

export default About;
