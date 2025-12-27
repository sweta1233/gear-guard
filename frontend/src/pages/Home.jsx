import { motion, animate, useMotionValue } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";


const brands = [
    "/logos/Ola_Cabs_logo.svg",
    "/logos/Uber_logo_2018.svg",
    "/logos/Suzuki_logo_2025_(vertical).svg",
    "/logos/Tata_logo.svg",
    "/logos/Bosch-logo.svg",
    "/logos/Siemens-logo.svg",
];

const testimonials = [
    {
        name: "Amit Verma",
        role: "Maintenance Manager",
        avatar: "/avatars/amit.jpg",
        text: "GearGuard helped us reduce response time and organize maintenance workflows efficiently."
    },
    {
        name: "Priya Sharma",
        role: "Operations Lead",
        avatar: "/avatars/priya.jpg",
        text: "The Kanban-style workflow gives complete transparency across all teams."
    },
    {
        name: "Rohit Mehta",
        role: "Plant Supervisor",
        avatar: "/avatars/rohit.jpg",
        text: "Preventive scheduling significantly reduced unexpected equipment failures."
    },
    {
        name: "Neha Kulkarni",
        role: "Facility Manager",
        avatar: "/avatars/neha.jpg",
        text: "Asset tracking and maintenance history in one place made audits much easier."
    },
    {
        name: "Arjun Patel",
        role: "Operations Manager",
        avatar: "/avatars/arjun.jpg",
        text: "GearGuard feels intuitive, fast, and fits perfectly into daily operations."
    }
];

/* ---------------- COUNT UP ---------------- */

function CountUp({ value }) {
    const ref = useRef(null);
    const motionValue = useMotionValue(0);

    useEffect(() => {
        const controls = animate(motionValue, value, {
            duration: 1.8,
            ease: "easeOut",
        });

        motionValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = Math.floor(latest);
            }
        });

        return () => controls.stop();
    }, [value]);

    return <span ref={ref}>0</span>;
}

/* ---------------- PAGE ---------------- */

function Home() {
    return (
        <motion.div
            className="relative px-6 sm:px-10 py-24 max-w-7xl mx-auto overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            {/* BACKGROUND GLOW */}
            <motion.div
                className="absolute -top-20 -left-20 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"
                animate={{ y: [0, -30, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-3xl rounded-full"
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />


            <section className="text-center mb-32 relative z-10">
                <h1 className="text-5xl sm:text-6xl font-extrabold text-cyan-400 mb-6">
                    GearGuard
                </h1>

                <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10">
                    A modern maintenance management platform to track assets,
                    manage breakdowns, and schedule preventive maintenance
                    using a clean and visual workflow.
                </p>

                <div className="flex justify-center flex-wrap gap-4">
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-cyan-500 rounded-lg hover:bg-cyan-400 transition hover:scale-105"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/about"
                        className="px-6 py-3 border border-cyan-500 rounded-lg hover:bg-cyan-500/20 transition"
                    >
                        Learn More
                    </Link>
                </div>
            </section>


            <section className="grid md:grid-cols-3 gap-8 mb-32">
                {[
                    ["Asset Management", "Centralized equipment records with ownership, location, and warranty details."],
                    ["Kanban Workflow", "Drag-and-drop request tracking for faster maintenance resolution."],
                    ["Preventive Maintenance", "Reduce downtime by scheduling routine maintenance in advance."]
                ].map(([title, desc], i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="bg-white/10 backdrop-blur rounded-xl p-6 hover:bg-white/20 transition"
                    >
                        <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
                        <p className="text-gray-300">{desc}</p>
                    </motion.div>
                ))}
            </section>


            <section className="grid sm:grid-cols-3 gap-8 text-center mb-32">
                {[
                    [120, "Assets Managed"],
                    [300, "Requests Resolved"],
                    [40, "Downtime Reduced (%)"]
                ].map(([num, label], i) => (
                    <div
                        key={i}
                        className="bg-white/10 backdrop-blur rounded-xl p-8"
                    >
                        <h3 className="text-4xl font-bold text-cyan-400">
                            <CountUp value={num} />+
                        </h3>
                        <p className="text-gray-300 mt-2">{label}</p>
                    </div>
                ))}
            </section>


            <section className="overflow-hidden mb-32">
                <p className="text-center text-gray-400 mb-8">
                    Trusted by teams at
                </p>

                <motion.div
                    className="flex gap-20 w-max items-center"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                >
                    {[...brands, ...brands].map((logo, i) => (
                        <img
                            key={i}
                            src={logo}
                            alt="brand"
                            className="h-10 sm:h-12 opacity-50 hover:opacity-100 transition"
                        />
                    ))}
                </motion.div>
            </section>


            <section className="mt-32 overflow-hidden">
                <h2 className="text-4xl font-bold text-center text-cyan-400 mb-12">
                    Loved by Operations Teams
                </h2>

                <motion.div
                    className="flex gap-8 w-max cursor-grab active:cursor-grabbing"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 35,
                        ease: "linear",
                        repeat: Infinity,
                    }}
                    drag="x"
                    dragConstraints={{ left: -800, right: 0 }}
                    whileHover={{ animationPlayState: "paused" }}
                    whileTap={{ animationPlayState: "paused" }}
                >
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={i}
                            className="min-w-[300px] sm:min-w-[340px] bg-white/10 backdrop-blur rounded-xl p-6"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <img
                                    src={t.avatar}
                                    alt={t.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-cyan-400">{t.name}</p>
                                    <p className="text-sm text-gray-400">{t.role}</p>
                                </div>
                            </div>

                            <p className="text-gray-300 italic">
                                “{t.text}”
                            </p>
                        </div>
                    ))}
                </motion.div>
            </section>

        </motion.div>
    );
}

export default Home;
