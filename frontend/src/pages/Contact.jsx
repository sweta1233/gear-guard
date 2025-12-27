import { motion } from "framer-motion";

function Contact() {
  return (
    <motion.div
      className="p-12 max-w-xl mx-auto text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="text-4xl font-bold text-cyan-400 mb-6">
        Contact Us
      </h2>

      <p className="text-gray-300 mb-4">
        Have questions, feedback, or ideas? We’d love to hear from you.
      </p>

      <div className="bg-white/10 backdrop-blur p-6 rounded-xl">
        <p className="text-gray-300 mb-2">
          📧 <span className="font-medium">Email:</span> support@gearguard.dev
        </p>
        <p className="text-gray-300">
          🌍 <span className="font-medium">Location:</span> India
        </p>
      </div>
    </motion.div>
  );
}

export default Contact;
