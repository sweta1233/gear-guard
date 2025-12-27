import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";
import { loginUser } from "../utils/auth";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.email || !form.password) {
            return setError("All fields are required");
        }

        setLoading(true);

        try {
            const res = await api.post("/auth/login", form);

            loginUser(res.data.access_token);
            window.dispatchEvent(new Event("storage"));
            navigate("/maintenance");
        } catch (err) {
            setError(
                err.response?.data?.detail || "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-screen flex items-center justify-center px-4"
        >
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white/10 backdrop-blur rounded-xl p-8 shadow-xl"
            >
                <h2 className="text-3xl font-bold text-cyan-400 text-center mb-6">
                    Welcome Back
                </h2>

                {error && (
                    <p className="bg-red-500/20 text-red-400 p-2 rounded mb-4 text-sm">
                        {error}
                    </p>
                )}

                <div className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full p-3 rounded bg-black/30 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-6 bg-cyan-500 py-3 rounded hover:bg-cyan-400 transition disabled:opacity-50"
                >
                    {loading ? "Signing in..." : "Login"}
                </button>

                <p className="text-center text-gray-400 mt-4 text-sm">
                    Don’t have an account?{" "}
                    <Link to="/signup" className="text-cyan-400 hover:underline">
                        Sign up
                    </Link>
                </p>
            </form>
        </motion.div>
    );
}

export default Login;
