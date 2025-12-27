import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setOpen(false);
        navigate("/login");
    };

    const NavLinks = () => (
        <>
            <Link to="/" onClick={() => setOpen(false)} className="hover:text-cyan-400">
                Home
            </Link>
            <Link to="/about" onClick={() => setOpen(false)} className="hover:text-cyan-400">
                About
            </Link>
            <Link to="/contact" onClick={() => setOpen(false)} className="hover:text-cyan-400">
                Contact
            </Link>

            {isLoggedIn() ? (
                <>
                    <Link to="/equipment" onClick={() => setOpen(false)}>
                        Equipment
                    </Link>
                    <Link to="/maintenance" onClick={() => setOpen(false)}>
                        Maintenance
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 px-3 py-1 rounded hover:bg-red-400"
                    >
                        Logout
                    </button>
                </>
            ) : (
                <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="bg-cyan-500 px-3 py-1 rounded hover:bg-cyan-400"
                >
                    Login
                </Link>
            )}
        </>
    );

    return (
        <nav className="backdrop-blur bg-white/10 px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-cyan-400 hover:scale-105 transition">
                    GearGuard
                </h1>

                {/* DESKTOP MENU */}
                <div className="hidden md:flex space-x-4 items-center">
                    <NavLinks />
                </div>

                {/* MOBILE HAMBURGER */}
                <button
                    className="md:hidden text-cyan-400 text-2xl"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </div>

            {/* MOBILE DROPDOWN */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="md:hidden mt-4 flex flex-col gap-3 bg-white/5 rounded-lg p-4"
                    >
                        <NavLinks />
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}

export default Navbar;
