import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, logout } from "../utils/auth";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [loggedIn, setLoggedIn] = useState(isLoggedIn());

    const handleLogout = () => {
        logout();
        setLoggedIn(false);
        setOpen(false);
        navigate("/login");
    };

    // 👇 LISTEN TO LOGIN / LOGOUT CHANGES
    useEffect(() => {
        const syncAuth = () => {
            setLoggedIn(isLoggedIn());
        };

        window.addEventListener("storage", syncAuth);
        return () => window.removeEventListener("storage", syncAuth);
    }, []);

    const NavLinks = () => (
        <>
            {!loggedIn && (
                <>
                    <Link to="/" onClick={() => setOpen(false)}>Home</Link>
                    <Link to="/about" onClick={() => setOpen(false)}>About</Link>
                    <Link to="/contact" onClick={() => setOpen(false)}>Contact</Link>
                </>
            )}

            {loggedIn ? (
                <>
                    <Link to="/equipment" onClick={() => setOpen(false)}>
                        Equipment
                    </Link>
                    <Link to="/maintenance" onClick={() => setOpen(false)}>
                        Maintenance
                    </Link>
                    <Link to="/teams" onClick={() => setOpen(false)}>
                        Teams
                    </Link>
                    <Link to="/calendar" onClick={() => setOpen(false)}>
                        Calendar
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
                <h1 className="text-xl font-bold text-cyan-400">
                    GearGuard
                </h1>

                <div className="hidden md:flex space-x-4 items-center">
                    <NavLinks />
                </div>

                <button
                    className="md:hidden text-cyan-400 text-2xl"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
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
